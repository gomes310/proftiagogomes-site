// Gera app/www a partir da Trilha do RLM em React (pasta trilha-app/), no modo app:
// sem links de compra (regra da Google Play), fontes embutidas e caminhos relativos.
import { execSync } from 'node:child_process';
import { cpSync, existsSync, rmSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const FONTE = join(AQUI, '..', 'trilha-app');
const WWW = join(AQUI, 'www');
if (!existsSync(FONTE)) throw new Error('Não achei a pasta trilha-app ao lado de app/. Use o repositório completo do site.');
const sh = (c) => execSync(c, { cwd: FONTE, stdio: 'inherit', env: { ...process.env, VITE_APP: '1' } });
if (!existsSync(join(FONTE, 'node_modules'))) sh('npm ci --no-audit --no-fund');
sh('npx vite build');
rmSync(WWW, { recursive: true, force: true });
cpSync(join(FONTE, 'dist-app'), WWW, { recursive: true });
const html = readFileSync(join(WWW, 'index.html'), 'utf8');
if (/hotmart|href="\/guia/i.test(html)) throw new Error('Sobrou link de compra no app');
console.log('www do app gerado a partir de trilha-app/dist-app');
