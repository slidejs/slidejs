/**
 * @slidejs/theme - 主题系统类型定义
 *
 * 定义标准化的主题配置接口，不针对特定 runner
 *
 * 注意：本包只提供高级 API（标准变量），不提供低级 API（runner 特定变量）。
 * 如果需要直接设置 runner 特定变量，请自行使用 DOM API，风险自负。
 */

/**
 * 标准主题配置
 * 使用标准变量名，不包含 runner 名称
 *
 * 这些变量会被所有 runner 自动映射到自己的特定变量
 */
export interface StandardTheme {
  /** 导航按钮颜色 */
  navigationColor?: string;
  /** 分页器颜色 */
  paginationColor?: string;
  /** 分页器激活颜色 */
  paginationActiveColor?: string;
  /** 滚动条背景色 */
  scrollbarBg?: string;
  /** 滚动条拖拽颜色 */
  scrollbarDragBg?: string;
  /** 箭头颜色（用于 Splide） */
  arrowColor?: string;
  /** 进度条颜色 */
  progressBarColor?: string;
  /** 背景色 */
  backgroundColor?: string;
  /** 文本颜色 */
  textColor?: string;
  /** 链接颜色 */
  linkColor?: string;
  /** 标题颜色 */
  headingColor?: string;
  /** 代码背景色 */
  codeBackground?: string;
}

/**
 * 标准 CSS 变量名
 *
 * 这些是 SlideJS 官方支持的标准变量名
 * 所有 runner 会将这些变量映射到自己的特定变量
 */
export const STANDARD_CSS_VARIABLES = {
  navigationColor: '--slidejs-navigation-color',
  paginationColor: '--slidejs-pagination-color',
  paginationActiveColor: '--slidejs-pagination-active-color',
  scrollbarBg: '--slidejs-scrollbar-bg',
  scrollbarDragBg: '--slidejs-scrollbar-drag-bg',
  arrowColor: '--slidejs-arrow-color',
  progressBarColor: '--slidejs-progress-bar-color',
  backgroundColor: '--slidejs-background-color',
  textColor: '--slidejs-text-color',
  linkColor: '--slidejs-link-color',
  headingColor: '--slidejs-heading-color',
  codeBackground: '--slidejs-code-background',
} as const;

/**
 * Runner 特定 CSS 变量映射（仅供内部参考，不导出）
 *
 * 注意：
 * 1. 此接口不导出，仅供内部类型检查使用
 * 2. 实际的映射在 runner 的 CSS 文件中通过 CSS `var()` 函数完成
 * 3. 本包只提供高级 API（标准变量），不提供低级 API（runner 特定变量）
 * 4. 如果需要直接设置 runner 特定变量，请自行使用 DOM API，风险自负
 *
 * 映射关系（仅供参考）：
 * - Reveal.js: `--slidejs-background-color` → `--slidejs-revealjs-background-color`
 * - Swiper: `--slidejs-navigation-color` → `--slidejs-swiper-navigation-color`
 * - Splide: `--slidejs-arrow-color` → `--slidejs-splide-arrow-color`
 *
 * 查看 runner 的 `style.css` 文件了解完整的映射关系。
 */
interface RunnerCSSVariableMap {
  revealjs: {
    '--slidejs-background-color': string;
    '--slidejs-text-color': string;
    '--slidejs-link-color': string;
    '--slidejs-heading-color': string;
    '--slidejs-code-background': string;
  };
  swiper: {
    '--slidejs-navigation-color': string;
    '--slidejs-pagination-color': string;
    '--slidejs-pagination-active-color': string;
    '--slidejs-scrollbar-bg': string;
    '--slidejs-scrollbar-drag-bg': string;
  };
  splide: {
    '--slidejs-arrow-color': string;
    '--slidejs-pagination-color': string;
    '--slidejs-pagination-active-color': string;
    '--slidejs-progress-bar-color': string;
  };
}
