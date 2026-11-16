// Gera o site publicado em dist/: copia as páginas fixas e cria o banco de questões
// a partir de data/questoes.json (única fonte dos dados das questões).
// Uso: node scripts/build.mjs   (o Netlify roda isso em cada deploy)
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(RAIZ, 'dist');
const SITE = 'https://proftiagogomes.com.br';
const CANAL = 'https://www.youtube.com/channel/UCMIAzvrCpApjss0Gwd0u0kQ';
const HOJE = new Date().toISOString().slice(0, 10);
const MIN_PAGINA = 3; // mínimo de questões completas para uma banca ou tema ganhar página própria

// ---------- dados ----------
const { questoes: todas } = JSON.parse(readFileSync(join(RAIZ, 'data/questoes.json'), 'utf8'));
const completas = todas.filter((q) => q.completa);

const BANCA_INFO = {
  ibgp: { playlist: 'https://www.youtube.com/playlist?list=PLIVsJz2LbRAI', ebook: 'https://go.hotmart.com/F108280890X', ebookNome: 'Ebook de Raciocínio Lógico da banca IBGP (2022 a 2026)' },
  'ms-concursos': { playlist: 'https://www.youtube.com/playlist?list=PLkR-RQjzDGjiTDJ9bML0ZCdq_TGEQdumN', ebook: 'https://go.hotmart.com/E98439322E', ebookNome: 'Ebook com 114 questões da banca MS CONCURSOS' },
  ibfc: { ebook: 'https://go.hotmart.com/K101890013D?dp=1', ebookNome: 'Curso completo de Raciocínio Lógico da banca IBFC' },
};
const TEMA_INFO = {
  'verdades-e-mentiras': {
    intro: 'Questões em que algumas pessoas dizem a verdade e outras mentem, e você precisa descobrir quem é quem. O caminho mais seguro é testar uma hipótese por vez e descartar as que geram contradição.',
    playlist: 'https://www.youtube.com/playlist?list=PLkR-RQjzDGji7sKPqLhrgqCLxiVmAHBy-', ebook: 'https://go.hotmart.com/V99501635B?dp=1', ebookNome: 'Ebook de questões sobre Verdades e Mentiras',
  },
  'sequencias-logicas': { intro: 'Sequências de números, letras, palavras e figuras: encontre a lei de formação e descubra o próximo termo ou um termo distante da sequência.' },
  'proposicoes-e-conectivos': {
    intro: 'O ponto de partida da lógica: reconhecer o que é proposição, separar proposições simples de compostas e escrever frases em linguagem simbólica com os conectivos e, ou, se… então e se e somente se.',
    aulao: { video: 'ryxofLmdqeI', titulo: 'Proposições lógicas: 100 questões resolvidas', duracao: 'PT1H31M53S', publicado: '2021-12-08' },
  },
  'equivalencias-e-negacoes': {
    intro: 'Como negar uma proposição composta e como reescrevê-la sem mudar o sentido. É o assunto que mais aparece em prova depois da tabela-verdade.',
    aulao: { video: '-PC9G3zIkHc', titulo: 'Equivalências e negações: 100 questões resolvidas', duracao: 'PT2H53M16S', publicado: '2022-06-03' },
  },
  'tabela-verdade': {
    intro: 'Quando uma proposição composta é verdadeira ou falsa. Saber a tabela de cada conectivo resolve boa parte das questões de lógica proposicional.',
    aulao: { video: 'DjgHeLCanpg', titulo: 'Tabela-verdade: 100 questões resolvidas', duracao: 'PT4H6M8S', publicado: '2023-04-05' },
  },
};

// ---------- utilidades ----------
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slug = (t) => t.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const curto = (s, n) => { s = String(s).replace(/\s+/g, ' ').trim(); return s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)) + '…'; };
const dur = (iso) => { const m = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(iso || '') || []; const h = +m[1] || 0, mi = +m[2] || 0, s = +m[3] || 0; return h ? `${h}h${String(mi).padStart(2, '0')}` : `${mi}min${s ? ' ' + String(s).padStart(2, '0') + 's' : ''}`; };
const paragrafos = (t) => t.split(/\n{2,}/).map((p) => p.split('\n').map((l) => l.trim()).filter(Boolean)
  .reduce((acc, l) => { if (!acc.length) return [l]; const ant = acc[acc.length - 1]; if (/^[a-zà-ú(]/.test(l) && !/[.:;?!”"]$/.test(ant)) acc[acc.length - 1] = ant + ' ' + l; else acc.push(l); return acc; }, []))
  .map((linhas) => `<p>${linhas.map(esc).join('<br>')}</p>`).join('\n');

function urlQuestao(q) {
  return `/questao/${slug([q.banca, q.orgao, q.ano, q.tema].filter(Boolean).join(' '))}-${q.video.toLowerCase()}/`;
}
function tituloQuestao(q) { return `Questão de ${q.tema} – ${q.banca}${q.ano ? ' ' + q.ano : ''}${q.orgao ? ` (${q.orgao})` : ''}`; }

// agrupamentos
const agrupar = (lista, chave) => lista.reduce((m, q) => { (m[q[chave]] ||= []).push(q); return m; }, {});
const porBanca = agrupar(completas, 'banca_slug');
const porTema = agrupar(completas, 'tema_slug');
const nomeBanca = Object.fromEntries(completas.map((q) => [q.banca_slug, q.banca]));
const nomeTema = Object.fromEntries(completas.map((q) => [q.tema_slug, q.tema]));
const ordenar = (l) => [...l].sort((a, b) => (b.ano || 0) - (a.ano || 0) || (a.numero_serie || 0) - (b.numero_serie || 0));
const bancasComPagina = Object.keys(porBanca).filter((b) => porBanca[b].length >= MIN_PAGINA).sort((a, b) => porBanca[b].length - porBanca[a].length);
const temasComPagina = Object.keys(porTema).filter((t) => porTema[t].length >= MIN_PAGINA).sort((a, b) => porTema[b].length - porTema[a].length);
const urlBanca = (b) => bancasComPagina.includes(b) ? `/questoes/bancas/${b}/` : null;
const urlTema = (t) => temasComPagina.includes(t) ? `/questoes/${t}/` : null;

// colisões de URL quebrariam o link permanente: falha cedo
const urls = completas.map(urlQuestao);
if (new Set(urls).size !== urls.length) throw new Error('URLs de questão repetidas');
const RESERVADAS = ['bancas'];
for (const t of temasComPagina) if (RESERVADAS.includes(t)) throw new Error('tema colide com rota: ' + t);

// ---------- layout ----------
const AUTOR = { '@type': 'Person', name: 'Tiago Gomes', jobTitle: 'Professor de Raciocínio Lógico', url: SITE + '/', sameAs: [CANAL] };

function pagina({ caminho, titulo, descricao, h1Extra = '', corpo, ld = [], og = '/assets/og.png', tipo = 'website', migalhas = [] }) {
  const canon = SITE + caminho;
  const bc = migalhas.length ? {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: migalhas.map(([nome, url], i) => ({ '@type': 'ListItem', position: i + 1, name: nome, ...(url ? { item: SITE + url } : {}) })),
  } : null;
  const blocos = [bc, ...ld].filter(Boolean).map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n');
  const nav = migalhas.length ? `<nav class="migalhas" aria-label="Você está em"><ol>${migalhas.map(([n, u], i) => `<li>${u && i < migalhas.length - 1 ? `<a href="${u}">${esc(n)}</a>` : `<span aria-current="page">${esc(n)}</span>`}</li>`).join('')}</ol></nav>` : '';
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${canon}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="${tipo}">
<meta property="og:site_name" content="Prof. Tiago Gomes">
<meta property="og:locale" content="pt_BR">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:url" content="${canon}">
<meta property="og:image" content="${og.startsWith('http') ? og : SITE + og}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/questoes.css">
<link rel="stylesheet" href="/assets/whatsapp.css">
${blocos}
</head>
<body>
<header class="wrap topo">
  <a class="marca" href="/">Prof. Tiago Gomes</a>
  <nav aria-label="Seções">
    <a href="/questoes/">Banco de questões</a>
    <a href="/trilha/">Trilha</a>
    <a href="/guia/">Guia do RLM</a>
  </nav>
</header>
<main class="wrap">
${nav}
${corpo}
</main>
<footer class="wrap rodape">
  <p>Resoluções do Prof. Tiago Gomes, professor de Raciocínio Lógico para concursos. Enunciados reproduzidos das provas indicadas em cada questão.</p>
  <p><a href="/questoes/">Banco de questões</a> · <a href="/#questoes">Questões no seu e-mail</a> · <a href="${CANAL}">YouTube</a> · <a href="/privacidade.html">Privacidade</a></p>
</footer>
<a class="wa" href="https://wa.me/5567981457668?text=Ol%C3%A1%2C%20Professor%20Tiago!%20Vim%20pelo%20site%20e%20tenho%20uma%20d%C3%BAvida." target="_blank" rel="noopener" aria-label="Falar com o Prof. Tiago no WhatsApp"><svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.2.6 4.4 1.7 6.3L3.2 28.8l7.1-1.9c1.8 1 3.8 1.5 5.8 1.5 7 0 12.7-5.6 12.7-12.6S23 3 16 3Zm0 23.1c-1.9 0-3.7-.5-5.3-1.4l-.4-.2-4.2 1.1 1.1-4.1-.3-.4c-1-1.6-1.6-3.5-1.6-5.5C5.3 9.8 10.1 5.1 16 5.1s10.7 4.7 10.7 10.5S21.9 26.1 16 26.1Zm5.9-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8 0 1.6 1.2 3.2 1.4 3.4.2.2 2.3 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4Z"/></svg><span class="wa-rotulo">Fale comigo no WhatsApp</span></a>
</body>
</html>
`;
}

const itemQuestao = (q) => `<li class="q-item" data-banca="${q.banca_slug}" data-tema="${q.tema_slug}" data-texto="${esc((q.enunciado + ' ' + q.prova).toLowerCase().slice(0, 400))}">
  <a href="${urlQuestao(q)}"><span class="q-tit">${esc(tituloQuestao(q))}</span>
  <span class="q-trecho">${esc(curto(q.enunciado, 140))}</span></a>
</li>`;

const blocoVideo = (videoId, titulo, rotulo = 'Assistir à resolução') => `<div class="video-lite" data-id="${videoId}">
  <a class="video-capa" href="https://www.youtube.com/watch?v=${videoId}" data-titulo="${esc(titulo)}">
    <img src="https://i.ytimg.com/vi/${videoId}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy">
    <span class="play">${esc(rotulo)}</span>
  </a>
</div>`;

const videoLD = ({ video, nome, descricao, publicado, duracao }) => ({
  '@context': 'https://schema.org', '@type': 'VideoObject', name: nome, description: descricao,
  thumbnailUrl: [`https://i.ytimg.com/vi/${video}/hqdefault.jpg`], uploadDate: publicado, duration: duracao,
  embedUrl: `https://www.youtube-nocookie.com/embed/${video}`, contentUrl: `https://www.youtube.com/watch?v=${video}`,
  author: AUTOR, inLanguage: 'pt-BR',
});

const SCRIPT_VIDEO = `<script>
document.querySelectorAll('.video-capa').forEach(function (a) {
  a.addEventListener('click', function (e) {
    e.preventDefault();
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + a.parentNode.dataset.id + '?autoplay=1';
    f.title = a.dataset.titulo; f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'; f.allowFullscreen = true;
    a.replaceWith(f);
  });
});
</script>`;

// ---------- páginas de questão ----------
function paginaQuestao(q) {
  const caminho = urlQuestao(q);
  const serie = ordenar(porBanca[q.banca_slug]);
  const mesmoTema = ordenar(porTema[q.tema_slug]).filter((x) => x.video !== q.video).slice(0, 6);
  const mesmaBanca = serie.filter((x) => x.video !== q.video && x.tema_slug !== q.tema_slug).slice(0, 4);
  const alts = q.alternativas.length ? `<ol class="alts" data-gabarito="${esc(q.gabarito.toLowerCase())}">${q.alternativas.map(([l, t]) =>
    `<li><button type="button" data-letra="${l}"><b>${l.toUpperCase()}</b> <span>${esc(t)}</span></button></li>`).join('')}</ol>
    <p class="retorno" aria-live="polite" hidden></p>` : '';
  const ebook = BANCA_INFO[q.banca_slug]?.ebook ? `<aside class="cta"><p>Quer treinar só com questões da ${esc(q.banca)}?</p><a class="btn" href="${BANCA_INFO[q.banca_slug].ebook}">${esc(BANCA_INFO[q.banca_slug].ebookNome)}</a></aside>`
    : TEMA_INFO[q.tema_slug]?.ebook ? `<aside class="cta"><p>Quer mais questões de ${esc(q.tema.toLowerCase())}?</p><a class="btn" href="${TEMA_INFO[q.tema_slug].ebook}">${esc(TEMA_INFO[q.tema_slug].ebookNome)}</a></aside>` : '';
  const migalhas = [['Início', '/'], ['Questões', '/questoes/']];
  if (urlBanca(q.banca_slug)) migalhas.push([q.banca, urlBanca(q.banca_slug)]);
  else if (urlTema(q.tema_slug)) migalhas.push([q.tema, urlTema(q.tema_slug)]);
  migalhas.push([tituloQuestao(q), caminho]);
  const descricao = curto(`${q.banca}${q.ano ? ' ' + q.ano : ''}, ${q.tema}: ${q.enunciado}`, 155) ;
  const linkCompartilhar = encodeURIComponent(SITE + caminho);
  const corpo = `<article class="questao">
  <h1>${esc(tituloQuestao(q))}</h1>
  <dl class="ficha">
    <div><dt>Banca</dt><dd>${urlBanca(q.banca_slug) ? `<a href="${urlBanca(q.banca_slug)}">${esc(q.banca)}</a>` : esc(q.banca)}</dd></div>
    ${q.ano ? `<div><dt>Ano</dt><dd>${q.ano}</dd></div>` : ''}
    ${q.orgao ? `<div><dt>Órgão</dt><dd>${esc(q.orgao)}</dd></div>` : ''}
    <div><dt>Assunto</dt><dd>${urlTema(q.tema_slug) ? `<a href="${urlTema(q.tema_slug)}">${esc(q.assunto || q.tema)}</a>` : esc(q.assunto || q.tema)}</dd></div>
    <div class="largo"><dt>Prova</dt><dd>${esc(q.prova)}</dd></div>
  </dl>
  <section class="enunciado" aria-labelledby="t-enunciado">
    <h2 id="t-enunciado" class="oculto-visual">Enunciado</h2>
    ${paragrafos(q.enunciado)}
    ${alts}
  </section>
  <p class="dica-tentar">Tente responder antes de abrir o gabarito.</p>
  <details class="gabarito">
    <summary>Ver gabarito</summary>
    <p>Gabarito: <strong>${esc(q.gabarito)}</strong>${q.alternativas.find(([l]) => l === q.gabarito.toLowerCase()) ? ` — ${esc(q.alternativas.find(([l]) => l === q.gabarito.toLowerCase())[1])}` : ''}</p>
  </details>
  <section class="resolucao" aria-labelledby="t-res">
    <h2 id="t-res">Resolução passo a passo em vídeo</h2>
    <p>Resolvida pelo Prof. Tiago Gomes (${dur(q.duracao)}).</p>
    ${blocoVideo(q.video, q.titulo_video)}
  </section>
  ${ebook}
  <p class="compartilhar">Compartilhar: <a href="https://www.reddit.com/submit?url=${linkCompartilhar}&title=${encodeURIComponent(tituloQuestao(q))}">Reddit</a> · <a href="https://wa.me/?text=${encodeURIComponent(tituloQuestao(q) + ' ' + SITE + caminho)}">WhatsApp</a></p>
</article>
${mesmoTema.length ? `<section class="relacionadas"><h2>Mais questões de ${esc(q.tema.toLowerCase())}</h2><ul class="q-lista">${mesmoTema.map(itemQuestao).join('')}</ul>${urlTema(q.tema_slug) ? `<p><a href="${urlTema(q.tema_slug)}">Todas as questões de ${esc(q.tema.toLowerCase())}</a></p>` : ''}</section>` : ''}
${mesmaBanca.length ? `<section class="relacionadas"><h2>Outras questões da ${esc(q.banca)}</h2><ul class="q-lista">${mesmaBanca.map(itemQuestao).join('')}</ul>${urlBanca(q.banca_slug) ? `<p><a href="${urlBanca(q.banca_slug)}">Todas as questões da ${esc(q.banca)}</a></p>` : ''}</section>` : ''}
<script>
(function () {
  var lista = document.querySelector('.alts'); if (!lista) return;
  var certa = lista.dataset.gabarito, ret = document.querySelector('.retorno');
  lista.querySelectorAll('button').forEach(function (b) {
    b.addEventListener('click', function () {
      lista.querySelectorAll('button').forEach(function (x) { x.disabled = true; if (x.dataset.letra === certa) x.classList.add('certa'); });
      var ok = b.dataset.letra === certa; if (!ok) b.classList.add('errada');
      ret.hidden = false; ret.textContent = ok ? 'Você acertou! Veja a resolução para conferir o raciocínio.' : 'Não foi dessa vez. A resposta certa está marcada em verde; a resolução abaixo mostra o caminho.';
      document.querySelector('.gabarito').open = true;
    });
  });
})();
</script>
${SCRIPT_VIDEO}`;
  const ld = [
    videoLD({ video: q.video, nome: q.titulo_video, descricao: curto(`Resolução da questão ${q.banca}${q.ano ? ' ' + q.ano : ''} sobre ${q.tema}. ${q.enunciado}`, 300), publicado: q.publicado, duracao: q.duracao }),
  ];
  return { caminho, html: pagina({ caminho, titulo: `${q.tema} (${q.banca}${q.ano ? ' ' + q.ano : ''}): ${curto(q.enunciado.replace(/[“”"]/g, ''), 70)} | Resolvida`, descricao, corpo, ld, og: `https://i.ytimg.com/vi/${q.video}/hqdefault.jpg`, tipo: 'article', migalhas }) };
}

// ---------- listas (banca/tema) ----------
function paginaLista({ caminho, h1, intro, lista, migalhas, extra = '', ld = [], descricao }) {
  const corpo = `<h1>${esc(h1)}</h1>
<p class="intro">${intro}</p>
${extra}
<h2>${lista.length} questões resolvidas</h2>
<ul class="q-lista">${ordenar(lista).map(itemQuestao).join('\n')}</ul>
<aside class="cta"><p>Receba questões comentadas da sua banca no e-mail, toda semana.</p><a class="btn" href="/#questoes">Quero receber</a></aside>
${SCRIPT_VIDEO}`;
  return { caminho, html: pagina({ caminho, titulo: h1 + ' | Prof. Tiago Gomes', descricao, corpo, migalhas, ld }) };
}

function paginaBanca(b) {
  const nome = nomeBanca[b], info = BANCA_INFO[b] || {};
  const temas = [...new Set(porBanca[b].map((q) => q.tema))].join(', ').toLowerCase();
  const extra = `<p class="acoes-lista">${info.playlist ? `<a href="${info.playlist}">Playlist da ${esc(nome)} no YouTube</a>` : `<a href="${CANAL}/search?query=${encodeURIComponent(nome)}">Vídeos da ${esc(nome)} no canal</a>`}${info.ebook ? ` · <a href="${info.ebook}">${esc(info.ebookNome)}</a>` : ''}</p>`;
  return paginaLista({
    caminho: `/questoes/bancas/${b}/`, h1: `Questões de Raciocínio Lógico da banca ${nome}`,
    intro: `Questões de provas da ${esc(nome)} com enunciado, gabarito e resolução em vídeo. Assuntos: ${esc(temas)}.`,
    descricao: curto(`Questões de Raciocínio Lógico da banca ${nome} resolvidas pelo Prof. Tiago Gomes: enunciado, gabarito e resolução em vídeo. Assuntos: ${temas}.`, 155),
    lista: porBanca[b], migalhas: [['Início', '/'], ['Questões', '/questoes/'], ['Bancas', '/questoes/bancas/'], [nome, `/questoes/bancas/${b}/`]], extra,
  });
}

function paginaTema(t) {
  const nome = nomeTema[t], info = TEMA_INFO[t] || {};
  const bancas = [...new Set(porTema[t].map((q) => q.banca))].join(', ');
  let extra = '', ld = [];
  if (info.aulao) {
    extra += `<section class="aulao"><h2>Aula completa</h2><p>${esc(info.aulao.titulo)} (${dur(info.aulao.duracao)}).</p>${blocoVideo(info.aulao.video, info.aulao.titulo, 'Assistir à aula')}</section>`;
    ld.push(videoLD({ video: info.aulao.video, nome: info.aulao.titulo, descricao: `Aula do Prof. Tiago Gomes: ${info.aulao.titulo}, para concursos públicos.`, publicado: info.aulao.publicado, duracao: info.aulao.duracao }));
  }
  if (info.playlist || info.ebook) extra += `<p class="acoes-lista">${info.playlist ? `<a href="${info.playlist}">Playlist no YouTube</a>` : ''}${info.playlist && info.ebook ? ' · ' : ''}${info.ebook ? `<a href="${info.ebook}">${esc(info.ebookNome)}</a>` : ''}</p>`;
  return paginaLista({
    caminho: `/questoes/${t}/`, h1: `${nome}: questões de concurso resolvidas`,
    intro: esc(info.intro || `Questões de ${nome.toLowerCase()} com gabarito e resolução em vídeo.`) + ` Bancas: ${esc(bancas)}.`,
    descricao: curto(`${nome}: questões de concursos resolvidas passo a passo pelo Prof. Tiago Gomes, com gabarito e vídeo. Bancas: ${bancas}.`, 155),
    lista: porTema[t], migalhas: [['Início', '/'], ['Questões', '/questoes/'], [nome, `/questoes/${t}/`]], extra, ld,
  });
}

function paginaBancas() {
  const todasBancas = Object.keys(porBanca).sort((a, b) => porBanca[b].length - porBanca[a].length);
  const corpo = `<h1>Questões de Raciocínio Lógico por banca</h1>
<p class="intro">Escolha a banca da sua prova. Cada página reúne as questões dela com gabarito e resolução em vídeo.</p>
<ul class="grade">${todasBancas.map((b) => `<li>${urlBanca(b) ? `<a href="${urlBanca(b)}"><b>${esc(nomeBanca[b])}</b><span>${porBanca[b].length} questões</span></a>` : `<span class="sem-pagina"><b>${esc(nomeBanca[b])}</b><span>${porBanca[b].length} ${porBanca[b].length === 1 ? 'questão' : 'questões'}: ${porBanca[b].map((q) => `<a href="${urlQuestao(q)}">${esc(q.tema)}</a>`).join(', ')}</span></span>`}</li>`).join('')}</ul>`;
  return { caminho: '/questoes/bancas/', html: pagina({ caminho: '/questoes/bancas/', titulo: 'Questões de Raciocínio Lógico por banca | Prof. Tiago Gomes', descricao: 'Questões de Raciocínio Lógico resolvidas, separadas por banca: IBGP, MS CONCURSOS, IDECAN, Consulplan, FGV e outras.', corpo, migalhas: [['Início', '/'], ['Questões', '/questoes/'], ['Bancas', '/questoes/bancas/']] }) };
}

function paginaHub() {
  const opc = (obj, nomes) => Object.keys(obj).sort((a, b) => nomes[a].localeCompare(nomes[b], 'pt')).map((k) => `<option value="${k}">${esc(nomes[k])} (${obj[k].length})</option>`).join('');
  const corpo = `<h1>Banco de questões de Raciocínio Lógico resolvidas</h1>
<p class="intro">Questões de concursos com enunciado, gabarito e resolução passo a passo em vídeo pelo Prof. Tiago Gomes. Filtre por banca ou assunto, ou abra as páginas abaixo.</p>
<section class="atalhos" aria-label="Navegar por assunto e banca">
  <div><h2>Por assunto</h2><ul>${temasComPagina.map((t) => `<li><a href="/questoes/${t}/">${esc(nomeTema[t])}</a> <span>${porTema[t].length}</span></li>`).join('')}</ul></div>
  <div><h2>Por banca</h2><ul>${bancasComPagina.map((b) => `<li><a href="/questoes/bancas/${b}/">${esc(nomeBanca[b])}</a> <span>${porBanca[b].length}</span></li>`).join('')}<li><a href="/questoes/bancas/">Todas as bancas</a></li></ul></div>
</section>
<section aria-labelledby="t-todas">
  <h2 id="t-todas">Todas as questões</h2>
  <form class="filtros" role="search" onsubmit="return false">
    <label>Banca<select id="f-banca"><option value="">Todas</option>${opc(porBanca, nomeBanca)}</select></label>
    <label>Assunto<select id="f-tema"><option value="">Todos</option>${opc(porTema, nomeTema)}</select></label>
    <label class="busca">Buscar no enunciado<input id="f-busca" type="search" placeholder="Ex.: negação, sequência, Porto Velho"></label>
  </form>
  <p class="contagem" id="contagem" aria-live="polite">${completas.length} questões</p>
  <ul class="q-lista" id="lista">${ordenar(completas).map(itemQuestao).join('\n')}</ul>
  <p class="vazio" id="vazio" hidden>Nenhuma questão com esses filtros. <button type="button" id="limpar">Limpar filtros</button></p>
</section>
<script>
(function () {
  var b = document.getElementById('f-banca'), t = document.getElementById('f-tema'), s = document.getElementById('f-busca');
  var itens = [].slice.call(document.querySelectorAll('#lista .q-item')), cont = document.getElementById('contagem'), vazio = document.getElementById('vazio');
  function filtrar() {
    var n = 0, termo = s.value.trim().toLowerCase();
    itens.forEach(function (li) {
      var ok = (!b.value || li.dataset.banca === b.value) && (!t.value || li.dataset.tema === t.value) && (!termo || li.dataset.texto.indexOf(termo) > -1);
      li.hidden = !ok; if (ok) n++;
    });
    cont.textContent = n + (n === 1 ? ' questão' : ' questões'); vazio.hidden = n > 0;
  }
  [b, t].forEach(function (el) { el.addEventListener('change', filtrar); }); s.addEventListener('input', filtrar);
  document.getElementById('limpar').addEventListener('click', function () { b.value = ''; t.value = ''; s.value = ''; filtrar(); });
})();
</script>`;
  const ld = [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Banco de questões de Raciocínio Lógico resolvidas', url: SITE + '/questoes/', author: AUTOR, inLanguage: 'pt-BR' }];
  return { caminho: '/questoes/', html: pagina({ caminho: '/questoes/', titulo: 'Banco de questões de Raciocínio Lógico resolvidas | Prof. Tiago Gomes', descricao: `${completas.length} questões de Raciocínio Lógico de concursos com gabarito e resolução em vídeo, por banca (IBGP, MS CONCURSOS, IDECAN, Consulplan…) e por assunto.`, corpo, ld, migalhas: [['Início', '/'], ['Questões', '/questoes/']] }) };
}

// ---------- gravação ----------
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
const ESTATICOS = ['index.html', 'privacidade.html', '404.html', 'robots.txt', 'llms.txt', 'guia', 'trilha', 'assets'];
for (const f of ESTATICOS) if (existsSync(join(RAIZ, f))) cpSync(join(RAIZ, f), join(DIST, f), { recursive: true });
for (const f of readdirSync(RAIZ)) if (/^[0-9a-f]{32}\.txt$/.test(f)) cpSync(join(RAIZ, f), join(DIST, f)); // chave do IndexNow

const geradas = [paginaHub(), paginaBancas(), ...bancasComPagina.map(paginaBanca), ...temasComPagina.map(paginaTema), ...completas.map(paginaQuestao)];
for (const { caminho, html } of geradas) {
  const dir = join(DIST, caminho);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
}

// versão nos arquivos de estilo: cada deploy força o navegador a baixar o CSS novo
const VERSAO = (process.env.COMMIT_REF || Date.now().toString(36)).slice(0, 8);
(function carimbar(d) {
  for (const f of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, f.name);
    if (f.isDirectory()) carimbar(p);
    else if (f.name.endsWith('.html')) writeFileSync(p, readFileSync(p, 'utf8')
      .replace(/\/assets\/(\w+)\.css"/g, `/assets/$1.css?v=${VERSAO}"`)
      // links para fora do site abrem em outra aba, para o aluno não sair do site
      .replace(/<a ((?:(?!>)[^])*?)href="(https?:\/\/(?!proftiagogomes\.com\.br)[^"]+)"((?:(?!>)[^])*)>/g, (m, a, href, b) =>
        /target=/.test(a + b) ? m : `<a ${a}href="${href}"${b} target="_blank" rel="noopener">`));
  }
})(DIST);

// sitemap: só URLs canônicas públicas que este build publica
const fixas = ['/', '/trilha/', '/trilha/roteiro/', '/guia/', '/privacidade.html'];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...fixas, ...geradas.map((g) => g.caminho)].map((c) => `  <url><loc>${SITE}${c}</loc><lastmod>${HOJE}</lastmod></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(DIST, 'sitemap.xml'), sitemap);
writeFileSync(join(DIST, 'urls.txt'), [...fixas, ...geradas.map((g) => g.caminho)].map((c) => SITE + c).join('\n') + '\n');
console.log(`OK: ${geradas.length} páginas geradas (${completas.length} questões, ${bancasComPagina.length} bancas, ${temasComPagina.length} temas). ${todas.length - completas.length} questões com lacunas ficaram de fora (data/lacunas.csv).`);
