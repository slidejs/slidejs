#!/bin/bash

# 更新项目文档脚本

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🔄 更新项目文档...${NC}"

OUTPUT_DIR="${OUTPUT:-docs/architecture}"

# 检查是否存在现有文档
if [ ! -d "$OUTPUT_DIR" ]; then
    echo -e "${YELLOW}⚠️  未找到现有文档，将执行完整生成${NC}"
    exec "$(dirname "$0")/generate.sh"
fi

# 备份现有文档
BACKUP_DIR="${OUTPUT_DIR}.backup.$(date +%Y%m%d_%H%M%S)"
echo "📦 备份现有文档到: $BACKUP_DIR"
cp -r "$OUTPUT_DIR" "$BACKUP_DIR"

# 执行生成
"$(dirname "$0")/generate.sh"

echo -e "${GREEN}✅ 文档更新完成${NC}"
echo "旧文档备份在: $BACKUP_DIR"
