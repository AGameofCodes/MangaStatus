import {fileURLToPath, URL} from 'node:url';

import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import {ManualChunkMeta} from 'rollup';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), VueI18nPlugin({compositionOnly: false}),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    manifest: true,
    emptyOutDir: false,
    rolldownOptions: {
      input: ['./src/main.ts', './index.html'],
      output: {
        codeSplitting: {
          groups: [
            {
              test: () => true,
              name: 'main',
            },
          ],
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true, //needed because bootstrap still uses @import instead of @use; see https://sass-lang.com/blog/import-is-deprecated/
      },
    },
  },
  clearScreen: false,
  server: {
    proxy: {//for dev
      '^/anilist/.*$': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '^/mangadex/.*$': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '^/mangaupdates/.*$': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
