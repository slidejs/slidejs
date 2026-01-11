/**
 * @slidejs/runner-splide - Splide 适配器
 *
 * 将 Slide DSL 渲染为 Splide 幻灯片
 *
 * 样式会自动加载（包含 Splide 核心 CSS）。
 * 主题样式需要单独导入（可选）：
 * ```typescript
 * import '@splidejs/splide/css/theme/default';
 * // 或其他主题
 * ```
 */

// 导入核心样式（自动加载）
import './style.css';

export { SplideAdapter } from './adapter';
export { createSlideRunner, type SlideRunnerConfig } from './runner';
export type { SplideAdapterOptions } from './types';
