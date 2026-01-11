# RFC 0008: 统一包构建格式 - CJS 和 ESM 双格式支持

## 元数据

- **RFC ID**: 0008
- **标题**: 统一包构建格式 - CJS 和 ESM 双格式支持
- **状态**: 已完成
- **创建日期**: 2025-12-29
- **作者**: AI Assistant
- **相关 RFC**: RFC 0002 (Slide Runner)

## 摘要

本 RFC 旨在统一所有 SlideJS 包的构建格式，确保所有包都同时支持 CommonJS (CJS) 和 ES Module (ESM) 格式，提供更好的兼容性和使用体验。

## 问题描述

### 当前状态

目前 SlideJS 包的构建格式不一致：

1. **已支持双格式的包**：
   - `@slidejs/runner` - 生成 `index.mjs` (ESM) 和 `index.cjs` (CJS) ✅
   - `@slidejs/runner-revealjs` - 生成 `index.mjs` (ESM) 和 `index.cjs` (CJS) ✅
   - `@slidejs/runner-swiper` - 生成 `index.mjs` (ESM) 和 `index.cjs` (CJS) ✅
   - `@slidejs/runner-splide` - 生成 `index.mjs` (ESM) 和 `index.cjs` (CJS) ✅

2. **仅支持 ESM 的包**（已修复）：
   - `@slidejs/core` - 现在生成 `index.mjs` (ESM) 和 `index.cjs` (CJS) ✅
   - `@slidejs/context` - 现在生成 `index.mjs` (ESM) 和 `index.cjs` (CJS) ✅
   - `@slidejs/dsl` - 现在生成 `index.mjs` (ESM) 和 `index.cjs` (CJS) ✅

### 问题影响

1. **兼容性问题**：
   - 仅支持 ESM 的包无法在 CommonJS 环境中使用（如 Node.js 传统项目）
   - 限制了包的使用场景和兼容性

2. **不一致性**：
   - 不同包的导入方式不一致，增加学习成本
   - 用户需要了解哪些包支持哪些格式

3. **生态系统兼容性**：
   - 某些工具和框架可能仍需要 CommonJS 支持
   - 限制了与现有生态系统的集成

## 解决方案

### 目标

统一所有包的构建配置，确保：

1. 所有包都生成 `index.mjs` (ESM) 和 `index.cjs` (CJS) 格式
2. 所有包都生成 `index.d.ts` 类型定义文件
3. 所有包的 `package.json` 正确配置 `exports` 字段
4. 保持与现有代码的兼容性

### 实施计划

#### 1. 更新 Vite 配置

所有仅支持 ESM 的包需要更新 `vite.config.ts`：

```typescript
// 修改前
formats: ['es'],
fileName: 'index',

// 修改后
formats: ['es', 'cjs'],
fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
```

#### 2. 更新 package.json

需要更新以下字段：

```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

#### 3. 更新 DTS 插件配置

确保 `vite-plugin-dts` 配置正确：

```typescript
dts({
  include: ['src/**/*'],
  exclude: ['**/*.test.ts', '**/*.spec.ts'],
  rollupTypes: true, // 生成单个 index.d.ts 文件
}),
```

### 受影响的包

需要更新的包：

1. **@slidejs/core**
   - 更新 `vite.config.ts`
   - 更新 `package.json` exports 字段

2. **@slidejs/context**
   - 更新 `vite.config.ts`
   - 更新 `package.json` exports 字段

3. **@slidejs/dsl**
   - 更新 `vite.config.ts`
   - 更新 `package.json` exports 字段

### 参考实现

参考 `@slidejs/runner` 的配置：

**vite.config.ts**:

```typescript
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SlideJsRunner',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['@slidejs/core', '@slidejs/context'],
    },
    sourcemap: true,
  },
  plugins: [
    dts({
      include: ['src/**/*'],
      exclude: ['**/*.test.ts'],
      rollupTypes: true,
    }),
  ],
});
```

**package.json**:

```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    }
  }
}
```

## 实施细节

### 文件变更清单

1. **@slidejs/core**:
   - `packages/@slidejs/core/vite.config.ts` - 更新构建配置
   - `packages/@slidejs/core/package.json` - 更新 exports 字段

2. **@slidejs/context**:
   - `packages/@slidejs/context/vite.config.ts` - 更新构建配置
   - `packages/@slidejs/context/package.json` - 更新 exports 字段

3. **@slidejs/dsl**:
   - `packages/@slidejs/dsl/vite.config.ts` - 更新构建配置
   - `packages/@slidejs/dsl/package.json` - 更新 exports 字段

### 验证方法

1. **构建验证**：

   ```bash
   pnpm --filter @slidejs/core build
   pnpm --filter @slidejs/context build
   pnpm --filter @slidejs/dsl build
   ```

2. **产物检查**：
   每个包的 `dist` 目录应包含：
   - `index.mjs` (ESM)
   - `index.cjs` (CommonJS)
   - `index.d.ts` (TypeScript 类型定义)
   - `index.mjs.map` 和 `index.cjs.map` (Source maps)

3. **导入测试**：

   ```typescript
   // ESM 导入
   import { ... } from '@slidejs/core';

   // CommonJS 导入
   const { ... } = require('@slidejs/core');
   ```

## 影响范围

### 向后兼容性

- **完全兼容**：现有 ESM 导入方式不受影响
- **新增支持**：CommonJS 环境现在可以使用这些包
- **无破坏性变更**：所有现有代码继续工作

### 依赖关系

- 所有依赖这些包的包（如 `@slidejs/runner`）无需修改
- 构建工具和 CI/CD 流程无需修改

## 风险评估

### 技术风险

1. **构建时间**：
   - 风险等级: 低
   - 缓解: 生成两个格式仅略微增加构建时间

2. **包大小**：
   - 风险等级: 低
   - 缓解: 两个格式文件大小相近，总体增加约 50%

3. **类型定义**：
   - 风险等级: 低
   - 缓解: `rollupTypes: true` 确保生成单个类型文件

### 实施风险

1. **配置错误**：
   - 风险等级: 低
   - 缓解: 参考已验证的 `@slidejs/runner` 配置

2. **测试覆盖**：
   - 风险等级: 低
   - 缓解: 现有测试应继续通过

## 替代方案

### 方案 A: 仅支持 ESM（当前状态）

- **优点**: 简单，包体积小
- **缺点**: 兼容性差，限制使用场景

### 方案 B: 仅支持 CommonJS

- **优点**: 兼容性好
- **缺点**: 不符合现代 JavaScript 标准，无法利用 ESM 优势

**选择**: 我们选择双格式支持（本 RFC），因为：

1. 提供最佳兼容性
2. 符合现代包管理最佳实践
3. 与现有 runner 包保持一致

## 参考资料

- [Vite Library Mode](https://vitejs.dev/guide/build.html#library-mode)
- [Package Exports](https://nodejs.org/api/packages.html#exports)
- [Dual Package Hazard](https://nodejs.org/api/packages.html#dual-package-hazard)
- RFC 0002: Slide Runner 与多渲染引擎集成

## 变更历史

- 2025-12-29: 初始草稿，记录统一构建格式方案
- 2025-01-10: 标记为已完成 - 所有包已支持 CJS 和 ESM 双格式
