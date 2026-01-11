import { defineConfig, Plugin } from 'vite';
import { wsx } from '@wsxjs/wsx-vite-plugin';
import { wsxPress } from '@wsxjs/wsx-press/node';
import UnoCSS from 'unocss/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { copyFileSync, existsSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Vite 插件：复制 index.html 到 404.html
 *
 * GitHub Pages 使用 404.html 来处理客户端路由（SPA）
 * 当用户直接访问不存在的路径时，GitHub Pages 会返回 404.html
 * 如果 404.html 和 index.html 内容相同，SPA 路由就能正常工作
 */
function copy404Plugin(): Plugin {
  return {
    name: 'copy-404',
    enforce: 'post',
    closeBundle() {
      // 只在生产构建时执行
      if (process.env.NODE_ENV !== 'production') {
        return;
      }

      // 使用 vite.config.ts 中定义的 outDir
      const outDir = path.resolve(__dirname, 'dist');
      const indexHtml = path.resolve(outDir, 'index.html');
      const notFoundHtml = path.resolve(outDir, '404.html');

      if (!existsSync(indexHtml)) {
        console.warn(`⚠️  index.html 不存在: ${indexHtml}`);
        return;
      }

      try {
        copyFileSync(indexHtml, notFoundHtml);
        console.log(`✅ 已复制 index.html 到 404.html`);
      } catch (error) {
        console.error(`❌ 复制 404.html 失败:`, error);
      }
    },
  };
}

export default defineConfig({
  // GitHub Pages 部署 base 路径配置
  // 支持自定义域名和子路径部署
  base:
    process.env.NODE_ENV === 'production' && process.env.GITHUB_PAGES === 'true'
      ? process.env.CUSTOM_DOMAIN === 'true'
        ? '/' // 自定义域名 (slidejs.io)
        : '/slidejs/' // GitHub Pages 子路径 (username.github.io/slidejs)
      : '/', // 开发模式

  plugins: [
    // wsx-press 插件 - 构建文档页面（必须在其他插件之前）
    // 注意：当前版本 (0.0.19) 存在 glob 导入问题，需要等待上游修复
    // 如果遇到 "Named export 'glob' not found" 错误，请暂时注释掉此插件
    wsxPress({
      docsRoot: path.resolve(__dirname, './public/docs'),
      outputDir: path.resolve(__dirname, './.wsx-press'),
    }),
    // UnoCSS 原子化 CSS 引擎
    UnoCSS(),
    // wsx 插件 - 处理 .wsx 文件
    wsx({
      debug: false, // 开发模式启用调试
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    }),
    // 复制 404.html 插件 - 在构建完成后执行
    copy404Plugin(),
  ],

  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: process.env.NODE_ENV !== 'production', // 生产环境不生成 sourcemap
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['@wsxjs/wsx-core', '@wsxjs/wsx-base-components', '@wsxjs/wsx-router'],
          slidejs: ['@slidejs/core', '@slidejs/dsl'],
        },
      },
    },
  },

  // 开发模式下的路径别名
  // 直接使用源文件以支持热模块替换 (HMR)
  // 生产模式使用 package.json exports (dist 文件)
  resolve: {
    alias: {
      // 开发模式：直接使用源文件，支持 HMR
      // 注意：@wsxjs/* 包是外部 npm 包，不在 monorepo 中，不需要别名
      ...(process.env.NODE_ENV === 'development'
        ? {
            '@slidejs/core': path.resolve(__dirname, '../packages/@slidejs/core/src/index.ts'),
            '@slidejs/dsl': path.resolve(__dirname, '../packages/@slidejs/dsl/src/index.ts'),
            '@': path.resolve(__dirname, './src'),
          }
        : {
            '@': path.resolve(__dirname, './src'),
          }),
      // 处理 pino 浏览器版本导入问题
      // pino 的浏览器版本 (pino/browser) 使用命名导出，不是默认导出
      pino: 'pino/browser',
    },
    // 在开发环境中优先使用源码（source 字段）
    // CSS 文件通过插件直接解析到 dist 目录
    conditions: ['import', 'module', 'browser', 'default'],
  },

  server: {
    port: 5178,
    open: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5178,
    },
    watch: {
      // 监听 workspace 包的源码变化
      ignored: ['!**/node_modules/@slidejs/**', '!**/packages/**'],
    },
  },

  // 预览服务器配置
  preview: {
    port: 5180, // 使用不同端口避免与开发服务器冲突
    open: true,
    // 预览时使用与构建时相同的 base 路径
    // 这样可以在本地预览 GitHub Pages 部署效果
    cors: true,
  },

  optimizeDeps: {
    exclude: [
      '@wsxjs/wsx-core',
      '@wsxjs/wsx-base-components',
      '@wsxjs/wsx-router',
      '@slidejs/core',
      '@slidejs/dsl',
    ],
    // 包含 pino/browser 以便 Vite 预构建并正确处理 CommonJS 导出
    include: ['pino/browser'],
    // 处理 pino 的浏览器版本导入问题
    esbuildOptions: {
      resolveExtensions: ['.browser.js', '.js', '.mjs'],
    },
  },
});
