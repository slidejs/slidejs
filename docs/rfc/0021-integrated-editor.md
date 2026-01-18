# RFC 0021: 集成编辑器

## 元数据

- **RFC ID**: 0021
- **标题**: 集成编辑器
- **状态**: 草案
- **创建日期**: 2025-01-XX
- **作者**: AI Assistant
- **相关 RFC**: RFC 0013 (Markdown 支持与 Slidev 兼容功能)

## 摘要

本 RFC 提议为 SlideJS 添加集成编辑器功能，支持在演示应用中集成 Monaco Editor 或 CodeMirror，提供 Markdown 编辑、预览、语法高亮和自动补全功能。

## 动机

### 背景问题

1. **开发体验**: 用户希望在编辑 Markdown 时看到实时预览
2. **语法高亮**: 需要 Markdown 语法高亮
3. **自动补全**: 需要自动补全功能

### 设计目标

1. **集成编辑器**: 集成 Monaco Editor 或 CodeMirror
2. **实时预览**: 支持 Markdown 实时预览
3. **语法高亮**: 支持 Markdown 语法高亮
4. **自动补全**: 支持自动补全（Frontmatter、图标等）

## 详细设计

### 技术实现

1. **功能描述**:
   - 集成 Monaco Editor 或 CodeMirror
   - 支持 Markdown 编辑
   - 支持实时预览
   - 支持语法高亮
   - 支持自动补全

2. **实现方案**:
   - 使用 Monaco Editor（推荐，功能强大）
   - 在演示应用中集成编辑器
   - 支持实时预览
   - 支持热重载

3. **新包**: `@slidejs/editor-markdown`
   - `MarkdownEditor` - Markdown 编辑器组件
   - `MarkdownPreview` - Markdown 预览组件
   - `MarkdownLanguage` - Markdown 语言支持

### 实施步骤

1. **创建 `@slidejs/editor-markdown` 包**:
   - 安装 `monaco-editor` 依赖
   - 实现 `MarkdownEditor` 组件
   - 实现 `MarkdownPreview` 组件
   - 实现 Markdown 语言支持

2. **集成到演示应用**:
   - 在演示应用中集成编辑器
   - 支持实时预览
   - 支持热重载

3. **自动补全**:
   - 实现 Frontmatter 自动补全
   - 实现图标自动补全
   - 实现 Mermaid 自动补全

4. **测试**:
   - 单元测试覆盖编辑器功能
   - 测试实时预览
   - 测试自动补全

## 技术细节

### Monaco Editor 配置

```typescript
import * as monaco from 'monaco-editor';

const editor = monaco.editor.create(document.getElementById('editor'), {
  value: markdownSource,
  language: 'markdown',
  theme: 'vs-dark',
  automaticLayout: true,
  minimap: { enabled: true },
});
```

### 实时预览

```typescript
editor.onDidChangeModelContent(() => {
  const value = editor.getValue();
  // 转换 Markdown 为 DSL
  const dsl = markdownToSlideDSL(value);
  // 更新预览
  updatePreview(dsl);
});
```

## 兼容性考虑

1. **现有 DSL**: 不影响现有 DSL
2. **浏览器兼容性**: Monaco Editor 需要现代浏览器支持
3. **性能**: 编辑器可能影响性能

## 风险评估

1. **依赖大小**: Monaco Editor 会增加包大小
2. **性能**: 编辑器可能影响性能
3. **浏览器兼容性**: 需要现代浏览器支持

## 参考

- [Monaco Editor 文档](https://microsoft.github.io/monaco-editor/)
- [CodeMirror 文档](https://codemirror.net/)

## 决策记录

- **2025-01-XX**: 创建 RFC，开始讨论
- **待定**: 选择 Monaco Editor 或 CodeMirror
- **待定**: 开始实施
