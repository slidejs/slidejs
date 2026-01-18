# RFC 0022: 网站结构改进与功能增强

## 元数据

- **RFC ID**: 0022
- **标题**: 网站结构改进与功能增强
- **状态**: 草案
- **创建日期**: 2025-01-XX
- **最后更新**: 2025-01-XX
- **作者**: AI Assistant (Jeremy Howard Persona)
- **相关 RFC**: 
  - RFC 0012 (Beta 发布文档准备)
  - RFC 0021 (集成编辑器)
  - [推广计划](../PROMOTION-PLAN.md)

## 摘要

本 RFC 分析了当前 SlideJS 官方网站的结构，识别了缺失的关键功能和改进机会，并提出了系统性的改进方案。改进将显著提升用户体验、降低学习门槛，并促进社区参与。

## 当前网站结构分析

### 现有页面

1. **HomePage** (`/`)
   - Hero 区域（标题、副标题、CTA 按钮）
   - 核心特性展示（6 个特性卡片）
   - 开箱即用功能列表
   - 快速开始代码示例
   - 由我们构建，由您设计部分

2. **FeaturesPage** (`/features`)
   - 功能特性详细说明
   - 对比表格
   - CTA 区域

3. **DemosPage** (`/demos`)
   - Demo 列表展示（Vue、React、Svelte、Vanilla）
   - 每个 Demo 包含框架信息、描述、链接

4. **DocsPage** (`/docs/:category/:page`)
   - 使用 wsx-press 的文档布局
   - 支持多级文档结构

### 现有路由

```typescript
// 当前路由配置
/                          → HomePage
/features                  → FeaturesPage
/demos                     → DemosPage
/docs/:category/:page      → DocsPage
```

### 现有功能

- ✅ 多语言支持（中英文）
- ✅ 响应式设计
- ✅ 文档系统（基于 wsx-press）
- ✅ Demo 展示
- ✅ 特性展示

## 缺失的关键功能

### 1. 用户引导与快速上手

**问题**：
- 首页缺少醒目的"5 分钟快速上手"入口
- 没有交互式教程页面
- 用户需要自己探索如何开始

**影响**：
- 学习门槛高
- 用户流失率高
- 无法快速验证产品价值

### 2. 案例库（Gallery）

**问题**：
- 缺少真实应用案例展示
- 用户无法看到 Slide DSL 的实际应用场景
- 没有案例库页面

**影响**：
- 用户难以理解产品价值
- 缺少学习参考
- 无法建立用户信心

### 3. 模板库

**问题**：
- 没有预设模板提供
- 用户需要从零开始编写 DSL
- 缺少常用场景的模板

**影响**：
- 使用门槛高
- 开发效率低
- 用户需要重复造轮子

### 4. 搜索功能

**问题**：
- 文档系统缺少搜索功能
- 用户难以快速找到需要的信息
- 案例库和模板库缺少搜索

**影响**：
- 信息发现困难
- 用户体验差
- 内容利用率低

### 5. 社区展示

**问题**：
- 没有社区作品展示页面
- 缺少"每周一例"功能
- 无法展示用户贡献

**影响**：
- 社区参与度低
- 缺少自传播机制
- 无法形成社区文化

### 6. 内容系统

**问题**：
- 没有博客/文章系统
- 缺少教程和案例故事
- 无法发布更新和公告

**影响**：
- 内容营销困难
- SEO 优化受限
- 无法建立思想领导力

### 7. 导航增强

**问题**：
- 文档页面缺少面包屑导航
- 缺少相关文档推荐
- 缺少文档目录导航

**影响**：
- 导航体验差
- 内容发现困难
- 用户容易迷失

### 8. 404 页面

**问题**：
- 虽然有 404 处理脚本，但可能缺少友好的 404 页面
- 用户访问错误链接时体验差

**影响**：
- 用户体验差
- 可能造成用户流失

## 改进方案

### Phase 1: 核心用户体验改进（最高优先级）

#### 1.1 创建"5 分钟快速上手"页面

**路由**: `/quickstart`

**功能要求**：
- 集成 Monaco Editor（DSL 编辑器）
- 实时预览功能（使用 reveal.js runner）
- 3 个预设模板切换
- 代码复制和下载功能
- 响应式设计

**预设模板内容**：

**模板 1：简单欢迎页**
```slide
present quiz "welcome" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "# Welcome to Slide DSL"
          "## Create beautiful slides with ease"
        }
        behavior {
          transition fade {}
        }
      }
    }
  }
}
```

**模板 2：Quiz 演示**
```slide
present quiz "my-quiz" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "# Quiz Presentation"
          "## Let's get started!"
        }
      }
    }
    rule content "questions" {
      slide {
        content text {
          "# Question"
          "This is a sample question slide"
        }
      }
    }
    rule end "thanks" {
      slide {
        content text {
          "# Thank You!"
        }
      }
    }
  }
}
```

**模板 3：产品介绍**
```slide
present quiz "product" {
  rules {
    rule start "intro" {
      slide {
        content text {
          "# Product Introduction"
          "## Showcase your product"
        }
      }
    }
    rule content "features" {
      slide {
        content text {
          "# Features"
          "- Feature 1"
          "- Feature 2"
          "- Feature 3"
        }
      }
    }
  }
}
```

**实施步骤**：
1. 创建 `QuickStartPage.wsx` 组件
2. 参考现有 demo 实现编辑器集成
3. 创建预设模板数据（包含上述 3 个模板）
4. 添加路由配置
5. 在首页添加入口

**优先级**: 🔥 最高

---

#### 1.2 创建案例库（Gallery）页面

**路由**: `/gallery`

**功能要求**：
- 案例列表展示（卡片布局）
- 分类筛选（教育/商业/技术/创意）
- 搜索功能
- 案例详情页面
- "在编辑器中打开"功能

**初始案例清单**（至少 5 个）：

1. **教育场景 - Quiz 演示**
   - 标题：从 Quiz 数据生成演示
   - 场景：教师需要将 Quiz 题目转换为演示文稿，用于课堂展示
   - 分类：education
   - 包含完整的 Quiz 演示 DSL 源码

2. **企业培训 - 产品介绍**
   - 标题：产品介绍演示
   - 场景：销售团队需要快速创建产品介绍
   - 分类：business
   - 包含动态内容的产品介绍 DSL

3. **技术分享 - API 文档**
   - 标题：API 文档演示
   - 场景：开发者需要展示 API 文档
   - 分类：technical
   - 技术文档风格的 DSL

4. **数据展示 - 调查报告**
   - 标题：调查报告演示
   - 场景：数据分析师需要展示调查结果
   - 分类：business
   - 数据展示风格的 DSL

5. **创意展示 - 作品集**
   - 标题：作品集演示
   - 场景：设计师需要展示作品
   - 分类：creative
   - 创意风格的 DSL

**实施步骤**：
1. 创建 `GalleryPage.wsx` 组件
2. 创建案例数据结构（JSON）
3. 创建上述 5 个初始案例（包含完整 DSL 源码）
4. 实现分类和搜索功能
5. 创建案例详情页面

**优先级**: 🔥 最高

---

#### 1.3 优化首页 Hero 区域

**改进内容**：
- 添加醒目的"5 分钟快速上手"按钮（主要 CTA）
- 添加"查看案例库"按钮（次要 CTA）
- 优化文案，强调"快速"和"实用"
- 添加统计数据（可选）

**优先级**: 🔥 高

---

### Phase 2: 内容与模板系统（高优先级）

#### 2.1 创建模板库页面

**路由**: `/templates`

**功能要求**：
- 模板列表展示
- 分类筛选
- 搜索功能
- 模板详情（包含 DSL 源码、使用说明、预览）
- 一键复制和下载功能

**模板分类**：
- 教育类：Quiz 演示、课程大纲、学习笔记
- 商业类：产品介绍、项目提案、年度报告
- 技术类：API 文档、技术分享、架构说明
- 创意类：作品集、故事展示、活动介绍

**优先级**: 🔥 高

---

#### 2.2 创建博客/文章系统

**路由**: `/blog` 或 `/articles`

**功能要求**：
- 文章列表页面
- 文章详情页面
- 分类和标签
- 搜索功能
- RSS 支持（可选）

**内容类型**：
- 教程文章
- 案例故事
- 技术深度文章
- 更新公告

**初始文章规划**（2-3 篇）：

1. **"如何用 Slide DSL 在 10 分钟内将 Quiz 数据转换为演示"**
   - 类型：案例故事
   - 内容结构：
     - 问题描述
     - 解决方案
     - 完整代码示例
     - 效果展示
   - 发布平台：项目博客、Dev.to、Medium、掘金

2. **"教育工作者如何使用 Slide DSL 创建互动课程"**
   - 类型：案例故事
   - 内容结构：同上
   - 发布平台：同上

3. **"开发者如何用 DSL 替代传统 PPT 工具"**
   - 类型：技术深度文章
   - 内容结构：同上
   - 发布平台：同上

**优先级**: 🟡 中

---

#### 2.3 视频内容集成

**功能要求**：
- 在网站首页和文档中集成视频教程链接
- 支持 YouTube/Bilibili 嵌入
- 视频播放器组件
- 视频列表页面（可选）

**视频教程计划**（第 1 集）：
- 时长：5-8 分钟
- 内容大纲：
  - 0-1 分钟：介绍 Slide DSL 是什么
  - 1-3 分钟：创建第一个简单幻灯片
  - 3-5 分钟：使用模板创建 Quiz 演示
  - 5-8 分钟：自定义内容和样式
- 平台：YouTube、Bilibili
- 字幕：中英文字幕

**实施步骤**：
1. 录制视频教程
2. 上传到视频平台
3. 在网站添加视频嵌入组件
4. 在首页和文档页面添加视频链接

**优先级**: 🟡 中

---

### Phase 3: 导航与搜索增强（中优先级）

#### 3.1 文档系统搜索功能

**功能要求**：
- 全文搜索
- 搜索结果高亮
- 搜索建议
- 快捷键支持（Cmd/Ctrl + K）

**实施方式**：
- 使用 wsx-press 的搜索功能（如果支持）
- 或集成第三方搜索库（如 Algolia、Fuse.js）

**优先级**: 🟡 中

---

#### 3.2 文档导航增强

**功能要求**：
- 面包屑导航
- 文档目录（TOC）
- 相关文档推荐
- 上一篇/下一篇导航

**实施方式**：
- 扩展 `DocsPage.wsx` 组件
- 使用 wsx-press 的导航功能（如果支持）

**优先级**: 🟡 中

---

#### 3.3 全局搜索功能

**功能要求**：
- 全局搜索入口（导航栏）
- 搜索所有内容（文档、案例、模板、博客）
- 搜索结果分类展示
- 快捷键支持

**优先级**: 🟡 中

---

### Phase 4: 社区功能（中优先级）

#### 4.1 社区作品展示页面

**路由**: `/community` 或 `/showcase`

**功能要求**：
- 社区作品列表
- 筛选和搜索
- 作品详情页面
- 提交作品功能（GitHub Issues 或表单）

**优先级**: 🟡 中

---

#### 4.2 社区展示与挑战赛

**4.2.1 "每周一例"功能**

**功能要求**：
- 在首页或社区页面展示每周精选案例
- 自动或手动更新
- 案例作者信息
- 分享功能

**展示格式**：
```markdown
## 本周精选案例

**标题**：[案例名称]  
**作者**：@username  
**场景**：教育/商业/技术  
**亮点**：使用 Slide DSL 解决了什么问题  
**查看**：[链接]  
**DSL 源码**：[链接]
```

**4.2.2 "Slide DSL 挑战赛"功能**

**功能要求**：
- 挑战赛页面
- 每月一个主题（如"用 DSL 展示你的项目"）
- 作品提交功能（GitHub Issues 或表单）
- 评审机制
- 奖项系统（GitHub Star、社区徽章、小礼品等）
- 优秀作品收录到案例库

**实施步骤**：
1. 设计挑战赛规则和流程
2. 创建挑战赛页面组件
3. 实现作品提交功能
4. 建立评审机制
5. 在社交媒体宣传

**优先级**: 🟡 中（挑战赛）、🟢 低（每周一例）

---

### Phase 5: 用户体验优化（低优先级）

#### 5.1 友好的 404 页面

**路由**: `/404` 或自动处理

**功能要求**：
- 友好的错误提示
- 推荐链接（首页、文档、案例库）
- 搜索功能（可选）

**优先级**: 🟢 低

---

#### 5.2 页面加载优化

**功能要求**：
- 代码分割
- 懒加载
- 预加载关键资源
- 性能监控

**优先级**: 🟢 低

---

#### 5.3 SEO 优化增强

**功能要求**：
- 结构化数据（Schema.org）
- Open Graph 标签
- Twitter Card 支持
- 更好的 sitemap.xml

**优先级**: 🟢 低

---

## 实施计划

### 第 1 周：核心用户体验改进

- [ ] 创建 QuickStartPage 组件
- [ ] 创建 GalleryPage 组件
- [ ] 优化首页 Hero 区域
- [ ] 添加路由配置
- [ ] 创建初始案例数据（至少 5 个）

**目标**：用户能在 5 分钟内创建第一个幻灯片

---

### 第 2 周：内容与模板系统

- [ ] 创建模板库页面
- [ ] 创建至少 10 个模板（包含快速上手页面的 3 个预设模板）
- [ ] 实现模板分类和搜索
- [ ] 创建博客系统基础结构（可选）
- [ ] 录制视频教程（第 1 集）
- [ ] 在网站集成视频内容

**目标**：提供丰富的模板和内容资源

---

### 第 3 周：导航与搜索增强

- [ ] 实现文档搜索功能
- [ ] 添加文档导航增强（面包屑、目录等）
- [ ] 实现全局搜索功能

**目标**：提升信息发现和导航体验

---

### 第 4 周：社区功能

- [ ] 创建社区展示页面
- [ ] 实现"每周一例"功能
- [ ] 创建挑战赛页面和功能
- [ ] 添加作品提交功能
- [ ] 建立评审机制

**目标**：建立社区参与机制

---

### 持续优化

- [ ] 创建友好的 404 页面
- [ ] 页面加载优化
- [ ] SEO 优化增强
- [ ] 根据用户反馈持续改进

---

## 技术实现要点

### 组件结构

```
site/src/components/pages/
├── HomePage.wsx              # 现有
├── FeaturesPage.wsx          # 现有
├── DemosPage.wsx             # 现有
├── DocsPage.wsx              # 现有
├── QuickStartPage.wsx        # 🆕 新增
├── GalleryPage.wsx           # 🆕 新增
├── GalleryDetailPage.wsx     # 🆕 新增
├── TemplatesPage.wsx         # 🆕 新增
├── TemplateDetailPage.wsx    # 🆕 新增
├── BlogPage.wsx              # 🆕 新增（可选）
├── BlogDetailPage.wsx        # 🆕 新增（可选）
├── CommunityPage.wsx         # 🆕 新增（可选）
└── NotFoundPage.wsx          # 🆕 新增（可选）
```

### 数据文件结构

```
site/public/
├── templates/                # 🆕 模板文件
│   ├── quickstart/          # 快速上手页面的 3 个预设模板
│   │   ├── welcome.slide
│   │   ├── quiz.slide
│   │   └── product.slide
│   ├── education/
│   │   ├── quiz-presentation/
│   │   │   ├── template.slide
│   │   │   └── README.md
│   │   └── course-outline/
│   ├── business/
│   │   ├── product-intro/
│   │   └── project-proposal/
│   ├── technical/
│   │   ├── api-docs/
│   │   └── tech-sharing/
│   └── creative/
│       └── portfolio/
├── gallery/                  # 🆕 案例数据
│   ├── cases.json           # 案例列表数据
│   └── previews/             # 案例预览图
│       ├── quiz-demo.png
│       ├── product-intro.png
│       └── ...
└── blog/                     # 🆕 博客文章（可选）
    └── posts/
        ├── 2025-01-XX-quiz-to-presentation.md
        └── ...
```

### 数据结构示例

**案例数据结构** (`site/public/gallery/cases.json`):
```json
{
  "cases": [
    {
      "id": "quiz-demo",
      "title": "从 Quiz 数据生成演示",
      "description": "展示如何将 Quiz 题目转换为演示文稿",
      "category": "education",
      "scenario": "教师需要将 Quiz 题目转换为演示文稿，用于课堂展示",
      "previewImage": "/gallery/previews/quiz-demo.png",
      "dslSource": "present quiz \"my-quiz\" { ... }",
      "tags": ["quiz", "education", "tutorial"],
      "author": "SlideJS Team",
      "createdAt": "2025-01-XX",
      "featured": true
    }
  ]
}
```

**模板数据结构** (`site/public/templates/quickstart/templates.json`):
```json
{
  "templates": [
    {
      "id": "welcome",
      "name": "简单欢迎页",
      "description": "最基础的欢迎页面模板",
      "dslSource": "present quiz \"welcome\" { ... }",
      "category": "quickstart"
    },
    {
      "id": "quiz",
      "name": "Quiz 演示",
      "description": "包含 start、content、end 规则的完整 Quiz 演示",
      "dslSource": "present quiz \"my-quiz\" { ... }",
      "category": "quickstart"
    },
    {
      "id": "product",
      "name": "产品介绍",
      "description": "产品介绍演示模板",
      "dslSource": "present quiz \"product\" { ... }",
      "category": "quickstart"
    }
  ]
}
```

### 路由配置

**在 `site/src/App.wsx` 中添加路由**:

```typescript
<wsx-router mode="hash">
  {/* 现有路由 */}
  <wsx-view route="/" component="home-page"></wsx-view>
  <wsx-view route="/features" component="features-page"></wsx-view>
  <wsx-view route="/demos" component="demos-page"></wsx-view>
  <wsx-view route="/docs/:category/:page" component="docs-page"></wsx-view>
  
  {/* 新增路由 */}
  <wsx-view route="/quickstart" component="quick-start-page"></wsx-view>
  <wsx-view route="/gallery" component="gallery-page"></wsx-view>
  <wsx-view route="/gallery/:id" component="gallery-detail-page"></wsx-view>
  <wsx-view route="/templates" component="templates-page"></wsx-view>
  <wsx-view route="/templates/:id" component="template-detail-page"></wsx-view>
  <wsx-view route="/blog" component="blog-page"></wsx-view>
  <wsx-view route="/blog/:slug" component="blog-detail-page"></wsx-view>
  <wsx-view route="/community" component="community-page"></wsx-view>
  <wsx-view route="/404" component="not-found-page"></wsx-view>
</wsx-router>
```

### 国际化支持

**需要添加的 i18n 键** (`site/public/locales/*/common.json`):

```json
{
  "quickStart": "快速上手",
  "gallery": "案例库",
  "templates": "模板库",
  "blog": "博客",
  "community": "社区",
  "weeklyShowcase": "每周一例",
  "challenge": "挑战赛",
  "viewCase": "查看案例",
  "openInEditor": "在编辑器中打开",
  "copyCode": "复制代码",
  "downloadSlide": "下载 .slide 文件"
}
```

---

## 成功指标（KPI）

### 短期指标（1 个月内）

- [ ] QuickStartPage 访问量 > 1000
- [ ] GalleryPage 访问量 > 500
- [ ] 用户创建的幻灯片数量 > 100
- [ ] 模板下载量 > 200

### 中期指标（3 个月内）

- [ ] 案例库案例数量 > 20
- [ ] 模板库模板数量 > 30
- [ ] 社区提交的作品 > 10
- [ ] 博客文章阅读量 > 5000

### 长期指标（6 个月内）

- [ ] 活跃用户数 > 500
- [ ] 社区贡献者 > 10
- [ ] 搜索功能使用率 > 30%
- [ ] 用户留存率 > 40%

---

## 风险评估

### 技术风险

1. **Monaco Editor 集成复杂度**
   - 风险等级: 中
   - 缓解: 参考现有 demo 实现，复用代码

2. **搜索功能性能**
   - 风险等级: 低
   - 缓解: 使用成熟的搜索库，实现索引优化

3. **内容管理复杂度**
   - 风险等级: 低
   - 缓解: 使用 JSON 文件管理，后续可迁移到 CMS

### 维护风险

1. **内容更新成本**
   - 风险等级: 中
   - 缓解: 建立内容贡献流程，鼓励社区贡献

2. **功能维护负担**
   - 风险等级: 低
   - 缓解: 优先实施高价值功能，低优先级功能可延后

---

## 替代方案

### 方案 A: 最小化实施（仅核心功能）

只实施 Phase 1 的核心功能：
- QuickStartPage
- GalleryPage
- 首页优化

**优点**: 快速见效，降低风险  
**缺点**: 功能不完整，用户体验受限

**选择**: 不推荐，但可以作为 MVP 版本

---

### 方案 B: 分阶段实施（推荐）

按照本 RFC 的 Phase 1-5 分阶段实施，优先高优先级功能。

**优点**: 平衡功能完整性和实施风险  
**缺点**: 实施周期较长

**选择**: ✅ 推荐方案

---

### 方案 C: 使用第三方服务

使用第三方服务提供部分功能：
- 使用 CodeSandbox 提供在线编辑器
- 使用 GitHub Discussions 作为社区功能
- 使用 Algolia 提供搜索功能

**优点**: 快速实施，降低开发成本  
**缺点**: 依赖第三方，定制化受限

**选择**: 可作为部分功能的替代方案

---

## 参考资源

- [推广计划](../PROMOTION-PLAN.md) - 详细的推广策略
- [执行清单](../PROMOTION-TODO.md) - 具体的实施任务
- [RFC 0021: 集成编辑器](./0021-integrated-editor.md) - Monaco Editor 集成参考
- [RFC 0012: Beta 发布文档准备](./0012-beta-documentation.md) - 文档系统参考

---

## 变更历史

- 2025-01-XX: 初始草案创建
- 2025-01-XX: 整合推广计划中的缺失内容（预设模板、初始案例、视频集成、挑战赛功能）
- 2025-01-XX: 补充技术实现细节（数据结构、路由配置、国际化支持）

---

## 待讨论问题

1. 博客系统是否必要？是否可以用 GitHub Discussions 替代？
2. 搜索功能是否应该使用第三方服务（如 Algolia）？
3. 社区功能是否应该集成到 GitHub 或使用独立系统？
4. 模板库是否应该支持用户提交？
5. 是否需要用户认证系统来支持用户作品提交？

---

## 实施检查清单

### Phase 1 检查清单

- [ ] QuickStartPage 组件创建完成
  - [ ] Monaco Editor 集成
  - [ ] 实时预览功能
  - [ ] 3 个预设模板数据
  - [ ] 模板切换功能
  - [ ] 代码复制和下载功能
  - [ ] 响应式设计测试

- [ ] GalleryPage 组件创建完成
  - [ ] 案例列表展示
  - [ ] 分类筛选功能
  - [ ] 搜索功能
  - [ ] 案例详情页面
  - [ ] "在编辑器中打开"功能

- [ ] 初始案例数据创建完成
  - [ ] 5 个案例的完整 DSL 源码
  - [ ] 案例预览图
  - [ ] 案例元数据（标题、描述、场景等）

- [ ] 首页优化完成
  - [ ] "5 分钟快速上手"按钮
  - [ ] "查看案例库"按钮
  - [ ] 文案优化
  - [ ] 路由配置

### Phase 2 检查清单

- [ ] 模板库页面创建完成
- [ ] 至少 10 个模板创建完成
- [ ] 视频教程录制完成
- [ ] 视频内容集成完成
- [ ] 博客系统基础结构创建完成（可选）

### Phase 3-5 检查清单

- [ ] 搜索功能实现
- [ ] 导航增强完成
- [ ] 社区功能完成
- [ ] 404 页面创建完成
- [ ] 性能优化完成
- [ ] SEO 优化完成

---

**状态**: 草案  
**下一步**: 
1. 团队讨论和反馈
2. 根据反馈修订 RFC
3. 批准后开始 Phase 1 实施
