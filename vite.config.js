import dotenv from 'dotenv';
import react from '@vitejs/plugin-react';
import EnvironmentPlugin from 'vite-plugin-environment';
dotenv.config();
import { defineConfig } from 'vite';

const { PORT = 3001 } = process.env;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), EnvironmentPlugin('all')],
  server: {
    proxy: {
      '/api/': {
        target: `http://localhost:${PORT}`,
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    port: 3000,
  },
  build: {
    outDir: 'dist/app',
    // sourcemap: 'true',
  },
});
