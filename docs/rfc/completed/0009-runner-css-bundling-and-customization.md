# RFC 0009: Runner 包 CSS 打包与 CSS 变量自定义

## 元数据

- **RFC ID**: 0009
- **标题**: Runner 包 CSS 打包与 CSS 变量自定义
- **状态**: 已完成
- **创建日期**: 2025-01-10
- **作者**: AI Assistant
- **相关 RFC**: RFC 0007 (Runner 包 CSS 打包与自动加载)

## 摘要

本 RFC 定义了 runner 包（`@slidejs/runner-revealjs`、`@slidejs/runner-swiper`、`@slidejs/runner-splide`）的 CSS 打包策略和 CSS 变量自定义机制。确保所有 runner 包在外部使用时能够正确加载样式，并支持通过 CSS 变量进行样式自定义。

## 问题描述

### 症状

当在 slidejs 项目外部使用 runner 包时，出现以下问题：

1. **CSS 未正确打包**：
   - `@slidejs/runner-swiper` 和 `@slidejs/runner-splide` 缺少 CSS 文件
   - 构建后 `dist/` 目录中没有 `style.css` 文件
   - `package.json` 中定义了 `./style.css` 导出，但文件不存在

2. **样式无法应用**：
   - 导入 runner 包后，幻灯片没有样式
   - 需要手动导入第三方库的 CSS（如 `swiper/css`、`@splidejs/splide/css`）
   - 用户体验差，容易遗漏必要的样式导入

3. **无法自定义样式**：
   - 没有提供 CSS 变量机制
   - 用户需要覆盖大量 CSS 规则才能自定义样式
   - 缺乏统一的样式自定义接口

### 根本原因分析

1. **CSS 文件缺失**：
   - `runner-swiper` 和 `runner-splide` 没有创建 `src/style.css` 文件
   - 入口文件 `src/index.ts` 中没有导入 CSS
   - Vite 构建配置没有正确提取 CSS 文件

2. **CSS 打包配置不完整**：
   - `vite.config.ts` 中缺少 `cssCodeSplit: false` 配置
   - `assetFileNames` 配置不正确，导致 CSS 文件名不匹配
   - 没有确保 CSS 文件被提取为 `style.css`

3. **缺少 CSS 变量支持**：
   - 没有定义 CSS 变量供用户自定义
   - 样式硬编码，无法通过变量覆盖

## 解决方案

### 1. 统一的 CSS 文件结构

所有 runner 包都应包含 `src/style.css` 文件，结构如下：

```css
/**
 * @slidejs/runner-{name} - {库名} 核心样式
 *
 * 此文件导入 {库名} 的核心 CSS，用户只需导入此包即可获得所有必需的样式。
 * 可选样式需要单独导入。
 *
 * 使用示例：
 * ```typescript
 * import '@slidejs/runner-{name}';
 * // 或显式导入样式
 * import '@slidejs/runner-{name}/style.css';
 * ```
 *
 * 自定义样式：
 * 可以通过 CSS 变量自定义样式，例如：
 * ```css
 * :root {
 *   --slidejs-{name}-{property}: value;
 * }
 * ```
 */

/* 导入核心 CSS - @import 必须在文件开头 */
@import '{library}/css';

/* CSS 变量定义 - 可通过覆盖这些变量来自定义样式 */
:root {
  --slidejs-{name}-{property}: default-value;
}

/* 应用 CSS 变量到组件 */
.{library-class} {
  property: var(--slidejs-{name}-{property}, fallback-value);
}
```

### 2. CSS 变量命名规范

所有 CSS 变量应遵循以下命名规范：

- **前缀**: `--slidejs-{runner-name}-`
- **属性名**: 使用 kebab-case，描述性命名
- **示例**:
  - `--slidejs-revealjs-background-color`
  - `--slidejs-swiper-navigation-color`
  - `--slidejs-splide-arrow-color`

### 3. Vite 构建配置

所有 runner 包的 `vite.config.ts` 应包含以下配置：

```typescript
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SlideJs{Name}',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        '@slidejs/core',
        '@slidejs/runner',
        '@slidejs/dsl',
        '@slidejs/context',
        '{library}',
        // Only externalize JS modules, NOT CSS
        /^{library}\/.*\.js$/,
      ],
      output: {
        // 确保 CSS 文件被正确提取为 style.css
        assetFileNames: assetInfo => {
          // 将所有 CSS 文件重命名为 style.css
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'style.css';
          }
          return assetInfo.name || 'assets/[name].[ext]';
        },
      },
    },
    sourcemap: true,
    // 确保 CSS 被提取到单独的文件
    cssCodeSplit: false,
  },
});
```

### 4. 入口文件导入 CSS

所有 runner 包的 `src/index.ts` 应在文件开头导入 CSS：

```typescript
/**
 * @slidejs/runner-{name} - {库名} 适配器
 *
 * 样式会自动加载（包含 {库名} 核心 CSS）。
 * 可选样式需要单独导入。
 */

// 导入核心样式（自动加载）
import './style.css';

// ... 其他导出
```

### 5. package.json 导出配置

所有 runner 包的 `package.json` 应包含 CSS 导出：

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./style.css": "./dist/style.css"
  }
}
```

## 实施细节

### 文件变更

#### 1. `@slidejs/runner-swiper`

**新增文件**：
- `packages/@slidejs/runner-swiper/src/style.css`

**修改文件**：
- `packages/@slidejs/runner-swiper/src/index.ts` - 添加 CSS 导入
- `packages/@slidejs/runner-swiper/vite.config.ts` - 更新构建配置

**CSS 变量**：
- `--slidejs-swiper-navigation-color`: 导航按钮颜色
- `--slidejs-swiper-pagination-color`: 分页器颜色
- `--slidejs-swiper-pagination-bullet-active-color`: 分页器激活颜色
- `--slidejs-swiper-scrollbar-bg`: 滚动条背景色
- `--slidejs-swiper-scrollbar-drag-bg`: 滚动条拖拽颜色

#### 2. `@slidejs/runner-splide`

**新增文件**：
- `packages/@slidejs/runner-splide/src/style.css`

**修改文件**：
- `packages/@slidejs/runner-splide/src/index.ts` - 添加 CSS 导入
- `packages/@slidejs/runner-splide/vite.config.ts` - 更新构建配置

**CSS 变量**：
- `--slidejs-splide-arrow-color`: 箭头颜色
- `--slidejs-splide-pagination-color`: 分页器颜色
- `--slidejs-splide-pagination-active-color`: 分页器激活颜色
- `--slidejs-splide-progress-bar-color`: 进度条颜色

#### 3. `@slidejs/runner-revealjs`

**已存在**（参考实现）：
- `packages/@slidejs/runner-revealjs/src/style.css` - 已包含 CSS 变量

**CSS 变量**：
- `--slidejs-revealjs-background-color`: 背景色
- `--slidejs-revealjs-text-color`: 文本颜色
- `--slidejs-revealjs-link-color`: 链接颜色
- `--slidejs-revealjs-heading-color`: 标题颜色
- `--slidejs-revealjs-code-background`: 代码背景色

### 使用方式

#### 基础使用（CSS 自动加载）

```typescript
import { createSlideRunner } from '@slidejs/runner-swiper';
// CSS 自动加载，无需手动导入
```

#### 显式导入 CSS

```typescript
import { createSlideRunner } from '@slidejs/runner-swiper';
import '@slidejs/runner-swiper/style.css';
```

#### 自定义样式（CSS 变量）

```css
/* 在用户的应用 CSS 中 */
:root {
  --slidejs-swiper-navigation-color: #ff0000;
  --slidejs-swiper-pagination-color: #00ff00;
}
```

```typescript
import { createSlideRunner } from '@slidejs/runner-swiper';
// CSS 变量会自动应用
```

#### 作用域自定义（仅影响特定容器）

```css
.my-slides-container {
  --slidejs-swiper-navigation-color: #ff0000;
  --slidejs-swiper-pagination-color: #00ff00;
}
```

```html
<div class="my-slides-container">
  <div id="slides"></div>
</div>
```

## 验证方法

### 1. 构建验证

```bash
# 构建所有 runner 包
pnpm --filter "@slidejs/runner-*" build

# 检查 dist 目录
ls -la packages/@slidejs/runner-*/dist/style.css
# 所有包都应包含 style.css 文件
```

### 2. 外部使用验证

创建测试项目：

```bash
mkdir test-slidejs && cd test-slidejs
npm init -y
npm install @slidejs/runner-swiper
```

```typescript
// test.js
import { createSlideRunner } from '@slidejs/runner-swiper';
// 验证 CSS 是否正确加载
```

### 3. CSS 变量验证

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    :root {
      --slidejs-swiper-navigation-color: #ff0000;
    }
  </style>
</head>
<body>
  <div id="slides"></div>
  <script type="module">
    import { createSlideRunner } from '@slidejs/runner-swiper';
    // 验证 CSS 变量是否生效
  </script>
</body>
</html>
```

## 影响范围

### 受影响的包

- `@slidejs/runner-revealjs` - 已有实现，作为参考
- `@slidejs/runner-swiper` - 需要新增 CSS 文件和变量
- `@slidejs/runner-splide` - 需要新增 CSS 文件和变量

### 向后兼容性

- **完全兼容**：现有代码无需修改即可工作
- **改进**：新代码可以移除手动 CSS 导入，使用更简洁的 API
- **增强**：新增 CSS 变量支持，提供更好的自定义能力

## 风险评估

### 技术风险

1. **CSS 加载顺序**：
   - 风险：用户自定义 CSS 变量可能被第三方库 CSS 覆盖
   - 缓解：CSS 变量定义在 `:root` 中，具有足够高的优先级

2. **构建配置**：
   - 风险：Vite 配置错误可能导致 CSS 未正确打包
   - 缓解：统一配置模板，所有包使用相同的构建配置

3. **CSS 变量浏览器支持**：
   - 风险：旧浏览器不支持 CSS 变量
   - 缓解：所有 CSS 变量都提供 fallback 值

### 性能影响

- **CSS 文件大小**：每个 runner 包增加约 5-10KB CSS（gzip 后约 2-5KB）
- **加载性能**：CSS 自动加载，无需额外的 HTTP 请求
- **运行时性能**：CSS 变量对性能影响可忽略不计

## 未来改进

1. **主题系统**：
   - 提供预设主题（light、dark、custom）
   - 支持主题切换 API

2. **更多 CSS 变量**：
   - 根据用户反馈添加更多可自定义属性
   - 支持动画、过渡效果自定义

3. **CSS-in-JS 支持**：
   - 考虑提供 styled-components 或 emotion 支持
   - 支持运行时样式注入

## CSS Hook API（运行时自定义）

### 设计目标

提供一个标准的、类型安全的 API，允许开发者在运行时动态自定义样式，无需手动操作 CSS 变量。

### API 设计

创建了 `@slidejs/theme` 包，提供统一的 CSS Hook API：

```typescript
import { setTheme, useTheme } from '@slidejs/theme';

// 全局设置
setTheme({
  swiper: {
    navigationColor: '#ff0000',
    paginationColor: '#00ff00',
  },
  revealjs: {
    backgroundColor: '#ffffff',
    textColor: '#000000',
  },
});

// 作用域设置（针对特定容器）
const theme = useTheme('#my-slides');
theme.set({
  swiper: {
    navigationColor: '#ff0000',
  },
});
```

### 核心 API

#### 1. 全局 API

- `setTheme(theme: SlideTheme)`: 设置全局主题
- `setSwiperTheme(theme: SwiperTheme)`: 设置全局 Swiper 主题
- `setRevealJsTheme(theme: RevealJsTheme)`: 设置全局 Reveal.js 主题
- `setSplideTheme(theme: SplideTheme)`: 设置全局 Splide 主题

#### 2. 作用域 API

- `useTheme(selector?: HTMLElement | string): SlideThemeHook`: 创建作用域主题 Hook

#### 3. Hook 类方法

- `set(theme: SlideTheme)`: 设置主题
- `setSwiper(theme: SwiperTheme)`: 设置 Swiper 主题
- `setRevealJs(theme: RevealJsTheme)`: 设置 Reveal.js 主题
- `setSplide(theme: SplideTheme)`: 设置 Splide 主题
- `get(variableName: string)`: 获取 CSS 变量值
- `remove(variableName: string)`: 移除 CSS 变量
- `clear()`: 清除所有主题变量

### 使用示例

#### 基础使用

```typescript
import { setTheme } from '@slidejs/theme';
import { createSlideRunner } from '@slidejs/runner-swiper';

// 设置主题
setTheme({
  swiper: {
    navigationColor: '#ff0000',
    paginationColor: '#00ff00',
  },
});

// 创建 runner（会自动应用主题）
const runner = await createSlideRunner(dslSource, context);
```

#### 动态切换主题

```typescript
import { setTheme } from '@slidejs/theme';

// 切换到深色主题
function setDarkTheme() {
  setTheme({
    revealjs: {
      backgroundColor: '#191919',
      textColor: '#ffffff',
    },
  });
}

// 切换到浅色主题
function setLightTheme() {
  setTheme({
    revealjs: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
    },
  });
}
```

#### 作用域自定义

```typescript
import { useTheme } from '@slidejs/theme';

// 为特定容器设置主题
const container = document.getElementById('slides');
const theme = useTheme(container);

theme.set({
  swiper: {
    navigationColor: '#ff0000',
  },
});

// 多个容器可以有不同的主题
const theme2 = useTheme('#another-slides');
theme2.set({
  swiper: {
    navigationColor: '#00ff00',
  },
});
```

### 实现细节

1. **类型安全**：所有主题配置都有完整的 TypeScript 类型定义
2. **运行时应用**：通过 `setProperty` API 动态设置 CSS 变量
3. **作用域支持**：支持全局（document）和局部（HTMLElement）作用域
4. **向后兼容**：不影响现有的 CSS 变量直接使用方式

## 变更历史

- 2025-01-10: 初始草稿，定义 CSS 打包和 CSS 变量自定义方案
- 2025-01-10: 标记为已完成 - 所有 runner 包已实现 CSS 打包和 CSS 变量支持
- 2025-01-10: 新增 CSS Hook API - 创建 `@slidejs/theme` 包提供运行时主题自定义 API
