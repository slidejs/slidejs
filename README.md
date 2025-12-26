# SlideJS

一个使用 DSL 构建幻灯片的开源库。

## 简介

SlideJS 是一个功能强大的幻灯片构建库，它使用 DSL（领域特定语言）来定义和渲染幻灯片，支持多种渲染引擎（reveal.js、Swiper、Splide 等）。让您可以轻松创建、管理和展示交互式幻灯片。

## 特性

- 🎯 **声明式 DSL** - 使用简洁的 DSL 语法定义幻灯片结构
- 🎨 **多种渲染引擎** - 支持 reveal.js、Swiper、Splide 等
- 📦 **数据源无关** - 通过 Context Adapter 支持任意数据源（Quiz、Survey、Form 等）
- 🔒 **类型安全** - 完整的 TypeScript 类型定义和验证
- 🔄 **规则引擎** - 支持 start、content、end 规则和嵌套循环
- 🎨 **动态内容** - 支持静态文本和动态组件
- ⚡ **高性能** - 基于编译时优化的 DSL 解析和生成

## 安装

```bash
# 安装核心组件库
npm install @slidejs/core

# 安装 DSL 库（用于验证和序列化）
npm install @slidejs/dsl

# 安装运行器（可选）
npm install @slidejs/runner-revealjs    # reveal.js 运行器
npm install @slidejs/runner-swiper      # Swiper 运行器
npm install @slidejs/runner-splide      # Splide 运行器
```

## 快速开始

### 使用运行器（Runner）

```typescript
import { createRunner } from '@slidejs/runner-revealjs';
import type { SlideDSL } from '@slidejs/dsl';

const dsl: SlideDSL = {
  version: '1.0.0',
  slides: [
    {
      id: 'slide-1',
      type: 'title',
      title: '欢迎使用 SlideJS',
      subtitle: '一个强大的幻灯片 DSL',
    },
    {
      id: 'slide-2',
      type: 'content',
      title: '特性',
      content: [
        { type: 'text', text: '支持多种渲染引擎' },
        { type: 'text', text: '简洁的 DSL 语法' },
        { type: 'text', text: '类型安全' },
      ],
    },
  ],
};

// 创建运行器
const runner = createRunner({
  container: document.getElementById('slides-container')!,
  dsl,
});

// 初始化
await runner.init();
```

## 项目结构

```
slidejs/
├── packages/              # 核心包
│   ├── @slidejs/         # 核心包命名空间
│   │   ├── core/         # 核心引擎
│   │   ├── dsl/          # DSL 定义、验证和序列化
│   │   ├── context/      # 上下文管理
│   │   ├── runner/       # 基础运行器
│   │   ├── runner-revealjs/  # reveal.js 运行器
│   │   ├── runner-swiper/    # Swiper 运行器
│   │   └── runner-splide/    # Splide 运行器
├── demos/                # 演示项目
│   ├── slidejs-revealjs/ # reveal.js 演示
│   ├── slidejs-swiper/   # Swiper 演示
│   └── slidejs-splide/   # Splide 演示
├── site/                 # 官方网站
│   └── src/              # wsx 组件和页面
└── docs/                 # 文档
    └── rfc/              # 技术规范和架构设计
```

## 核心包

### @slidejs/core

核心引擎，提供幻灯片渲染的基础能力。

- `SlideEngine` - 幻灯片引擎
- `SlideContext` - 上下文管理

### @slidejs/dsl

Slide DSL 定义、验证和序列化工具。

- `validateSlideDSL()` - DSL 验证
- `parseSlideDSL()` - DSL 解析
- `compileSlideDSL()` - DSL 编译

### @slidejs/runner-revealjs

reveal.js 运行器，基于 reveal.js 渲染幻灯片。

- `createRunner()` - 创建运行器实例

### @slidejs/runner-swiper

Swiper 运行器，基于 Swiper.js 渲染幻灯片。

- `createRunner()` - 创建运行器实例

### @slidejs/runner-splide

Splide 运行器，基于 Splide 渲染幻灯片。

- `createRunner()` - 创建运行器实例

## 文档

- **RFC 文档**: [docs/rfc/](./docs/rfc/) - 技术规范和架构设计

## 开发

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
pnpm install
```

### 开发命令

```bash
# 开发模式（交互式菜单）
pnpm dev

# 开发特定项目
pnpm dev:site              # 开发网站
pnpm dev:slidejs           # reveal.js 演示
pnpm dev:slidejs-swiper    # Swiper 演示
pnpm dev:slidejs-splide    # Splide 演示

# 构建所有包
pnpm build

# 运行测试
pnpm test

# 代码检查
pnpm lint
pnpm lint:fix        # 自动修复
```

### 网站部署

```bash
# 构建网站和演示
pnpm build:pages

# 预览构建结果
pnpm preview:pages

# 部署到 GitHub Pages
pnpm deploy:pages
```

## 许可证

本项目采用 **MIT License**，允许自由使用、修改和分发，包括商业用途。

### 企业许可证

对于企业客户，我们提供商业许可证选项，包括：

- ✅ 商业法律保护（无 MIT 免责声明）
- ✅ 优先技术支持
- ✅ SLA（服务级别协议）
- ✅ 定制开发服务
- ✅ 白标/品牌定制

**了解更多**: 查看 [企业许可证文档](./docs/ENTERPRISE-LICENSE.md) 或联系 [enterprise@slidejs.io](mailto:enterprise@slidejs.io)

## 相关项目

- [reveal.js](https://revealjs.com/) - HTML 演示框架
- [Swiper](https://swiperjs.com/) - 现代触摸滑块
- [Splide](https://splidejs.com/) - 轻量级轮播组件
- [wsxjs](https://www.wsxjs.dev) - Web Components 框架

## 贡献

欢迎贡献！请查看 [GitHub Issues](https://github.com/slidejs/slidejs/issues) 了解待办事项。

## 作者

SlideJS 团队
