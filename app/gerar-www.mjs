// Gera app/www a partir da trilha do site (trilha/index.html), adaptada para o app Android:
// fonte embutida (funciona sem internet), sem navegação do site e sem links de compra
// (a Google Play não permite levar o usuário a pagar fora dela por conteúdo digital).
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const WWW = join(AQUI, 'www');
const FONTE = join(AQUI, 'node_modules/@fontsource/familjen-grotesk/files');
const CANAL = 'https://www.youtube.com/channel/UCMIAzvrCpApjss0Gwd0u0kQ';

let s = readFileSync(join(AQUI, '..', 'trilha', 'index.html'), 'utf8');
function troca(de, para) { if (de instanceof RegExp ? !de.test(s) : !s.includes(de)) throw new Error('Trecho não encontrado: ' + String(de).slice(0, 80)); s = s.replace(de, para); }

rmSync(WWW, { recursive: true, force: true });
mkdirSync(join(WWW, 'fontes'), { recursive: true });
for (const p of [400, 500, 600, 700]) cpSync(join(FONTE, `familjen-grotesk-latin-${p}-normal.woff2`), join(WWW, 'fontes', `fg-${p}.woff2`));
cpSync(join(AQUI, '..', 'assets', 'whatsapp.css'), join(WWW, 'whatsapp.css'));

// cabeça: fontes locais, sem SEO de página web
troca(/<link rel="preconnect"[^>]*>\s*<link rel="preconnect"[^>]*>\s*<link href="https:\/\/fonts\.googleapis[^>]*>/,
  '<style>' + [400, 500, 600, 700].map((p) => `@font-face{font-family:'Familjen Grotesk';font-weight:${p};font-display:swap;src:url(fontes/fg-${p}.woff2) format('woff2')}`).join('') + '</style>');
s = s.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '');
s = s.replace(/<link rel="canonical"[^>]*>\s*/g, '').replace(/<meta property="og:[^>]*>\s*/g, '').replace(/<meta name="twitter:[^>]*>\s*/g, '');
s = s.replace(/href="\/assets\/whatsapp\.css[^"]*"/, 'href="whatsapp.css"');
s = s.replace('<meta name="viewport" content="width=device-width, initial-scale=1">', '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">');

// topo: só a marca, sem menu do site
troca(/<header class="wrap topo">[\s\S]*?<\/header>/, '<header class="wrap topo"><span class="marca">Trilha do RLM · Prof. Tiago Gomes</span></header>');
// abertura: sem links do site
s = s.replace(/<p class="links">[\s\S]*?<\/p>/, '');
s = s.replace('Seu progresso fica salvo neste aparelho.', 'Seu progresso fica salvo no celular, e tudo funciona sem internet.');
// rodapé: sem venda, aponta para o canal
troca(/<section class="rodape-trilha">[\s\S]*?<\/section>/, `<section class="rodape-trilha">
    <h2>Quer ir além da trilha?</h2>
    <p>No canal do Prof. Tiago Gomes tem aulões e questões de concurso resolvidas, de graça.</p>
    <div class="acoes">
      <a class="btn btn-guia" href="${CANAL}" target="_blank" rel="noopener">Ver aulas no YouTube</a>
      <a class="btn" href="https://wa.me/?text=Estou%20fazendo%20a%20Trilha%20do%20RLM%20do%20Prof.%20Tiago%20Gomes%3A%20https%3A%2F%2Fproftiagogomes.com.br%2Ftrilha%2F" target="_blank" rel="noopener">Convidar um amigo</a>
    </div>
  </section>`);
// mensagens de conquista: trocar links do Guia pelo canal
s = s.split('<a href="/guia/">Guia do Raciocínio Lógico</a>').join(`<a href="${CANAL}" target="_blank" rel="noopener">canal do Prof. Tiago no YouTube</a>`);
s = s.split(`<a class="btn btn-guia" href="/guia/">Conhecer o Guia do RLM</a>`).join(`<a class="btn btn-guia" href="${CANAL}" target="_blank" rel="noopener">Ver aulas no YouTube</a>`);
s = s.split('o Guia tem a teoria completa e muito mais questões resolvidas.').join('o canal tem aulões e muitas questões resolvidas.');
s = s.split('Quer se aprofundar nesses assuntos?').join('Quer ver esses assuntos em aula?');
s = s.split('Aprofunde com o').join('Veja mais no');
s = s.replace(/'<p><a href="https:\/\/wa\.me\/\?text=' \+ compart \+ '">/, `'<p><a href="https://wa.me/?text=' + compart + '" target="_blank" rel="noopener">`);
// área segura (barra de status / navegação do Android)
s = s.replace('</style>\n</head>', '  body { padding-top: env(safe-area-inset-top); }\n  .licao { padding-top: env(safe-area-inset-top); }\n</style>\n</head>');

if (/href="\/(?!\/)/.test(s)) throw new Error('Sobrou link interno do site: ' + s.match(/href="\/[^"]*"/)[0]);
if (/hotmart|\/guia\//i.test(s)) throw new Error('Sobrou link de compra');
writeFileSync(join(WWW, 'index.html'), s);
console.log('www gerado:', (s.length / 1024).toFixed(0), 'KB');
