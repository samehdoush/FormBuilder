// Special config for a standalone UMD build with Vue included
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/umd-entry.js'),
      name: 'VueFormBuilder',
      fileName: () => 'vue-form-builder.standalone.js',
      formats: ['umd']
    },
    outDir: 'dist',
    rollupOptions: {
      external: [], // Include everything in the bundle
      output: {
        globals: {},
        exports: 'named'
      }
    }
  }
});
