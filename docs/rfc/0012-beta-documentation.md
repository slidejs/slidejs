# RFC 0012: SlideJS Beta 发布文档准备

## 元数据

- **RFC ID**: 0012
- **标题**: SlideJS Beta 发布文档准备
- **状态**: 进行中
- **创建日期**: 2025-01-17
- **作者**: AI Assistant
- **相关 RFC**: 
  - RFC 0001 (Slide DSL 规范) ✅
  - RFC 0002 (Slide Runner) ✅
  - RFC 0010 (CSS Hook API) ✅
  - RFC 0011 (演示项目规范) ✅

## 摘要

本 RFC 旨在为 SlideJS Beta 版本发布准备完整的文档体系。文档将使用 wsx-press 进行管理，位于 `site/public/docs` 目录。本 RFC 将评估当前项目状态，确定 Beta 就绪性，并规划完整的文档工作。

## 动机

### 当前状态

SlideJS 项目已经实现了核心功能：

1. **核心 DSL 系统** ✅
   - Slide DSL 语法解析器（Peggy）
   - DSL 编译和验证
   - SlideEngine 幻灯片生成引擎
   - 完整的 TypeScript 类型定义

2. **多 Runner 支持** ✅
   - Reveal.js Runner（完整实现）
   - Swiper Runner（完整实现）
   - Splide Runner（完整实现）
   - 统一的 Runner API 和工厂函数

3. **主题系统** ✅
   - CSS Hook API（运行时主题自定义）
   - 预设主题支持（Solarized Dark/Light）
   - 标准 CSS 变量系统

4. **演示项目** ✅
   - Vue.js Demo（3 个 runner 对比）
   - React Demo（3 个 runner 对比）
   - Svelte Demo（3 个 runner 对比）
   - Vanilla TypeScript Demo（3 个 runner 对比）

5. **文档基础设施** ✅
   - wsx-press 文档系统已配置
   - 文档目录结构已建立（`site/public/docs`）
   - 基础文档已创建（快速开始、安装指南、DSL 指南）

### Beta 就绪性评估

#### ✅ 已就绪的功能

1. **核心 DSL 功能**
   - 语法解析和验证
   - 规则引擎（start, content, end）
   - 静态文本内容
   - 动态组件支持
   - 过渡效果（slide, fade, zoom, cube, flip, none）

2. **Runner 系统**
   - 三个完整的 Runner 实现
   - 统一的 API 接口
   - 生命周期管理
   - 事件系统

3. **主题系统**
   - 运行时主题切换
   - 预设主题
   - 自定义主题支持

4. **开发体验**
   - 完整的 TypeScript 类型定义
   - 多个框架的演示项目
   - Monaco Editor 集成（DSL 语法高亮）

#### ⚠️ 需要文档化的功能

1. **API 文档**
   - `@slidejs/core` API 参考
   - `@slidejs/dsl` API 参考
   - `@slidejs/runner` API 参考
   - 各 Runner 包的 API 参考
   - `@slidejs/theme` API 参考

2. **使用指南**
   - 完整的 DSL 语法参考
   - Runner 选择和配置指南
   - 主题自定义指南
   - 动态组件开发指南
   - 最佳实践

3. **迁移指南**
   - 从其他幻灯片库迁移
   - 版本升级指南

4. **示例和教程**
   - 更多实际使用案例
   - 常见问题解答（FAQ）
   - 故障排除指南

## 详细设计

### 1. 文档结构规划

文档将使用 wsx-press 管理，位于 `site/public/docs` 目录：

```
site/public/docs/
├── guide/                    # 指南文档
│   ├── getting-started.md    # 快速开始 ✅
│   ├── installation.md       # 安装指南 ✅
│   ├── dsl-guide.md          # DSL 完整指南 ✅
│   ├── runner-guide.md       # Runner 使用指南（待创建）
│   ├── theme-guide.md        # 主题系统指南（待创建）
│   ├── components-guide.md   # 动态组件开发指南（待创建）
│   └── migration-guide.md   # 迁移指南（待创建）
├── api/                       # API 参考文档（待创建）
│   ├── core.md               # @slidejs/core API
│   ├── dsl.md                # @slidejs/dsl API
│   ├── runner.md             # @slidejs/runner API
│   ├── runner-revealjs.md    # @slidejs/runner-revealjs API
│   ├── runner-swiper.md      # @slidejs/runner-swiper API
│   ├── runner-splide.md      # @slidejs/runner-splide API
│   └── theme.md              # @slidejs/theme API
├── examples/                 # 示例和教程（待创建）
│   ├── basic-presentation.md # 基础演示文稿示例
│   ├── interactive-quiz.md   # 交互式测验示例
│   ├── multi-runner.md      # 多 Runner 对比示例
│   └── custom-theme.md       # 自定义主题示例
├── faq/                      # 常见问题（待创建）
│   └── index.md              # FAQ 主页面
└── rfc/                      # RFC 文档（已存在）
    └── ...
```

### 2. 文档内容规划

#### 2.1 指南文档（Guide）

**runner-guide.md** - Runner 使用指南
- Runner 选择建议
- 各 Runner 的配置选项
- Runner 生命周期
- 事件处理
- 性能优化建议

**theme-guide.md** - 主题系统指南
- 预设主题使用
- 自定义主题创建
- CSS 变量系统
- 作用域主题
- 主题切换最佳实践

**components-guide.md** - 动态组件开发指南
- Web Components 集成
- WSX 组件集成
- 组件属性传递
- 事件处理
- 组件样式

**migration-guide.md** - 迁移指南
- 从 reveal.js 迁移
- 从其他幻灯片库迁移
- 版本升级指南

#### 2.2 API 参考文档（API Reference）

为每个包创建完整的 API 参考文档：
- 所有导出的类和函数
- 类型定义
- 参数说明
- 返回值说明
- 使用示例
- 注意事项

#### 2.3 示例和教程（Examples）

创建实际的使用案例：
- 基础演示文稿
- 交互式测验
- 多 Runner 对比
- 自定义主题
- 复杂场景示例

#### 2.4 常见问题（FAQ）

收集和整理常见问题：
- 安装问题
- 使用问题
- 配置问题
- 性能问题
- 故障排除

### 3. 文档工具和流程

#### 3.1 wsx-press 配置

wsx-press 已在 `site/vite.config.ts` 中配置：

```typescript
wsxPress({
  docsRoot: path.resolve(__dirname, './public/docs'),
  outputDir: path.resolve(__dirname, './.wsx-press'),
})
```

#### 3.2 文档编写规范

1. **Markdown 格式**
   - 使用标准 Markdown 语法
   - 支持 frontmatter（标题、顺序、分类等）
   - 代码块使用语法高亮

2. **代码示例**
   - 所有代码示例必须可运行
   - 提供完整的上下文
   - 包含必要的导入语句

3. **文档结构**
   - 清晰的章节划分
   - 目录导航
   - 交叉引用

#### 3.3 文档维护流程

1. **创建文档**
   - 在 `site/public/docs` 相应目录创建 `.md` 文件
   - 添加 frontmatter
   - 编写内容

2. **预览文档**
   - 运行 `pnpm dev:site` 或 `pnpm site`
   - 访问 `/docs/{category}/{page}` 查看

3. **构建文档**
   - wsx-press 会在构建时自动处理文档
   - 生成静态 HTML 页面

### 4. Beta 发布检查清单

#### 4.1 功能完整性 ✅

- [x] 核心 DSL 功能完整
- [x] 三个 Runner 实现完整
- [x] 主题系统完整
- [x] TypeScript 类型定义完整
- [x] 演示项目完整

#### 4.2 文档完整性

- [x] 快速开始指南
- [x] 安装指南
- [x] DSL 基础指南
- [x] Runner 使用指南
- [x] 主题系统指南
- [x] 动态组件指南
- [x] API 参考文档（所有包）
- [x] 示例和教程（4个示例）
- [x] FAQ
- [x] 迁移指南

#### 4.3 代码质量

- [x] 单元测试覆盖
- [x] TypeScript 类型检查
- [x] ESLint 检查
- [x] 代码格式化

#### 4.4 发布准备

- [ ] 版本号确定（0.2.0-beta.1）
- [ ] CHANGELOG 更新
- [ ] 发布说明准备
- [ ] npm 发布配置

## 实施计划

### Phase 1: 文档结构建立（1-2 天）

- [x] 确认 wsx-press 配置
- [x] 创建文档目录结构
- [x] 创建文档模板
- [x] 建立文档编写规范

### Phase 2: 核心文档编写（3-5 天）

- [x] Runner 使用指南
- [x] 主题系统指南
- [x] 动态组件开发指南
- [x] API 参考文档（所有包）

### Phase 3: 示例和教程（2-3 天）

- [x] 基础示例
- [x] 高级示例
- [x] 实际使用案例

### Phase 4: 完善和审查（2-3 天）

- [x] FAQ 整理
- [x] 迁移指南
- [x] 文档审查和修正
- [x] 链接检查（已移除非标准 `{#id}` 语法，改用标准 Markdown 锚点）

### Phase 5: Beta 发布准备（1-2 天）

- [ ] 版本号更新
- [ ] CHANGELOG 编写
- [ ] 发布说明准备
- [ ] npm 发布

## 风险评估

### 文档质量风险

- **风险等级**: 中
- **缓解措施**: 
  - 建立文档审查流程
  - 提供代码示例验证
  - 收集用户反馈

### 文档维护风险

- **风险等级**: 低
- **缓解措施**: 
  - 使用 wsx-press 自动化构建
  - 建立文档更新流程
  - 版本控制管理

### 时间风险

- **风险等级**: 中
- **缓解措施**: 
  - 分阶段实施
  - 优先核心文档
  - 逐步完善

## 成功标准

1. **文档完整性**
   - 所有核心功能都有文档
   - API 参考完整
   - 示例丰富

2. **文档质量**
   - 内容准确
   - 代码示例可运行
   - 易于理解

3. **用户体验**
   - 文档结构清晰
   - 导航方便
   - 搜索功能可用

4. **Beta 发布就绪**
   - 所有检查清单项完成
   - 文档可以支持 Beta 用户
   - 发布流程就绪

## 后续工作

Beta 发布后，根据用户反馈：
- 补充缺失的文档
- 改进文档质量
- 添加更多示例
- 完善 FAQ

## 参考

- [wsx-press 文档](https://github.com/wsxjs/wsx-press)
- [RFC 0001: Slide DSL 规范](./completed/0001-slide-dsl.md)
- [RFC 0002: Slide Runner](./completed/0002-slide-runner.md)
- [RFC 0010: CSS Hook API](./completed/0010-css-hook-api.md)
