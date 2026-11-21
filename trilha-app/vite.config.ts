import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
const VERSAO = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')).version;
import react from '@vitejs/plugin-react';

// No site a trilha fica em /trilha/; no app Android, na raiz (base relativa).
export default defineConfig({
  plugins: [react()],
  define: { __VERSAO__: JSON.stringify(VERSAO) },
  base: process.env.VITE_APP === '1' ? './' : '/trilha/',
  build: { outDir: process.env.VITE_APP === '1' ? 'dist-app' : 'dist', assetsDir: 'assets', sourcemap: false }
});
