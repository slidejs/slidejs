#!/usr/bin/env node

/**
 * 技术栈分析工具
 * 深入分析项目使用的技术栈
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');

program
  .option('-r, --root <path>', '项目根目录', '.')
  .option('-o, --output <path>', '输出文件', 'stack.json')
  .parse(process.argv);

const options = program.opts();

const stackInfo = {
  frontend: {
    framework: null,
    libraries: [],
    buildTool: null,
    cssFramework: null,
  },
  backend: {
    runtime: null,
    framework: null,
    database: [],
  },
  testing: {
    unitTest: [],
    e2eTest: [],
  },
  tools: {
    linter: [],
    formatter: [],
    bundler: [],
  },
};

function analyzePackageJson() {
  const pkgPath = path.join(options.root, 'package.json');
  if (!fs.existsSync(pkgPath)) return;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

  // 前端框架
  if (allDeps.react) stackInfo.frontend.framework = 'React';
  if (allDeps.vue) stackInfo.frontend.framework = 'Vue';
  if (allDeps.angular) stackInfo.frontend.framework = 'Angular';
  if (allDeps.svelte) stackInfo.frontend.framework = 'Svelte';

  // 构建工具
  if (allDeps.vite) stackInfo.frontend.buildTool = 'Vite';
  if (allDeps.webpack) stackInfo.frontend.buildTool = 'Webpack';
  if (allDeps.rollup) stackInfo.frontend.buildTool = 'Rollup';

  // CSS 框架
  if (allDeps.tailwindcss) stackInfo.frontend.cssFramework = 'Tailwind CSS';
  if (allDeps.bootstrap) stackInfo.frontend.cssFramework = 'Bootstrap';

  // 后端
  if (allDeps.express) stackInfo.backend.framework = 'Express';
  if (allDeps.fastify) stackInfo.backend.framework = 'Fastify';
  if (allDeps['@nestjs/core']) stackInfo.backend.framework = 'NestJS';

  // 测试
  if (allDeps.jest) stackInfo.testing.unitTest.push('Jest');
  if (allDeps.vitest) stackInfo.testing.unitTest.push('Vitest');
  if (allDeps.cypress) stackInfo.testing.e2eTest.push('Cypress');
  if (allDeps.playwright) stackInfo.testing.e2eTest.push('Playwright');

  // 工具
  if (allDeps.eslint) stackInfo.tools.linter.push('ESLint');
  if (allDeps.prettier) stackInfo.tools.formatter.push('Prettier');
}

function main() {
  console.log('🔬 分析技术栈...');
  analyzePackageJson();

  fs.writeFileSync(options.output, JSON.stringify(stackInfo, null, 2));
  console.log('✅ 技术栈分析完成');
}

main();
