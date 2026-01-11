import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SlideJsSwiper',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        '@slidejs/core',
        '@slidejs/runner',
        '@slidejs/dsl',
        '@slidejs/context',
        'swiper',
        // Only externalize JS modules from swiper, NOT CSS
        /^swiper\/.*\.js$/,
      ],
      output: {
        // 确保 CSS 文件被正确提取为 style.css
        assetFileNames: assetInfo => {
          // 将所有 CSS 文件重命名为 style.css（与 package.json exports 一致）
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'style.css';
          }
          return assetInfo.name || 'assets/[name].[ext]';
        },
      },
    },
    sourcemap: true,
    // CSS 被提取到单独文件，但通过 import 语句自动加载
    cssCodeSplit: false,
  },
  plugins: [
    dts({
      include: ['src/**/*'],
      exclude: ['**/*.test.ts'],
      rollupTypes: true,
    }),
  ],
});
