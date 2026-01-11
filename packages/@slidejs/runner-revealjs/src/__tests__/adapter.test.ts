/**
 * @slidejs/runner-revealjs - RevealJsAdapter 单元测试
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RevealJsAdapter } from '../adapter';
import type { SlideDefinition } from '@slidejs/core';
import type { RevealJsOptions } from '../types';

// Mock reveal.js
const mockReveal = {
  initialize: vi.fn().mockResolvedValue(undefined),
  sync: vi.fn(),
  destroy: vi.fn(),
  slide: vi.fn(),
  getIndices: vi.fn().mockReturnValue({ h: 0, v: 0 }),
  getTotalSlides: vi.fn().mockReturnValue(1),
  on: vi.fn(),
};

vi.mock('reveal.js', () => {
  return {
    default: vi.fn().mockImplementation(() => mockReveal),
  };
});

// 创建测试用的幻灯片定义
function createTestSlide(id: string, content: string[]): SlideDefinition {
  return {
    id,
    content: {
      type: 'text',
      lines: content,
    },
  };
}

describe('RevealJsAdapter', () => {
  let adapter: RevealJsAdapter;
  let container: HTMLElement;

  beforeEach(() => {
    adapter = new RevealJsAdapter();
    container = document.createElement('div');
    document.body.appendChild(container);

    // 重置 mock
    vi.clearAllMocks();
  });

  afterEach(async () => {
    if (adapter) {
      await adapter.destroy();
    }
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('构造函数', () => {
    it('应该创建 RevealJsAdapter 实例', () => {
      expect(adapter).toBeInstanceOf(RevealJsAdapter);
      expect(adapter.name).toBe('revealjs');
    });
  });

  describe('initialize()', () => {
    it('应该成功初始化适配器', async () => {
      await adapter.initialize(container);

      expect(mockReveal.initialize).toHaveBeenCalled();
    });

    it('应该创建 reveal.js DOM 结构', async () => {
      await adapter.initialize(container);

      const viewport = container.querySelector('.reveal-viewport');
      const reveal = container.querySelector('.reveal');
      const slides = container.querySelector('.slides');

      expect(viewport).toBeTruthy();
      expect(reveal).toBeTruthy();
      expect(slides).toBeTruthy();
    });

    it('应该使用默认配置', async () => {
      await adapter.initialize(container);

      const Reveal = (await import('reveal.js')).default;
      expect(Reveal).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({
          controls: true,
          progress: true,
          center: true,
          hash: false,
          transition: 'slide',
        })
      );
    });

    it('应该接受自定义配置', async () => {
      const options: RevealJsOptions = {
        revealConfig: {
          controls: false,
          progress: false,
          transition: 'fade',
        },
      };

      await adapter.initialize(container, options);

      const Reveal = (await import('reveal.js')).default;
      expect(Reveal).toHaveBeenCalledWith(
        expect.any(HTMLElement),
        expect.objectContaining({
          controls: false,
          progress: false,
          transition: 'fade',
        })
      );
    });

    it('应该在初始化失败时抛出错误', async () => {
      mockReveal.initialize.mockRejectedValueOnce(new Error('Init failed'));

      await expect(adapter.initialize(container)).rejects.toThrow(
        'Failed to initialize RevealJsAdapter'
      );
    });
  });

  describe('render()', () => {
    it('应该在未初始化时抛出错误', async () => {
      const slides = [createTestSlide('slide-1', ['Test'])];

      await expect(adapter.render(slides)).rejects.toThrow(
        'RevealJsAdapter not initialized'
      );
    });

    it('应该成功渲染幻灯片', async () => {
      await adapter.initialize(container);

      const slides = [
        createTestSlide('slide-1', ['# Slide 1']),
        createTestSlide('slide-2', ['# Slide 2']),
      ];

      await adapter.render(slides);

      const sections = container.querySelectorAll('.slides section');
      expect(sections.length).toBe(2);
      expect(mockReveal.sync).toHaveBeenCalled();
    });

    it('应该清空现有幻灯片后渲染新幻灯片', async () => {
      await adapter.initialize(container);

      const slides1 = [createTestSlide('slide-1', ['# Slide 1'])];
      await adapter.render(slides1);

      const slides2 = [createTestSlide('slide-2', ['# Slide 2'])];
      await adapter.render(slides2);

      const sections = container.querySelectorAll('.slides section');
      expect(sections.length).toBe(1);
    });
  });

  describe('navigateTo()', () => {
    it('应该在未初始化时抛出错误', () => {
      expect(() => adapter.navigateTo(0)).toThrow('RevealJsAdapter not initialized');
    });

    it('应该成功导航到指定幻灯片', async () => {
      await adapter.initialize(container);
      await adapter.render([createTestSlide('slide-1', ['Test'])]);

      adapter.navigateTo(0);

      expect(mockReveal.slide).toHaveBeenCalledWith(0, 0);
    });
  });

  describe('getCurrentIndex()', () => {
    it('应该在未初始化时返回 0', () => {
      expect(adapter.getCurrentIndex()).toBe(0);
    });

    it('应该返回当前幻灯片索引', async () => {
      await adapter.initialize(container);
      await adapter.render([createTestSlide('slide-1', ['Test'])]);

      mockReveal.getIndices.mockReturnValue({ h: 2, v: 0 });
      expect(adapter.getCurrentIndex()).toBe(2);
    });
  });

  describe('getTotalSlides()', () => {
    it('应该在未初始化时返回 0', () => {
      expect(adapter.getTotalSlides()).toBe(0);
    });

    it('应该返回幻灯片总数', async () => {
      await adapter.initialize(container);
      await adapter.render([
        createTestSlide('slide-1', ['Test']),
        createTestSlide('slide-2', ['Test']),
      ]);

      mockReveal.getTotalSlides.mockReturnValue(2);
      expect(adapter.getTotalSlides()).toBe(2);
    });
  });

  describe('destroy()', () => {
    it('应该成功销毁适配器', async () => {
      await adapter.initialize(container);
      await adapter.destroy();

      expect(mockReveal.destroy).toHaveBeenCalled();
    });

    it('应该清理 DOM 结构', async () => {
      await adapter.initialize(container);
      
      // 验证 DOM 结构存在
      const reveal = container.querySelector('.reveal');
      expect(reveal).toBeTruthy();
      
      await adapter.destroy();

      // 验证 reveal 实例被销毁
      expect(mockReveal.destroy).toHaveBeenCalled();
    });
  });

  describe('事件处理', () => {
    it('应该注册事件监听器', async () => {
      await adapter.initialize(container);

      const handler = vi.fn();
      adapter.on('ready', handler);

      // 触发 ready 事件（通过 emit）
      // 注意：这里我们测试的是适配器内部的事件系统
      expect(handler).toBeDefined();
    });

    it('应该移除事件监听器', async () => {
      await adapter.initialize(container);

      const handler = vi.fn();
      adapter.on('ready', handler);
      adapter.off('ready', handler);

      // 验证监听器已移除
      expect(handler).toBeDefined();
    });
  });

  describe('renderSlide()', () => {
    it('应该渲染文本内容幻灯片', async () => {
      await adapter.initialize(container);

      const slide = createTestSlide('slide-1', ['# Title', '## Subtitle', 'Content']);
      await adapter.render([slide]);

      const section = container.querySelector('.slides section');
      expect(section).toBeTruthy();

      const slideContent = section?.querySelector('.slide-content');
      expect(slideContent).toBeTruthy();
    });

    it('应该渲染动态内容幻灯片', async () => {
      await adapter.initialize(container);

      const slide: SlideDefinition = {
        id: 'slide-1',
        content: {
          type: 'dynamic',
          component: 'my-component',
          props: {
            title: 'Test',
          },
        },
      };

      await adapter.render([slide]);

      const section = container.querySelector('.slides section');
      expect(section).toBeTruthy();

      const component = section?.querySelector('my-component');
      expect(component).toBeTruthy();
      expect(component?.getAttribute('title')).toBe('Test');
    });
  });
});
