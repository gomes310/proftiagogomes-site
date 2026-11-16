// Testes do site gerado em dist/ (rode depois de node scripts/build.mjs):
// links internos, canônicas, títulos/descrições únicos, JSON-LD válido, sitemap coerente e robots.txt.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const SITE = 'https://proftiagogomes.com.br';
const erros = [];
const arquivos = [];
(function andar(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? andar(p) : p.endsWith('.html') && arquivos.push(p); } })(DIST);

const caminhoDe = (p) => '/' + relative(DIST, p).replace(/index\.html$/, '');
const existe = (href) => {
  const limpo = href.split('#')[0].split('?')[0];
  if (!limpo || limpo === '/') return true;
  const alvo = join(DIST, limpo);
  return existsSync(alvo) && (statSync(alvo).isFile() || existsSync(join(alvo, 'index.html')));
};

const titulos = new Map(), descricoes = new Map(), canonicas = new Set();
for (const p of arquivos) {
  const h = readFileSync(p, 'utf8'), cam = caminhoDe(p);
  const is404 = cam === '/404.html';
  const t = (/<title>([^<]+)<\/title>/.exec(h) || [])[1];
  const d = (/<meta name="description" content="([^"]*)"/.exec(h) || [])[1];
  const c = (/<link rel="canonical" href="([^"]+)"/.exec(h) || [])[1];
  if (!t) erros.push(`${cam}: sem <title>`);
  if (!is404) {
    if (!d) erros.push(`${cam}: sem meta description`);
    if (!c) erros.push(`${cam}: sem canônica`);
    else if (c !== SITE + cam) erros.push(`${cam}: canônica ${c} não bate com o caminho`);
    else canonicas.add(c);
    if (/noindex/.test(h)) erros.push(`${cam}: noindex numa página pública`);
    if ((h.match(/<h1[\s>]/g) || []).length !== 1) erros.push(`${cam}: precisa de exatamente um <h1>`);
    if (titulos.has(t)) erros.push(`${cam}: título repetido de ${titulos.get(t)}`); else titulos.set(t, cam);
    if (descricoes.has(d)) erros.push(`${cam}: descrição repetida de ${descricoes.get(d)}`); else descricoes.set(d, cam);
  }
  for (const [, href] of h.matchAll(/<a [^>]*href="(\/[^"]*)"/g)) if (!existe(href)) erros.push(`${cam}: link quebrado ${href}`);
  for (const [, j] of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { const o = JSON.parse(j); if (o['@type'] === 'VideoObject') for (const k of ['name', 'description', 'thumbnailUrl', 'uploadDate']) if (!o[k]) erros.push(`${cam}: VideoObject sem ${k}`); }
    catch { erros.push(`${cam}: JSON-LD inválido`); }
  }
}

const sm = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
for (const u of locs) { if (!canonicas.has(u)) erros.push(`sitemap: ${u} não é canônica de nenhuma página`); }
for (const c of canonicas) if (!locs.includes(c)) erros.push(`sitemap: falta ${c}`);
const rb = readFileSync(join(DIST, 'robots.txt'), 'utf8');
if (!rb.includes('Sitemap: ' + SITE + '/sitemap.xml')) erros.push('robots.txt sem Sitemap');
for (const bot of ['Googlebot', 'Bingbot', 'OAI-SearchBot', 'PerplexityBot', 'Claude-SearchBot']) {
  const bloco = new RegExp(`User-agent: ${bot}\\nAllow: /`).test(rb);
  if (!bloco) erros.push(`robots.txt não libera ${bot}`);
}
if (/Disallow:\s*\/\s*$/m.test(rb)) erros.push('robots.txt bloqueia o site inteiro para algum robô');

console.log(`${arquivos.length} páginas HTML, ${locs.length} URLs no sitemap.`);
if (erros.length) { console.error(erros.join('\n')); process.exit(1); }
console.log('Tudo certo.');
