/**
 * @slidejs/runner-swiper - Swiper 适配器
 *
 * 将 Slide DSL 渲染为 Swiper 幻灯片
 *
 * 样式会自动加载（包含 Swiper 核心 CSS），无需手动导入 CSS。
 * CSS 会在创建 Swiper 容器时自动注入到页面中。
 */

export { SwiperAdapter } from './adapter';
export { createSlideRunner, type SlideRunnerConfig } from './runner';
export type { SwiperAdapterOptions } from './types';
