# API Documentation Generator Skill

## 📦 技能包位置

打包后的技能文件：`/Volumes/ORICO/ws/prj/slidejs/slidejs/.claude/skills/skill-creator/api-doc-generator.skill`

## 🚀 安装方式

在 Claude Code 中安装此技能：

```bash
claude skill add api-doc-generator.skill
```

## ✨ 功能特性

- **多语言支持**: JavaScript/TypeScript、Python
- **多格式输出**: Markdown、HTML、OpenAPI 3.0
- **自动提取**: 函数、类、接口、类型定义
- **文档解析**: JSDoc、Python docstrings、类型注解

## 📝 使用示例

### 生成单个文件的文档

```bash
python3 scripts/extract_api_info.py src/api/users.ts > api_info.json
python3 scripts/generate_markdown.py api_info.json docs/api.md
```

### 在 Claude Code 中使用

直接对 Claude 说：

- "为这个项目生成 API 文档"
- "扫描 src/ 目录并创建 API 文档"
- "生成 OpenAPI 规范"
- "为 TypeScript 接口生成文档"

## 📁 技能结构

```
api-doc-generator/
├── SKILL.md                          # 主技能文档
├── scripts/
│   ├── extract_api_info.py          # API 信息提取脚本
│   └── generate_markdown.py         # Markdown 生成脚本
├── references/
│   ├── jsdoc-patterns.md            # JSDoc 模式参考
│   └── openapi-spec.md              # OpenAPI 规范参考
└── assets/
    └── templates/
        ├── markdown-api.md          # Markdown 模板
        └── openapi-base.yaml        # OpenAPI 基础模板
```

## 🔧 依赖要求

Python 3.7+（脚本执行需要）

## 📚 文档

详细使用说明请参阅 `SKILL.md`
