# Slide DSL 推广 - 立即执行清单

> **快速开始指南** - 按照优先级顺序执行，每个任务都有明确的完成标准

## 🚀 第 1 优先级：5 分钟快速上手页面

### 任务 1.1：创建 QuickStartPage 组件

**文件路径**：`site/src/components/pages/QuickStartPage.wsx`

**参考实现**：
- 参考 `demos/vue/src/App.vue` 的编辑器实现
- 参考 `demos/react/src/App.tsx` 的布局结构

**功能要求**：
- [ ] 集成 Monaco Editor（DSL 编辑器）
- [ ] 集成实时预览（使用 reveal.js runner）
- [ ] 提供 3 个预设模板切换
- [ ] 添加"复制代码"按钮
- [ ] 添加"下载 .slide 文件"按钮
- [ ] 响应式设计（支持移动端）

**完成标准**：
- 用户能在页面上编辑 DSL 并实时看到预览
- 页面加载时间 < 3 秒
- 支持模板切换

**预计时间**：2-3 天

---

### 任务 1.2：创建预设模板

**文件路径**：`site/public/templates/quickstart/`

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

**完成标准**：
- 3 个模板都能正常渲染
- 每个模板都有清晰的注释说明

**预计时间**：0.5 天

---

### 任务 1.3：添加路由和导航

**文件路径**：
- `site/src/router/` - 添加路由配置
- `site/src/components/pages/HomePage.wsx` - 添加入口按钮

**具体任务**：
- [ ] 在路由中添加 `/quickstart` 路由
- [ ] 在首页 Hero 区域添加"5 分钟快速上手"按钮
- [ ] 在导航菜单中添加"快速上手"链接

**完成标准**：
- 可以从首页直接访问快速上手页面
- 路由正常工作

**预计时间**：0.5 天

---

## 🎨 第 2 优先级：案例库页面

### 任务 2.1：创建 GalleryPage 组件

**文件路径**：`site/src/components/pages/GalleryPage.wsx`

**功能要求**：
- [ ] 展示案例列表（卡片布局）
- [ ] 支持分类筛选（教育/商业/技术/创意）
- [ ] 支持搜索功能
- [ ] 每个案例卡片包含：
  - 标题和描述
  - 预览图
  - 使用场景
  - "查看详情"按钮
  - "在编辑器中打开"按钮

**完成标准**：
- 页面布局美观
- 筛选和搜索功能正常
- 响应式设计

**预计时间**：2 天

---

### 任务 2.2：创建初始案例数据

**文件路径**：`site/public/gallery/cases.json`

**需要创建的案例**（至少 5 个）：

1. **教育场景 - Quiz 演示**
   - 标题：从 Quiz 数据生成演示
   - 场景：教师需要将 Quiz 题目转换为演示文稿
   - DSL 源码：完整的 Quiz 演示 DSL

2. **企业培训 - 产品介绍**
   - 标题：产品介绍演示
   - 场景：销售团队需要快速创建产品介绍
   - DSL 源码：包含动态内容的产品介绍 DSL

3. **技术分享 - API 文档**
   - 标题：API 文档演示
   - 场景：开发者需要展示 API 文档
   - DSL 源码：技术文档风格的 DSL

4. **数据展示 - 调查报告**
   - 标题：调查报告演示
   - 场景：数据分析师需要展示调查结果
   - DSL 源码：数据展示风格的 DSL

5. **创意展示 - 作品集**
   - 标题：作品集演示
   - 场景：设计师需要展示作品
   - DSL 源码：创意风格的 DSL

**数据结构**：
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
      "dslSource": "...",
      "tags": ["quiz", "education", "tutorial"],
      "author": "SlideJS Team"
    }
  ]
}
```

**完成标准**：
- 至少 5 个完整案例
- 每个案例都有完整的 DSL 源码
- 数据结构规范

**预计时间**：1-2 天

---

### 任务 2.3：添加案例详情页面

**文件路径**：`site/src/components/pages/GalleryDetailPage.wsx`

**功能要求**：
- [ ] 显示案例完整信息
- [ ] 显示 DSL 源码（可复制）
- [ ] 提供"在编辑器中打开"功能
- [ ] 显示使用场景和说明
- [ ] 相关案例推荐

**完成标准**：
- 详情页面信息完整
- 可以复制 DSL 代码
- 可以跳转到编辑器

**预计时间**：1 天

---

## 🏠 第 3 优先级：优化首页

### 任务 3.1：优化首页 Hero 区域

**文件路径**：`site/src/components/pages/HomePage.wsx`

**具体修改**：
- [ ] 添加醒目的"5 分钟快速上手"按钮（主要 CTA）
- [ ] 添加"查看案例库"按钮（次要 CTA）
- [ ] 优化 Hero 文案，强调"快速"和"实用"
- [ ] 添加统计数据（可选）

**文案建议**：
```markdown
主标题：用 DSL 创建幻灯片，5 分钟上手
副标题：从 Quiz 数据到演示，只需一个 DSL 文件。无需复杂配置，开箱即用。
按钮 1：5 分钟快速上手（主要）
按钮 2：查看案例库（次要）
```

**完成标准**：
- 按钮醒目，易于点击
- 文案清晰，突出价值
- 响应式设计

**预计时间**：0.5 天

---

### 任务 3.2：添加"为什么选择 Slide DSL"部分

**文件路径**：`site/src/components/pages/HomePage.wsx`

**内容要点**：
- 5 分钟上手（快速）
- 数据源无关（灵活）
- 类型安全（可靠）
- 多种渲染引擎（兼容）

**完成标准**：
- 内容清晰，突出优势
- 布局美观

**预计时间**：0.5 天

---

## 📋 执行检查清单

### 第 1 周完成目标

- [ ] QuickStartPage 组件完成
- [ ] 3 个预设模板创建完成
- [ ] 路由和导航配置完成
- [ ] GalleryPage 组件完成
- [ ] 至少 5 个案例数据创建完成
- [ ] 首页优化完成

### 验证标准

- [ ] 所有页面可以正常访问
- [ ] 快速上手页面功能正常
- [ ] 案例库页面展示正常
- [ ] 移动端体验良好
- [ ] 页面加载速度 < 3 秒

---

## 🚀 快速开始命令

```bash
# 1. 创建快速上手页面组件
touch site/src/components/pages/QuickStartPage.wsx

# 2. 创建案例库页面组件
touch site/src/components/pages/GalleryPage.wsx

# 3. 创建模板目录
mkdir -p site/public/templates/quickstart

# 4. 创建案例数据目录
mkdir -p site/public/gallery
touch site/public/gallery/cases.json

# 5. 启动开发服务器
cd site
pnpm dev
```

---

## 📝 下一步行动

完成上述任务后，可以继续：

1. **创建视频教程**（第 2 周）
2. **启动"每周一例"**（第 3 周）
3. **优化 GitHub README**（第 3 周）
4. **建立模板库**（第 2 周）

---

**提示**：按照优先级顺序执行，每个任务完成后立即验证效果，根据反馈快速调整。
