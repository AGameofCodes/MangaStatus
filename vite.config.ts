import {fileURLToPath, URL} from 'node:url';

import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

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
    rollupOptions: {
      input: './src/main.ts',
    },
  },
  clearScreen: false,
  server: {
    proxy: {
      '/graphql': {
        target: 'https://graphql.anilist.co',
        changeOrigin: true,
      },
      '^/mangaupdates/.*$': {
        target: 'https://api.mangaupdates.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mangaupdates/, ''),
      },
    },
  },
});
