# RFC 0016: 绘制和注释功能

## 元数据

- **RFC ID**: 0016
- **标题**: 绘制和注释功能
- **状态**: 草案
- **创建日期**: 2025-01-XX
- **作者**: AI Assistant
- **相关 RFC**: RFC 0002 (Slide Runner), RFC 0013 (Markdown 支持)

## 摘要

本 RFC 提议为 SlideJS 添加绘制和注释功能，允许用户在幻灯片上绘制、高亮和注释，支持触摸设备，并提供撤销/重做功能。

## 动机

### 背景问题

1. **演示需求**: 在演示过程中需要实时标注和注释
2. **交互性**: 增强幻灯片的交互性
3. **移动设备**: 支持在平板和手机上绘制

### 设计目标

1. **绘制工具**: 支持画笔、高亮、箭头等工具
2. **撤销/重做**: 支持撤销和重做操作
3. **保存和恢复**: 支持保存和恢复绘制内容
4. **触摸支持**: 支持触摸设备（平板、手机）

## 详细设计

### 技术实现

1. **功能描述**:
   - 在幻灯片上绘制和注释
   - 支持画笔、高亮、箭头、矩形、圆形等工具
   - 支持颜色选择
   - 支持线条粗细调整
   - 支持撤销/重做
   - 支持保存和恢复绘制内容

2. **实现方案**:
   - 使用 `fabric.js` 作为绘制引擎（推荐，功能强大）
   - 在 Runner 上叠加绘制层
   - 提供绘制工具栏
   - 支持触摸设备

3. **新包**: `@slidejs/drawing`
   - `DrawingLayer` - 绘制层组件
   - `DrawingToolbar` - 绘制工具栏
   - `DrawingStorage` - 绘制内容存储
   - `DrawingTools` - 绘制工具（画笔、高亮、箭头等）

### 实施步骤

1. **创建 `@slidejs/drawing` 包**:
   - 安装 `fabric` 依赖
   - 实现 `DrawingLayer` 组件
   - 实现 `DrawingToolbar` 组件
   - 实现绘制工具（画笔、高亮、箭头等）

2. **Runner 集成**:
   - 在 Runner 上叠加绘制层
   - 集成绘制工具栏
   - 支持所有 Runner（Reveal.js, Swiper, Splide）

3. **存储功能**:
   - 实现绘制内容序列化
   - 支持保存到 localStorage
   - 支持恢复绘制内容

4. **测试**:
   - 单元测试覆盖绘制功能
   - 测试触摸设备支持
   - 测试撤销/重做
   - 测试保存和恢复

## 技术细节

### Fabric.js 配置

```typescript
import { fabric } from 'fabric';

const canvas = new fabric.Canvas('drawing-canvas', {
  isDrawingMode: true,
  width: window.innerWidth,
  height: window.innerHeight,
});

// 画笔工具
canvas.freeDrawingBrush.width = 5;
canvas.freeDrawingBrush.color = '#4a90e2';
```

### API 设计

```typescript
interface DrawingLayer {
  enableDrawing(): void;
  disableDrawing(): void;
  setTool(tool: DrawingTool): void;
  setColor(color: string): void;
  setBrushWidth(width: number): void;
  undo(): void;
  redo(): void;
  clear(): void;
  save(): DrawingData;
  load(data: DrawingData): void;
}
```

## 兼容性考虑

1. **现有 Runner**: 所有 Runner 都支持（作为叠加层）
2. **触摸设备**: 支持触摸设备（平板、手机）
3. **性能**: 绘制操作需要优化，避免影响幻灯片性能

## 风险评估

1. **性能**: 大量绘制操作可能有性能开销
2. **浏览器兼容性**: Fabric.js 需要现代浏览器支持
3. **依赖大小**: Fabric.js 会增加包大小

## 参考

- [Fabric.js 文档](http://fabricjs.com/)
- [Konva.js 文档](https://konvajs.org/)（备选方案）

## 决策记录

- **2025-01-XX**: 创建 RFC，开始讨论
- **待定**: 选择 Fabric.js 或 Konva.js
- **待定**: 开始实施
