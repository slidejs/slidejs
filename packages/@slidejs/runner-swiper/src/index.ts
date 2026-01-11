/**
 * @slidejs/runner-swiper - Swiper 适配器
 *
 * 将 Slide DSL 渲染为 Swiper 幻灯片
 *
 * 样式会自动加载（使用 Swiper Bundle CSS，包含所有模块的 CSS），
 * 无需手动导入 CSS。Bundle CSS 会在创建 Swiper 容器时自动注入到页面中。
 */

export { SwiperAdapter } from './adapter';
export { createSlideRunner, type SlideRunnerConfig } from './runner';
export type { SwiperAdapterOptions, SwiperOptions } from './types';
