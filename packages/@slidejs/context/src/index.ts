/**
 * @slidejs/context
 *
 * Slide DSL Context 接口定义
 */

export type {
  SlideContext,
  SlideMetadata,
  ContentItem,
  ContentGroup,
  ContextAdapter,
} from './types';

// 导出空对象以确保生成有效的运行时代码
// 这个包主要提供类型定义，但需要有效的运行时导出以通过构建验证
export const __contextVersion = '0.1.6';
