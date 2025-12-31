# RFC 0007: Runner 包 CSS 打包与自动加载

## 元数据
- **RFC ID**: 0007
- **标题**: Runner 包 CSS 打包与自动加载 - 修复构建后 CSS 缺失问题
- **状态**: 已完成
- **创建日期**: 2025-12-29
- **作者**: AI Assistant
- **相关 RFC**: RFC 0002 (Slide Runner)

## 摘要

本 RFC 记录了对 runner 包（特别是 `@slidejs/runner-revealjs`）CSS 打包和加载机制的修复。修复后，runner 包会自动包含所需的 CSS，用户无需在应用代码中手动导入 CSS 文件。

## 问题描述

### 症状

在构建后部署到生产环境时（如 https://slidejs.io/demos/revealjs/），reveal.js 演示出现以下问题：

1. **内容被挤压到左侧**：幻灯片内容没有正确居中，所有内容都挤在页面左侧
2. **布局完全失效**：reveal.js 的布局系统无法正常工作
3. **样式缺失**：关键 CSS 样式没有被正确加载

### 根本原因分析

1. **CSS 导入位置不当**：
   - CSS 在 `adapter.ts` 中导入，但在库模式构建时可能被外部化
   - Demo 应用中手动导入 CSS，但构建后路径可能不正确

2. **缺少 DOM 结构**：
   - reveal.js 5.x 需要 `.reveal-viewport` 包装器，但适配器未创建此结构

3. **CSS 打包配置不完整**：
   - Vite 库模式构建时，CSS 可能没有被正确提取到单独文件
   - `package.json` 中定义了 `./style.css` 导出，但源文件不存在

## 解决方案

### 1. 创建统一的 CSS 入口文件

在 runner 包的 `src/` 目录下创建 `style.css` 文件：

```css
/**
 * @slidejs/runner-revealjs - reveal.js 核心样式
 *
 * 此文件导入 reveal.js 的核心 CSS，用户只需导入此包即可获得所有必需的样式。
 * 主题样式需要单独导入（可选）。
 */
@import 'reveal.js/dist/reveal.css';
```

### 2. 在入口文件中自动导入 CSS

在 `src/index.ts` 中添加 CSS 导入：

```typescript
// 导入核心样式（自动加载）
import './style.css';

// ... 其他导出
```

这样，当用户导入 `@slidejs/runner-revealjs` 时，CSS 会自动加载。

### 3. 更新构建配置

在 `vite.config.ts` 中：

```typescript
export default defineConfig({
  build: {
    // ...
    rollupOptions: {
      output: {
        // 确保 CSS 文件被正确提取
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'style.css';
          }
          return assetInfo.name || 'assets/[name].[ext]';
        },
      },
    },
    // 确保 CSS 被提取到单独的文件
    cssCodeSplit: false,
  },
});
```

### 4. 修复 DOM 结构

在 `adapter.ts` 的 `createRevealStructure` 方法中添加 `reveal-viewport` 包装器：

```typescript
private createRevealStructure(container: HTMLElement): void {
  // 创建 .reveal-viewport 包装器（reveal.js 5.x 要求）
  const viewportDiv = document.createElement('div');
  viewportDiv.className = 'reveal-viewport';

  // 创建 .reveal 容器
  const revealDiv = document.createElement('div');
  revealDiv.className = 'reveal';

  // 创建 .slides 容器
  const slidesDiv = document.createElement('div');
  slidesDiv.className = 'slides';

  revealDiv.appendChild(slidesDiv);
  viewportDiv.appendChild(revealDiv);
  container.appendChild(viewportDiv);

  this.revealContainer = revealDiv;
  this.slidesContainer = slidesDiv;
}
```

### 5. 清理重复导入

- 从 `adapter.ts` 中移除 `import 'reveal.js/dist/reveal.css'`
- 从 demo 应用中移除核心 CSS 导入（只保留主题 CSS）

## 实施细节

### 文件变更

1. **新增文件**：
   - `packages/@slidejs/runner-revealjs/src/style.css`

2. **修改文件**：
   - `packages/@slidejs/runner-revealjs/src/index.ts` - 添加 CSS 导入
   - `packages/@slidejs/runner-revealjs/src/adapter.ts` - 移除重复 CSS 导入，添加 viewport 包装器
   - `packages/@slidejs/runner-revealjs/vite.config.ts` - 更新构建配置
   - `demos/slidejs-revealjs/src/main.ts` - 移除核心 CSS 导入

### 使用方式变更

**修复前**（需要手动导入 CSS）：
```typescript
import { createSlideRunner } from '@slidejs/runner-revealjs';
import 'reveal.js/dist/reveal.css'; // 必须手动导入
import 'reveal.js/dist/theme/black.css';
```

**修复后**（CSS 自动加载）：
```typescript
import { createSlideRunner } from '@slidejs/runner-revealjs';
// CSS 自动加载，无需手动导入
import 'reveal.js/dist/theme/black.css'; // 主题样式（可选）
```

## 验证方法

### 1. 构建验证

```bash
# 构建 runner 包
pnpm --filter @slidejs/runner-revealjs build

# 检查 dist 目录
ls -la packages/@slidejs/runner-revealjs/dist/
# 应该包含 style.css 文件
```

### 2. Demo 构建验证

```bash
# 构建 demo
pnpm --filter slidejs-revealjs-demo build

# 检查构建产物
cat demos/slidejs-revealjs/dist/index.html
# CSS 应该被正确引用
```

### 3. 运行时验证

1. 启动开发服务器，检查样式是否正确加载
2. 构建生产版本，部署到测试环境
3. 检查浏览器开发者工具，确认 CSS 文件被正确加载
4. 验证布局是否正确（内容居中，不是挤压到左侧）

## 影响范围

### 受影响的包

- `@slidejs/runner-revealjs` - 主要修复目标
- `@slidejs/runner-swiper` - 可参考此方案（如果存在类似问题）
- `@slidejs/runner-splide` - 可参考此方案（如果存在类似问题）

### 向后兼容性

- **完全兼容**：现有代码无需修改即可工作
- **改进**：新代码可以移除手动 CSS 导入，使用更简洁的 API

## 风险评估

### 技术风险

1. **CSS 加载顺序**：
   - 风险等级: 低
   - 缓解: CSS 在入口文件中导入，确保加载顺序正确

2. **构建配置复杂性**：
   - 风险等级: 低
   - 缓解: 使用标准的 Vite 配置，经过验证

3. **主题样式冲突**：
   - 风险等级: 低
   - 缓解: 主题样式仍然需要用户手动导入，不会冲突

## 替代方案

### 方案 A: 继续要求用户手动导入 CSS
- **优点**: 简单，用户完全控制
- **缺点**: 容易出错，用户体验差

### 方案 B: 使用 CDN 链接
- **优点**: 简单
- **缺点**: 依赖外部资源，不符合包管理最佳实践

**选择**: 我们选择自动打包 CSS（本 RFC），因为：
1. 更好的用户体验
2. 减少配置错误
3. 符合现代包管理最佳实践

## 参考资料

- [Vite Library Mode](https://vitejs.dev/guide/build.html#library-mode)
- [reveal.js 5.x Documentation](https://revealjs.com/)
- RFC 0002: Slide Runner 与多渲染引擎集成

## 变更历史

- 2025-12-29: 初始草稿，记录 CSS 打包修复方案

