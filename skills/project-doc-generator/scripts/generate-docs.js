#!/usr/bin/env node

/**
 * 文档生成工具
 * 基于分析结果生成完整的架构文档
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program
  .option('-r, --root <path>', '项目根目录', '.')
  .option('-o, --output <path>', '输出目录', 'docs/architecture')
  .option('-f, --format <format>', '输出格式', 'markdown')
  .option('-a, --analysis-dir <path>', '分析结果目录', 'docs/architecture/analysis')
  .option('-e, --include-examples <boolean>', '包含代码示例', 'true')
  .option('-n, --project-name <name>', '项目名称', '')
  .option('-v, --project-version <version>', '项目版本', '')
  .option('-d, --project-desc <desc>', '项目描述', '')
  .parse(process.argv);

const options = program.opts();

/**
 * 加载分析结果
 */
function loadAnalysisData() {
  const data = {};

  try {
    const structurePath = path.join(options.analysisDir, 'structure.json');
    if (fs.existsSync(structurePath)) {
      data.structure = JSON.parse(fs.readFileSync(structurePath, 'utf-8'));
    }

    const stackPath = path.join(options.analysisDir, 'stack.json');
    if (fs.existsSync(stackPath)) {
      data.stack = JSON.parse(fs.readFileSync(stackPath, 'utf-8'));
    }

    const depsPath = path.join(options.analysisDir, 'dependencies.json');
    if (fs.existsSync(depsPath)) {
      data.dependencies = JSON.parse(fs.readFileSync(depsPath, 'utf-8'));
    }

    const aiPath = path.join(options.analysisDir, 'ai-insights.json');
    if (fs.existsSync(aiPath)) {
      data.aiInsights = JSON.parse(fs.readFileSync(aiPath, 'utf-8'));
    }
  } catch (error) {
    console.error('加载分析数据失败:', error.message);
  }

  return data;
}

/**
 * 生成架构概览文档
 */
function generateArchitectureDoc(data) {
  const { structure, stack, aiInsights } = data;

  let content = `# ${options.projectName || 'Project'} - 架构概览\n\n`;

  if (options.projectDesc) {
    content += `> ${options.projectDesc}\n\n`;
  }

  content += `**版本**: ${options.projectVersion || 'N/A'}  \n`;
  content += `**生成时间**: ${new Date().toISOString().split('T')[0]}\n\n`;

  content += `---\n\n`;

  // 项目概述
  content += `## 📋 项目概述\n\n`;

  if (structure) {
    content += `### 项目规模\n\n`;
    content += `| 指标 | 数值 |\n`;
    content += `|------|------|\n`;
    content += `| 总文件数 | ${structure.statistics.totalFiles} |\n`;
    content += `| 代码文件 | ${structure.statistics.codeFiles} |\n`;
    content += `| 代码行数 | ${structure.statistics.codeLines} |\n`;
    content += `| 模块数量 | ${structure.modules.length} |\n\n`;
  }

  // 技术栈
  content += `## 🛠️ 技术栈\n\n`;

  if (structure?.techStack) {
    if (structure.techStack.languages.length > 0) {
      content += `### 编程语言\n\n`;
      structure.techStack.languages.forEach(lang => {
        content += `- ${lang}\n`;
      });
      content += `\n`;
    }

    if (structure.techStack.frameworks.length > 0) {
      content += `### 框架和库\n\n`;
      structure.techStack.frameworks.forEach(fw => {
        content += `- ${fw}\n`;
      });
      content += `\n`;
    }

    if (structure.techStack.tools.length > 0) {
      content += `### 开发工具\n\n`;
      structure.techStack.tools.forEach(tool => {
        content += `- ${tool}\n`;
      });
      content += `\n`;
    }
  }

  // 架构模式
  if (aiInsights?.patterns) {
    content += `## 🏗️ 架构模式\n\n`;
    aiInsights.patterns.forEach(pattern => {
      content += `### ${pattern.name}\n\n`;
      content += `${pattern.description}\n\n`;
      if (pattern.benefits) {
        content += `**优势**:\n`;
        pattern.benefits.forEach(benefit => {
          content += `- ${benefit}\n`;
        });
        content += `\n`;
      }
    });
  }

  // 目录结构
  content += `## 📁 目录结构\n\n`;
  content += `\`\`\`\n`;
  content += generateTreeView(structure);
  content += `\`\`\`\n\n`;

  // 核心模块
  if (structure?.modules && structure.modules.length > 0) {
    content += `## 🎯 核心模块\n\n`;
    structure.modules.slice(0, 10).forEach(module => {
      content += `### ${module.name}\n\n`;
      content += `- **路径**: \`${module.path}\`\n`;
      content += `- **文件数**: ${module.fileCount}\n\n`;
    });
  }

  // AI 洞察
  if (aiInsights?.recommendations) {
    content += `## 💡 架构建议\n\n`;
    aiInsights.recommendations.forEach((rec, index) => {
      content += `${index + 1}. **${rec.title}**\n`;
      content += `   ${rec.description}\n\n`;
    });
  }

  return content;
}

/**
 * 生成模块文档
 */
function generateModulesDoc(data) {
  const { structure } = data;

  let content = `# 模块说明\n\n`;
  content += `本文档详细说明了项目中各个模块的功能和职责。\n\n`;
  content += `---\n\n`;

  if (!structure?.modules || structure.modules.length === 0) {
    content += `暂无模块信息。\n`;
    return content;
  }

  content += `## 📦 模块列表\n\n`;
  content += `| 模块名称 | 路径 | 文件数 | 说明 |\n`;
  content += `|---------|------|--------|------|\n`;

  structure.modules.forEach(module => {
    content += `| ${module.name} | \`${module.path}\` | ${module.fileCount} | - |\n`;
  });

  content += `\n---\n\n`;

  // 详细说明
  content += `## 📝 模块详情\n\n`;

  structure.modules.forEach(module => {
    content += `### ${module.name}\n\n`;
    content += `**路径**: \`${module.path}\`\n\n`;
    content += `**文件列表**:\n\n`;

    module.files.slice(0, 20).forEach(file => {
      content += `- \`${file}\`\n`;
    });

    if (module.files.length > 20) {
      content += `- ... 还有 ${module.files.length - 20} 个文件\n`;
    }

    content += `\n`;
  });

  return content;
}

/**
 * 生成依赖文档
 */
function generateDependenciesDoc(data) {
  const { dependencies, structure } = data;

  let content = `# 依赖关系\n\n`;
  content += `项目依赖分析和说明。\n\n`;
  content += `---\n\n`;

  // NPM 依赖
  const packageJsonPath = path.join(options.root, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      content += `## 📦 NPM 依赖\n\n`;

      if (packageJson.dependencies) {
        content += `### 生产依赖\n\n`;
        content += `| 包名 | 版本 |\n`;
        content += `|------|------|\n`;
        Object.entries(packageJson.dependencies).forEach(([name, version]) => {
          content += `| ${name} | ${version} |\n`;
        });
        content += `\n`;
      }

      if (packageJson.devDependencies) {
        content += `### 开发依赖\n\n`;
        content += `| 包名 | 版本 |\n`;
        content += `|------|------|\n`;
        Object.entries(packageJson.devDependencies).slice(0, 20).forEach(([name, version]) => {
          content += `| ${name} | ${version} |\n`;
        });

        const total = Object.keys(packageJson.devDependencies).length;
        if (total > 20) {
          content += `| ... | *还有 ${total - 20} 个依赖* |\n`;
        }
        content += `\n`;
      }
    } catch (error) {
      console.error('解析 package.json 失败');
    }
  }

  // 模块依赖关系
  if (dependencies && Object.keys(dependencies).length > 0) {
    content += `## 🔗 模块依赖关系\n\n`;
    content += `> 基于代码导入分析生成\n\n`;

    const deps = Object.entries(dependencies).slice(0, 10);
    deps.forEach(([module, deps]) => {
      if (Array.isArray(deps) && deps.length > 0) {
        content += `### ${module}\n\n`;
        content += `依赖模块:\n`;
        deps.forEach(dep => {
          content += `- \`${dep}\`\n`;
        });
        content += `\n`;
      }
    });
  }

  return content;
}

/**
 * 生成目录树视图
 */
function generateTreeView(structure) {
  if (!structure?.modules) return '暂无数据';

  let tree = `${structure.name}/\n`;

  // 常见目录
  const commonDirs = ['src', 'lib', 'packages', 'docs', 'tests'];
  commonDirs.forEach(dir => {
    const dirPath = path.join(options.root, dir);
    if (fs.existsSync(dirPath)) {
      tree += `├── ${dir}/\n`;
    }
  });

  // 配置文件
  structure.files.config.slice(0, 5).forEach((file, index, arr) => {
    const prefix = index === arr.length - 1 ? '└──' : '├──';
    tree += `${prefix} ${file.name}\n`;
  });

  return tree;
}

/**
 * 主函数
 */
function main() {
  console.log('📝 生成项目文档...');

  // 加载数据
  const data = loadAnalysisData();

  // 生成文档
  const architectureDoc = generateArchitectureDoc(data);
  const modulesDoc = generateModulesDoc(data);
  const dependenciesDoc = generateDependenciesDoc(data);

  // 写入文件
  fs.writeFileSync(
    path.join(options.output, 'ARCHITECTURE.md'),
    architectureDoc,
    'utf-8'
  );

  fs.writeFileSync(
    path.join(options.output, 'MODULES.md'),
    modulesDoc,
    'utf-8'
  );

  fs.writeFileSync(
    path.join(options.output, 'DEPENDENCIES.md'),
    dependenciesDoc,
    'utf-8'
  );

  console.log('✅ 文档生成完成');
  console.log(`  • ARCHITECTURE.md`);
  console.log(`  • MODULES.md`);
  console.log(`  • DEPENDENCIES.md`);
}

// 执行
try {
  main();
} catch (error) {
  console.error('❌ 错误:', error.message);
  console.error(error.stack);
  process.exit(1);
}
