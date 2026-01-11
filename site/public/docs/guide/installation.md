---
title: 安装指南
order: 2
category: guide
description: '详细的安装说明，包括环境要求、包管理器选择和 TypeScript 支持'
---

# 安装指南

本指南将帮助您安装 SlideJS 及其依赖。

## 环境要求

- **Node.js**: >= 22.12.0
- **浏览器**: 支持 Web Components 的现代浏览器（Chrome、Firefox、Safari、Edge 最新版本）

## 安装步骤

### 步骤 1: 安装核心包

所有 SlideJS 项目都需要核心包：

```bash
npm install @slidejs/core @slidejs/dsl @slidejs/context
```

### 步骤 2: 选择运行器（必需）

根据您的需求，选择一个或多个运行器：

#### Reveal.js 运行器（推荐用于演示文稿）

```bash
npm install @slidejs/runner-revealjs
```

#### Swiper 运行器（推荐用于移动端）

```bash
npm install @slidejs/runner-swiper
```

#### Splide 运行器（轻量级）

```bash
npm install @slidejs/runner-splide
```

### 步骤 3: 安装主题系统（可选）

如果需要自定义主题：

```bash
npm install @slidejs/theme
```

### 步骤 4: 验证安装

安装完成后，验证安装是否成功：

```typescript
import { parseSlideDSL, compile } from '@slidejs/dsl';
import type { SlideContext } from '@slidejs/context';

console.log('✅ SlideJS 已安装！');

// 测试 DSL 解析功能
const testDSL = `
present quiz "test" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "Hello, SlideJS!"
        }
      }
    }
  }
}
`;

try {
  const ast = await parseSlideDSL(testDSL);
  const slideDSL = compile(ast);
  console.log('✅ DSL 解析和编译功能正常');
} catch (error) {
  console.error('❌ 错误:', error);
}
```

## TypeScript 支持

所有包都包含完整的 TypeScript 类型定义，无需额外安装类型包。

```typescript
import type { SlideDSL, SlideContext } from '@slidejs/core';
import type { PresentationNode } from '@slidejs/dsl';
import type { SlideRunner } from '@slidejs/runner';
```

## 使用包管理器

### npm

```bash
npm install @slidejs/core @slidejs/dsl @slidejs/context @slidejs/runner-revealjs
```

### pnpm

```bash
pnpm add @slidejs/core @slidejs/dsl @slidejs/context @slidejs/runner-revealjs
```

### yarn

```bash
yarn add @slidejs/core @slidejs/dsl @slidejs/context @slidejs/runner-revealjs
```

## 完整安装示例

### 最小安装（仅核心功能）

```bash
npm install @slidejs/core @slidejs/dsl @slidejs/context @slidejs/runner-revealjs
```

### 完整安装（包含所有功能）

```bash
npm install @slidejs/core @slidejs/dsl @slidejs/context \
  @slidejs/runner-revealjs \
  @slidejs/runner-swiper \
  @slidejs/runner-splide \
  @slidejs/theme
```

## 下一步

- [快速开始](./getting-started.md) - 5 分钟快速上手
- [Slide DSL 完整指南](./dsl-guide.md) - 深入了解 DSL 语法和功能
- [示例项目](https://github.com/slidejs/slidejs/tree/main/demos) - 查看完整示例代码
