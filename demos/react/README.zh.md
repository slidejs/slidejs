# SlideJS Runner Comparison Demo (React)

这是一个 React 演示项目，同时展示 3 种不同的 SlideJS Runner，并包含 DSL 编辑器。

## 语言

- [English](README.md)
- [中文](README.zh.md)

## 相关演示

- [Vue.js 演示](../vue/README.zh.md)
- [React 演示](README.zh.md) (当前)

## 功能特性

- **3 列 Runner 展示**：同时展示 Reveal.js、Swiper 和 Splide 三个 Runner
- **Monaco 编辑器**：实时编辑 Slide DSL，支持语法高亮
- **可调整分割器**：支持拖拽调整播放器和编辑器区域的大小
- **主题切换**：支持 Solarized Dark / Light 主题
- **实时同步**：编辑 DSL 时，所有 3 个 Runner 自动更新
- **Web Components 支持**：支持自定义 Web Components 和 WSX 组件

## 布局结构

```
┌─────────────────────────────────────────┐
│  主题工具栏                               │
├──────────┬──────────┬───────────────────┤
│          │          │                   │
│ Reveal.js│  Swiper  │      Splide       │
│          │          │                   │
│          │          │                   │
├──────────┴──────────┴───────────────────┤
│  ←→ 水平分割器（可拖拽调整）              │
├─────────────────────────────────────────┤
│                                          │
│         DSL Editor (Monaco)              │
│                                          │
└─────────────────────────────────────────┘
```

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器（端口 3005）
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 项目结构

```
react/
├── src/
│   ├── components/
│   │   ├── my-quiz-question.wsx   # Web Component 示例
│   │   └── my-quiz-question.css
│   ├── App.tsx                    # 主应用组件
│   ├── main.tsx                   # 入口文件
│   ├── demo.slide                 # Slide DSL 源文件
│   └── style.css                  # 全局样式
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 技术栈

- **React 18** - 前端框架
- **TypeScript** - 类型支持
- **Vite** - 构建工具
- **Monaco Editor** - 代码编辑器（VS Code 编辑器核心）
- **@slidejs/editor** - Slide DSL 编辑器支持
- **@slidejs/runner-revealjs** - Reveal.js Runner
- **@slidejs/runner-swiper** - Swiper Runner
- **@slidejs/runner-splide** - Splide Runner
- **@slidejs/theme** - 主题系统

## 使用说明

1. **启动开发服务器**：运行 `pnpm dev`，浏览器会自动打开 `http://localhost:3005`

2. **编辑 DSL**：
   - 在底部的 DSL Editor 中编辑 Slide DSL
   - 编辑后会自动延迟 500ms 更新所有 Runner

3. **调整布局**：
   - 拖拽水平分割器调整播放器和编辑器区域的高度

4. **切换主题**：
   - 点击顶部工具栏的主题按钮切换主题
   - 主题会影响所有 Runner 的样式

5. **对比 Runner**：
   - 3 个 Runner 使用相同的 DSL 源文件
   - 可以同时查看不同 Runner 的渲染效果
   - 支持键盘导航（每个 Runner 独立）

## 注意事项

- Monaco Editor 是一个大型库，首次加载可能需要一些时间
- 每个 Runner 独立管理自己的生命周期
- DSL 语法错误时，所有 Runner 都会显示错误信息
- 编辑 DSL 时有 500ms 的防抖延迟，避免频繁更新
- 使用 React Hooks (useState, useEffect, useRef) 管理状态和生命周期

## 参考

本 demo 参考了 `demos/vue` 的实现方式，包括：

- Monaco 编辑器的集成
- 可调整分割器的实现
- 布局结构和样式设计
