import dotenv from 'dotenv';
import EnvironmentPlugin from 'vite-plugin-environment';
dotenv.config();

import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

const { PORT = 3001 } = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), EnvironmentPlugin('all')],
  server: {
    proxy: {
      '/api/': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    outDir: 'dist/app',
  },
});
