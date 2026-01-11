#!/bin/bash

# 文档验证脚本

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

OUTPUT_DIR="${OUTPUT:-docs/architecture}"
ERROR_COUNT=0
WARNING_COUNT=0

echo -e "${GREEN}🔍 验证项目文档...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查文档目录
if [ ! -d "$OUTPUT_DIR" ]; then
    echo -e "${RED}❌ 错误: 文档目录不存在: $OUTPUT_DIR${NC}"
    exit 1
fi

# 检查必需文档
REQUIRED_DOCS=("README.md" "ARCHITECTURE.md" "MODULES.md" "DEPENDENCIES.md")

for doc in "${REQUIRED_DOCS[@]}"; do
    if [ ! -f "$OUTPUT_DIR/$doc" ]; then
        echo -e "${RED}❌ 错误: 缺少必需文档: $doc${NC}"
        ((ERROR_COUNT++))
    else
        # 检查文件是否为空
        if [ ! -s "$OUTPUT_DIR/$doc" ]; then
            echo -e "${YELLOW}⚠️  警告: 文档为空: $doc${NC}"
            ((WARNING_COUNT++))
        else
            echo -e "${GREEN}✓ $doc${NC}"
        fi
    fi
done

# 检查分析数据
if [ -d "$OUTPUT_DIR/analysis" ]; then
    echo ""
    echo "检查分析数据..."

    ANALYSIS_FILES=("structure.json" "stack.json")
    for file in "${ANALYSIS_FILES[@]}"; do
        if [ -f "$OUTPUT_DIR/analysis/$file" ]; then
            # 验证 JSON 格式
            if ! jq empty "$OUTPUT_DIR/analysis/$file" 2>/dev/null; then
                echo -e "${RED}❌ 错误: JSON 格式无效: $file${NC}"
                ((ERROR_COUNT++))
            else
                echo -e "${GREEN}✓ analysis/$file${NC}"
            fi
        fi
    done
fi

# 检查架构图
if [ -d "$OUTPUT_DIR/diagrams" ]; then
    echo ""
    echo "检查架构图..."

    diagram_count=$(find "$OUTPUT_DIR/diagrams" -name "*.md" | wc -l)
    if [ "$diagram_count" -eq 0 ]; then
        echo -e "${YELLOW}⚠️  警告: 未找到架构图${NC}"
        ((WARNING_COUNT++))
    else
        echo -e "${GREEN}✓ 找到 $diagram_count 个架构图${NC}"
    fi
fi

# 输出结果
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "验证结果:"
echo "  错误: $ERROR_COUNT"
echo "  警告: $WARNING_COUNT"

if [ "$ERROR_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ 文档验证通过${NC}"
    exit 0
else
    echo -e "${RED}❌ 文档验证失败${NC}"
    exit 1
fi
