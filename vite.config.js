import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 'aim9hire.com',
    open: true,
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
  },
});
