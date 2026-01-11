# 项目架构文档生成器 - 快速开始

3 分钟快速上手，为你的项目生成专业的架构文档！

## 🎯 一键生成

最简单的使用方式：

```bash
# 在项目根目录执行
claude skill project-doc-generator generate
```

就这么简单！文档将生成到 `docs/architecture` 目录。

## 📂 查看生成的文档

```bash
# 打开文档目录
cd docs/architecture

# 查看主文档
open README.md  # macOS
# 或
xdg-open README.md  # Linux
# 或
start README.md  # Windows
```

## 🚀 5 个常用命令

### 1. 基础生成

```bash
claude skill project-doc-generator generate
```

生成包含以下内容的完整文档：
- ✅ 项目概览
- ✅ 架构设计
- ✅ 模块说明
- ✅ 依赖分析
- ✅ 架构图表

### 2. 详细分析

```bash
claude skill project-doc-generator generate --depth comprehensive
```

包含更详细的信息：
- ✅ 完整的目录树
- ✅ 所有模块的文件列表
- ✅ 详细的代码统计
- ✅ 深入的架构分析

### 3. 快速生成（基础模式）

```bash
claude skill project-doc-generator generate --depth basic
```

快速生成基础文档：
- ✅ 核心架构信息
- ✅ 主要模块列表
- ✅ 技术栈概览

### 4. 仅生成架构图

```bash
claude skill project-doc-generator diagrams
```

只生成架构图，不生成完整文档：
- ✅ 模块架构图
- ✅ 技术栈图
- ✅ 目录结构图

### 5. AI 增强分析

```bash
claude skill project-doc-generator generate --ai-enhanced true
```

获得 AI 驱动的洞察：
- 🤖 架构模式识别
- 🤖 代码质量评估
- 🤖 改进建议
- 🤖 最佳实践推荐

## 📖 理解生成的文档

### 主要文档

| 文档 | 内容 |
|------|------|
| `README.md` | 📑 文档索引，快速导航 |
| `ARCHITECTURE.md` | 🏗️ 架构概览，技术栈，设计模式 |
| `MODULES.md` | 📦 模块详细说明 |
| `DEPENDENCIES.md` | 🔗 依赖关系分析 |

### 架构图表

| 图表 | 说明 |
|------|------|
| `diagrams/modules.md` | 模块架构图 |
| `diagrams/tech-stack.md` | 技术栈图 |
| `diagrams/directory.md` | 目录结构图 |

### 分析数据

`analysis/` 目录包含 JSON 格式的原始分析数据，可用于：
- 自定义处理
- 集成到其他工具
- 生成自定义报告

## 🎨 查看架构图

架构图使用 Mermaid 语法，可以在以下地方查看：

### 在线查看

1. 打开 [Mermaid Live Editor](https://mermaid.live/)
2. 复制图表代码
3. 粘贴到编辑器

### 本地查看

支持 Mermaid 的工具：
- ✅ GitHub / GitLab
- ✅ Typora
- ✅ VS Code (需要插件)
- ✅ Obsidian
- ✅ Notion

## 💼 实际使用场景

### 场景 1: 新项目文档

```bash
# 初始化项目后
npm init
npm install

# 生成文档
claude skill project-doc-generator generate

# 提交到 Git
git add docs/architecture
git commit -m "docs: 添加项目架构文档"
```

### 场景 2: 技术分享

```bash
# 生成包含图表的文档
claude skill project-doc-generator generate \
  --generate-diagrams true \
  --include-examples true

# 使用生成的文档做技术分享
open docs/architecture/README.md
```

### 场景 3: 代码审查

```bash
# 生成 AI 增强的分析报告
claude skill project-doc-generator generate \
  --ai-enhanced true \
  --depth comprehensive

# 查看 AI 建议
cat docs/architecture/analysis/ai-insights.json | jq .
```

### 场景 4: 新成员 Onboarding

```bash
# 生成详细文档
claude skill project-doc-generator generate --depth detailed

# 新成员按顺序阅读:
# 1. docs/architecture/README.md - 快速了解
# 2. docs/architecture/ARCHITECTURE.md - 深入架构
# 3. docs/architecture/MODULES.md - 模块详情
```

## 🔧 自定义输出目录

```bash
# 输出到自定义目录
claude skill project-doc-generator generate \
  --output docs/my-arch-docs

# 输出到项目外部
claude skill project-doc-generator generate \
  --output /path/to/docs
```

## ⚡ 性能提示

### 大型项目优化

对于大型项目（>10000 文件），建议：

```bash
# 1. 使用基础模式快速生成
claude skill project-doc-generator generate --depth basic

# 2. 或者指定特定目录
claude skill project-doc-generator generate \
  --root ./src \
  --output docs/src-architecture
```

### 跳过某些分析

```bash
# 跳过依赖分析（更快）
claude skill project-doc-generator generate \
  --analyze-dependencies false

# 跳过架构图生成（更快）
claude skill project-doc-generator generate \
  --generate-diagrams false
```

## 📊 示例输出预览

### 项目概览示例

```
# My Project - 架构概览

## 📋 项目概述

### 项目规模

| 指标 | 数值 |
|------|------|
| 总文件数 | 234 |
| 代码文件 | 156 |
| 代码行数 | 12,456 |
| 模块数量 | 12 |

## 🛠️ 技术栈

### 编程语言
- TypeScript
- JavaScript

### 框架和库
- React
- Vite
- Express
```

### AI 洞察示例

```json
{
  "patterns": [
    {
      "name": "分层架构",
      "description": "项目采用了分层架构，清晰地划分了不同层次的职责",
      "benefits": [
        "职责明确",
        "易于维护",
        "支持测试"
      ]
    }
  ],
  "recommendations": [
    {
      "title": "添加测试",
      "description": "项目中未发现测试文件，建议添加单元测试和集成测试",
      "priority": "high"
    }
  ]
}
```

## 🆘 遇到问题？

### 文档为空

```bash
# 尝试详细模式
claude skill project-doc-generator generate --depth comprehensive

# 检查项目结构
ls -la src/
```

### 架构图无法显示

- 确保使用支持 Mermaid 的 Markdown 查看器
- 或访问 https://mermaid.live/ 粘贴代码

### 分析时间过长

```bash
# 使用基础模式
claude skill project-doc-generator generate --depth basic

# 或跳过某些分析
claude skill project-doc-generator generate \
  --analyze-dependencies false \
  --generate-diagrams false
```

## 🎓 进阶学习

想了解更多？查看：

- [完整文档](./README.md) - 详细功能说明
- [配置指南](./examples/) - 自定义配置示例
- [最佳实践](#) - 使用建议和技巧

## 💡 小技巧

1. **定期更新**: 每次大的变更后重新生成
2. **版本控制**: 将文档纳入 Git
3. **自动化**: 集成到 CI/CD 流程
4. **分享**: 与团队成员分享文档链接

## 🚀 开始使用

现在你已经掌握了基础用法，赶快试试吧：

```bash
claude skill project-doc-generator generate
```

祝你使用愉快！ ✨
