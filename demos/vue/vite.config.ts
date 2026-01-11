import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { wsx } from '@wsxjs/wsx-vite-plugin';
import path from 'path';

export default defineConfig({
  // 使用相对路径，确保在子目录部署时资源路径正确
  base: './',
  plugins: [
    // Vue 插件
    vue(),
    // wsx 插件 - 处理 .wsx 文件
    wsx({
      debug: false,
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    conditions: ['source', 'import', 'module', 'browser', 'default'],
  },
  optimizeDeps: {
    exclude: [
      '@slidejs/core',
      '@slidejs/runner',
      '@slidejs/context',
      '@slidejs/dsl',
      '@slidejs/runner-revealjs',
      '@slidejs/runner-swiper',
      '@slidejs/runner-splide',
      '@slidejs/editor',
      '@slidejs/theme',
      '@wsxjs/wsx-core',
      'monaco-editor',
    ],
  },
  server: {
    port: 3003,
    open: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3003,
    },
    watch: {
      // 监听 workspace 包的源码变化
      ignored: ['!**/node_modules/@slidejs/**', '!**/packages/**'],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
