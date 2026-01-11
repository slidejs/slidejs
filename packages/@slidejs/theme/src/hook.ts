/**
 * @slidejs/theme - CSS Hook API
 *
 * 提供运行时动态设置标准 CSS 变量的 API
 * 
 * 注意：本包只提供高级 API（标准变量），不提供低级 API（runner 特定变量）。
 * 如果需要直接设置 runner 特定变量，请自行使用 DOM API，风险自负。
 */

import type { StandardTheme } from './types';
import { STANDARD_CSS_VARIABLES } from './types';
import { presets, type PresetThemeName } from './presets';

/**
 * 设置 CSS 变量的辅助函数
 */
function setCSSVariable(
  element: HTMLElement | Document,
  variableName: string,
  value: string
): void {
  if (element instanceof Document) {
    element.documentElement.style.setProperty(variableName, value);
  } else {
    element.style.setProperty(variableName, value);
  }
}

/**
 * 应用标准主题（高级 API）
 * 设置标准 CSS 变量，runner 会将这些变量映射到自己的变量
 */
function applyStandardTheme(
  element: HTMLElement | Document,
  theme: StandardTheme
): void {
  if (theme.navigationColor) {
    setCSSVariable(element, STANDARD_CSS_VARIABLES.navigationColor, theme.navigationColor);
  }
  if (theme.paginationColor) {
    setCSSVariable(element, STANDARD_CSS_VARIABLES.paginationColor, theme.paginationColor);
  }
  if (theme.paginationActiveColor) {
    setCSSVariable(element, STANDARD_CSS_VARIABLES.paginationActiveColor, theme.paginationActiveColor);
  }
  if (theme.scrollbarBg) {
    setCSSVariable(element, STANDARD_CSS_VARIABLES.scrollbarBg, theme.scrollbarBg);
  }
  if (theme.scrollbarDragBg) {
    setCSSVariable(element, STANDARD_CSS_VARIABLES.scrollbarDragBg, theme.scrollbarDragBg);
  }
  if (theme.arrowColor) {
    setCSSVariable(element, STANDARD_CSS_VARIABLES.arrowColor, theme.arrowColor);
  }
  if (theme.progressBarColor) {
    setCSSVariable(element, STANDARD_CSS_VARIABLES.progressBarColor, theme.progressBarColor);
  }
  if (theme.backgroundColor) {
    setCSSVariable(element, STANDARD_CSS_VARIABLES.backgroundColor, theme.backgroundColor);
  }
  if (theme.textColor) {
    setCSSVariable(element, STANDARD_CSS_VARIABLES.textColor, theme.textColor);
  }
  if (theme.linkColor) {
    setCSSVariable(element, STANDARD_CSS_VARIABLES.linkColor, theme.linkColor);
  }
  if (theme.headingColor) {
    setCSSVariable(element, STANDARD_CSS_VARIABLES.headingColor, theme.headingColor);
  }
  if (theme.codeBackground) {
    setCSSVariable(element, STANDARD_CSS_VARIABLES.codeBackground, theme.codeBackground);
  }
}

/**
 * CSS Hook API 类
 * 
 * 只提供高级 API（标准变量），不提供低级 API（runner 特定变量）
 */
export class SlideThemeHook {
  private target: HTMLElement | Document;

  /**
   * 创建主题 Hook 实例
   *
   * @param target - 目标元素或文档（默认为 document）
   */
  constructor(target?: HTMLElement | Document | string) {
    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (!element) {
        throw new Error(`Element not found: ${target}`);
      }
      this.target = element as HTMLElement;
    } else if (target) {
      this.target = target;
    } else {
      this.target = document;
    }
  }

  /**
   * 设置标准主题（高级 API）
   * 使用标准变量名，不针对特定 runner
   * 
   * 这是 SlideJS 官方支持的 API
   *
   * @param theme - 标准主题配置或预设主题名称
   */
  set(theme: StandardTheme | PresetThemeName): void {
    if (typeof theme === 'string') {
      const preset = presets[theme];
      if (!preset) {
        throw new Error(`Unknown preset theme: ${theme}. Available presets: ${Object.keys(presets).join(', ')}`);
      }
      applyStandardTheme(this.target, preset);
    } else {
      applyStandardTheme(this.target, theme);
    }
  }

  /**
   * 获取 CSS 变量值
   *
   * @param variableName - CSS 变量名（标准变量或 runner 特定变量）
   * @returns CSS 变量值
   */
  get(variableName: string): string | null {
    if (this.target instanceof Document) {
      return getComputedStyle(this.target.documentElement).getPropertyValue(variableName).trim();
    }
    return getComputedStyle(this.target).getPropertyValue(variableName).trim();
  }

  /**
   * 移除 CSS 变量
   *
   * @param variableName - CSS 变量名（标准变量或 runner 特定变量）
   */
  remove(variableName: string): void {
    if (this.target instanceof Document) {
      this.target.documentElement.style.removeProperty(variableName);
    } else {
      this.target.style.removeProperty(variableName);
    }
  }

  /**
   * 清除所有标准主题变量
   */
  clear(): void {
    Object.values(STANDARD_CSS_VARIABLES).forEach(variableName => {
      this.remove(variableName);
    });
  }
}

/**
 * 全局主题 Hook 实例（作用于 document）
 */
export const globalTheme = new SlideThemeHook();

/**
 * 设置全局标准主题（高级 API）
 * 
 * 这是 SlideJS 官方支持的 API
 * 使用标准变量名，所有 runner 会自动映射这些变量
 *
 * @param theme - 标准主题配置或预设主题名称
 * 
 * @example
 * ```typescript
 * import { setTheme } from '@slidejs/theme';
 * 
 * // 使用自定义主题
 * setTheme({
 *   navigationColor: '#ff0000',
 *   paginationColor: '#00ff00',
 * });
 * 
 * // 使用预设主题
 * setTheme('solarized-dark');
 * setTheme('solarized-light');
 * ```
 */
export function setTheme(theme: StandardTheme | PresetThemeName): void {
  if (typeof theme === 'string') {
    const preset = presets[theme];
    if (!preset) {
      throw new Error(`Unknown preset theme: ${theme}. Available presets: ${Object.keys(presets).join(', ')}`);
    }
    globalTheme.set(preset);
  } else {
    globalTheme.set(theme);
  }
}

/**
 * 创建作用域主题 Hook
 *
 * @param selector - CSS 选择器或 HTMLElement
 * @returns 主题 Hook 实例
 * 
 * @example
 * ```typescript
 * import { useTheme } from '@slidejs/theme';
 * 
 * const theme = useTheme('#my-slides');
 * theme.set({
 *   navigationColor: '#ff0000',
 * });
 * ```
 */
export function useTheme(selector?: HTMLElement | string): SlideThemeHook {
  return new SlideThemeHook(selector);
}
