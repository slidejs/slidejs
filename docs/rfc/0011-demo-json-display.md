# RFC 0011: 移除演示项目中的编译结果 JSON 显示

## 元数据

- **RFC ID**: 0011
- **标题**: 移除演示项目中的编译结果 JSON 显示
- **状态**: 草案
- **创建日期**: 2025-01-17
- **作者**: AI Assistant
- **相关 RFC**: RFC 0001 (Slide DSL 规范), RFC 0002 (Slide Runner)

## 摘要

本 RFC 提议移除演示项目中的编译结果 JSON 显示功能。编译后的 JSON 显示对用户帮助有限，且增加了不必要的复杂性。移除后可以简化演示项目的代码，专注于核心功能。

## 动机

### 当前问题

1. **编译后的 JSON 显示对用户帮助有限**: 编译后的 SlideDSL 包含函数，无法直接序列化，显示的内容不完整
2. **增加不必要的复杂性**: 需要处理函数序列化、Monaco Editor 配置等额外代码
3. **用户更关注实际效果**: 用户更关心 DSL 的实际渲染效果，而不是编译后的中间结构

### 设计目标

1. **简化演示项目**: 移除 JSON 显示相关的代码和 UI
2. **专注于核心功能**: 演示项目专注于 DSL 编辑和实际渲染效果
3. **减少维护成本**: 减少不必要的代码和配置

## 详细设计

### 1. 移除范围（阶段 1 - 已完成）

需要从以下演示项目中移除 JSON 显示功能：

- `demos/slidejs-swiper/src/main.ts`
- `demos/slidejs-revealjs/src/main.ts`
- `demos/slidejs-splide/src/main.ts`
- `demos/vue/src/App.vue`

### 1.1 创建新的演示项目（阶段 2）

参考 `demos/vue` 的结构，创建以下新演示项目：

#### 1.1.1 `demos/react` - React 版本

**目标**: 创建 React + TypeScript 版本的演示项目

**功能要求**:
- 使用 React + TypeScript
- 展示 3 个 Runner（Reveal.js, Swiper, Splide）并排显示
- 包含 DSL 编辑器（Monaco Editor）
- 主题切换功能（Solarized Dark/Light）
- 水平分割器（调整 Runner 区域和编辑器区域大小）
- 布局与 `demos/vue` 相同（顶部 3 列 Runner，底部 DSL 编辑器）

**技术栈**:
- React 18+
- TypeScript
- Vite
- Monaco Editor
- @slidejs/* 包

#### 1.1.2 `demos/svelte` - Svelte 版本

**目标**: 创建 Svelte + TypeScript 版本的演示项目

**功能要求**:
- 使用 Svelte + TypeScript
- 展示 3 个 Runner（Reveal.js, Swiper, Splide）并排显示
- 包含 DSL 编辑器（Monaco Editor）
- 主题切换功能（Solarized Dark/Light）
- 水平分割器（调整 Runner 区域和编辑器区域大小）
- 布局与 `demos/vue` 相同（顶部 3 列 Runner，底部 DSL 编辑器）

**技术栈**:
- Svelte 5+
- TypeScript
- Vite
- Monaco Editor
- @slidejs/* 包

#### 1.1.3 `demos/vanilla` - Vanilla JavaScript 版本

**目标**: 合并 3 个独立的 `slidejs-*` demo 为一个统一的多 runner 展示

**功能要求**:
- 使用原生 TypeScript（不使用框架）
- 展示 3 个 Runner（Reveal.js, Swiper, Splide）并排显示
- 包含 DSL 编辑器（Monaco Editor）
- 主题切换功能（Solarized Dark/Light）
- 水平分割器（调整 Runner 区域和编辑器区域大小）
- 布局与 `demos/vue` 相同（顶部 3 列 Runner，底部 DSL 编辑器）
- 替换现有的 3 个独立 demo（`slidejs-swiper`, `slidejs-revealjs`, `slidejs-splide`）

**技术栈**:
- 原生 TypeScript
- Vite
- Monaco Editor
- @slidejs/* 包

**实施说明**:
- 合并 `demos/slidejs-swiper`, `demos/slidejs-revealjs`, `demos/slidejs-splide` 的功能
- 保持相同的组件和样式
- 统一为一个多 runner 对比展示

### 2. 移除内容

1. **移除 JSON 编辑器相关代码**:
   - Monaco Editor JSON 编辑器实例
   - JSON 容器元素引用
   - JSON 更新逻辑

2. **移除 UI 元素**:
   - JSON 查看器面板（如果存在）
   - 相关的分割器和布局代码

3. **简化函数**:
   - 将 `updatePlayerAndJson` 重命名为 `updatePlayer`
   - 移除所有 JSON 相关的参数和逻辑

### 3. 实施步骤

1. 移除所有演示项目中的 JSON 编辑器初始化代码
2. 移除 JSON 更新逻辑
3. 简化函数名称和参数
4. 移除相关的 UI 元素和样式（如果存在）
5. 更新相关注释

## 实施细节

### 代码修改示例

**移除前：**
```typescript
let jsonEditor: monaco.editor.IStandaloneCodeEditor | null = null;

// 初始化 JSON 编辑器
const jsonContainer = document.getElementById('json-viewer');
if (jsonContainer) {
  jsonEditor = monaco.editor.create(jsonContainer, {
    value: '',
    language: 'json',
    theme: 'vs-dark',
    readOnly: true,
    // ...
  });
}

// 更新 JSON 显示
if (jsonEditor) {
  jsonEditor.setValue(JSON.stringify(slideDSL, null, 2));
}
```

**移除后：**
```typescript
// JSON 编辑器相关代码全部移除
// 只保留 DSL 编辑器和 Runner 渲染
```

## 影响分析

### 正面影响

1. **简化代码**: 移除不必要的 JSON 显示代码，减少维护成本
2. **专注核心功能**: 演示项目专注于 DSL 编辑和实际渲染效果
3. **更好的用户体验**: 用户界面更简洁，专注于实际效果
4. **减少复杂性**: 不需要处理函数序列化等复杂问题

### 负面影响

1. **失去编译结果查看**: 用户无法在演示项目中查看编译后的结构
   - **缓解方案**: 如果需要查看编译结果，可以使用浏览器开发者工具或编写专门的调试工具

## 替代方案

### 方案 1: 保留 JSON 显示但修复序列化问题（已拒绝）

使用 replacer 函数将函数替换为 `[Generator]` 占位符。

**拒绝原因**: 编译后的 JSON 显示对用户帮助有限，增加不必要的复杂性。

### 方案 2: 显示执行后的结果（已拒绝）

显示执行 `generate()` 后的 `SlideDefinition[]`，而不是编译后的 `SlideDSL`。

**拒绝原因**: 用户更关心实际渲染效果，而不是中间数据结构。

## 测试计划

1. 验证所有演示项目移除 JSON 显示后功能正常
2. 验证 DSL 编辑器功能正常
3. 验证 Runner 渲染功能正常
4. 验证 UI 布局正常（移除 JSON 面板后）

## 实施状态

### 阶段 1: 移除 JSON 显示（已完成）

- [x] 移除 `demos/slidejs-swiper/src/main.ts` 中的 JSON 显示代码
- [x] 移除 `demos/slidejs-revealjs/src/main.ts` 中的 JSON 显示代码
- [x] 移除 `demos/slidejs-splide/src/main.ts` 中的 JSON 显示代码
- [x] 移除 `demos/vue/src/App.vue` 中的 JSON 显示代码
- [x] 移除相关的 UI 元素和样式

### 阶段 2: 创建新的演示项目

- [x] 创建 `demos/react` - 参考 `demos/vue` 构建 React 版本
  - [x] 创建项目结构和配置文件
  - [x] 实现 React 组件（App.tsx）
  - [x] 实现 DSL 编辑器集成
  - [x] 实现 3 个 Runner 展示
  - [x] 实现主题切换功能
  - [x] 实现水平分割器
  - [x] 复制组件和样式文件

- [x] 创建 `demos/svelte` - 参考 `demos/vue` 构建 Svelte 版本
  - [x] 创建项目结构和配置文件
  - [x] 实现 Svelte 组件（App.svelte）
  - [x] 实现 DSL 编辑器集成
  - [x] 实现 3 个 Runner 展示
  - [x] 实现主题切换功能
  - [x] 实现水平分割器
  - [x] 复制组件和样式文件

- [x] 创建 `demos/vanilla` - 合并 3 个 slidejs-* demo 为一个 vanilla demo
  - [x] 创建项目结构和配置文件
  - [x] 实现主 TypeScript 文件（main.ts）
  - [x] 实现 DSL 编辑器集成
  - [x] 实现 3 个 Runner 展示
  - [x] 实现主题切换功能
  - [x] 实现水平分割器
  - [x] 复制组件和样式文件

### 阶段 3: 更新 site 项目以集成新的 demo

- [x] 更新 `site/scripts/copy-demos.ts` 脚本
  - [x] 添加新的 4 个 demo 到复制列表
  - [x] 保留旧的 3 个单 runner demo（与新的多 runner demo 并存）
  - [ ] 测试复制脚本功能

- [x] 更新 `site/src/components/pages/DemosPage.wsx`
  - [x] 添加新的 4 个 demo 到 demos 数组
  - [ ] 测试页面显示

- [x] 更新国际化文件
  - [x] 更新 `site/public/locales/en/demos.json`
  - [x] 更新 `site/public/locales/zh/demos.json`
  - [x] 添加所有新 demo 的国际化文本

- [ ] 验证构建流程
  - [ ] 确保 `build:pages` 脚本正确执行
  - [ ] 确保所有 demo 正确复制到 `site/dist/demos/`
  - [ ] 验证所有 demo 链接可访问

- [ ] 可选：更新相关文档

### 阶段 3: 更新 site 项目以集成新的 demo

完成阶段 2 后，需要更新 site 项目以引用新的 4 个 demo。

#### 3.1 更新复制脚本

**文件**: `site/scripts/copy-demos.ts`

**已修改**:
- 更新 `DEMOS` 常量，只包含新的 4 个 demo：
  - `vue` (从 `demos/vue`)
  - `react` (从 `demos/react`)
  - `svelte` (从 `demos/svelte`)
  - `vanilla` (从 `demos/vanilla`)
- **已移除**旧的 3 个单 runner demo（`slidejs-swiper`, `slidejs-splide`, `slidejs-revealjs`）
  - **决策**: 由于 `demos/vanilla` 合并了这 3 个 demo 的功能，旧的单 runner demo 已被移除

**最终实现**:
```typescript
// 4 个多 runner demo
const DEMOS = ['vue', 'react', 'svelte', 'vanilla'] as const;
```

#### 3.2 更新演示页面组件

**文件**: `site/src/components/pages/DemosPage.wsx`

**已修改**:
- 在 `demos` 数组中只保留新的 4 个 demo 对象
- 移除了旧的 3 个单 runner demo（`swiper`, `splide`, `revealjs`）
- 每个 demo 对象包含：
  - `id`: demo 标识符（用于 URL 和 i18n key）
  - `name`: 显示名称（从 i18n 获取）
  - `icon`: 图标 emoji
  - `framework`: 框架名称（从 i18n 获取）
  - `package`: 包名（从 i18n 获取）
  - `description`: 描述（从 i18n 获取）
  - `link`: 链接路径

**最终 demo 配置**:
```typescript
const demos = [
  {
    id: 'vue',
    name: this.t('vue.title'),
    icon: '⚡',
    framework: this.t('vue.framework'),
    package: this.t('vue.package'),
    description: this.t('vue.description'),
    link: getDemoLink('vue'),
  },
  {
    id: 'react',
    name: this.t('react.title'),
    icon: '⚛️',
    framework: this.t('react.framework'),
    package: this.t('react.package'),
    description: this.t('react.description'),
    link: getDemoLink('react'),
  },
  {
    id: 'svelte',
    name: this.t('svelte.title'),
    icon: '🎯',
    framework: this.t('svelte.framework'),
    package: this.t('svelte.package'),
    description: this.t('svelte.description'),
    link: getDemoLink('svelte'),
  },
  {
    id: 'vanilla',
    name: this.t('vanilla.title'),
    icon: '🍦',
    framework: this.t('vanilla.framework'),
    package: this.t('vanilla.package'),
    description: this.t('vanilla.description'),
    link: getDemoLink('vanilla'),
  },
];
```

#### 3.3 更新国际化文件

**文件**: 
- `site/public/locales/en/demos.json`
- `site/public/locales/zh/demos.json`

**已修改**:
- 移除了旧的 3 个单 runner demo 的国际化文本（`revealjs`, `swiper`, `splide`）
- 只保留新的 4 个多 runner demo 的国际化文本

**最终国际化配置**:
```json
{
  "title": "Demos",
  "subtitle": "See SlideJS in action with different rendering engines. Each example includes complete working code and source.",
  "viewDemo": "View Example",
  "vue": {
    "title": "Vue.js Demo",
    "description": "Multi-runner comparison demo built with Vue.js. Compare Reveal.js, Swiper, and Splide side by side.",
    "framework": "Vue.js",
    "package": "@slidejs/demo-vue"
  },
  "react": {
    "title": "React Demo",
    "description": "Multi-runner comparison demo built with React. Compare Reveal.js, Swiper, and Splide side by side.",
    "framework": "React",
    "package": "@slidejs/demo-react"
  },
  "svelte": {
    "title": "Svelte Demo",
    "description": "Multi-runner comparison demo built with Svelte. Compare Reveal.js, Swiper, and Splide side by side.",
    "framework": "Svelte",
    "package": "@slidejs/demo-svelte"
  },
  "vanilla": {
    "title": "Vanilla JavaScript Demo",
    "description": "Multi-runner comparison demo built with vanilla TypeScript. Compare Reveal.js, Swiper, and Splide side by side.",
    "framework": "Vanilla TypeScript",
    "package": "@slidejs/demo-vanilla"
  }
}
```

#### 3.4 更新构建流程

**文件**: `site/package.json`

**检查项**:
- 确保 `build:pages` 脚本包含 `copy:demos` 步骤
- 确保构建顺序正确：先构建所有 demo，再复制到 site

**建议的构建流程**:
```json
{
  "scripts": {
    "build:pages": "cross-env NODE_ENV=production GITHUB_PAGES=true CUSTOM_DOMAIN=true vite build && pnpm copy:demos",
    "copy:demos": "tsx scripts/copy-demos.ts"
  }
}
```

#### 3.5 可选：更新文档

**文件**: 相关文档文件（如果有）

**需要更新**:
- 更新演示页面相关的文档
- 更新 README 或指南中关于 demo 的说明
- 添加新 demo 的说明和链接

### 阶段 4: 测试

- [ ] 测试所有演示项目功能正常
  - [ ] 测试 `demos/vue` 功能
  - [ ] 测试 `demos/react` 功能
  - [ ] 测试 `demos/svelte` 功能
  - [ ] 测试 `demos/vanilla` 功能

- [ ] 测试 site 集成
  - [ ] 测试 site 构建流程（包括复制 demo）
  - [ ] 测试 site 演示页面显示所有 demo
  - [ ] 测试所有 demo 链接可访问
  - [ ] 测试国际化文本正确显示
  - [ ] 测试在不同 base path 下的路径正确性（GitHub Pages）

## 参考

- RFC 0001: Slide DSL 规范
- RFC 0002: Slide Runner 与多渲染引擎集成
