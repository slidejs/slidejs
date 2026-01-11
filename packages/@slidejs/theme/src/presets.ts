/**
 * @slidejs/theme - 预设主题
 *
 * 提供内置的主题预设
 */

import type { StandardTheme } from './types';

/**
 * 预设主题名称常量
 */
const PRESET_THEME_SOLARIZED_DARK = 'solarized-dark' as const;
const PRESET_THEME_SOLARIZED_LIGHT = 'solarized-light' as const;

/**
 * Solarized Dark 主题
 * 
 * 基于 Solarized 配色方案的深色主题
 * 参考：https://ethanschoonover.com/solarized/
 */
export const solarizedDark: StandardTheme = {
  // 基础颜色
  backgroundColor: '#002b36',      // base03 - 最暗的背景
  textColor: '#839496',            // base0 - 主要文本
  headingColor: '#93a1a1',        // base1 - 标题文本
  linkColor: '#268bd2',            // blue - 链接颜色
  
  // 导航和分页
  navigationColor: '#268bd2',      // blue - 导航按钮
  paginationColor: '#268bd2',       // blue - 分页器
  paginationActiveColor: '#2aa198', // cyan - 激活状态
  arrowColor: '#268bd2',           // blue - 箭头（Splide）
  progressBarColor: '#2aa198',     // cyan - 进度条
  
  // 滚动条
  scrollbarBg: 'rgba(131, 148, 150, 0.2)',      // base0 with opacity
  scrollbarDragBg: 'rgba(131, 148, 150, 0.5)',  // base0 with opacity
  
  // 代码
  codeBackground: '#073642',        // base02 - 代码背景
};

/**
 * Solarized Light 主题
 * 
 * 基于 Solarized 配色方案的浅色主题
 * 参考：https://ethanschoonover.com/solarized/
 */
export const solarizedLight: StandardTheme = {
  // 基础颜色
  backgroundColor: '#fdf6e3',      // base3 - 最亮的背景
  textColor: '#657b83',             // base00 - 主要文本
  headingColor: '#586e75',         // base01 - 标题文本
  linkColor: '#268bd2',            // blue - 链接颜色
  
  // 导航和分页
  navigationColor: '#268bd2',      // blue - 导航按钮
  paginationColor: '#268bd2',       // blue - 分页器
  paginationActiveColor: '#2aa198', // cyan - 激活状态
  arrowColor: '#268bd2',           // blue - 箭头（Splide）
  progressBarColor: '#2aa198',     // cyan - 进度条
  
  // 滚动条
  scrollbarBg: 'rgba(101, 123, 131, 0.2)',      // base00 with opacity
  scrollbarDragBg: 'rgba(101, 123, 131, 0.5)',  // base00 with opacity
  
  // 代码
  codeBackground: '#eee8d5',        // base2 - 代码背景
};

/**
 * 预设主题映射
 * 使用常量作为键，确保类型安全
 */
export const presets = {
  [PRESET_THEME_SOLARIZED_DARK]: solarizedDark,
  [PRESET_THEME_SOLARIZED_LIGHT]: solarizedLight,
} as const;

/**
 * 预设主题名称类型
 */
export type PresetThemeName = keyof typeof presets;

/**
 * 预设主题名称常量对象
 * 提供类型安全的命名空间访问
 */
export const Preset = {
  SolarizedDark: PRESET_THEME_SOLARIZED_DARK,
  SolarizedLight: PRESET_THEME_SOLARIZED_LIGHT,
} as const;
