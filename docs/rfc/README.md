# RFC 文档

本目录包含 slidejs 项目的 RFC（Request for Comments）文档，用于记录技术规范、架构设计和设计决策。

## RFC 列表

### 已完成

- [RFC 0001: Slide DSL 规范](./completed/0001-slide-dsl.md) - 通用幻灯片演示领域特定语言设计 ✅
- [RFC 0002: Slide Runner 与多渲染引擎集成](./completed/0002-slide-runner.md) - 可扩展的幻灯片执行引擎与多渲染引擎适配器（reveal.js、Swiper、Splide）✅
- [RFC 0007: Runner 包 CSS 打包与自动加载](./completed/0007-runner-css-bundling.md) - 修复构建后 CSS 缺失问题 ✅
- [RFC 0008: 统一包构建格式](./completed/0008-unified-build-formats.md) - CJS 和 ESM 双格式支持 ✅
- [RFC 0009: Runner 包 CSS 打包与 CSS 变量自定义](./0009-runner-css-bundling-and-customization.md) - CSS 打包策略和 CSS 变量自定义机制 ✅
- [RFC 0010: CSS Hook API - 运行时主题自定义系统](./0010-css-hook-api.md) - 统一的运行时主题自定义 API ✅

### 草案中

- [RFC 0003: Slide DSL 增强功能与性能优化](./0003-slide-dsl-enhancements.md) - 条件逻辑、变量定义、模块化、性能优化和安全性增强
- [RFC 0004: Slide DSL 语言服务器与开发工具](./0004-slide-dsl-language-server.md) - LSP 服务器、VSCode 扩展与 CLI 工具
- [RFC 0005: reveal.js 高级功能支持](./0005-revealjs-advanced-features.md) - Fragments、Background、Notes 等功能
- [RFC 0006: SlideJS 插件生态系统](./0006-plugin-ecosystem.md) - 插件市场与分发机制

### 计划中

- RFC 0011: Vue 集成设计

## RFC 流程

1. **提案**: 创建新的 RFC 文档，状态为"草案"
2. **讨论**: 在 GitHub Issues 或 Discussions 中讨论
3. **修订**: 根据反馈修订 RFC
4. **批准**: 核心团队批准后，状态改为"已批准"
5. **实施**: 按照 RFC 实施功能
6. **完成**: 实施完成后，状态改为"已完成"

## RFC 状态

- **草案 (Draft)**: 正在讨论中
- **已批准 (Approved)**: 已批准，准备实施
- **实施中 (Implementing)**: 正在实施
- **已完成 (Completed)**: 实施完成
- **已废弃 (Deprecated)**: 不再使用

## 贡献指南

1. 创建新的 RFC 文档，编号递增
2. 使用 Markdown 格式
3. 包含必要的章节：摘要、动机、设计、实施等
4. 提交 PR 并等待审查

## 参考

- [Rust RFC Process](https://github.com/rust-lang/rfcs)
- [React RFC Process](https://github.com/reactjs/rfcs)
