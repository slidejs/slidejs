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

import type { SlideContext } from './types';

// 导出常量以确保生成有效的运行时代码
// 这个包主要提供类型定义，但需要有效的运行时导出以通过构建验证
export const __contextVersion = '0.1.7';

// 导出工具函数以增加运行时内容
export function createEmptyContext(): SlideContext {
  return {
    sourceType: 'static',
    sourceId: '',
    metadata: {
      title: '',
    },
    items: [],
  };
}
