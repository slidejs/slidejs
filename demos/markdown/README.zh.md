# Markdown 到 DSL 转换器演示

此演示应用展示了 Markdown 到 Slide DSL 的转换功能。

## 布局

```
┌─────────────────────────────────────────────────────────┐
│  主题工具栏                                              │
├──────────────┬──────────────────────────────────────────┤
│              │  ┌────────────────────────────────────┐  │
│  Markdown     │  │  幻灯片预览 (Reveal.js)          │  │
│  编辑器       │  └────────────────────────────────────┘  │
│  (Monaco)     │  ┌────────────────────────────────────┐  │
│              │  │  生成的 DSL (Monaco)                │  │
│              │  └────────────────────────────────────┘  │
└──────────────┴──────────────────────────────────────────┘
```

- **左侧面板**: Markdown 编辑器（Monaco Editor，支持 Markdown 语法高亮）
- **右侧顶部面板**: 幻灯片预览（Reveal.js Runner）
- **右侧底部面板**: 生成的 DSL（Monaco Editor，只读）

## 功能

- 实时转换：编辑 Markdown 时自动转换为 DSL 并更新预览
- 可调整面板：拖动垂直和水平分割器调整面板大小
- 主题切换：在深色和浅色主题之间切换
- 实时预览：实时查看幻灯片渲染效果

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 项目结构

```
demos/markdown/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── style.css
│   ├── presentation.md          # 示例 Markdown 文件
│   └── env.d.ts
└── README.md
```

## 实现状态

⚠️ **注意**：此演示目前使用模拟转换函数。实际的 Markdown 到 DSL 转换将在 `@slidejs/markdown` 包中实现（参见 RFC 0013）。

一旦 `@slidejs/markdown` 包实现后，此演示将：
- 使用 `markdownToSlideDSL()` 将 Markdown 转换为 DSL
- 使用 `createMarkdownRunner()` 创建幻灯片运行器
- 支持所有 Markdown 功能（Frontmatter、代码高亮、LaTeX、Mermaid 等）

## 相关演示

- [Vue 演示](../vue/README.zh.md) - 功能完整的 Vue.js 演示，包含所有运行器
- [React 演示](../react/README.zh.md) - React.js 演示
- [Vanilla 演示](../vanilla/README.zh.md) - Vanilla TypeScript 演示

## 语言

[English](./README.md)
