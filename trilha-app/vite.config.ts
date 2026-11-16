import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// No site a trilha fica em /trilha/; no app Android, na raiz (base relativa).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_APP === '1' ? './' : '/trilha/',
  build: { outDir: process.env.VITE_APP === '1' ? 'dist-app' : 'dist', assetsDir: 'assets', sourcemap: false }
});
