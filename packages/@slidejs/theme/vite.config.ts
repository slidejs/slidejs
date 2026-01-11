import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SlideJsTheme',
      formats: ['es', 'cjs'],
      fileName: format => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    sourcemap: true,
  },
  plugins: [
    dts({
      include: ['src/**/*'],
      exclude: ['**/*.test.ts'],
      rollupTypes: true,
    }),
  ],
});
