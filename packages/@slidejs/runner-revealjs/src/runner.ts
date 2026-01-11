/**
 * @slidejs/runner-revealjs - SlideRunner 工厂函数
 *
 * 提供创建配置好的 SlideRunner 实例的便捷方法
 */

import { parseSlideDSL, compile } from '@slidejs/dsl';
import { SlideRunner } from '@slidejs/runner';
import type { SlideContext } from '@slidejs/context';
import { RevealJsAdapter } from './adapter';
import type { RevealJsAdapterOptions } from './types';
// 导入 CSS 内容用于注入
import revealCSS from 'reveal.js/dist/reveal.css?inline';
import customCSS from './style.css?inline';

/**
 * SlideRunner 配置选项
 */
export interface SlideRunnerConfig {
  /**
   * 容器选择器或 HTMLElement
   */
  container: string | HTMLElement;

  /**
   * reveal.js 配置选项
   */
  revealOptions?: RevealJsAdapterOptions['revealConfig'];
}

/**
 * 从 DSL 源代码创建并运行 SlideRunner
 *
 * @example
 * ```typescript
 * import { createSlideRunner } from '@slidejs/runner-revealjs';
 *
 * const dslSource = `
 *   present quiz "demo" {
 *     rules {
 *       rule start "intro" {
 *         slide {
 *           content text { "Hello World!" }
 *         }
 *       }
 *     }
 *   }
 * `;
 *
 * const context = { sourceType: 'quiz', sourceId: 'demo', items: [] };
 * const runner = await createSlideRunner(dslSource, context, {
 *   container: '#app',
 *   revealOptions: {
 *     controls: true,
 *     progress: true,
 *   },
 * });
 * ```
 */
export async function createSlideRunner<TContext extends SlideContext = SlideContext>(
  dslSource: string,
  context: TContext,
  config: SlideRunnerConfig
): Promise<SlideRunner<TContext>> {
  // 1. 解析 DSL
  const ast = await parseSlideDSL(dslSource);

  // 2. 编译为 SlideDSL
  const slideDSL = compile<TContext>(ast);

  // 2.1 注入 Reveal.js CSS 到 document.head（全局，如果尚未注入）
  const globalStyleId = 'reveal-styles';
  const globalStyles = document.head.querySelector(`#${globalStyleId}`);
  if (!globalStyles) {
    const style = document.createElement('style');
    style.id = globalStyleId;
    style.textContent = revealCSS;
    document.head.appendChild(style);
  }

  // 2.2 获取用户提供的容器元素
  let userContainer: HTMLElement;
  if (typeof config.container === 'string') {
    const element = document.querySelector(config.container);
    if (!element) {
      throw new Error(`Container not found: ${config.container}`);
    }
    userContainer = element as HTMLElement;
  } else {
    userContainer = config.container;
  }

  // 2.3 注入自定义 CSS 样式到容器
  const styleId = 'slidejs-runner-revealjs-styles';
  if (!userContainer.querySelector(`#${styleId}`)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = customCSS;
    userContainer.appendChild(style);
  }

  // 2.4 创建一个新的 div 节点用于 Reveal.js（Reveal.js 会接管这个 div）
  const revealContainer = document.createElement('div');
  // 确保容器占满父元素的高度和宽度
  revealContainer.style.width = '100%';
  revealContainer.style.height = '100%';
  userContainer.appendChild(revealContainer);

  // 3. 创建适配器和 Runner（将 revealContainer 传给 Runner，而不是 userContainer）
  const adapter = new RevealJsAdapter();
  const runner = new SlideRunner<TContext>({
    container: revealContainer,
    adapter,
    adapterOptions: {
      revealConfig: config.revealOptions,
    },
  });

  // 4. 运行演示（这会初始化适配器并渲染幻灯片）
  await runner.run(slideDSL, context);

  // 注意：需要手动调用 runner.play() 来启动演示（导航到第一张幻灯片）
  // 返回 runner 以便用户可以控制演示
  return runner;
}
