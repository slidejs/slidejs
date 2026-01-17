/**
 * 复制 index.html 到 404.html
 * GitHub Pages 使用 404.html 来处理客户端路由（SPA）
 * 当用户直接访问不存在的路径时，GitHub Pages 会返回 404.html
 * 如果 404.html 和 index.html 内容相同，SPA 路由就能正常工作
 *
 * 注意：应用使用 hash 模式路由，404.html 主要用于：
 * 1. 处理直接访问不存在的文件路径（如 /some-file.html）
 * 2. 确保资源路径正确（相对于 base 路径）
 */

import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// site dist 目录
const DIST_DIR = resolve(__dirname, '../dist');
const INDEX_HTML = join(DIST_DIR, 'index.html');
const NOT_FOUND_HTML = join(DIST_DIR, '404.html');

/**
 * 复制 index.html 到 404.html
 * 确保 404.html 与 index.html 内容完全一致
 */
function copy404(): void {
  if (!existsSync(INDEX_HTML)) {
    console.error(`❌ index.html 不存在: ${INDEX_HTML}`);
    console.error('   请先运行构建命令');
    process.exit(1);
  }

  try {
    // 直接复制文件（内容应该已经由 Vite 处理了 base 路径）
    copyFileSync(INDEX_HTML, NOT_FOUND_HTML);
    console.log(`✅ 已复制 index.html 到 404.html`);
    console.log(`   注意：应用使用 hash 模式路由，404.html 主要用于处理直接访问不存在的文件路径`);
  } catch (error) {
    console.error(`❌ 复制失败:`, error);
    process.exit(1);
  }
}

copy404();
