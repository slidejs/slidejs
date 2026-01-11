/**
 * @slidejs/runner-revealjs - createSlideRunner 单元测试
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createSlideRunner } from '../runner';
import type { SlideContext } from '@slidejs/context';

// Mock reveal.js
vi.mock('reveal.js', () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        initialize: vi.fn().mockResolvedValue(undefined),
        sync: vi.fn(),
        destroy: vi.fn(),
        slide: vi.fn(),
        getIndices: vi.fn().mockReturnValue({ h: 0, v: 0 }),
        getTotalSlides: vi.fn().mockReturnValue(1),
        on: vi.fn(),
      };
    }),
  };
});

// Mock CSS imports
vi.mock('reveal.js/dist/reveal.css?inline', () => ({
  default: '/* reveal.js CSS */',
}));

vi.mock('../style.css?inline', () => ({
  default: '/* custom CSS */',
}));

// 创建测试用的 SlideContext
function createTestContext(): SlideContext {
  return {
    sourceType: 'quiz',
    sourceId: 'test-id',
    metadata: {
      title: 'Test Presentation',
    },
    items: [],
  };
}

// 创建测试用的 DSL 源代码
function createTestDSLSource(): string {
  return `
    present quiz "test-id" {
      rules {
        rule start "intro" {
          slide {
            content text {
              "# Welcome"
              "## Test Slide"
            }
          }
        }
        rule end "end" {
          slide {
            content text {
              "# End"
            }
          }
        }
      }
    }
  `;
}

describe('createSlideRunner', () => {
  let container: HTMLElement;

  beforeEach(() => {
    // 创建 DOM 容器
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);

    // 清空 document.head 中的样式
    const existingStyles = document.head.querySelectorAll('style');
    existingStyles.forEach(style => style.remove());
  });

  afterEach(() => {
    // 清理 DOM
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
    const existingStyles = document.head.querySelectorAll('style');
    existingStyles.forEach(style => style.remove());
  });

  describe('基本功能', () => {
    it('应该成功创建 SlideRunner 实例', async () => {
      const dslSource = createTestDSLSource();
      const context = createTestContext();

      const runner = await createSlideRunner(dslSource, context, {
        container: '#test-container',
      });

      expect(runner).toBeDefined();
      expect(runner.getTotalSlides()).toBeGreaterThan(0);
    });

    it('应该接受 HTMLElement 作为容器', async () => {
      const dslSource = createTestDSLSource();
      const context = createTestContext();

      const runner = await createSlideRunner(dslSource, context, {
        container,
      });

      expect(runner).toBeDefined();
    });

    it('应该在容器不存在时抛出错误', async () => {
      const dslSource = createTestDSLSource();
      const context = createTestContext();

      await expect(
        createSlideRunner(dslSource, context, {
          container: '#non-existent',
        })
      ).rejects.toThrow('Container not found');
    });
  });

  describe('CSS 注入', () => {
    it('应该注入 Reveal.js CSS 到 document.head', async () => {
      const dslSource = createTestDSLSource();
      const context = createTestContext();

      await createSlideRunner(dslSource, context, {
        container: '#test-container',
      });

      const globalStyle = document.head.querySelector('#reveal-styles');
      expect(globalStyle).toBeTruthy();
      expect(globalStyle?.textContent).toContain('reveal.js CSS');
    });

    it('应该只注入一次 Reveal.js CSS（避免重复）', async () => {
      const dslSource = createTestDSLSource();
      const context = createTestContext();

      // 创建第一个 runner
      await createSlideRunner(dslSource, context, {
        container: '#test-container',
      });

      // 创建第二个容器和 runner
      const container2 = document.createElement('div');
      container2.id = 'test-container-2';
      document.body.appendChild(container2);

      await createSlideRunner(dslSource, context, {
        container: '#test-container-2',
      });

      // 应该只有一个全局样式
      const globalStyles = document.head.querySelectorAll('#reveal-styles');
      expect(globalStyles.length).toBe(1);

      container2.remove();
    });

    it('应该注入自定义 CSS 到容器', async () => {
      const dslSource = createTestDSLSource();
      const context = createTestContext();

      await createSlideRunner(dslSource, context, {
        container: '#test-container',
      });

      const customStyle = container.querySelector('#slidejs-runner-revealjs-styles');
      expect(customStyle).toBeTruthy();
      expect(customStyle?.textContent).toContain('custom CSS');
    });

    it('应该为每个容器创建独立的 revealContainer', async () => {
      const dslSource = createTestDSLSource();
      const context = createTestContext();

      await createSlideRunner(dslSource, context, {
        container: '#test-container',
      });

      // 应该有一个 revealContainer div
      const revealContainers = container.querySelectorAll('div');
      expect(revealContainers.length).toBeGreaterThan(0);

      // revealContainer 应该有正确的样式
      const revealContainer = Array.from(revealContainers).find(
        div => div.style.width === '100%' && div.style.height === '100%'
      );
      expect(revealContainer).toBeTruthy();
    });
  });

  describe('reveal.js 配置', () => {
    it('应该传递 reveal.js 配置选项', async () => {
      const dslSource = createTestDSLSource();
      const context = createTestContext();

      const revealOptions = {
        controls: false,
        progress: false,
        center: false,
        transition: 'fade' as const,
      };

      await createSlideRunner(dslSource, context, {
        container: '#test-container',
        revealOptions,
      });

      // 验证 Reveal 构造函数被调用（通过 mock）
      const Reveal = (await import('reveal.js')).default;
      expect(Reveal).toHaveBeenCalled();
    });
  });

  describe('错误处理', () => {
    it('应该在 DSL 解析失败时抛出错误', async () => {
      const invalidDSL = 'invalid dsl syntax';
      const context = createTestContext();

      await expect(
        createSlideRunner(invalidDSL, context, {
          container: '#test-container',
        })
      ).rejects.toThrow();
    });
  });
});
