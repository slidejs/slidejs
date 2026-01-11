#!/usr/bin/env node

/**
 * 架构图生成工具
 * 使用 Mermaid 生成项目架构图
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program
  .option('-r, --root <path>', '项目根目录', '.')
  .option('-o, --output <path>', '输出目录', 'diagrams')
  .option('-a, --analysis-dir <path>', '分析结果目录')
  .parse(process.argv);

const options = program.opts();

/**
 * 生成模块架构图
 */
function generateModuleDiagram(structureData) {
  let diagram = '```mermaid\ngraph TB\n';

  if (structureData.modules && structureData.modules.length > 0) {
    // 创建节点
    structureData.modules.forEach(module => {
      const nodeId = module.name.replace(/[^a-zA-Z0-9]/g, '_');
      diagram += `    ${nodeId}["${module.name}<br/>${module.fileCount} files"]\n`;
    });

    // 简单的连接（基于目录层级）
    diagram += `    Root["Project Root"]\n`;
    structureData.modules.forEach(module => {
      const nodeId = module.name.replace(/[^a-zA-Z0-9]/g, '_');
      diagram += `    Root --> ${nodeId}\n`;
    });
  }

  diagram += '```\n';
  return diagram;
}

/**
 * 生成技术栈图
 */
function generateTechStackDiagram(structureData) {
  let diagram = '```mermaid\ngraph LR\n';

  if (structureData.techStack) {
    const { languages, frameworks, tools } = structureData.techStack;

    diagram += `    Project["${structureData.name}"]\n`;

    if (languages && languages.length > 0) {
      diagram += `    Languages["Languages"]\n`;
      diagram += `    Project --> Languages\n`;
      languages.forEach(lang => {
        const nodeId = lang.replace(/[^a-zA-Z0-9]/g, '_');
        diagram += `    Languages --> ${nodeId}["${lang}"]\n`;
      });
    }

    if (frameworks && frameworks.length > 0) {
      diagram += `    Frameworks["Frameworks"]\n`;
      diagram += `    Project --> Frameworks\n`;
      frameworks.forEach(fw => {
        const nodeId = fw.replace(/[^a-zA-Z0-9]/g, '_');
        diagram += `    Frameworks --> ${nodeId}["${fw}"]\n`;
      });
    }

    if (tools && tools.length > 0) {
      diagram += `    Tools["Tools"]\n`;
      diagram += `    Project --> Tools\n`;
      tools.forEach(tool => {
        const nodeId = tool.replace(/[^a-zA-Z0-9]/g, '_');
        diagram += `    Tools --> ${nodeId}["${tool}"]\n`;
      });
    }
  }

  diagram += '```\n';
  return diagram;
}

/**
 * 生成目录结构图
 */
function generateDirectoryDiagram(structureData) {
  let diagram = '```mermaid\ngraph TD\n';

  diagram += `    Root["${structureData.name}"]\n`;

  if (structureData.modules && structureData.modules.length > 0) {
    structureData.modules.slice(0, 10).forEach(module => {
      const nodeId = module.name.replace(/[^a-zA-Z0-9]/g, '_');
      diagram += `    Root --> ${nodeId}["📁 ${module.name}"]\n`;

      // 显示前几个文件
      if (module.files && module.files.length > 0) {
        module.files.slice(0, 3).forEach((file, idx) => {
          const fileName = path.basename(file);
          const fileId = `${nodeId}_file_${idx}`;
          diagram += `    ${nodeId} --> ${fileId}["📄 ${fileName}"]\n`;
        });

        if (module.files.length > 3) {
          const moreId = `${nodeId}_more`;
          diagram += `    ${nodeId} --> ${moreId}["... ${module.files.length - 3} more files"]\n`;
        }
      }
    });
  }

  diagram += '```\n';
  return diagram;
}

/**
 * 主函数
 */
function main() {
  console.log('🎨 生成架构图...');

  // 加载结构数据
  const structurePath = path.join(options.analysisDir, 'structure.json');
  if (!fs.existsSync(structurePath)) {
    console.error('❌ 未找到结构数据');
    process.exit(1);
  }

  const structureData = JSON.parse(fs.readFileSync(structurePath, 'utf-8'));

  // 创建输出目录
  fs.mkdirSync(options.output, { recursive: true });

  // 生成各类图表
  const moduleDiagram = generateModuleDiagram(structureData);
  const techStackDiagram = generateTechStackDiagram(structureData);
  const directoryDiagram = generateDirectoryDiagram(structureData);

  // 写入文件
  fs.writeFileSync(
    path.join(options.output, 'modules.md'),
    `# 模块架构图\n\n${moduleDiagram}`,
    'utf-8'
  );

  fs.writeFileSync(
    path.join(options.output, 'tech-stack.md'),
    `# 技术栈图\n\n${techStackDiagram}`,
    'utf-8'
  );

  fs.writeFileSync(
    path.join(options.output, 'directory.md'),
    `# 目录结构图\n\n${directoryDiagram}`,
    'utf-8'
  );

  // 创建索引
  const indexContent = `# 架构图表

## 可用图表

- [模块架构图](./modules.md) - 展示项目模块结构
- [技术栈图](./tech-stack.md) - 展示使用的技术栈
- [目录结构图](./directory.md) - 展示项目目录组织

## 说明

这些图表使用 Mermaid 语法生成，可以在支持 Mermaid 的 Markdown 查看器中查看（如 GitHub、GitLab、Typora 等）。

## 在线查看

你也可以复制图表代码到 [Mermaid Live Editor](https://mermaid.live/) 在线查看和编辑。
`;

  fs.writeFileSync(
    path.join(options.output, 'README.md'),
    indexContent,
    'utf-8'
  );

  console.log('✅ 架构图生成完成');
  console.log(`  • modules.md - 模块架构图`);
  console.log(`  • tech-stack.md - 技术栈图`);
  console.log(`  • directory.md - 目录结构图`);
}

try {
  main();
} catch (error) {
  console.error('❌ 错误:', error.message);
  process.exit(1);
}
