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

### 使用 Slide DSL 创建幻灯片

SlideJS 使用声明式的 DSL（领域特定语言）来定义幻灯片。首先创建一个 `.slide` 文件：

```slide
present quiz "my-presentation" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "# 欢迎使用 SlideJS"
          "## 一个强大的幻灯片 DSL"
        }
        behavior {
          transition fade {}
        }
      }
    }

    rule content "main-content" {
      slide {
        content text {
          "# 特性"
          ""
          "- 支持多种渲染引擎"
          "- 简洁的 DSL 语法"
          "- 类型安全"
        }
        behavior {
          transition slide {}
        }
      }
    }

    rule end "thanks" {
      slide {
        content text {
          "# 谢谢！"
        }
        behavior {
          transition zoom {}
        }
      }
    }
  }
}
```

### 在代码中使用

```typescript
import { createSlideRunner } from '@slidejs/runner-revealjs';
import type { SlideContext } from '@slidejs/context';

// DSL 源代码（可以从文件导入或直接定义）
const dslSource = `
present quiz "my-presentation" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "# 欢迎使用 SlideJS"
        }
      }
    }
  }
}
`;

// 创建上下文数据
const context: SlideContext = {
  sourceType: 'quiz',
  sourceId: 'my-presentation',
  metadata: {
    title: '我的演示',
  },
  items: [],
};

// 创建并运行幻灯片
const runner = await createSlideRunner(dslSource, context, {
  container: '#slides-container',
  revealOptions: {
    controls: true,
    progress: true,
  },
});

// 开始播放
runner.play();
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

Slide DSL 语法解析器和编译器。

- `parseSlideDSL()` - 解析 DSL 源代码为 AST
- `compile()` - 将 AST 编译为可执行的 SlideDSL 对象
- 基于 [Peggy](https://peggyjs.org/) 的语法解析器

### @slidejs/runner-revealjs

reveal.js 运行器，基于 reveal.js 渲染幻灯片。

- `createSlideRunner()` - 从 DSL 源代码创建运行器实例

### @slidejs/runner-swiper

Swiper 运行器，基于 Swiper.js 渲染幻灯片。

- `createSlideRunner()` - 从 DSL 源代码创建运行器实例

### @slidejs/runner-splide

Splide 运行器，基于 Splide 渲染幻灯片。

- `createSlideRunner()` - 从 DSL 源代码创建运行器实例

### @slidejs/theme

运行时主题自定义系统。

- `setTheme()` - 全局设置主题
- `useTheme()` - 创建作用域主题 Hook
- `Preset` - 预设主题（SolarizedDark、SolarizedLight）

## 文档

- **RFC 文档**: [docs/rfc/](./docs/rfc/) - 技术规范和架构设计

## 开发

### 环境要求

- Node.js >= 22.12.0
- pnpm >= 10.0.0

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
