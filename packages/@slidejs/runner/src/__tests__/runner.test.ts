/**
 * @slidejs/runner - SlideRunner 单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SlideRunner } from '../runner';
import { SlideRunnerError } from '../errors';
import type { SlideAdapter, SlideRunnerPlugin } from '../types';
import type { SlideDSL, SlideDefinition } from '@slidejs/core';
import type { SlideContext } from '@slidejs/context';

// 创建模拟适配器
function createMockAdapter(): SlideAdapter {
  const eventHandlers = new Map<string, Set<(data: unknown) => void>>();
  let currentIndex = 0;
  let totalSlides = 0;

  return {
    name: 'mock-adapter',
    async initialize(container: HTMLElement) {
      // 模拟初始化
    },
    async render(slides: SlideDefinition[]) {
      totalSlides = slides.length;
    },
    async destroy() {
      eventHandlers.clear();
    },
    navigateTo(index: number) {
      const fromIndex = currentIndex;
      currentIndex = index;
      // 同步触发事件，模拟真实适配器行为
      const handlers = eventHandlers.get('slideChanged');
      if (handlers) {
        handlers.forEach((handler) => handler({ index, from: fromIndex, to: index }));
      }
    },
    getCurrentIndex() {
      return currentIndex;
    },
    getTotalSlides() {
      return totalSlides;
    },
    on(event: string, handler: (data: unknown) => void) {
      if (!eventHandlers.has(event)) {
        eventHandlers.set(event, new Set());
      }
      eventHandlers.get(event)!.add(handler);
    },
    off(event: string, handler: (data: unknown) => void) {
      eventHandlers.get(event)?.delete(handler);
    },
  };
}

// 创建测试用的 SlideContext
function createTestContext(): SlideContext {
  return {
    sourceType: 'test',
    sourceId: 'test-id',
    metadata: {
      title: 'Test Presentation',
    },
    items: [],
  };
}

// 创建测试用的 SlideDSL
function createTestDSL(): SlideDSL {
  return {
    version: '1.0.0',
    sourceType: 'test',
    sourceId: 'test-id',
    rules: [
      {
        type: 'start',
        name: 'intro',
        generate: () => [
          {
            id: 'slide-1',
            content: {
              type: 'text',
              lines: ['Welcome'],
            },
          },
        ],
      },
      {
        type: 'content',
        name: 'content',
        generate: () => [
          {
            id: 'slide-2',
            content: {
              type: 'text',
              lines: ['Content'],
            },
          },
        ],
      },
      {
        type: 'end',
        name: 'end',
        generate: () => [
          {
            id: 'slide-3',
            content: {
              type: 'text',
              lines: ['End'],
            },
          },
        ],
      },
    ],
  };
}

describe('SlideRunner', () => {
  let container: HTMLElement;
  let adapter: SlideAdapter;
  let context: SlideContext;
  let dsl: SlideDSL;

  beforeEach(() => {
    // 创建 DOM 容器
    container = document.createElement('div');
    document.body.appendChild(container);

    // 创建模拟适配器
    adapter = createMockAdapter();
    context = createTestContext();
    dsl = createTestDSL();
  });

  describe('构造函数', () => {
    it('应该成功创建 SlideRunner 实例', () => {
      const runner = new SlideRunner({
        container,
        adapter,
      });

      expect(runner).toBeInstanceOf(SlideRunner);
    });

    it('应该接受字符串选择器作为容器', () => {
      container.id = 'test-container';
      const runner = new SlideRunner({
        container: '#test-container',
        adapter,
      });

      expect(runner).toBeInstanceOf(SlideRunner);
    });

    it('应该在没有适配器时抛出错误', () => {
      expect(() => {
        new SlideRunner({
          container,
          adapter: null as unknown as SlideAdapter,
        });
      }).toThrow(SlideRunnerError);
    });

    it('应该在容器不存在时抛出错误', () => {
      expect(() => {
        new SlideRunner({
          container: '#non-existent',
          adapter,
        });
      }).toThrow(SlideRunnerError);
    });

    it('应该接受插件数组', () => {
      const plugin: SlideRunnerPlugin = {
        name: 'test-plugin',
      };

      const runner = new SlideRunner({
        container,
        adapter,
        plugins: [plugin],
      });

      expect(runner).toBeInstanceOf(SlideRunner);
    });
  });

  describe('run()', () => {
    it('应该成功运行幻灯片演示', async () => {
      const runner = new SlideRunner({
        container,
        adapter,
      });

      await runner.run(dsl, context);

      expect(runner.getTotalSlides()).toBe(3);
    });

    it('应该执行 beforeRender 插件钩子', async () => {
      const beforeRender = vi.fn();
      const plugin: SlideRunnerPlugin = {
        name: 'test-plugin',
        beforeRender,
      };

      const runner = new SlideRunner({
        container,
        adapter,
        plugins: [plugin],
      });

      await runner.run(dsl, context);

      expect(beforeRender).toHaveBeenCalledTimes(1);
      expect(beforeRender).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ id: 'slide-1' }),
      ]));
    });

    it('应该执行 afterRender 插件钩子', async () => {
      const afterRender = vi.fn();
      const plugin: SlideRunnerPlugin = {
        name: 'test-plugin',
        afterRender,
      };

      const runner = new SlideRunner({
        container,
        adapter,
        plugins: [plugin],
      });

      await runner.run(dsl, context);

      expect(afterRender).toHaveBeenCalledTimes(1);
    });

    it('应该在适配器初始化失败时抛出错误', async () => {
      const failingAdapter = createMockAdapter();
      failingAdapter.initialize = vi.fn().mockRejectedValue(new Error('Init failed'));

      const runner = new SlideRunner({
        container,
        adapter: failingAdapter,
      });

      await expect(runner.run(dsl, context)).rejects.toThrow(SlideRunnerError);
    });
  });

  describe('renderSlides()', () => {
    it('应该直接渲染提供的幻灯片', async () => {
      const slides: SlideDefinition[] = [
        {
          id: 'slide-1',
          content: {
            type: 'text',
            lines: ['Slide 1'],
          },
        },
        {
          id: 'slide-2',
          content: {
            type: 'text',
            lines: ['Slide 2'],
          },
        },
      ];

      const runner = new SlideRunner({
        container,
        adapter,
      });

      await runner.renderSlides(slides);

      expect(runner.getTotalSlides()).toBe(2);
    });

    it('应该执行 beforeRender 插件钩子', async () => {
      const beforeRender = vi.fn();
      const plugin: SlideRunnerPlugin = {
        name: 'test-plugin',
        beforeRender,
      };

      const slides: SlideDefinition[] = [
        {
          id: 'slide-1',
          content: { type: 'text', lines: ['Test'] },
        },
      ];

      const runner = new SlideRunner({
        container,
        adapter,
        plugins: [plugin],
      });

      await runner.renderSlides(slides);

      expect(beforeRender).toHaveBeenCalledTimes(1);
    });
  });

  describe('play()', () => {
    it('应该成功播放演示', async () => {
      const runner = new SlideRunner({
        container,
        adapter,
      });

      await runner.run(dsl, context);
      runner.play();

      expect(runner.getCurrentIndex()).toBe(0);
    });

    it('应该在未初始化时抛出错误', () => {
      const runner = new SlideRunner({
        container,
        adapter,
      });

      expect(() => runner.play()).toThrow(SlideRunnerError);
      expect(() => runner.play()).toThrow('No slides to play');
    });

    it('应该在无幻灯片时抛出错误', async () => {
      // 创建一个会生成空幻灯片的 DSL（但至少有一个 start 规则）
      const emptyDSL: SlideDSL = {
        version: '1.0.0',
        sourceType: 'test',
        sourceId: 'test-id',
        rules: [
          {
            type: 'start',
            name: 'empty',
            generate: () => [], // 返回空数组
          },
          {
            type: 'end',
            name: 'empty-end',
            generate: () => [],
          },
        ],
      };

      const runner = new SlideRunner({
        container,
        adapter,
      });

      await runner.run(emptyDSL, context);

      expect(() => runner.play()).toThrow(SlideRunnerError);
      expect(() => runner.play()).toThrow('No slides');
    });
  });

  describe('navigateTo()', () => {
    it('应该成功导航到指定幻灯片', async () => {
      const runner = new SlideRunner({
        container,
        adapter,
      });

      await runner.run(dsl, context);
      runner.navigateTo(1);

      // 等待异步钩子执行
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(runner.getCurrentIndex()).toBe(1);
    });

    it('应该在索引超出范围时抛出错误', async () => {
      const runner = new SlideRunner({
        container,
        adapter,
      });

      await runner.run(dsl, context);

      expect(() => runner.navigateTo(10)).toThrow(SlideRunnerError);
      expect(() => runner.navigateTo(-1)).toThrow(SlideRunnerError);
    });

    it('应该执行 beforeSlideChange 插件钩子', async () => {
      const beforeSlideChange = vi.fn();
      const plugin: SlideRunnerPlugin = {
        name: 'test-plugin',
        beforeSlideChange,
      };

      const runner = new SlideRunner({
        container,
        adapter,
        plugins: [plugin],
      });

      await runner.run(dsl, context);
      runner.navigateTo(1);

      // 等待异步钩子执行
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(beforeSlideChange).toHaveBeenCalledWith(0, 1);
    });

    it('应该执行 afterSlideChange 插件钩子', async () => {
      const afterSlideChange = vi.fn();
      const plugin: SlideRunnerPlugin = {
        name: 'test-plugin',
        afterSlideChange,
      };

      const runner = new SlideRunner({
        container,
        adapter,
        plugins: [plugin],
      });

      await runner.run(dsl, context);
      runner.navigateTo(1);

      // 等待异步钩子执行
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(afterSlideChange).toHaveBeenCalledWith(0, 1);
    });
  });

  describe('getCurrentIndex()', () => {
    it('应该返回当前幻灯片索引', async () => {
      const runner = new SlideRunner({
        container,
        adapter,
      });

      await runner.run(dsl, context);
      runner.navigateTo(2);

      // 等待异步钩子执行
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(runner.getCurrentIndex()).toBe(2);
    });
  });

  describe('getTotalSlides()', () => {
    it('应该返回幻灯片总数', async () => {
      const runner = new SlideRunner({
        container,
        adapter,
      });

      await runner.run(dsl, context);

      expect(runner.getTotalSlides()).toBe(3);
    });
  });

  describe('updateSlide()', () => {
    it('应该在适配器支持时更新幻灯片', async () => {
      const adapterWithUpdate = createMockAdapter();
      adapterWithUpdate.updateSlide = vi.fn().mockResolvedValue(undefined);

      const runner = new SlideRunner({
        container,
        adapter: adapterWithUpdate,
      });

      await runner.run(dsl, context);

      const newSlide: SlideDefinition = {
        id: 'slide-1-updated',
        content: {
          type: 'text',
          lines: ['Updated'],
        },
      };

      await runner.updateSlide(0, newSlide);

      expect(adapterWithUpdate.updateSlide).toHaveBeenCalledWith(0, newSlide);
    });

    it('应该在适配器不支持时抛出错误', async () => {
      const runner = new SlideRunner({
        container,
        adapter,
      });

      await runner.run(dsl, context);

      const newSlide: SlideDefinition = {
        id: 'slide-1-updated',
        content: {
          type: 'text',
          lines: ['Updated'],
        },
      };

      await expect(runner.updateSlide(0, newSlide)).rejects.toThrow(SlideRunnerError);
    });

    it('应该在索引无效时抛出错误', async () => {
      const adapterWithUpdate = createMockAdapter();
      adapterWithUpdate.updateSlide = vi.fn().mockResolvedValue(undefined);

      const runner = new SlideRunner({
        container,
        adapter: adapterWithUpdate,
      });

      await runner.run(dsl, context);

      const newSlide: SlideDefinition = {
        id: 'slide-invalid',
        content: {
          type: 'text',
          lines: ['Invalid'],
        },
      };

      await expect(runner.updateSlide(10, newSlide)).rejects.toThrow(SlideRunnerError);
    });
  });

  describe('refresh()', () => {
    it('应该重新渲染所有幻灯片', async () => {
      const renderSpy = vi.spyOn(adapter, 'render');

      const runner = new SlideRunner({
        container,
        adapter,
      });

      await runner.run(dsl, context);
      await runner.refresh();

      expect(renderSpy).toHaveBeenCalledTimes(2); // run() 一次，refresh() 一次
    });
  });

  describe('destroy()', () => {
    it('应该成功销毁 Runner', async () => {
      const destroySpy = vi.spyOn(adapter, 'destroy');

      const runner = new SlideRunner({
        container,
        adapter,
      });

      await runner.run(dsl, context);
      await runner.destroy();

      expect(destroySpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('事件处理', () => {
    it('应该注册事件监听器', () => {
      const handler = vi.fn();
      const runner = new SlideRunner({
        container,
        adapter,
      });

      runner.on('slideChanged', handler);

      // 触发适配器事件
      adapter.navigateTo(1);

      expect(handler).toHaveBeenCalled();
    });

    it('应该移除事件监听器', () => {
      const handler = vi.fn();
      const runner = new SlideRunner({
        container,
        adapter,
      });

      runner.on('slideChanged', handler);
      runner.off('slideChanged', handler);

      // 触发适配器事件
      adapter.navigateTo(1);

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('错误处理', () => {
    it('应该正确处理插件钩子错误', async () => {
      const plugin: SlideRunnerPlugin = {
        name: 'error-plugin',
        beforeRender: () => {
          throw new Error('Plugin error');
        },
      };

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const runner = new SlideRunner({
        container,
        adapter,
        plugins: [plugin],
      });

      // 不应该抛出错误，应该继续执行
      await expect(runner.run(dsl, context)).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});

