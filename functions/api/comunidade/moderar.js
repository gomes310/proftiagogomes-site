// Só o professor (usuarios.admin = 1)
// GET  /api/comunidade/moderar?status=novo → relatos para analisar
// POST /api/comunidade/moderar {id, status, titulo?, resposta?} → muda o andamento, publica a ideia ou responde
import { rota, json, lerJson, ErroHttp, exigirAdmin } from '../../../lib/trilha-api.js';

const STATUS = ['novo', 'votacao', 'fazendo', 'feito', 'arquivado'];

export const onRequestGet = rota(async ({ request, env }) => {
  await exigirAdmin(request, env);
  const s = new URL(request.url).searchParams.get('status') || 'novo';
  if (!STATUS.includes(s)) throw new ErroHttp(400, 'Status inválido.');
  const { results } = await env.DB.prepare(`SELECT r.id, r.criado, r.tipo, r.onde, r.texto, r.contexto, r.status, r.titulo, r.resposta, u.apelido,
      (SELECT COUNT(*) FROM votos v WHERE v.relato_id = r.id) AS votos
    FROM relatos r LEFT JOIN usuarios u ON u.id = r.usuario_id WHERE r.status = ? ORDER BY r.criado DESC LIMIT 100`).bind(s).all();
  const cont = await env.DB.prepare('SELECT status, COUNT(*) AS n FROM relatos GROUP BY status').all();
  return json(200, { relatos: results, contagem: Object.fromEntries(cont.results.map((c) => [c.status, c.n])) }, request);
});

export const onRequestPost = rota(async ({ request, env }) => {
  await exigirAdmin(request, env);
  const { id, status, titulo, resposta } = await lerJson(request, 4000);
  if (!STATUS.includes(status)) throw new ErroHttp(400, 'Status inválido.');
  const t = titulo == null ? null : String(titulo).trim().slice(0, 140) || null;
  if ((status === 'votacao' || status === 'fazendo') && !t) throw new ErroHttp(400, 'Escreva um título público antes de colocar em votação.');
  const r = await env.DB.prepare('UPDATE relatos SET status = ?, titulo = COALESCE(?, titulo), resposta = COALESCE(?, resposta), atualizado = ? WHERE id = ? RETURNING id')
    .bind(status, t, resposta == null ? null : String(resposta).trim().slice(0, 1500) || null, Date.now(), Number(id)).first();
  if (!r) throw new ErroHttp(404, 'Relato não encontrado.');
  return json(200, { ok: true }, request);
});
