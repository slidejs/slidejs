/**
 * 复制 demos 构建产物到 site/dist/demos/ 目录
 * 用于在 GitHub Pages 上托管所有 demo 应用
 */

import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 项目根目录（site 的父目录）
const ROOT_DIR = resolve(__dirname, '../..');
// site dist 目录
const SITE_DIST_DIR = resolve(__dirname, '../dist');
// demos dist 目录
const DEMOS_DIST_DIR = join(SITE_DIST_DIR, 'demos');

// 需要复制的 demo 列表
const DEMOS = ['vue', 'react', 'svelte', 'vanilla'] as const;

/**
 * 复制单个 demo 的构建产物
 */
function copyDemo(demoName: string): void {
  const demoDistPath = join(ROOT_DIR, 'demos', demoName, 'dist');
  // 直接使用 demo 名称作为目标名称
  const targetName = demoName;
  const targetPath = join(DEMOS_DIST_DIR, targetName);

  if (!existsSync(demoDistPath)) {
    console.warn(`⚠️  Demo "${demoName}" 的构建产物不存在: ${demoDistPath}`);
    console.warn(`   请先运行: pnpm --filter @slidejs/demo-${demoName} build`);
    return;
  }

  try {
    // 确保目标目录存在
    mkdirSync(targetPath, { recursive: true });

    // 使用 Node.js 内置的 cpSync 复制整个目录
    cpSync(demoDistPath, targetPath, {
      recursive: true,
      force: true,
      filter: src => {
        // 排除 node_modules 和源文件
        if (src.includes('node_modules')) return false;
        if (src.endsWith('.ts') || src.endsWith('.tsx')) return false;
        return true;
      },
    });

    // 修复 index.html 中的资源路径
    const indexPath = join(targetPath, 'index.html');
    if (existsSync(indexPath)) {
      let htmlContent = readFileSync(indexPath, 'utf-8');
      // 将绝对路径的资源引用改为相对于 base 的路径
      // /assets/... -> /demos/{demoName}/assets/...
      htmlContent = htmlContent.replace(
        /(href|src)="\/assets\/([^"]+)"/g,
        `$1="/demos/${targetName}/assets/$2"`
      );
      // 修复 favicon 等根路径资源（如果存在）
      // 匹配 /vite.svg, /favicon.svg, /favicon.ico 等
      htmlContent = htmlContent.replace(
        /(href|src)="\/(vite\.svg|favicon\.(svg|ico|png|jpg))"/g,
        `$1="/demos/${targetName}/$2"`
      );
      // 修复其他可能的 public 目录资源（如 /images/..., /fonts/... 等）
      // 但只修复绝对路径，不修复相对路径
      htmlContent = htmlContent.replace(
        /(href|src)="\/([^/][^"]*\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot))"/g,
        (match, attr, path) => {
          // 如果路径已经是 /demos/ 开头，不处理
          if (path.startsWith('demos/')) return match;
          // 如果路径是 /assets/，已经在上面处理过了
          if (path.startsWith('assets/')) return match;
          // 其他根路径资源，添加 /demos/{targetName}/ 前缀
          return `${attr}="/demos/${targetName}/${path}"`;
        }
      );
      writeFileSync(indexPath, htmlContent, 'utf-8');
    }

    console.log(`✅ 已复制 ${targetName} demo 到 ${targetPath}`);
  } catch (error) {
    console.error(`❌ 复制 ${demoName} demo 失败:`, error);
    throw error;
  }
}

/**
 * 主函数
 */
function main() {
  console.log('📦 开始复制 demos 构建产物...\n');

  // 确保 demos 目录存在
  mkdirSync(DEMOS_DIST_DIR, { recursive: true });

  // 复制所有 demos
  for (const demo of DEMOS) {
    copyDemo(demo);
  }

  console.log(`\n✨ 所有 demos 已复制到 ${DEMOS_DIST_DIR}`);
  console.log(`\n📝 访问路径:`);
  DEMOS.forEach(demo => {
    console.log(`   - /demos/${demo}/`);
  });
}

main();
