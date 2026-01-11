# @slidejs/theme

SlideJS 主题系统 - 运行时 CSS 变量 Hook API

## 功能特性

- ✅ 统一的标准化主题配置接口
- ✅ 运行时动态设置 CSS 变量
- ✅ 支持全局和作用域自定义
- ✅ 类型安全的 API
- ✅ 所有 runner 自动映射标准变量
- ✅ 内置预设主题（Solarized Dark/Light）

## 设计理念

### 高级 API（官方支持）

使用标准变量名，不针对特定 runner：

```typescript
setTheme({
  navigationColor: '#ff0000', // 标准变量名
  paginationColor: '#00ff00', // 标准变量名
});
```

所有 runner 会自动将这些标准变量映射到自己的变量：

- `--slidejs-navigation-color` → `--slidejs-swiper-navigation-color` (Swiper)
- `--slidejs-navigation-color` → `--slidejs-splide-arrow-color` (Splide)

### 低级 API（自行使用，风险自负）

如果需要直接设置 runner 特定变量，请自行使用 DOM API：

```typescript
// 不推荐：直接设置 runner 特定变量（风险自负）
document.documentElement.style.setProperty('--slidejs-swiper-navigation-color', '#ff0000');
```

**注意**：

- 低级 API 不在 SlideJS 官方支持范围内
- 可能导致兼容性问题
- 不推荐使用

## 安装

```bash
npm install @slidejs/theme
```

## 使用方式

### 使用预设主题（推荐）

```typescript
import { setTheme, Preset } from '@slidejs/theme';

// 使用 Solarized Dark 主题（推荐：使用命名空间常量）
setTheme(Preset.SolarizedDark);

// 使用 Solarized Light 主题（推荐：使用命名空间常量）
setTheme(Preset.SolarizedLight);
```

### 全局主题设置（自定义）

```typescript
import { setTheme } from '@slidejs/theme';

// 设置全局主题（使用标准变量名）
setTheme({
  navigationColor: '#ff0000',
  paginationColor: '#00ff00',
  backgroundColor: '#ffffff',
  textColor: '#000000',
});
```

### 作用域主题设置

```typescript
import { useTheme } from '@slidejs/theme';

// 为特定容器设置预设主题（推荐：使用命名空间常量）
import { Preset } from '@slidejs/theme';

const theme = useTheme('#my-slides');
theme.set(Preset.SolarizedDark);

// 或使用自定义主题
theme.set({
  navigationColor: '#ff0000',
  paginationColor: '#00ff00',
});

// 或使用 HTMLElement
import { Preset } from '@slidejs/theme';
const container = document.getElementById('slides');
const theme2 = useTheme(container);
theme2.set(Preset.SolarizedLight);
```

### 动态切换主题

```typescript
import { setTheme } from '@slidejs/theme';

// 使用预设主题切换（推荐：使用命名空间常量）
import { Preset } from '@slidejs/theme';

function setDarkTheme() {
  setTheme(Preset.SolarizedDark);
}

function setLightTheme() {
  setTheme(Preset.SolarizedLight);
}

// 或使用自定义主题
function setCustomDarkTheme() {
  setTheme({
    backgroundColor: '#191919',
    textColor: '#ffffff',
    linkColor: '#42affa',
  });
}
```

### 高级用法

```typescript
import { SlideThemeHook } from '@slidejs/theme';

// 创建自定义 Hook 实例
const theme = new SlideThemeHook('#my-slides');

// 设置主题
theme.set({
  navigationColor: '#ff0000',
});

// 获取 CSS 变量值
const color = theme.get('--slidejs-navigation-color');

// 移除 CSS 变量
theme.remove('--slidejs-navigation-color');

// 清除所有标准主题变量
theme.clear();
```

## 预设主题

### Solarized Dark

```typescript
import { setTheme, Preset, solarizedDark } from '@slidejs/theme';

// 使用命名空间常量（推荐）
setTheme(Preset.SolarizedDark);

// 或直接使用主题对象
setTheme(solarizedDark);
```

### Solarized Light

```typescript
import { setTheme, Preset, solarizedLight } from '@slidejs/theme';

// 使用命名空间常量（推荐）
setTheme(Preset.SolarizedLight);

// 或直接使用主题对象
setTheme(solarizedLight);
```

## API 参考

### `setTheme(theme: StandardTheme | PresetThemeName)`

设置全局标准主题（官方支持）。

- 参数可以是标准主题配置对象
- 或预设主题命名空间常量（`Preset.SolarizedDark` 或 `Preset.SolarizedLight`）

### `useTheme(selector?: HTMLElement | string): SlideThemeHook)`

创建作用域主题 Hook。

### `SlideThemeHook`

主题 Hook 类，提供以下方法：

- `set(theme: StandardTheme | PresetThemeName)`: 设置标准主题或预设主题（官方支持）
- `get(variableName: string)`: 获取 CSS 变量值
- `remove(variableName: string)`: 移除 CSS 变量
- `clear()`: 清除所有标准主题变量

### 预设主题导出

```typescript
import {
  Preset,
  solarizedDark,
  solarizedLight,
  presets,
  type PresetThemeName,
} from '@slidejs/theme';

// 使用命名空间常量（推荐）
setTheme(Preset.SolarizedDark);
setTheme(Preset.SolarizedLight);

// 或直接使用主题对象
setTheme(solarizedDark);
setTheme(solarizedLight);

// 获取所有预设主题
Object.keys(presets); // ['solarized-dark', 'solarized-light']
```

## 标准主题配置

```typescript
interface StandardTheme {
  navigationColor?: string; // 导航按钮颜色
  paginationColor?: string; // 分页器颜色
  paginationActiveColor?: string; // 分页器激活颜色
  scrollbarBg?: string; // 滚动条背景色
  scrollbarDragBg?: string; // 滚动条拖拽颜色
  arrowColor?: string; // 箭头颜色（用于 Splide）
  progressBarColor?: string; // 进度条颜色
  backgroundColor?: string; // 背景色
  textColor?: string; // 文本颜色
  linkColor?: string; // 链接颜色
  headingColor?: string; // 标题颜色
  codeBackground?: string; // 代码背景色
}
```

## 标准 CSS 变量

所有标准变量都以 `--slidejs-` 开头，不包含 runner 名称：

- `--slidejs-navigation-color`
- `--slidejs-pagination-color`
- `--slidejs-pagination-active-color`
- `--slidejs-scrollbar-bg`
- `--slidejs-scrollbar-drag-bg`
- `--slidejs-arrow-color`
- `--slidejs-progress-bar-color`
- `--slidejs-background-color`
- `--slidejs-text-color`
- `--slidejs-link-color`
- `--slidejs-heading-color`
- `--slidejs-code-background`

## Runner 映射

每个 runner 会自动将标准变量映射到自己的变量：

### Swiper

- `--slidejs-navigation-color` → `--slidejs-swiper-navigation-color`
- `--slidejs-pagination-color` → `--slidejs-swiper-pagination-color`

### Reveal.js

- `--slidejs-background-color` → `--slidejs-revealjs-background-color`
- `--slidejs-text-color` → `--slidejs-revealjs-text-color`

### Splide

- `--slidejs-arrow-color` → `--slidejs-splide-arrow-color`
- `--slidejs-pagination-color` → `--slidejs-splide-pagination-color`

## 低级 API（自行使用，风险自负）

如果需要直接设置 runner 特定变量，请自行使用 DOM API：

```typescript
// 不推荐：直接设置 runner 特定变量
document.documentElement.style.setProperty('--slidejs-swiper-navigation-color', '#ff0000');

// 或使用作用域
const container = document.getElementById('slides');
if (container) {
  container.style.setProperty('--slidejs-swiper-navigation-color', '#ff0000');
}
```

**警告**：

- 这些变量不在 SlideJS 官方支持范围内
- 可能导致兼容性问题
- 不推荐使用

## 预设主题详情

### Solarized Dark

基于 Solarized 配色方案的深色主题，适合在暗光环境下使用。

**颜色方案**：

- 背景：`#002b36` (base03)
- 文本：`#839496` (base0)
- 链接/导航：`#268bd2` (blue)
- 激活状态：`#2aa198` (cyan)

### Solarized Light

基于 Solarized 配色方案的浅色主题，适合在明亮环境下使用。

**颜色方案**：

- 背景：`#fdf6e3` (base3)
- 文本：`#657b83` (base00)
- 链接/导航：`#268bd2` (blue)
- 激活状态：`#2aa198` (cyan)

参考：[Solarized 官方网站](https://ethanschoonover.com/solarized/)

## 许可证

MIT
