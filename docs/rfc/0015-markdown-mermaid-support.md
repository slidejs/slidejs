# RFC 0015: Mermaid 图表支持

## 元数据

- **RFC ID**: 0015
- **标题**: Mermaid 图表支持
- **状态**: 草案
- **创建日期**: 2025-01-XX
- **作者**: AI Assistant
- **相关 RFC**: RFC 0013 (Markdown 支持与 Slidev 兼容功能)

## 摘要

本 RFC 提议为 SlideJS 的 Markdown 支持添加 Mermaid 图表渲染功能，支持流程图、序列图、甘特图等多种图表类型。

## 动机

### 背景问题

1. **图表需求**: 技术演示经常需要展示流程图、架构图等
2. **Mermaid 的流行**: Mermaid 是广泛使用的图表工具
3. **Slidev 的成功**: Slidev 的 Mermaid 支持非常受欢迎

### 设计目标

1. **多种图表类型**: 支持 Mermaid 的所有图表类型
2. **文本描述**: 使用文本描述创建图表，无需图形工具
3. **高质量渲染**: 使用 Mermaid 提供高质量 SVG 渲染
4. **主题支持**: 支持 Mermaid 主题系统

## 详细设计

### 技术实现

1. **Markdown 语法**:
   ```markdown
   # Diagrams
   
   Flowchart:
   ```mermaid
   graph TD
       A[Start] --> B{Decision}
       B -->|Yes| C[Action 1]
       B -->|No| D[Action 2]
   ```
   
   Sequence Diagram:
   ```mermaid
   sequenceDiagram
       participant A
       participant B
       A->>B: Request
       B-->>A: Response
   ```
   ```

2. **实现方案**:
   - 使用 `mermaid` 库渲染图表
   - 在 Markdown 解析时检测 `mermaid` 代码块
   - 转换为 HTML 时保留 Mermaid 标记
   - 在 Runner 渲染时初始化 Mermaid
   - 支持 Mermaid 的所有图表类型和配置

3. **新包**: `@slidejs/markdown-mermaid`
   - `renderMermaid()` - 渲染 Mermaid 图表
   - `initMermaid()` - 初始化 Mermaid
   - 支持所有 Mermaid 图表类型

### 实施步骤

1. **创建 `@slidejs/markdown-mermaid` 包**:
   - 安装 `mermaid` 依赖
   - 实现 `parseMermaid()` - 检测和解析 Mermaid 代码块
   - 实现 `renderMermaid()` - 渲染 Mermaid 图表为 SVG
   - 实现 `initMermaid()` - 初始化 Mermaid

2. **集成到 `@slidejs/markdown`**:
   - 在 Markdown 解析时检测 `mermaid` 代码块
   - 在 HTML 转换时保留 Mermaid 标记
   - 调用 `renderMermaid()` 渲染图表

3. **Runner 集成**:
   - 在 Runner 初始化时加载 Mermaid
   - 在幻灯片渲染后调用 Mermaid 渲染图表
   - 支持所有 Runner（Reveal.js, Swiper, Splide）

4. **测试**:
   - 单元测试覆盖基本图表类型
   - 测试流程图、序列图、甘特图等
   - 测试复杂图表
   - 测试性能

## 技术细节

### Mermaid 配置

```typescript
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  themeVariables: {
    primaryColor: '#4a90e2',
  },
});

async function renderMermaid(diagram: string, id: string): Promise<string> {
  const { svg } = await mermaid.render(id, diagram);
  return svg;
}
```

### Markdown 解析

```typescript
function parseMermaid(markdown: string): string {
  let mermaidIndex = 0;
  
  markdown = markdown.replace(/```mermaid\n([\s\S]*?)```/g, (match, diagram) => {
    const id = `mermaid-${mermaidIndex++}`;
    return `<div class="mermaid-diagram" data-mermaid="${id}">${diagram.trim()}</div>`;
  });
  
  return markdown;
}
```

## 兼容性考虑

1. **现有 DSL**: 不影响现有 DSL，仅影响 Markdown 转换
2. **Runner**: 所有 Runner 都支持（因为转换为 SVG）
3. **主题**: 支持 Mermaid 主题系统

## 风险评估

1. **性能**: Mermaid 渲染可能有性能开销，需要优化
2. **浏览器兼容性**: Mermaid 需要现代浏览器支持
3. **依赖大小**: Mermaid 会增加包大小

## 参考

- [Mermaid 文档](https://mermaid.js.org/)
- [Slidev Mermaid 支持](https://sli.dev/guide/syntax.html#mermaid)

## 决策记录

- **2025-01-XX**: 创建 RFC，开始讨论
- **待定**: 开始实施
