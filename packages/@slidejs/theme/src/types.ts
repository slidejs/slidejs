/**
 * @slidejs/theme - 主题系统类型定义
 *
 * 定义抽象的主题配置接口，从 Slide 的角度定义通用主题属性
 * 各个 runner 可以自由决定如何应用这些抽象主题属性
 */

/**
 * 抽象主题配置
 *
 * 从 Slide 的抽象角度定义主题属性，不涉及具体的 runner 实现
 * 各个 runner 可以自由决定如何将这些抽象属性应用到自己的实现中
 */
export interface StandardTheme {
  /** 导航控件颜色 */
  navigationColor?: string;
  /** 分页控件颜色 */
  paginationColor?: string;
  /** 分页控件激活状态颜色 */
  paginationActiveColor?: string;
  /** 滚动条背景色 */
  scrollbarBg?: string;
  /** 滚动条拖拽颜色 */
  scrollbarDragBg?: string;
  /** 导航箭头颜色 */
  arrowColor?: string;
  /** 进度指示器颜色 */
  progressBarColor?: string;
  /** 幻灯片背景色 */
  backgroundColor?: string;
  /** 文本颜色 */
  textColor?: string;
  /** 链接颜色 */
  linkColor?: string;
  /** 标题颜色 */
  headingColor?: string;
  /** 代码块背景色 */
  codeBackground?: string;
}

/**
 * 标准 CSS 变量名
 *
 * 这些是 SlideJS 定义的抽象主题 CSS 变量
 * 各个 runner 可以自由决定如何消费和应用这些变量
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
