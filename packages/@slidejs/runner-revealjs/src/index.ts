/**
 * @slidejs/runner-revealjs - 入口文件
 *
 * 导出 reveal.js 适配器和 SlideRunner 工厂函数
 *
 * 样式会自动加载（包含 reveal.js 核心 CSS）。
 * 主题样式需要单独导入（可选）：
 * ```typescript
 * import 'reveal.js/dist/theme/black.css';
 * // 或其他主题: white.css, league.css, sky.css, night.css, beige.css
 * ```
 */

// 导入核心样式（自动加载）
import './style.css';

// 适配器（低级 API）
export { RevealJsAdapter } from './adapter';
export type { RevealJsOptions } from './types';

// SlideRunner 工厂函数（推荐）
export { createSlideRunner } from './runner';
export type { SlideRunnerConfig } from './runner';

// 重新导出 SlideRunner 类型
export type { SlideRunner } from '@slidejs/runner';
