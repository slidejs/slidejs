# SlideJS 文档计划 - wsx-press 集成

## 📋 概述

本文档规划了使用 **wsx-press** 构建 SlideJS 完整文档系统的方案。

## 🎯 目标

1. **完整的文档体系**：覆盖从入门到高级的所有使用场景
2. **优秀的用户体验**：清晰的导航、搜索、代码高亮
3. **多语言支持**：中英文双语文档
4. **现代化设计**：与站点主题一致的视觉风格
5. **易于维护**：基于 Markdown + Frontmatter 的简单结构

## 📁 文档结构规划

```
site/public/docs/
├── guide/                    # 指南文档（已存在部分）
│   ├── getting-started.md    # ✅ 快速开始（已存在）
│   ├── installation.md       # ✅ 安装指南（已存在）
│   ├── dsl-guide.md          # ✅ DSL 完整指南（已存在）
│   ├── runners.md            # 🆕 运行器选择指南
│   ├── theme.md              # 🆕 主题系统指南
│   ├── context.md            # 🆕 上下文数据指南
│   └── best-practices.md     # 🆕 最佳实践
│
├── api/                      # API 参考文档
│   ├── core.md               # 🆕 @slidejs/core API
│   ├── dsl.md                # 🆕 @slidejs/dsl API
│   ├── context.md            # 🆕 @slidejs/context API
│   ├── runner.md             # 🆕 @slidejs/runner API
│   ├── runner-revealjs.md    # 🆕 reveal.js 运行器 API
│   ├── runner-swiper.md      # 🆕 Swiper 运行器 API
│   ├── runner-splide.md      # 🆕 Splide 运行器 API
│   └── theme.md              # 🆕 @slidejs/theme API
│
├── runners/                  # 运行器详细文档
│   ├── revealjs.md          # 🆕 reveal.js 运行器完整指南
│   ├── swiper.md            # 🆕 Swiper 运行器完整指南
│   ├── splide.md            # 🆕 Splide 运行器完整指南
│   └── comparison.md        # 🆕 运行器对比和选择建议
│
├── examples/                 # 示例文档
│   ├── basic.md             # 🆕 基础示例
│   ├── quiz-presentation.md # 🆕 Quiz 演示示例
│   ├── dynamic-content.md   # 🆕 动态内容示例
│   ├── nested-loops.md      # 🆕 嵌套循环示例
│   ├── theme-customization.md # 🆕 主题自定义示例
│   └── vue-integration.md   # 🆕 Vue 集成示例
│
├── rfc/                      # RFC 文档（迁移自 docs/rfc/）
│   ├── index.md             # 🆕 RFC 索引页
│   ├── 0001-slide-dsl.md    # 🆕 RFC 0001（迁移）
│   ├── 0002-slide-runner.md # 🆕 RFC 0002（迁移）
│   ├── 0003-slide-dsl-enhancements.md # 🆕 RFC 0003（迁移）
│   ├── 0004-language-server.md # 🆕 RFC 0004（迁移）
│   ├── 0005-revealjs-advanced.md # 🆕 RFC 0005（迁移）
│   └── 0006-plugin-ecosystem.md # 🆕 RFC 0006（迁移）
│
└── advanced/                 # 高级主题
    ├── architecture.md      # 🆕 架构设计
    ├── performance.md       # 🆕 性能优化
    ├── customization.md     # 🆕 深度自定义
    └── contributing.md      # 🆕 贡献指南
```

## 📝 文档 Frontmatter 规范

每个文档文件都需要包含以下 frontmatter：

```yaml
---
title: 文档标题
order: 排序数字（用于目录排序）
category: 分类（guide/api/runners/examples/rfc/advanced）
description: 文档描述（用于 SEO 和搜索）
tags: [标签1, 标签2] # 可选，用于搜索和分类
---
```

### 示例

```yaml
---
title: 快速开始
order: 1
category: guide
description: '5 分钟快速上手 SlideJS，学习如何创建第一个 Slide DSL 文件和运行幻灯片演示'
tags: [getting-started, tutorial, quick-start]
---
```

## 🎨 文档设计规范

### 1. 代码块规范

- **DSL 代码**：使用 `slide` 语言标识符
- **TypeScript 代码**：使用 `typescript` 或 `ts`
- **JavaScript 代码**：使用 `javascript` 或 `js`
- **Bash 命令**：使用 `bash` 或 `sh`
- **JSON 配置**：使用 `json`

### 2. 文档结构规范

每个文档应包含：

1. **标题**（H1）
2. **简介**（可选，简短描述）
3. **目录**（可选，长文档建议添加）
4. **主要内容**（H2-H6）
5. **相关链接**（底部，链接到相关文档）

### 3. 链接规范

- **内部链接**：使用相对路径，如 `[安装指南](./installation.md)`
- **外部链接**：使用完整 URL，如 `[reveal.js](https://revealjs.com/)`
- **跨分类链接**：使用完整路径，如 `[API 参考](../api/core.md)`

## 📚 内容规划

### Phase 1: 核心指南完善（优先级：高）

1. ✅ **快速开始** - 已完成
2. ✅ **安装指南** - 已完成
3. ✅ **DSL 完整指南** - 已完成
4. 🆕 **运行器选择指南** (`guide/runners.md`)
   - 各运行器特点对比
   - 使用场景建议
   - 性能对比
   - 迁移指南

5. 🆕 **主题系统指南** (`guide/theme.md`)
   - 预设主题使用
   - 自定义主题
   - CSS 变量系统
   - 运行时主题切换

6. 🆕 **上下文数据指南** (`guide/context.md`)
   - Context 接口说明
   - 数据源适配
   - 数据访问路径
   - 类型定义

7. 🆕 **最佳实践** (`guide/best-practices.md`)
   - 代码组织
   - 性能优化
   - 错误处理
   - 调试技巧

### Phase 2: API 参考文档（优先级：高）

1. 🆕 **@slidejs/core API** (`api/core.md`)
   - `SlideEngine` 类
   - `SlideDSL` 类型
   - 核心接口

2. 🆕 **@slidejs/dsl API** (`api/dsl.md`)
   - `parseSlideDSL()` 函数
   - `compile()` 函数
   - AST 类型定义
   - 错误处理

3. 🆕 **@slidejs/context API** (`api/context.md`)
   - `SlideContext` 接口
   - `createEmptyContext()` 函数
   - `isValidContext()` 函数

4. 🆕 **@slidejs/runner API** (`api/runner.md`)
   - `SlideRunner` 接口
   - 基础运行器接口

5. 🆕 **运行器特定 API**
   - `api/runner-revealjs.md` - reveal.js 运行器
   - `api/runner-swiper.md` - Swiper 运行器
   - `api/runner-splide.md` - Splide 运行器

6. 🆕 **@slidejs/theme API** (`api/theme.md`)
   - `setTheme()` 函数
   - `useTheme()` Hook
   - `Preset` 枚举
   - 主题类型定义

### Phase 3: 运行器详细文档（优先级：中）

1. 🆕 **reveal.js 运行器** (`runners/revealjs.md`)
   - 完整配置选项
   - 高级功能（Fragments、Background、Notes）
   - 插件集成
   - 性能优化

2. 🆕 **Swiper 运行器** (`runners/swiper.md`)
   - 完整配置选项
   - 触摸交互
   - 移动端优化
   - 性能优化

3. 🆕 **Splide 运行器** (`runners/splide.md`)
   - 完整配置选项
   - 轻量级特性
   - 性能优化

4. 🆕 **运行器对比** (`runners/comparison.md`)
   - 功能对比表
   - 性能对比
   - 使用场景建议
   - 迁移指南

### Phase 4: 示例文档（优先级：中）

1. 🆕 **基础示例** (`examples/basic.md`)
   - 最简单的幻灯片
   - 文本内容
   - 静态幻灯片

2. 🆕 **Quiz 演示示例** (`examples/quiz-presentation.md`)
   - 从 Quiz 数据生成幻灯片
   - 动态内容组件
   - 完整工作流

3. 🆕 **动态内容示例** (`examples/dynamic-content.md`)
   - 动态组件使用
   - 属性传递
   - 组件通信

4. 🆕 **嵌套循环示例** (`examples/nested-loops.md`)
   - 多级循环
   - 复杂数据结构处理

5. 🆕 **主题自定义示例** (`examples/theme-customization.md`)
   - 自定义主题创建
   - CSS 变量使用
   - 运行时切换

6. 🆕 **Vue 集成示例** (`examples/vue-integration.md`)
   - Vue 组件集成
   - 响应式数据
   - 生命周期管理

### Phase 5: RFC 文档迁移（优先级：低）

1. 🆕 **RFC 索引页** (`rfc/index.md`)
   - 所有 RFC 的索引
   - 状态说明
   - 分类导航

2. 🆕 **迁移现有 RFC**
   - 从 `docs/rfc/` 迁移到 `site/public/docs/rfc/`
   - 添加 frontmatter
   - 统一格式

### Phase 6: 高级主题（优先级：低）

1. 🆕 **架构设计** (`advanced/architecture.md`)
   - 系统架构
   - 模块设计
   - 数据流

2. 🆕 **性能优化** (`advanced/performance.md`)
   - 编译优化
   - 运行时优化
   - 最佳实践

3. 🆕 **深度自定义** (`advanced/customization.md`)
   - 自定义运行器
   - 自定义主题
   - 插件开发

4. 🆕 **贡献指南** (`advanced/contributing.md`)
   - 开发环境设置
   - 代码规范
   - PR 流程

## 🎨 文档页面设计优化

### 当前状态

- ✅ wsx-press 已集成
- ✅ 路由已配置 (`/docs/:category/:page`)
- ✅ 基础样式已存在

### 需要优化的点

1. **文档布局样式** (`site/src/components/pages/DocsPage.css`)
   - 添加侧边栏导航
   - 优化内容区域宽度
   - 添加目录导航
   - 响应式设计

2. **代码高亮**
   - 确保代码块样式美观
   - 添加行号（可选）
   - 添加复制按钮（可选）

3. **搜索功能**
   - wsx-press 已生成 `search-index.json`
   - 需要添加搜索 UI 组件

4. **导航增强**
   - 添加面包屑导航
   - 添加上一篇/下一篇链接
   - 添加相关文档推荐

## 🌍 国际化支持

### 当前状态

- ✅ 站点已支持 i18n（中英文）
- ❌ 文档尚未支持多语言

### 计划

1. **文档结构**
   ```
   site/public/docs/
   ├── zh/          # 中文文档
   │   ├── guide/
   │   ├── api/
   │   └── ...
   └── en/          # 英文文档
       ├── guide/
       ├── api/
       └── ...
   ```

2. **路由调整**
   - 当前：`/docs/:category/:page`
   - 调整：`/docs/:lang/:category/:page` 或 `/docs/:category/:page`（根据当前语言）

3. **语言切换**
   - 在文档页面添加语言切换器
   - 保持当前语言状态

## 📅 实施计划

### Week 1: 核心指南完善
- [ ] 创建 `guide/runners.md`
- [ ] 创建 `guide/theme.md`
- [ ] 创建 `guide/context.md`
- [ ] 创建 `guide/best-practices.md`

### Week 2: API 参考文档
- [ ] 创建所有 API 参考文档
- [ ] 添加代码示例
- [ ] 添加类型定义说明

### Week 3: 运行器和示例
- [ ] 创建运行器详细文档
- [ ] 创建示例文档
- [ ] 添加完整代码示例

### Week 4: 设计和优化
- [ ] 优化文档页面样式
- [ ] 添加搜索功能
- [ ] 添加导航增强
- [ ] 国际化支持

## 🔧 技术细节

### wsx-press 配置

当前配置（`site/vite.config.ts`）：
```typescript
wsxPress({
  docsRoot: path.resolve(__dirname, './public/docs'),
  outputDir: path.resolve(__dirname, './.wsx-press'),
})
```

### 文档路由

当前路由（`site/src/App.wsx`）：
```jsx
<wsx-view route="/docs/:category/:page" component="docs-page"></wsx-view>
```

### 文档组件

当前组件（`site/src/components/pages/DocsPage.wsx`）：
```jsx
<wsx-doc-layout />
```

## 📝 注意事项

1. **文档格式**：所有文档使用 Markdown + Frontmatter
2. **代码示例**：确保所有代码示例可运行
3. **链接检查**：定期检查内部链接有效性
4. **版本同步**：文档内容与代码版本保持同步
5. **SEO 优化**：每个文档包含合适的 description

## 🎯 成功标准

1. ✅ 所有核心功能都有文档覆盖
2. ✅ 文档结构清晰，易于导航
3. ✅ 代码示例完整且可运行
4. ✅ 搜索功能正常工作
5. ✅ 多语言支持完整
6. ✅ 设计风格与站点一致
7. ✅ 移动端体验良好

## 📚 参考资源

- [wsx-press 文档](https://www.wsxjs.dev)（如果可用）
- [Markdown 规范](https://commonmark.org/)
- [Frontmatter 规范](https://jekyllrb.com/docs/front-matter/)

---

**最后更新**: 2024-12-XX
**状态**: 规划中
**负责人**: SlideJS 团队
