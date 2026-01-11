/**
 * @slidejs/runner-revealjs - 类型定义
 *
 * 定义 reveal.js 适配器的选项和配置
 */

import type Reveal from 'reveal.js';
import type { AdapterOptions } from '@slidejs/runner';

/**
 * Reveal.js 配置选项类型
 * @see https://revealjs.com/config/
 */
export type RevealOptions = Reveal.Options;

/**
 * RevealJsAdapter 选项
 *
 * 主题通过静态导入加载：
 * ```typescript
 * import 'reveal.js/dist/theme/black.css';
 * ```
 */
export interface RevealJsAdapterOptions extends AdapterOptions {
  /**
   * reveal.js 配置
   * @see https://revealjs.com/config/
   */
  revealConfig?: RevealOptions;
}
