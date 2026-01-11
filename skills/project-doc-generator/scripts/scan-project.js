#!/usr/bin/env node

/**
 * 项目结构扫描工具
 * 扫描项目目录，分析文件结构和代码组织
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

// 命令行参数
program
  .option('-r, --root <path>', '项目根目录', '.')
  .option('-o, --output <path>', '输出文件', 'structure.json')
  .option('-d, --depth <level>', '分析深度', 'detailed')
  .parse(process.argv);

const options = program.opts();

// 忽略的目录和文件
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'coverage',
  '.turbo',
  '.cache',
  '__pycache__',
  '.pytest_cache',
  'venv',
  'env'
];

// 代码文件扩展名
const CODE_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx',
  '.py', '.java', '.go', '.rs',
  '.c', '.cpp', '.h', '.hpp',
  '.vue', '.svelte'
];

// 配置文件
const CONFIG_FILES = [
  'package.json',
  'tsconfig.json',
  'vite.config.js',
  'webpack.config.js',
  'rollup.config.js',
  'jest.config.js',
  'babel.config.js',
  'eslint.config.js',
  '.eslintrc.js',
  'prettier.config.js',
  'tailwind.config.js',
  'next.config.js',
  'nuxt.config.js',
  'vue.config.js'
];

/**
 * 项目结构数据
 */
const projectStructure = {
  root: options.root,
  name: path.basename(path.resolve(options.root)),
  scanTime: new Date().toISOString(),
  depth: options.depth,

  // 统计信息
  statistics: {
    totalFiles: 0,
    totalDirectories: 0,
    codeFiles: 0,
    configFiles: 0,
    totalLines: 0,
    codeLines: 0
  },

  // 目录树
  tree: {},

  // 文件分类
  files: {
    code: [],
    config: [],
    documentation: [],
    tests: [],
    assets: []
  },

  // 模块信息
  modules: [],

  // 技术栈标识
  techStack: {
    languages: new Set(),
    frameworks: new Set(),
    tools: new Set()
  }
};

/**
 * 判断是否应该忽略该路径
 */
function shouldIgnore(filePath) {
  const parts = filePath.split(path.sep);
  return IGNORE_PATTERNS.some(pattern => parts.includes(pattern));
}

/**
 * 判断是否是代码文件
 */
function isCodeFile(fileName) {
  return CODE_EXTENSIONS.some(ext => fileName.endsWith(ext));
}

/**
 * 判断是否是配置文件
 */
function isConfigFile(fileName) {
  return CONFIG_FILES.includes(fileName) ||
         fileName.endsWith('.config.js') ||
         fileName.endsWith('.config.ts') ||
         fileName.startsWith('.');
}

/**
 * 判断是否是测试文件
 */
function isTestFile(fileName) {
  return fileName.includes('.test.') ||
         fileName.includes('.spec.') ||
         fileName.includes('__tests__');
}

/**
 * 判断是否是文档文件
 */
function isDocFile(fileName) {
  return fileName.endsWith('.md') ||
         fileName.endsWith('.mdx') ||
         fileName.endsWith('.txt') ||
         fileName === 'README' ||
         fileName === 'CHANGELOG' ||
         fileName === 'LICENSE';
}

/**
 * 统计文件行数
 */
function countLines(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const codeLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 0 && !trimmed.startsWith('//') && !trimmed.startsWith('/*');
    }).length;

    return {
      total: lines.length,
      code: codeLines
    };
  } catch (error) {
    return { total: 0, code: 0 };
  }
}

/**
 * 识别编程语言
 */
function detectLanguage(fileName) {
  const ext = path.extname(fileName);
  const langMap = {
    '.js': 'JavaScript',
    '.jsx': 'JavaScript (React)',
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript (React)',
    '.py': 'Python',
    '.java': 'Java',
    '.go': 'Go',
    '.rs': 'Rust',
    '.c': 'C',
    '.cpp': 'C++',
    '.vue': 'Vue',
    '.svelte': 'Svelte'
  };
  return langMap[ext] || 'Unknown';
}

/**
 * 扫描目录
 */
function scanDirectory(dirPath, depth = 0) {
  if (depth > 10) return; // 限制递归深度

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  entries.forEach(entry => {
    const fullPath = path.join(dirPath, entry.name);
    const relativePath = path.relative(options.root, fullPath);

    if (shouldIgnore(relativePath)) {
      return;
    }

    if (entry.isDirectory()) {
      projectStructure.statistics.totalDirectories++;

      // 递归扫描子目录
      scanDirectory(fullPath, depth + 1);
    } else if (entry.isFile()) {
      projectStructure.statistics.totalFiles++;

      const fileInfo = {
        name: entry.name,
        path: relativePath,
        size: fs.statSync(fullPath).size
      };

      // 分类文件
      if (isCodeFile(entry.name)) {
        projectStructure.statistics.codeFiles++;

        const lines = countLines(fullPath);
        projectStructure.statistics.totalLines += lines.total;
        projectStructure.statistics.codeLines += lines.code;

        fileInfo.lines = lines;
        fileInfo.language = detectLanguage(entry.name);

        projectStructure.techStack.languages.add(fileInfo.language);

        if (isTestFile(entry.name)) {
          projectStructure.files.tests.push(fileInfo);
        } else {
          projectStructure.files.code.push(fileInfo);
        }
      } else if (isConfigFile(entry.name)) {
        projectStructure.statistics.configFiles++;
        projectStructure.files.config.push(fileInfo);
      } else if (isDocFile(entry.name)) {
        projectStructure.files.documentation.push(fileInfo);
      } else {
        projectStructure.files.assets.push(fileInfo);
      }
    }
  });
}

/**
 * 分析项目模块
 */
function analyzeModules() {
  const srcDirs = ['src', 'lib', 'packages', 'apps'];

  srcDirs.forEach(srcDir => {
    const srcPath = path.join(options.root, srcDir);
    if (fs.existsSync(srcPath) && fs.statSync(srcPath).isDirectory()) {
      const entries = fs.readdirSync(srcPath, { withFileTypes: true });

      entries.forEach(entry => {
        if (entry.isDirectory()) {
          const modulePath = path.join(srcPath, entry.name);
          const relativePath = path.relative(options.root, modulePath);

          // 统计模块文件
          const moduleFiles = [];
          function collectFiles(dir) {
            const items = fs.readdirSync(dir, { withFileTypes: true });
            items.forEach(item => {
              const itemPath = path.join(dir, item.name);
              if (item.isFile() && isCodeFile(item.name)) {
                moduleFiles.push(path.relative(options.root, itemPath));
              } else if (item.isDirectory() && !shouldIgnore(item.name)) {
                collectFiles(itemPath);
              }
            });
          }
          collectFiles(modulePath);

          projectStructure.modules.push({
            name: entry.name,
            path: relativePath,
            fileCount: moduleFiles.length,
            files: moduleFiles
          });
        }
      });
    }
  });
}

/**
 * 检测技术栈
 */
function detectTechStack() {
  const packageJsonPath = path.join(options.root, 'package.json');

  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

      // 检测框架
      const deps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };

      const frameworks = {
        'react': 'React',
        'vue': 'Vue.js',
        'angular': 'Angular',
        'svelte': 'Svelte',
        'next': 'Next.js',
        'nuxt': 'Nuxt.js',
        'express': 'Express',
        'fastify': 'Fastify',
        'nest': 'NestJS',
        'vite': 'Vite',
        'webpack': 'Webpack',
        'rollup': 'Rollup'
      };

      Object.keys(deps).forEach(dep => {
        Object.entries(frameworks).forEach(([key, name]) => {
          if (dep.includes(key)) {
            projectStructure.techStack.frameworks.add(name);
          }
        });
      });

      // 检测工具
      const tools = {
        'eslint': 'ESLint',
        'prettier': 'Prettier',
        'jest': 'Jest',
        'vitest': 'Vitest',
        'typescript': 'TypeScript',
        'babel': 'Babel'
      };

      Object.keys(deps).forEach(dep => {
        Object.entries(tools).forEach(([key, name]) => {
          if (dep.includes(key)) {
            projectStructure.techStack.tools.add(name);
          }
        });
      });
    } catch (error) {
      console.error('解析 package.json 失败:', error.message);
    }
  }
}

/**
 * 生成目录树
 */
function generateTree() {
  const tree = {};

  function addToTree(filePath, isDir) {
    const parts = filePath.split(path.sep);
    let current = tree;

    parts.forEach((part, index) => {
      if (!current[part]) {
        current[part] = {
          type: index === parts.length - 1 ? (isDir ? 'directory' : 'file') : 'directory',
          children: {}
        };
      }
      current = current[part].children;
    });
  }

  // 添加代码文件
  projectStructure.files.code.forEach(file => addToTree(file.path, false));
  projectStructure.files.config.forEach(file => addToTree(file.path, false));

  // 添加模块
  projectStructure.modules.forEach(module => addToTree(module.path, true));

  projectStructure.tree = tree;
}

/**
 * 主函数
 */
function main() {
  console.log('🔍 扫描项目结构:', options.root);

  const startTime = Date.now();

  // 扫描目录
  scanDirectory(options.root);

  // 分析模块
  analyzeModules();

  // 检测技术栈
  detectTechStack();

  // 生成目录树
  if (options.depth === 'comprehensive') {
    generateTree();
  }

  // 转换 Set 为 Array
  projectStructure.techStack.languages = Array.from(projectStructure.techStack.languages);
  projectStructure.techStack.frameworks = Array.from(projectStructure.techStack.frameworks);
  projectStructure.techStack.tools = Array.from(projectStructure.techStack.tools);

  const duration = Date.now() - startTime;
  projectStructure.scanDuration = `${duration}ms`;

  // 输出结果
  fs.writeFileSync(
    options.output,
    JSON.stringify(projectStructure, null, 2),
    'utf-8'
  );

  console.log('✅ 扫描完成');
  console.log(`📊 统计: ${projectStructure.statistics.totalFiles} 个文件, ${projectStructure.statistics.codeFiles} 个代码文件`);
  console.log(`📝 代码行数: ${projectStructure.statistics.codeLines} 行`);
  console.log(`🎯 模块数: ${projectStructure.modules.length} 个`);
  console.log(`💾 结果已保存到: ${options.output}`);
}

// 执行
try {
  main();
} catch (error) {
  console.error('❌ 错误:', error.message);
  process.exit(1);
}
