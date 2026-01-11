# RFC 0010: CSS Hook API - 运行时主题自定义系统

## 元数据

- **RFC ID**: 0010
- **标题**: CSS Hook API - 运行时主题自定义系统
- **状态**: 已完成
- **创建日期**: 2025-01-10
- **作者**: AI Assistant
- **相关 RFC**: RFC 0009 (Runner 包 CSS 打包与 CSS 变量自定义)

## 摘要

本 RFC 定义了 SlideJS 的 CSS Hook API，提供一个标准的、类型安全的运行时主题自定义系统。通过 `@slidejs/theme` 包，开发者可以在运行时动态设置标准 CSS 变量，无需手动操作 DOM 或编写 CSS。

**设计原则**：
- **只提供高级 API**：使用标准变量名（如 `navigationColor`），不针对特定 runner
- **Runner 自动映射**：每个 runner 会将自己的标准变量映射到自己的特定变量
- **低级 API 自行使用**：如果需要直接设置 runner 特定变量，请自行使用 DOM API，风险自负
- **预设主题支持**：内置 Solarized Dark 和 Solarized Light 预设主题，支持一键应用

## 问题描述

### 当前问题

虽然 RFC 0009 已经实现了 CSS 变量系统，但用户仍然需要：

1. **手动操作 CSS 变量**：
   ```typescript
   // 用户需要手动设置 CSS 变量
   document.documentElement.style.setProperty(
     '--slidejs-swiper-navigation-color',
     '#ff0000'
   );
   ```

2. **记住变量名**：
   - 需要记住完整的 CSS 变量名（如 `--slidejs-swiper-navigation-color`）
   - 容易拼写错误
   - 缺乏类型检查

3. **缺乏统一接口**：
   - 不同 runner 包的变量命名不统一
   - 没有统一的 API 来管理主题

4. **无法作用域化**：
   - 只能全局设置，无法针对特定容器设置主题

## 解决方案

### 设计原则

1. **类型安全**：所有 API 都有完整的 TypeScript 类型定义
2. **统一接口**：所有 runner 包使用相同的 API 模式
3. **运行时动态**：支持运行时动态设置和切换主题
4. **作用域支持**：支持全局和作用域（容器级别）主题
5. **向后兼容**：不影响现有的 CSS 变量直接使用方式

### API 设计

#### 设计原则

1. **只提供高级 API**：使用标准变量名，不针对特定 runner
2. **Runner 自动映射**：每个 runner 会将自己的标准变量映射到自己的特定变量
3. **低级 API 自行使用**：如果需要直接设置 runner 特定变量，请自行使用 DOM API，风险自负

#### 1. 全局 API（高级 API - 官方支持）

```typescript
import { setTheme, Preset } from '@slidejs/theme';

// 使用预设主题（推荐：使用命名空间常量）
setTheme(Preset.SolarizedDark);
setTheme(Preset.SolarizedLight);

// 或设置自定义标准主题（使用标准变量名）
setTheme({
  navigationColor: '#ff0000',  // 标准变量名，所有 runner 会自动映射
  paginationColor: '#00ff00', // 标准变量名
  backgroundColor: '#ffffff',  // 标准变量名
  textColor: '#000000',       // 标准变量名
});
```

#### 2. 作用域 API（高级 API - 官方支持）

```typescript
import { useTheme } from '@slidejs/theme';

// 通过选择器创建作用域 Hook
import { Preset } from '@slidejs/theme';

const theme = useTheme('#my-slides');

// 使用预设主题（推荐：使用常量）
theme.set(Preset.SolarizedDark);

// 或设置自定义主题
theme.set({
  navigationColor: '#ff0000',  // 标准变量名
  paginationColor: '#00ff00',  // 标准变量名
});

// 通过 HTMLElement 创建作用域 Hook
const container = document.getElementById('slides');
const theme2 = useTheme(container);
theme2.set(Preset.SolarizedLight);
```

#### 3. Hook 类 API（高级 API - 官方支持）

```typescript
import { SlideThemeHook } from '@slidejs/theme';

import { Preset } from '@slidejs/theme';

const theme = new SlideThemeHook('#my-slides');

// 使用预设主题（推荐：使用常量）
theme.set(Preset.SolarizedDark);

// 或设置自定义标准主题
theme.set({
  navigationColor: '#ff0000',  // 标准变量名
  paginationColor: '#00ff00',  // 标准变量名
});

// 获取 CSS 变量值（标准变量或 runner 特定变量）
const color = theme.get('--slidejs-navigation-color');  // 标准变量
const swiperColor = theme.get('--slidejs-swiper-navigation-color');  // runner 特定变量

// 移除 CSS 变量
theme.remove('--slidejs-navigation-color');

// 清除所有标准主题变量
theme.clear();
```

#### 4. 低级 API（自行使用，风险自负）

```typescript
// 不推荐：直接设置 runner 特定变量（不在官方支持范围内）
document.documentElement.style.setProperty(
  '--slidejs-swiper-navigation-color',
  '#ff0000'
);

// 或使用作用域
const container = document.getElementById('slides');
if (container) {
  container.style.setProperty(
    '--slidejs-swiper-navigation-color',
    '#ff0000'
  );
}
```

### 类型定义

```typescript
// 标准主题配置（高级 API）
interface StandardTheme {
  navigationColor?: string;        // 导航按钮颜色（标准变量）
  paginationColor?: string;        // 分页器颜色（标准变量）
  paginationActiveColor?: string;  // 分页器激活颜色（标准变量）
  scrollbarBg?: string;            // 滚动条背景色（标准变量）
  scrollbarDragBg?: string;       // 滚动条拖拽颜色（标准变量）
  arrowColor?: string;             // 箭头颜色（标准变量，用于 Splide）
  progressBarColor?: string;       // 进度条颜色（标准变量）
  backgroundColor?: string;       // 背景色（标准变量）
  textColor?: string;             // 文本颜色（标准变量）
  linkColor?: string;             // 链接颜色（标准变量）
  headingColor?: string;          // 标题颜色（标准变量）
  codeBackground?: string;         // 代码背景色（标准变量）
}
```

### Runner 映射机制

每个 runner 会自动将标准变量映射到自己的变量：

**Swiper**:
- `--slidejs-navigation-color` → `--slidejs-swiper-navigation-color`
- `--slidejs-pagination-color` → `--slidejs-swiper-pagination-color`

**Reveal.js**:
- `--slidejs-background-color` → `--slidejs-revealjs-background-color`
- `--slidejs-text-color` → `--slidejs-revealjs-text-color`

**Splide**:
- `--slidejs-arrow-color` → `--slidejs-splide-arrow-color`
- `--slidejs-pagination-color` → `--slidejs-splide-pagination-color`

## 实施细节

### 包结构

创建新包 `@slidejs/theme`：

```
packages/@slidejs/theme/
├── src/
│   ├── index.ts          # 入口文件
│   ├── types.ts          # 类型定义
│   ├── hook.ts           # Hook API 实现
│   └── presets.ts        # 预设主题定义
├── package.json
├── tsconfig.json
└── vite.config.ts
```

**注意**：
- 不包含 `variables.ts` 文件
- CSS 变量映射在 runner 的 CSS 文件中通过 CSS `var()` 函数完成
- 本包只提供高级 API（标准变量），不提供低级 API（runner 特定变量）

### 核心实现

#### 标准 CSS 变量定义

```typescript
export const STANDARD_CSS_VARIABLES = {
  navigationColor: '--slidejs-navigation-color',
  paginationColor: '--slidejs-pagination-color',
  paginationActiveColor: '--slidejs-pagination-active-color',
  scrollbarBg: '--slidejs-scrollbar-bg',
  scrollbarDragBg: '--slidejs-scrollbar-drag-bg',
  arrowColor: '--slidejs-arrow-color',
  progressBarColor: '--slidejs-progress-bar-color',
  backgroundColor: '--slidejs-background-color',
  textColor: '--slidejs-text-color',
  linkColor: '--slidejs-link-color',
  headingColor: '--slidejs-heading-color',
  codeBackground: '--slidejs-code-background',
} as const;
```

#### Runner CSS 映射（在 runner 的 CSS 文件中）

**重要**：映射关系在 runner 的 CSS 文件中通过 CSS `var()` 函数完成，不在 JavaScript 中维护。

每个 runner 在自己的 `style.css` 中将标准变量映射到自己的变量：

```css
/* runner-swiper/src/style.css */
:root {
  /* 标准变量定义 */
  --slidejs-navigation-color: #007aff;
  --slidejs-pagination-color: #007aff;
}

:root {
  /* Runner 特定变量映射 - 通过 CSS var() 函数完成 */
  --slidejs-swiper-navigation-color: var(--slidejs-navigation-color, #007aff);
  --slidejs-swiper-pagination-color: var(--slidejs-pagination-color, #007aff);
}
```

**设计决策**：
- 不在 JavaScript 中维护映射关系（已移除 `variables.ts`）
5. **CSS 注入规范**：
   - **第三方库 CSS**：必须注入到 `document.head`（全局，使用唯一的 ID 避免重复注入）
   - **自定义 style.css**：必须注入到用户提供的容器中（作用域化，使用唯一的 ID 避免重复注入）
   - 使用 `?inline` 导入 CSS 内容，然后在 `runner.ts` 中动态注入
   - 注入前检查是否已存在（通过 ID 检查），避免重复注入

**CSS 注入实现示例**：

```typescript
// runner.ts
// 导入 CSS 内容用于注入
import thirdPartyCSS from 'third-party-library/css?inline';
import customCSS from './style.css?inline';

export async function createSlideRunner<TContext extends SlideContext = SlideContext>(
  dslSource: string,
  context: TContext,
  config: SlideRunnerConfig
): Promise<SlideRunner<TContext>> {
  // ... 解析和编译 DSL ...

  // 1. 注入第三方库 CSS 到 document.head（全局，如果尚未注入）
  const globalStyleId = 'runner-third-party-styles'; // 使用唯一的 ID
  const globalStyles = document.head.querySelector(`#${globalStyleId}`);
  if (!globalStyles) {
    const style = document.createElement('style');
    style.id = globalStyleId;
    style.textContent = thirdPartyCSS;
    document.head.appendChild(style);
  }

  // 2. 获取用户提供的容器元素
  let userContainer: HTMLElement;
  if (typeof config.container === 'string') {
    const element = document.querySelector(config.container);
    if (!element) {
      throw new Error(`Container not found: ${config.container}`);
    }
    userContainer = element as HTMLElement;
  } else {
    userContainer = config.container;
  }

  // 3. 注入自定义 CSS 样式到容器（作用域化，如果尚未注入）
  const customStyleId = 'runner-custom-styles'; // 使用唯一的 ID
  if (!userContainer.querySelector(`#${customStyleId}`)) {
    const style = document.createElement('style');
    style.id = customStyleId;
    style.textContent = customCSS;
    userContainer.appendChild(style);
  }

  // 4. 创建 runner 容器（如果需要，某些 runner 会接管容器）
  const runnerContainer = document.createElement('div');
  userContainer.appendChild(runnerContainer);

  // 5. 创建适配器和 Runner
  // ...
}
```




