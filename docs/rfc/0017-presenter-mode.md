# RFC 0017: 演讲者模式

## 元数据

- **RFC ID**: 0017
- **标题**: 演讲者模式
- **状态**: 草案
- **创建日期**: 2025-01-XX
- **作者**: AI Assistant
- **相关 RFC**: RFC 0002 (Slide Runner), RFC 0013 (Markdown 支持)

## 摘要

本 RFC 提议为 SlideJS 添加演讲者模式功能，提供演讲者视图（当前幻灯片 + 下一张 + 备注 + 计时器）和观众视图（仅当前幻灯片），支持双屏显示和远程控制。

## 动机

### 背景问题

1. **演示需求**: 演讲者需要看到备注和下一张幻灯片
2. **双屏支持**: 支持演讲者屏幕和投影屏幕
3. **远程控制**: 支持使用手机控制幻灯片

### 设计目标

1. **演讲者视图**: 当前幻灯片 + 下一张 + 备注 + 计时器
2. **观众视图**: 仅当前幻灯片
3. **双屏显示**: 支持演讲者屏幕 + 投影屏幕
4. **远程控制**: 支持手机控制幻灯片

## 详细设计

### 技术实现

1. **功能描述**:
   - 演讲者视图：当前幻灯片 + 下一张 + 备注 + 计时器 + 进度条
   - 观众视图：仅当前幻灯片
   - 状态同步：使用 WebSocket 或 BroadcastChannel 同步状态
   - 远程控制：支持手机控制幻灯片

2. **实现方案**:
   - 创建演讲者视图组件
   - 使用 WebSocket 或 BroadcastChannel 同步状态
   - 支持多窗口显示
   - 支持备注显示（从 Frontmatter 或单独文件读取）

3. **新包**: `@slidejs/presenter`
   - `PresenterMode` - 演讲者模式组件
   - `PresenterSync` - 状态同步
   - `PresenterNotes` - 备注显示
   - `PresenterTimer` - 计时器

### 实施步骤

1. **创建 `@slidejs/presenter` 包**:
   - 实现 `PresenterMode` 组件
   - 实现状态同步机制（WebSocket 或 BroadcastChannel）
   - 实现备注显示
   - 实现计时器

2. **Runner 集成**:
   - 在 Runner 中集成演讲者模式
   - 支持切换演讲者/观众视图
   - 支持所有 Runner（Reveal.js, Swiper, Splide）

3. **远程控制**:
   - 实现 WebSocket 服务器
   - 实现手机控制界面
   - 支持前进、后退、跳转等操作

4. **测试**:
   - 单元测试覆盖演讲者模式
   - 测试状态同步
   - 测试双屏显示
   - 测试远程控制

## 技术细节

### 状态同步

```typescript
// 使用 BroadcastChannel（同源）
const channel = new BroadcastChannel('slidejs-presenter');

channel.postMessage({
  type: 'slide-change',
  slideIndex: 2,
});

// 或使用 WebSocket（跨设备）
const ws = new WebSocket('ws://localhost:3000');
ws.send(JSON.stringify({
  type: 'slide-change',
  slideIndex: 2,
}));
```

### API 设计

```typescript
interface PresenterMode {
  enable(): void;
  disable(): void;
  switchView(view: 'presenter' | 'audience'): void;
  showNotes(notes: string): void;
  startTimer(): void;
  stopTimer(): void;
}
```

## 兼容性考虑

1. **现有 Runner**: 所有 Runner 都支持
2. **浏览器兼容性**: BroadcastChannel 需要现代浏览器支持
3. **网络**: WebSocket 需要网络连接

## 风险评估

1. **复杂度**: 状态同步和远程控制增加复杂度
2. **网络**: WebSocket 需要网络连接
3. **安全性**: 远程控制需要考虑安全性

## 参考

- [Reveal.js Presenter Mode](https://revealjs.com/presenter-mode/)
- [Slidev Presenter Mode](https://sli.dev/guide/presenter-mode.html)

## 决策记录

- **2025-01-XX**: 创建 RFC，开始讨论
- **待定**: 选择 BroadcastChannel 或 WebSocket
- **待定**: 开始实施
