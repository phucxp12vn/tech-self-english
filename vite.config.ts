import dns from 'dns';
import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

dns.setDefaultResultOrder('verbatim');

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react({
      include: '**/*.tsx',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
    fs: {
      cachedChecks: false,
    },
    // proxy: {
    //   '/api': {
    // target: 'http://build-card-server:3000',
    //     target: 'http://192.168.1.9:3000',
    //     changeOrigin: true,
    //   },
    // },
  },
});
