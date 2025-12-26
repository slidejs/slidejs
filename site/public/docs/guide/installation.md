# 安装指南

本指南将帮助您安装 SlideJS 及其依赖。

## 环境要求

- **Node.js**: >= 16.0.0
- **浏览器**: 支持 Web Components 的现代浏览器

## 安装步骤

### 步骤 1: 选择安装方式

根据您的使用场景，选择以下安装方式之一：

#### 方式 A: 使用编辑器 + 播放器（推荐）

如果您需要创建和展示测验：

```bash
npm install @slidejs/quizerjs @slidejs/core @slidejs/dsl
```

#### 方式 B: 仅使用播放器

如果您只需要展示测验：

```bash
npm install @slidejs/core @slidejs/dsl
```

#### 方式 C: 仅使用 DSL 验证

如果您只需要验证 DSL 数据：

```bash
npm install @slidejs/dsl
```

### 步骤 2: 安装框架集成包（可选）

根据您使用的框架，安装相应的集成包：

#### React

```bash
npm install @slidejs/react @slidejs/dsl
npm install react react-dom
```

#### Vue

```bash
npm install @slidejs/vue @slidejs/dsl
npm install vue@^3.0.0
```

#### Svelte

```bash
npm install @slidejs/svelte @slidejs/dsl
npm install svelte@^4.0.0
```

#### Vanilla JS

无需安装额外包，直接使用 `@slidejs/quizerjs` 和 `@slidejs/core`。

### 步骤 3: 验证安装

安装完成后，验证安装是否成功：

```typescript
import { validateQuizDSL } from '@slidejs/dsl';

console.log('✅ SlideJS DSL 已安装！');

// 测试验证功能
const testDSL = {
  version: '1.0.0',
  quiz: {
    id: 'test',
    title: '测试',
    questions: [],
  },
};

const result = validateQuizDSL(testDSL);
console.log('验证功能:', result.valid ? '✅ 正常' : '❌ 异常');
```

## TypeScript 支持

所有包都包含完整的 TypeScript 类型定义，无需额外安装类型包。

```typescript
import type { QuizDSL, Question, QuestionType } from '@slidejs/dsl';
import type { QuizEditorOptions } from '@slidejs/quizerjs';
```

## 使用包管理器

### npm

```bash
npm install @slidejs/quizerjs @slidejs/core @slidejs/dsl
```

### pnpm

```bash
pnpm add @slidejs/quizerjs @slidejs/core @slidejs/dsl
```

### yarn

```bash
yarn add @slidejs/quizerjs @slidejs/core @slidejs/dsl
```

## 下一步

- [快速开始](./getting-started.md) - 5 分钟快速上手
- [DSL 指南](./dsl-guide.md) - 了解 DSL 数据格式
- [框架集成](./vue-integration.md) - 在 Vue、React、Svelte 中使用
