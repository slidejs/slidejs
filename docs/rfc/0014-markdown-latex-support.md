# RFC 0014: LaTeX 数学公式支持

## 元数据

- **RFC ID**: 0014
- **标题**: LaTeX 数学公式支持
- **状态**: 草案
- **创建日期**: 2025-01-XX
- **作者**: AI Assistant
- **相关 RFC**: RFC 0013 (Markdown 支持与 Slidev 兼容功能)

## 摘要

本 RFC 提议为 SlideJS 的 Markdown 支持添加 LaTeX 数学公式渲染功能，支持行内和块级数学公式，使用 KaTeX 或 MathJax 作为渲染引擎。

## 动机

### 背景问题

1. **技术演示需求**: 技术演示经常需要展示数学公式
2. **Slidev 的成功**: Slidev 的 LaTeX 支持非常受欢迎
3. **用户需求**: 用户希望在 SlideJS 中也能使用 LaTeX

### 设计目标

1. **行内公式**: 支持 `$...$` 语法
2. **块级公式**: 支持 `$$...$$` 语法
3. **高质量渲染**: 使用 KaTeX 或 MathJax 提供高质量渲染
4. **性能优化**: 确保数学公式渲染不影响幻灯片性能

## 详细设计

### 技术实现

1. **Markdown 语法**:
   ```markdown
   # Math Equations
   
   Inline math: $E = mc^2$
   
   Block math:
   $$
   \int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
   $$
   
   Matrix:
   $$
   \begin{pmatrix}
   a & b \\
   c & d
   \end{pmatrix}
   $$
   ```

2. **实现方案**:
   - 使用 `katex` 作为渲染引擎（推荐，性能更好）
   - 在 Markdown 解析时检测 `$...$` 和 `$$...$$`
   - 转换为 HTML 时保留数学公式标记
   - 在 Runner 渲染时初始化 KaTeX
   - 支持 KaTeX 的所有 LaTeX 命令和符号

3. **新包**: `@slidejs/markdown-latex`
   - `renderMath()` - 渲染数学公式
   - `initKaTeX()` - 初始化 KaTeX
   - 支持行内和块级公式
   - 支持所有 KaTeX 功能

### 实施步骤

1. **创建 `@slidejs/markdown-latex` 包**:
   - 安装 `katex` 依赖
   - 实现 `parseMath()` - 检测和解析数学公式
   - 实现 `renderMath()` - 渲染数学公式为 HTML
   - 实现 `initKaTeX()` - 初始化 KaTeX CSS 和 JS

2. **集成到 `@slidejs/markdown`**:
   - 在 Markdown 解析时检测数学公式
   - 在 HTML 转换时保留数学公式标记
   - 调用 `renderMath()` 渲染公式

3. **Runner 集成**:
   - 在 Runner 初始化时加载 KaTeX CSS
   - 在幻灯片渲染后调用 KaTeX 渲染数学公式
   - 支持所有 Runner（Reveal.js, Swiper, Splide）

4. **测试**:
   - 单元测试覆盖基本数学公式
   - 测试行内和块级公式
   - 测试复杂公式（矩阵、积分等）
   - 测试性能

## 技术细节

### KaTeX 配置

```typescript
import katex from 'katex';
import 'katex/dist/katex.min.css';

function renderMath(expression: string, displayMode: boolean): string {
  return katex.renderToString(expression, {
    throwOnError: false,
    displayMode,
    output: 'html',
  });
}
```

### Markdown 解析

```typescript
function parseMath(markdown: string): string {
  // 检测块级公式 $$...$$
  markdown = markdown.replace(/\$\$([\s\S]*?)\$\$/g, (match, expr) => {
    return `<div class="math-block">${renderMath(expr.trim(), true)}</div>`;
  });
  
  // 检测行内公式 $...$
  markdown = markdown.replace(/\$([^\$]+)\$/g, (match, expr) => {
    return renderMath(expr.trim(), false);
  });
  
  return markdown;
}
```

## 兼容性考虑

1. **现有 DSL**: 不影响现有 DSL，仅影响 Markdown 转换
2. **Runner**: 所有 Runner 都支持（因为转换为 HTML）
3. **主题**: 支持主题系统，可以自定义数学公式样式

## 风险评估

1. **性能**: KaTeX 渲染可能有性能开销，需要优化
2. **浏览器兼容性**: KaTeX 需要现代浏览器支持
3. **依赖大小**: KaTeX 会增加包大小

## 参考

- [KaTeX 文档](https://katex.org/)
- [MathJax 文档](https://www.mathjax.org/)
- [Slidev LaTeX 支持](https://sli.dev/guide/syntax.html#latex)

## 决策记录

- **2025-01-XX**: 创建 RFC，开始讨论
- **待定**: 选择 KaTeX 或 MathJax
- **待定**: 开始实施
