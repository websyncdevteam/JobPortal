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
  preview: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: [
      "aim9hire.com",
      "www.aim9hire.com"
    ]
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
  },
});
