/**
 * @slidejs/theme - SlideJS Theme System
 *
 * 提供统一的 CSS Hook API，支持运行时动态自定义样式
 *
 * 只提供高级 API（标准变量），不提供低级 API（runner 特定变量）。
 *
 * 高级 API（官方支持）：
 * - 使用标准变量名（如 `navigationColor`）
 * - 所有 runner 会自动映射这些变量
 * - 推荐使用
 *
 * 低级 API（自行使用，风险自负）：
 * - 直接设置 runner 特定变量（如 `--slidejs-swiper-navigation-color`）
 * - 需要自行使用 DOM API
 * - 不推荐，可能导致兼容性问题
 *
 * @example
 * ```typescript
 * import { setTheme, useTheme } from '@slidejs/theme';
 *
 * // 高级 API：使用标准变量名（推荐）
 * setTheme({
 *   navigationColor: '#ff0000',
 *   paginationColor: '#00ff00',
 * });
 *
 * // 作用域设置
 * const theme = useTheme('#my-slides');
 * theme.set({
 *   navigationColor: '#ff0000',
 * });
 * ```
 */

export { SlideThemeHook, globalTheme, setTheme, useTheme } from './hook';

export type { StandardTheme } from './types';

export { STANDARD_CSS_VARIABLES } from './types';

// 注意：RUNNER_CSS_VARIABLE_MAP 和 RunnerCSSVariableMap 不导出
// 实际的映射在 runner 的 CSS 文件中通过 var() 函数完成
// 我们只提供高级 API（标准变量），不提供低级 API（runner 特定变量）

// 预设主题
export { Preset, solarizedDark, solarizedLight, presets, type PresetThemeName } from './presets';
