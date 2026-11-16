# Banco de questões e descoberta em buscadores: relatório (16/11/2026)

## Auditoria inicial (antes das mudanças)
- Site estático (HTML + CSS + JS, sem build) no Netlify, publicado da raiz do repositório; função `/api/inscrever` para a Brevo.
- `/#questoes` era só a inscrição por e-mail; **não havia banco de questões no site**. A fonte real das questões são as descrições dos vídeos do canal (banca/órgão/cargo/ano, assunto, enunciado, alternativas e gabarito).
- `/robots.txt` e `/sitemap.xml` respondiam 404; nenhuma página tinha `<link rel="canonical">`; sem dados estruturados; sem página 404 própria.

## O que mudou
- `data/questoes.json`: fonte única. Extraída por `scripts/extrair_descricoes.py` de 100 descrições de vídeos coletadas via vidIQ.
- `scripts/build.mjs`: gera `dist/` em cada deploy:
  - a página `/questoes/` e as páginas por banca, por tema e por questão;
  - `sitemap.xml` e `urls.txt`.
- O Netlify passou a publicar `dist/` com `node scripts/build.mjs`.
- `scripts/verificar.mjs`: testes do HTML gerado.
- `robots.txt`, `llms.txt`, `404.html`, imagem de compartilhamento (`assets/og.png`), canônicas e Open Graph em todas as páginas.
- JSON-LD:
  - `BreadcrumbList` em todas as páginas do banco;
  - `VideoObject` nas questões e nas aulas, com o Prof. Tiago Gomes como autor;
  - `WebSite`/`Person` na home.
- IndexNow: arquivo de chave na raiz e função `deploy-succeeded`, desligada até `INDEXNOW_ATIVO=1`.

## URLs criadas (66 no sitemap)
- `/questoes/` com filtros por banca, assunto e busca. Os filtros rodam na página e não criam URLs.
- `/questoes/bancas/` e as bancas com página própria:
  - `/questoes/bancas/ms-concursos/`
  - `/questoes/bancas/ibgp/`
  - `/questoes/bancas/idecan/`
  - `/questoes/bancas/consulplan/`
- Temas:
  - `/questoes/sequencias-logicas/`
  - `/questoes/verdades-e-mentiras/`
  - `/questoes/proposicoes-e-conectivos/`
  - `/questoes/equivalencias-e-negacoes/`
  - `/questoes/tabela-verdade/`
- 52 questões em `/questao/<banca>-<orgao>-<ano>-<tema>-<id-do-video>/`. A lista completa está em `dist/urls.txt` após o build.

Bancas e temas com menos de 3 questões completas aparecem nas listas, mas não ganharam página própria, para evitar páginas rasas: FGV, FUNDEP, AOCP, AVANÇASP, Verbena, tautologia, casa dos pombos, datas.

## Lacunas editoriais (para revisão do professor)
48 vídeos ficaram fora das páginas individuais. O motivo de cada um está em `data/lacunas.csv`:
- a maioria dos vídeos antigos (IBFC, IBGP 001–004, AOCP, CEBRASPE, Selecon) **não tem o gabarito na descrição**;
- alguns têm enunciado ou alternativas que dependem de figura;
- os aulões longos não são uma questão única.

Para incluir uma dessas questões, basta pôr `Gabarito: X` na descrição do vídeo (ou direto em `data/questoes.json`, campo `gabarito`, com `completa: true`) e publicar.

Revisar também:
- símbolos que se perderam na cópia, como "n 2" no lugar de n² (MS CONCURSOS, questão 95);
- o fato de que **ainda não há resolução comentada em texto**: a resolução é o vídeo. Um parágrafo de texto por questão melhoraria a citação por buscas com IA.

## Próximos passos depois que o domínio ativar
1. **Google Search Console**:
   - adicionar a propriedade de domínio `proftiagogomes.com.br` (verificação por TXT no Cloudflare);
   - em Sitemaps, enviar `https://proftiagogomes.com.br/sitemap.xml`;
   - inspecionar `/questoes/` e pedir indexação.
2. **Bing Webmaster Tools**: importar o site do Search Console (ou verificar por DNS) e enviar o mesmo sitemap. O Bing também alimenta buscas de IA.
3. **IndexNow**: no Netlify, criar a variável `INDEXNOW_ATIVO=1`. A cada deploy, as URLs do sitemap são avisadas ao Bing e a outros buscadores.
4. Acompanhar indexação, posições e citações (Search Console, Bing e tráfego de referência de chatgpt.com e perplexity.ai) nas semanas seguintes.

## Reddit
- `robots.txt` libera o `redditbot` e todas as páginas têm Open Graph, então os links mostram título, descrição e imagem.
- Cada questão tem o botão "Compartilhar: Reddit".
- Sugestão de uso: responder dúvidas reais em comunidades de concursos com a questão resolvida, com o link da página da questão (não do vídeo) e o enunciado no corpo do post. Ler as regras de cada comunidade sobre autopromoção antes. O Reddit é muito citado por buscas com IA.
