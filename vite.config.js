import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [
    vue(),
    // Add babel plugin to fix Vue default import issue
    {
      name: 'fix-vue-imports',
      transform(code, id) {
        if (id.endsWith('.js') || id.endsWith('.vue')) {
          // Replace default Vue imports with named imports only
          return code.replace(/import\s+\w+\s*,\s*\{\s*(.*?)\s*\}\s*from\s*['"]vue['"]/g, 'import { $1 } from "vue"');
        }
      }
    },
  ],
  css: {
    postcss: './postcss.config.js',
  },  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'VueFormBuilder',
      fileName: (format) => `vue-form-builder.${format}.js`
    },    rollupOptions: {
      external: format => format === 'es' ? ['vue', 'vuetify'] : [], // Don't externalize for UMD
      output: {
        globals: {
          vue: 'Vue',
          vuetify: 'Vuetify'
        },
        format: ['es', 'umd'],
        exports: 'named',
        preserveModules: false,
        // Use esModule interop to handle Vue's named exports correctly
        interop: 'esModule'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    open: '/demo.html', // Open demo page when running dev server
    port: 3000
  }
});
