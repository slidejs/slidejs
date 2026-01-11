/**
 * @slidejs/runner-swiper - 类型定义
 *
 * 定义 Swiper 适配器的选项和配置
 */

import { Swiper } from 'swiper';
import type { AdapterOptions } from '@slidejs/runner';

// Swiper 构造函数的第二个参数类型
type SwiperOptions = ConstructorParameters<typeof Swiper>[1];

/**
 * SwiperAdapter 选项
 *
 * 注意：Swiper Bundle CSS（包含所有模块的 CSS）会在创建 runner 时自动注入，
 * 无需手动导入。
 *
 * Keyboard、Navigation 和 Pagination 模块已在适配器中自动注册，
 * 无需在配置中再次指定 modules。
 */
export interface SwiperAdapterOptions extends AdapterOptions {
  /**
   * Swiper 配置选项
   * @see https://swiperjs.com/swiper-api#parameters
   */
  swiperConfig?: SwiperOptions;
}
