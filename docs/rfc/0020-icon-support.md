# RFC 0020: 图标支持

## 元数据

- **RFC ID**: 0020
- **标题**: 图标支持
- **状态**: 草案
- **创建日期**: 2025-01-XX
- **作者**: AI Assistant
- **相关 RFC**: RFC 0013 (Markdown 支持与 Slidev 兼容功能)

## 摘要

本 RFC 提议为 SlideJS 的 Markdown 支持添加图标支持，允许用户在 Markdown 中直接使用各种图标集的图标，如 Material Icons、Font Awesome、Heroicons 等。

## 动机

### 背景问题

1. **视觉增强**: 图标可以增强幻灯片的视觉效果
2. **多种图标集**: 用户希望使用不同的图标集
3. **Slidev 的成功**: Slidev 的图标支持非常受欢迎

### 设计目标

1. **多种图标集**: 支持 Material Icons、Font Awesome、Heroicons 等
2. **简单语法**: 在 Markdown 中使用简单的语法
3. **自定义图标**: 支持自定义图标

## 详细设计

### 技术实现

1. **Markdown 语法**:
   ```markdown
   # Icons
   
   :material-home: Home
   :mdi:github: GitHub
   :heroicons:heart: Like
   :fa:star: Favorite
   ```

2. **实现方案**:
   - 使用 `@iconify` 或类似库
   - 在 Markdown 解析时检测图标语法
   - 转换为 HTML 时渲染图标
   - 支持自定义图标集

3. **新包**: `@slidejs/markdown-icons`
   - `parseIcons()` - 检测和解析图标语法
   - `renderIcon()` - 渲染图标
   - `loadIconSet()` - 加载图标集

### 实施步骤

1. **创建 `@slidejs/markdown-icons` 包**:
   - 安装 `@iconify` 依赖
   - 实现 `parseIcons()` - 检测图标语法
   - 实现 `renderIcon()` - 渲染图标
   - 支持常用图标集

2. **集成到 `@slidejs/markdown`**:
   - 在 Markdown 解析时检测图标语法
   - 在 HTML 转换时渲染图标
   - 调用 `renderIcon()` 渲染图标

3. **Runner 集成**:
   - 在 Runner 初始化时加载图标集
   - 支持所有 Runner（Reveal.js, Swiper, Splide）

4. **测试**:
   - 单元测试覆盖图标解析
   - 测试不同图标集
   - 测试自定义图标

## 技术细节

### Iconify 配置

```typescript
import { getIcon } from '@iconify/utils';

async function renderIcon(iconName: string): Promise<string> {
  const icon = await getIcon(iconName);
  if (!icon) {
    return '';
  }
  return icon.body;
}
```

### Markdown 解析

```typescript
function parseIcons(markdown: string): string {
  // 检测图标语法 :icon-set:icon-name:
  markdown = markdown.replace(/:([a-z-]+):([a-z-]+):/g, (match, iconSet, iconName) => {
    return `<span class="icon icon-${iconSet} icon-${iconName}"></span>`;
  });
  
  return markdown;
}
```

## 兼容性考虑

1. **现有 DSL**: 不影响现有 DSL，仅影响 Markdown 转换
2. **Runner**: 所有 Runner 都支持（因为转换为 HTML）
3. **图标集**: 支持多种图标集

## 风险评估

1. **依赖大小**: 图标集可能增加包大小
2. **加载性能**: 图标集加载可能影响性能
3. **浏览器兼容性**: 需要现代浏览器支持

## 参考

- [Iconify 文档](https://iconify.design/)
- [Slidev 图标支持](https://sli.dev/guide/syntax.html#icons)

## 决策记录

- **2025-01-XX**: 创建 RFC，开始讨论
- **待定**: 选择图标库
- **待定**: 开始实施
