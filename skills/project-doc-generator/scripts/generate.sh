#!/bin/bash

# 项目架构文档生成脚本
# 自动分析项目结构并生成完整的技术文档

set -e  # 遇到错误立即退出

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 默认参数
PROJECT_ROOT="${ROOT:-.}"
OUTPUT_DIR="${OUTPUT:-docs/architecture}"
FORMAT="${FORMAT:-markdown}"
DEPTH="${DEPTH:-detailed}"
INCLUDE_EXAMPLES="${INCLUDE_EXAMPLES:-true}"
GENERATE_DIAGRAMS="${GENERATE_DIAGRAMS:-true}"
ANALYZE_DEPENDENCIES="${ANALYZE_DEPENDENCIES:-true}"
AI_ENHANCED="${AI_ENHANCED:-true}"

echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                           ║${NC}"
echo -e "${CYAN}║    📚  项目架构文档生成器                                 ║${NC}"
echo -e "${CYAN}║                                                           ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# 显示配置
echo -e "${BLUE}📋 配置信息:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  项目根目录: $PROJECT_ROOT"
echo "  输出目录: $OUTPUT_DIR"
echo "  输出格式: $FORMAT"
echo "  分析深度: $DEPTH"
echo "  包含代码示例: $INCLUDE_EXAMPLES"
echo "  生成架构图: $GENERATE_DIAGRAMS"
echo "  依赖分析: $ANALYZE_DEPENDENCIES"
echo "  AI 增强: $AI_ENHANCED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查项目根目录
if [ ! -d "$PROJECT_ROOT" ]; then
    echo -e "${RED}❌ 错误: 项目根目录不存在: $PROJECT_ROOT${NC}"
    exit 1
fi

# 创建输出目录
mkdir -p "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR/diagrams"
mkdir -p "$OUTPUT_DIR/analysis"

# 切换到项目根目录
cd "$PROJECT_ROOT"

# 获取项目信息
PROJECT_NAME=$(basename "$(pwd)")
if [ -f "package.json" ]; then
    PROJECT_NAME=$(node -p "require('./package.json').name" 2>/dev/null || echo "$PROJECT_NAME")
    PROJECT_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "unknown")
    PROJECT_DESC=$(node -p "require('./package.json').description" 2>/dev/null || echo "")
else
    PROJECT_VERSION="unknown"
    PROJECT_DESC=""
fi

echo -e "${GREEN}🔍 步骤 1/6: 扫描项目结构...${NC}"
echo ""

# 扫描项目结构
node "$(dirname "$0")/scan-project.js" \
    --root "$PROJECT_ROOT" \
    --output "$OUTPUT_DIR/analysis/structure.json" \
    --depth "$DEPTH"

echo -e "${GREEN}✓ 项目结构扫描完成${NC}"
echo ""

# 分析技术栈
echo -e "${GREEN}🔬 步骤 2/6: 分析技术栈...${NC}"
echo ""

node "$(dirname "$0")/analyze-stack.js" \
    --root "$PROJECT_ROOT" \
    --output "$OUTPUT_DIR/analysis/stack.json"

echo -e "${GREEN}✓ 技术栈分析完成${NC}"
echo ""

# 分析依赖关系
if [ "$ANALYZE_DEPENDENCIES" = "true" ]; then
    echo -e "${GREEN}📦 步骤 3/6: 分析依赖关系...${NC}"
    echo ""

    if [ -f "package.json" ]; then
        # 使用 madge 分析依赖
        echo "  分析模块依赖..."
        if command -v npx &> /dev/null; then
            npx -y madge \
                --json \
                --extensions js,ts,jsx,tsx \
                . > "$OUTPUT_DIR/analysis/dependencies.json" 2>/dev/null || echo "{}" > "$OUTPUT_DIR/analysis/dependencies.json"
        fi
    fi

    echo -e "${GREEN}✓ 依赖分析完成${NC}"
    echo ""
else
    echo -e "${YELLOW}⏭️  跳过依赖分析${NC}"
    echo ""
fi

# 生成架构图
if [ "$GENERATE_DIAGRAMS" = "true" ]; then
    echo -e "${GREEN}🎨 步骤 4/6: 生成架构图...${NC}"
    echo ""

    node "$(dirname "$0")/generate-diagrams.js" \
        --root "$PROJECT_ROOT" \
        --output "$OUTPUT_DIR/diagrams" \
        --analysis-dir "$OUTPUT_DIR/analysis"

    echo -e "${GREEN}✓ 架构图生成完成${NC}"
    echo ""
else
    echo -e "${YELLOW}⏭️  跳过架构图生成${NC}"
    echo ""
fi

# AI 增强分析
if [ "$AI_ENHANCED" = "true" ]; then
    echo -e "${GREEN}🤖 步骤 5/6: AI 增强分析...${NC}"
    echo ""

    node "$(dirname "$0")/ai-analyze.js" \
        --root "$PROJECT_ROOT" \
        --analysis-dir "$OUTPUT_DIR/analysis" \
        --output "$OUTPUT_DIR/analysis/ai-insights.json"

    echo -e "${GREEN}✓ AI 分析完成${NC}"
    echo ""
else
    echo -e "${YELLOW}⏭️  跳过 AI 增强${NC}"
    echo ""
fi

# 生成文档
echo -e "${GREEN}📝 步骤 6/6: 生成文档...${NC}"
echo ""

node "$(dirname "$0")/generate-docs.js" \
    --root "$PROJECT_ROOT" \
    --output "$OUTPUT_DIR" \
    --format "$FORMAT" \
    --analysis-dir "$OUTPUT_DIR/analysis" \
    --include-examples "$INCLUDE_EXAMPLES" \
    --project-name "$PROJECT_NAME" \
    --project-version "$PROJECT_VERSION" \
    --project-desc "$PROJECT_DESC"

echo -e "${GREEN}✓ 文档生成完成${NC}"
echo ""

# 生成索引
echo -e "${BLUE}📑 生成文档索引...${NC}"

cat > "$OUTPUT_DIR/README.md" <<EOF
# $PROJECT_NAME - 架构文档

> 版本: $PROJECT_VERSION
> 生成时间: $(date '+%Y-%m-%d %H:%M:%S')

## 📖 文档目录

### 核心文档

- [架构概览](./ARCHITECTURE.md) - 系统架构设计和核心模式
- [模块说明](./MODULES.md) - 各模块功能和职责
- [依赖关系](./DEPENDENCIES.md) - 项目依赖分析

### 架构图表

EOF

# 添加图表链接
if [ -d "$OUTPUT_DIR/diagrams" ] && [ "$(ls -A "$OUTPUT_DIR/diagrams" 2>/dev/null)" ]; then
    echo "- [架构图表目录](./diagrams/)" >> "$OUTPUT_DIR/README.md"
    echo "" >> "$OUTPUT_DIR/README.md"
fi

cat >> "$OUTPUT_DIR/README.md" <<EOF

## 🎯 快速导航

### 新手指南

1. 阅读 [架构概览](./ARCHITECTURE.md) 了解系统整体设计
2. 查看 [模块说明](./MODULES.md) 了解各模块功能
3. 参考架构图表理解组件关系

### 开发者指南

- 技术栈详情见 [技术栈](./STACK.md)
- 代码规范见 [编码规范](./CODING_STANDARDS.md)
- 部署流程见 [部署文档](./DEPLOYMENT.md)

## 📊 项目统计

EOF

# 添加项目统计
if [ -f "$OUTPUT_DIR/analysis/structure.json" ]; then
    echo '```' >> "$OUTPUT_DIR/README.md"
    node -e "
        const data = require('$OUTPUT_DIR/analysis/structure.json');
        console.log('文件总数:', data.fileCount || 'N/A');
        console.log('代码行数:', data.totalLines || 'N/A');
        console.log('模块数量:', data.moduleCount || 'N/A');
    " >> "$OUTPUT_DIR/README.md" 2>/dev/null || true
    echo '```' >> "$OUTPUT_DIR/README.md"
fi

echo "" >> "$OUTPUT_DIR/README.md"
echo "---" >> "$OUTPUT_DIR/README.md"
echo "" >> "$OUTPUT_DIR/README.md"
echo "*此文档由项目架构文档生成器自动生成*" >> "$OUTPUT_DIR/README.md"

# 完成
echo ""
echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                           ║${NC}"
echo -e "${CYAN}║    ✨  文档生成完成!                                      ║${NC}"
echo -e "${CYAN}║                                                           ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}📁 输出目录: $OUTPUT_DIR${NC}"
echo ""
echo -e "${BLUE}主要文档:${NC}"
echo "  • README.md - 文档索引"
echo "  • ARCHITECTURE.md - 架构概览"
echo "  • MODULES.md - 模块说明"
echo "  • DEPENDENCIES.md - 依赖分析"
echo ""

if [ "$GENERATE_DIAGRAMS" = "true" ]; then
    echo -e "${BLUE}架构图:${NC}"
    echo "  • diagrams/ - 架构图表目录"
    echo ""
fi

echo -e "${YELLOW}💡 提示: 使用以下命令查看文档${NC}"
echo "  cd $OUTPUT_DIR && open README.md"
echo ""
