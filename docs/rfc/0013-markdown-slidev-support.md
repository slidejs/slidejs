# RFC 0013: Markdown 支持与 Slidev 兼容功能

## 元数据

- **RFC ID**: 0013
- **标题**: Markdown 支持与 Slidev 兼容功能
- **状态**: 草案
- **创建日期**: 2025-01-XX
- **作者**: AI Assistant
- **相关 RFC**: RFC 0001 (Slide DSL 规范), RFC 0002 (Slide Runner), RFC 0005 (reveal.js 高级功能支持)

## 摘要

本 RFC 提议为 SlideJS 添加 Markdown 支持，实现 **Markdown 到 Slide DSL 的自动转换**。用户可以使用纯 Markdown 编写幻灯片（类似 Slidev），系统自动将 Markdown 转换为 Slide DSL，然后使用现有的 DSL 系统处理。**关键设计原则：所有幻灯片内容都使用 WSX 组件渲染**，确保统一的组件架构和更好的可扩展性。

## 动机

### 背景问题

1. **Markdown 是更熟悉的格式**: 大多数开发者熟悉 Markdown，使用 Markdown 编写幻灯片可以降低学习曲线
2. **Slidev 的成功**: Slidev 证明了 Markdown + 代码高亮 + 主题系统的组合非常受欢迎
3. **现有 DSL 的优势**: SlideJS 的 DSL 在数据驱动场景（Quiz、Survey）中更强大，但缺少 Markdown 的简洁性
4. **用户需求**: 用户希望同时拥有 Markdown 的简洁性和 DSL 的强大功能

### 设计目标

参考 Slidev 的功能列表，实现以下功能：

1. **📝 Markdown-based**: 使用 Markdown 编写幻灯片，专注于内容
2. **🧑‍💻 Developer Friendly**: 内置代码高亮、实时编码等
3. **🎨 Themable**: 主题可以通过 npm 包共享和使用
4. **🌈 Stylish**: 通过 CSS 变量和主题系统实现样式定制
5. **🤹 Interactive**: 无缝嵌入 Web Components 和 WSX 组件
6. **🎙 Presenter Mode**: 演讲者模式（演讲者视图 + 观众视图）
7. **🎨 Drawing**: 在幻灯片上绘制和注释
8. **🧮 LaTeX**: 内置 LaTeX 数学公式支持
9. **📰 Diagrams**: 使用 Mermaid 创建图表
10. **🌟 Icons**: 直接访问任何图标集
11. **💻 Editor**: 集成编辑器或 VSCode 扩展
12. **🎥 Recording**: 内置录制和摄像头视图
13. **📤 Portable**: 导出为 PDF、PNG 或 PPTX
14. **⚡️ Fast**: 由 Vite 驱动的即时重载
15. **🛠 Hackable**: 使用 Vite 插件、Web Components 或任何 npm 包

### 核心设计原则

**所有幻灯片内容都使用 WSX 组件渲染**：

- Markdown 转换后的内容通过 WSX 组件渲染，而不是直接使用 HTML
- 创建 `markdown-slide` WSX 组件来渲染 Markdown 内容
- 确保统一的组件架构和更好的可扩展性
- 支持在 Markdown 中嵌入其他 WSX 组件

### WSX 组件架构

**关键设计决策：所有幻灯片都使用 WSX 组件渲染**

1. **转换流程**:
   ```
   Markdown (.md)
     ↓
   解析 Frontmatter + 分割幻灯片
     ↓
   Markdown → HTML（代码高亮、LaTeX、Mermaid 等）
     ↓
   生成 DSL（使用 content dynamic + markdown-slide WSX 组件）
     ↓
   编译为 SlideDSL
     ↓
   SlideEngine 生成 SlideDefinition[]
     ↓
   Runner 渲染（通过 markdown-slide WSX 组件）
     ↓
   最终渲染为 HTML（在 WSX 组件内部）
   ```

2. **WSX 组件设计**:
   - **包**: `@slidejs/markdown-slide`
   - **组件名**: `<markdown-slide>`
   - **属性**:
     - `html`: Markdown 转换后的 HTML 内容
     - `theme`: 主题名称
     - `layout`: 布局类型
     - `codeTheme`: 代码主题
   - **功能**:
     - 渲染 HTML 内容
     - 初始化代码高亮（Shiki）
     - 初始化 LaTeX 渲染（KaTeX）
     - 初始化 Mermaid 图表
     - 应用主题样式

3. **优势**:
   - ✅ 统一的组件架构（所有幻灯片都是 WSX 组件）
   - ✅ 更好的可扩展性（可以轻松添加新功能）
   - ✅ 类型安全（TypeScript 支持）
   - ✅ 复用性（组件可以在其他地方使用）
   - ✅ 测试友好（可以单独测试组件）

## 详细设计

### 核心设计：Markdown 到 Slide DSL 转换

**核心思想**: 用户使用纯 Markdown 编写幻灯片（`.md` 文件），系统自动将 Markdown 转换为 Slide DSL，然后使用现有的 DSL 系统处理。完全隐藏 DSL 语法，提供类似 Slidev 的体验。

#### 技术实现

1. **Markdown 文件格式**:
   ```markdown
   ---
   theme: default
   layout: center
   transition: slide
   ---
   
   # Welcome to SlideJS
   
   ---
   
   # Features
   
   - Support for multiple rendering engines
   - Concise DSL syntax
   - Type safe
   
   ```typescript
   const runner = createSlideRunner(dsl, context);
   runner.play();
   ```
   
   ---
   
   # Thank You!
   ```

2. **转换流程**:
   ```
   Markdown (.md)
        ↓
   解析 Frontmatter (YAML)
        ↓
   使用 `---` 分割幻灯片
        ↓
   将每个 Markdown 块转换为 DSL 的 `content text`
        ↓
   生成完整的 Slide DSL 结构
        ↓
   编译为 SlideDSL 对象
        ↓
   使用现有 DSL 系统处理（SlideEngine）
        ↓
   渲染到 Runner (Reveal.js/Swiper/Splide)
   ```

3. **转换示例**:
   
   **输入 (presentation.md)**:
   ```markdown
   ---
   theme: default
   ---
   
   # Slide 1
   
   ---
   
   # Slide 2
   ```
   
   **自动转换为 DSL**:
   ```slide
   present markdown "presentation" {
     rules {
       rule start "intro" {
         slide {
           content text {
             "# Slide 1"
           }
         }
       }
       
       rule content "slides" {
         slide {
           content text {
             "# Slide 2"
           }
         }
       }
     }
   }
   ```

4. **新包**: `@slidejs/markdown`
   - `parseMarkdown()` - 解析 Markdown 文件
   - `markdownToSlideDSL()` - 将 Markdown 转换为 Slide DSL 源代码（字符串）
   - **不需要 `createMarkdownRunner()`** - 转换后的 DSL 就是普通 DSL，直接使用现有的 `createSlideRunner()`

5. **WSX 组件**: `@slidejs/markdown-slide`
   - `MarkdownSlide` - WSX 组件，用于渲染 Markdown 内容
   - 接收 HTML 内容作为属性
   - 支持代码高亮、LaTeX、Mermaid 等扩展功能
   - 自动注册为 Web Component `<markdown-slide>`

6. **API 设计**:
   ```typescript
   // 正确的使用方式：Markdown → DSL → Runner
   import { markdownToSlideDSL } from '@slidejs/markdown';
   import { createSlideRunner } from '@slidejs/runner-revealjs';
   import type { SlideContext } from '@slidejs/context';
   
   // 1. 将 Markdown 转换为 DSL 源代码（字符串）
   const dslSource = await markdownToSlideDSL('presentation.md');
   
   // 2. 创建 Context
   const context: SlideContext = {
     sourceType: 'markdown',
     sourceId: 'presentation',
     metadata: {},
     items: [],
   };
   
   // 3. 使用现有的 createSlideRunner 运行 DSL
   const runner = await createSlideRunner(dslSource, context, {
     container: '#slides',
     revealOptions: {
       controls: true,
       progress: true,
     },
   });
   
   runner.play();
   ```
   
   **关键点**:
   - `markdownToSlideDSL()` 返回 DSL 源代码字符串
   - 转换后的 DSL 就是普通 DSL，可以使用任何 Runner（Reveal.js、Swiper、Splide）
   - 不需要单独的 `createMarkdownRunner()`，因为流程是：Markdown → DSL → Runner

#### 优点

- ✅ 完全类似 Slidev 的体验（纯 Markdown）
- ✅ 无需学习 DSL 语法
- ✅ 复用现有 DSL 系统（无需重复实现）
- ✅ 复用现有 Runner（Reveal.js, Swiper, Splide）
- ✅ 向后兼容（现有 DSL 文件继续工作）
- ✅ 开发者友好（熟悉的 Markdown 格式）

#### 缺点

- ⚠️ 纯 Markdown 模式不支持数据驱动功能（规则引擎、循环等）
- ⚠️ 需要实现 Markdown 到 DSL 的转换层
- ⚠️ 如果需要高级功能，仍需使用 DSL

## 推荐方案

**推荐：Markdown 到 Slide DSL 转换（纯 Markdown 模式）**，理由：

1. **简洁性**: 用户只需写 Markdown，无需了解 DSL
2. **复用性**: 完全复用现有 DSL 系统，无需重复实现
3. **兼容性**: 现有 DSL 文件继续工作，向后兼容
4. **渐进式**: 用户可以从 Markdown 开始，需要高级功能时使用 DSL
5. **统一性**: 最终都转换为 DSL，使用同一套系统处理

## 实施计划

### 阶段 1: Markdown 解析与转换基础（3-4 周）

1. **创建 `@slidejs/markdown-slide` WSX 组件包**:
   - 创建 `MarkdownSlide` WSX 组件
   - 组件接收 HTML 内容作为属性
   - 实现 HTML 渲染和样式应用
   - 支持代码高亮初始化（Shiki）
   - 自动注册为 Web Component `<markdown-slide>`
   
   **组件实现示例**:
   ```typescript
   /** @jsxImportSource @wsxjs/wsx-core */
   import { LightComponent, autoRegister } from '@wsxjs/wsx-core';
   
   @autoRegister({ tagName: 'markdown-slide' })
   export class MarkdownSlide extends LightComponent {
     static get observedAttributes() {
       return ['html', 'theme'];
     }
     
     protected onConnected(): void {
       this.render();
       this.initCodeHighlight();
     }
     
     private render(): void {
       const html = this.getAttribute('html') || '';
       this.innerHTML = html;
     }
     
     private async initCodeHighlight(): Promise<void> {
       // 初始化代码高亮（Shiki）
       // ...
     }
   }
   ```

2. **创建 `@slidejs/markdown` 包**:
   - 安装依赖：`markdown-it`、`shiki`、`js-yaml`（Frontmatter 解析）
   - 实现 `parseMarkdown()` - 解析 Markdown 文件
   - 实现 `parseFrontmatter()` - 解析 YAML Frontmatter
   - 实现 `splitSlides()` - 使用 `---` 分割幻灯片
   - 实现代码高亮支持（使用 `shiki`）

3. **Markdown 到 DSL 转换（详细实现 - 使用 WSX 组件）**:
   
   **转换算法（使用 WSX 组件）**:
   ```typescript
   function markdownToSlideDSL(markdown: string, options?: MarkdownOptions): string {
     // 1. 分离 Frontmatter 和内容
     const { frontmatter, content } = parseFrontmatter(markdown);
     
     // 2. 使用 `---` 分割幻灯片
     const slides = splitSlides(content);
     
     // 3. 处理每个 Markdown 块
     const slideBlocks = slides.map((slideMarkdown, index) => {
       // 3.1 解析 Markdown 为 HTML（保留代码块）
       const html = markdownToHtml(slideMarkdown, {
         highlight: frontmatter.highlight || 'shiki',
         codeTheme: frontmatter.codeTheme || 'github-dark'
       });
       
       // 3.2 将 HTML 转义为 DSL 字符串字面量
       const escapedHtml = escapeForDSL(html);
       
       // 3.3 构建 slide 块（使用 WSX 组件）
       return buildSlideBlockWithWSX(escapedHtml, {
         transition: frontmatter.transition || 'slide',
         layout: frontmatter.layout || 'default',
         theme: frontmatter.theme || 'default'
       });
     });
     
     // 4. 生成完整的 DSL 结构
     return generateDSL(slideBlocks, frontmatter);
   }
   
   function buildSlideBlockWithWSX(html: string, config: SlideConfig): string {
     // 使用 content dynamic 和 markdown-slide WSX 组件
     return `
       slide {
         content dynamic {
           name: "markdown-slide"
           attrs {
             html: "${escapedHtml}"
             theme: "${config.theme}"
             layout: "${config.layout}"
           }
         }
         behavior {
           transition ${config.transition} {
             speed: 300
           }
         }
       }
     `;
   }
   ```
   
   **转换示例**:
   
   **输入 (presentation.md)**:
   ```markdown
   ---
   theme: default
   layout: center
   transition: slide
   highlight: shiki
   codeTheme: github-dark
   ---
   
   # Welcome to SlideJS
   
   A powerful slide DSL library
   
   ---
   
   # Features
   
   - Markdown support
   - Code highlighting
   - Multiple runners
   
   ```typescript
   const runner = createSlideRunner(dsl, context);
   ```
   
   ---
   
   # Thank You!
   ```
   
   **输出 (自动生成的 DSL - 使用 WSX 组件)**:
   ```slide
   present markdown "presentation" {
     rules {
       rule start "intro" {
         slide {
           content dynamic {
             name: "markdown-slide"
             attrs {
               html: "<h1>Welcome to SlideJS</h1><p>A powerful slide DSL library</p>"
               theme: "default"
             }
           }
           behavior {
             transition slide {
               speed: 300
             }
           }
         }
       }
       
       rule content "slides" {
         slide {
           content dynamic {
             name: "markdown-slide"
             attrs {
               html: "<h1>Features</h1><ul><li>Markdown support</li><li>Code highlighting</li><li>Multiple runners</li></ul><pre><code class=\"language-typescript\">const runner = createSlideRunner(dsl, context);</code></pre>"
               theme: "default"
             }
           }
           behavior {
             transition slide {
               speed: 300
             }
           }
         }
         
         slide {
           content dynamic {
             name: "markdown-slide"
             attrs {
               html: "<h1>Thank You!</h1>"
               theme: "default"
             }
           }
           behavior {
             transition slide {
               speed: 300
             }
           }
         }
       }
     }
   }
   ```
   
   **关键变化**:
   - 使用 `content dynamic` 而不是 `content text`
   - 使用 `markdown-slide` WSX 组件渲染 Markdown HTML
   - 通过 `attrs` 传递 HTML 内容和主题配置
   
   **关键转换步骤**:
   
   1. **Frontmatter 解析**:
      ```typescript
      interface Frontmatter {
        theme?: string;
        layout?: 'default' | 'center' | 'cover';
        transition?: 'slide' | 'fade' | 'zoom' | 'none';
        highlight?: 'shiki' | 'highlight.js';
        codeTheme?: string;
        [key: string]: unknown;
      }
      ```
   
   2. **幻灯片分割**:
      - 使用 `---` 作为分隔符（前后可以有空白行）
      - 第一个块作为 `start` rule
      - 中间块作为 `content` rule
      - 最后一个块作为 `end` rule（如果有）
   
   3. **Markdown 到 HTML 转换**:
      - 使用 `markdown-it` 解析 Markdown
      - 使用 `shiki` 高亮代码块
      - 保留 HTML 结构用于渲染
   
   4. **HTML 转义**:
      - 将 HTML 字符串转义为 DSL 字符串字面量
      - 处理换行符、引号等特殊字符
   
   5. **DSL 生成（使用 WSX 组件）**:
      - 构建 `present markdown "name"` 结构
      - 生成 `rules` 块
      - **使用 `content dynamic` 和 `markdown-slide` WSX 组件**，而不是 `content text`
      - 为每个 slide 添加 `behavior` 配置（从 Frontmatter 读取）
   
   6. **WSX 组件创建**:
      - 创建 `@slidejs/markdown-slide` WSX 组件
      - 组件接收 HTML 内容作为属性
      - 组件负责渲染 HTML 并应用样式
      - 支持代码高亮、LaTeX、Mermaid 等扩展功能

3. **Frontmatter 支持（详细）**:
   
   **支持的 Frontmatter 字段**:
   ```yaml
   ---
   # 主题配置
   theme: default              # 主题名称（从 @slidejs/theme 加载）
   colorSchema: dark           # 颜色方案：dark | light | auto
   
   # 布局配置
   layout: center              # 布局：default | center | cover | intro
   
   # 过渡效果
   transition: slide           # 过渡：slide | fade | zoom | none
   transitionSpeed: fast       # 速度：fast | default | slow
   
   # 代码高亮
   highlight: shiki            # 高亮引擎：shiki | highlight.js
   codeTheme: github-dark      # 代码主题（shiki 主题名称）
   
   # Runner 配置
   runner: revealjs            # Runner：revealjs | swiper | splide
   
   # Reveal.js 特定配置
   revealjs:
     controls: true
     progress: true
     center: true
   
   # Swiper 特定配置
   swiper:
     loop: false
     slidesPerView: 1
   
   # Splide 特定配置
   splide:
     type: slide
     perPage: 1
   
   # 其他配置
   title: My Presentation      # 演示标题
   info: |                     # 演示信息（多行）
     Created with SlideJS
   ---
   ```
   
   **Frontmatter 到 DSL 配置的映射**:
   ```typescript
   function mapFrontmatterToDSLConfig(frontmatter: Frontmatter): SlideConfig {
     return {
       theme: frontmatter.theme || 'default',
       layout: frontmatter.layout || 'default',
       transition: {
         type: frontmatter.transition || 'slide',
         speed: mapTransitionSpeed(frontmatter.transitionSpeed),
       },
       runner: {
         type: frontmatter.runner || 'revealjs',
         options: {
           // 根据 runner 类型合并配置
           ...(frontmatter.revealjs || {}),
           ...(frontmatter.swiper || {}),
           ...(frontmatter.splide || {}),
         },
       },
     };
   }
   ```

4. **演示应用示例**:
   
   创建 `demos/markdown` 演示项目，展示 Frontmatter 支持：
   
   **文件结构**:
   ```
   demos/markdown/
   ├── package.json
   ├── vite.config.ts
   ├── index.html
   ├── src/
   │   ├── main.ts
   │   └── presentation.md    # Markdown 演示文件
   └── README.md
   ```
   
   **presentation.md**:
   ```markdown
   ---
   theme: default
   layout: center
   transition: slide
   highlight: shiki
   codeTheme: github-dark
   runner: revealjs
   revealjs:
     controls: true
     progress: true
   ---
   
   # Welcome to SlideJS
   
   Markdown-based presentation with Frontmatter support
   
   ---
   
   # Features
   
   - 📝 Markdown-based
   - 🧑‍💻 Developer Friendly
   - 🎨 Themable
   - 🌈 Stylish
   
   ---
   
   # Code Highlighting
   
   ```typescript
   import { markdownToSlideDSL } from '@slidejs/markdown';
   import { createSlideRunner } from '@slidejs/runner-revealjs';
   import type { SlideContext } from '@slidejs/context';
   
   const dslSource = await markdownToSlideDSL('presentation.md');
   const context: SlideContext = {
     sourceType: 'markdown',
     sourceId: 'presentation',
     metadata: {},
     items: [],
   };
   
   const runner = await createSlideRunner(dslSource, context, {
     container: '#slides',
     revealOptions: {
       controls: true,
       progress: true,
     },
   });
   
   runner.play();
   ```
   
   ---
   
   # Thank You!
   ```
   
   **src/main.ts**:
   ```typescript
   import { markdownToSlideDSL } from '@slidejs/markdown';
   import { createSlideRunner } from '@slidejs/runner-revealjs';
   import type { SlideContext } from '@slidejs/context';
   // 导入 markdown-slide WSX 组件（必须在使用前注册）
   import '@slidejs/markdown-slide';
   
   async function init() {
     const container = document.getElementById('slides');
     if (!container) {
       throw new Error('Container not found');
     }
   
     // 1. 将 Markdown 转换为 DSL 源代码
     const dslSource = await markdownToSlideDSL('src/presentation.md');
   
     // 2. 创建 Context
     const context: SlideContext = {
       sourceType: 'markdown',
       sourceId: 'presentation',
       metadata: {},
       items: [],
     };
   
     // 3. 使用现有的 createSlideRunner 运行 DSL
     const runner = await createSlideRunner(dslSource, context, {
       container: '#slides',
       revealOptions: {
         controls: true,
         progress: true,
       },
     });
   
     runner.play();
   }
   
   init().catch(console.error);
   ```

5. **测试**:
   - 单元测试覆盖基本 Markdown 语法
   - 测试代码高亮
   - 测试 Frontmatter 解析
   - 测试幻灯片分割
   - 测试 DSL 转换正确性（确保使用 WSX 组件）
   - 测试 Frontmatter 配置映射
   - 测试 WSX 组件渲染

### 阶段 2: Runner 集成（2-3 周）

1. **Frontmatter 配置映射**:
   - 将 Frontmatter 配置映射到 DSL 的 `config` 块
   - 支持主题、布局、过渡等配置
   - 配置会转换为 DSL 的 `config` 和 `behavior` 块
   - **不需要单独的配置映射函数，因为配置已经包含在 DSL 中**

2. **使用现有 Runner**:
   - Markdown 转换后的 DSL 就是普通 DSL
   - 直接使用现有的 `createSlideRunner()` 从各个 runner 包
   - 支持所有现有 Runner（Reveal.js, Swiper, Splide）
   - **确保 `markdown-slide` WSX 组件在使用前已注册**

3. **CLI 工具**:
   - 添加 `slidejs dev` 命令支持 `.md` 文件
   - 添加 `slidejs build` 命令支持 Markdown
   - 自动检测文件类型（`.slide` vs `.md`）
   - **自动导入 `markdown-slide` WSX 组件**

### 阶段 3: 高级功能（3-4 周）

1. **演讲者模式**:
   - 实现演讲者视图（当前幻灯片 + 下一张 + 备注）
   - 实现观众视图（仅当前幻灯片）
   - 支持双屏显示

2. **PDF 导出**:
   - 使用 `puppeteer` 或 `playwright` 渲染幻灯片
   - 支持自定义页面大小和边距
   - 支持多页导出

3. **主题增强**:
   - 为 Markdown 内容添加专用主题
   - 支持代码块主题（如 GitHub、Monokai）
   - 支持自定义 CSS

4. **开发工具**:
   - VSCode 扩展支持 Markdown 预览
   - 语法高亮
   - 自动补全

### 阶段 4: 文档和示例（1-2 周）

1. **文档**:
   - 更新 DSL 文档，添加 Markdown 支持说明
   - 创建 Markdown 使用指南
   - 创建迁移指南（从 Slidev 迁移）

2. **示例**:
   - 创建 Markdown 示例项目
   - 创建从 Slidev 迁移的示例
   - 创建演讲者模式示例
   - 展示 Markdown 和 DSL 的对比

3. **演示应用（Markdown 到 DSL 转换器）**:
   
   创建 `demos/markdown` 演示应用，展示 Markdown 到 DSL 的转换过程：
   
   **布局设计**:
   ```
   ┌─────────────────────────────────────────────────────────┐
   │  Theme Toolbar                                          │
   ├──────────────┬──────────────────────────────────────────┤
   │              │  ┌────────────────────────────────────┐  │
   │  Markdown     │  │  Slide Preview (Reveal.js)        │  │
   │  Editor       │  └────────────────────────────────────┘  │
   │  (Monaco)     │  ┌────────────────────────────────────┐  │
   │              │  │  Generated DSL (Monaco)            │  │
   │              │  └────────────────────────────────────┘  │
   └──────────────┴──────────────────────────────────────────┘
   ```
   
   **功能**:
   - 左侧：Markdown 编辑器（Monaco Editor，支持 Markdown 语法高亮）
   - 右侧顶部：幻灯片预览（使用 Reveal.js Runner）
   - 右侧底部：生成的 DSL（Monaco Editor，只读，显示转换后的 DSL）
   - 实时转换：Markdown 编辑时自动转换为 DSL 并更新预览
   - 垂直分割器：调整 Markdown 编辑器和右侧面板的大小
   - 水平分割器：调整幻灯片预览和 DSL 显示的大小
   
   **文件结构**:
   ```
   demos/markdown/
   ├── package.json
   ├── vite.config.ts
   ├── tsconfig.json
   ├── index.html
   ├── src/
   │   ├── main.ts
   │   ├── App.vue
   │   ├── style.css
   │   ├── presentation.md          # 示例 Markdown 文件
   │   └── env.d.ts
   └── README.md
   ```

## 技术细节

### Markdown 解析器选择

**推荐使用 `markdown-it` + `shiki`**:

- `markdown-it`: 功能强大，插件生态丰富
- `shiki`: 代码高亮质量高，支持多种主题，基于 VS Code 的 TextMate 语法

### Frontmatter 格式

```yaml
---
theme: default
layout: center
transition: slide
highlight: shiki
codeTheme: github-dark
---
```

### 幻灯片分隔符

使用 `---` 作为幻灯片分隔符（与 Slidev 一致）：

```markdown
# Slide 1

---

# Slide 2
```

### 代码高亮

支持所有常见语言，使用 `shiki` 提供高质量高亮：

````markdown
```typescript
const runner = createSlideRunner(dsl, context);
```
````

## 兼容性考虑

1. **现有 DSL**: 完全向后兼容，不影响现有功能
2. **Runner**: 所有现有 Runner 自动支持 Markdown（因为转换为 WSX 组件，然后渲染为 HTML）
3. **主题**: 现有主题系统可以扩展支持 Markdown 样式
4. **WSX 组件**: 所有幻灯片内容都通过 WSX 组件渲染，确保统一的组件架构
5. **Web Components**: `markdown-slide` WSX 组件编译为标准 Web Component，兼容所有 Runner

## 风险评估

1. **复杂度**: 实施复杂度中等，需要新增两个包
2. **维护成本**: 需要维护 Markdown 解析和转换逻辑
3. **性能**: Markdown 解析和代码高亮可能有性能开销，需要优化

## 后续扩展

1. **Slidev 兼容性**: 考虑支持 Slidev 的特定语法（如 `v-click`、`v-motion`）
2. **Mermaid 图表**: 支持 Mermaid 图表渲染（通过 WSX 组件）
3. **LaTeX 数学公式**: 支持 LaTeX 数学公式渲染（通过 WSX 组件）
4. **自定义组件**: 在 Markdown 中嵌入自定义 WSX 组件
5. **WSX 组件生态**: 建立 WSX 组件库，提供更多幻灯片组件

## 参考

- [Slidev 官方文档](https://sli.dev/)
- [Markdown-it 文档](https://github.com/markdown-it/markdown-it)
- [Shiki 文档](https://shiki.matsu.io/)
- [Reveal.js Markdown 插件](https://revealjs.com/markdown/)

## 决策记录

- **2025-01-XX**: 创建 RFC，开始讨论
- **2025-01-XX**: **决策：采用 Markdown 到 Slide DSL 转换方案**（纯 Markdown 模式）
  - 用户写 Markdown → 自动转换为 DSL → 使用现有 DSL 系统处理
  - 不采用 DSL 包含 Markdown 的方案
  - 完全复用现有 DSL 和 Runner 系统
- **2025-01-XX**: **关键决策：所有幻灯片内容都使用 WSX 组件渲染**
  - Markdown 转换后使用 `content dynamic` 和 `markdown-slide` WSX 组件
  - 不使用 `content text` 直接渲染 HTML
  - 确保统一的组件架构和更好的可扩展性
  - 所有幻灯片通过 WSX 组件渲染，保持架构一致性
- **待定**: 开始实施
