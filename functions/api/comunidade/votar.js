// POST /api/comunidade/votar {id} → apoia (ou tira o apoio de) uma ideia em votação
import { rota, json, lerJson, ErroHttp, usuarioDaSessao } from '../../../lib/trilha-api.js';

export const onRequestPost = rota(async ({ request, env }) => {
  const u = await usuarioDaSessao(request, env);
  const { id } = await lerJson(request, 200);
  const r = await env.DB.prepare(`SELECT id FROM relatos WHERE id = ? AND status IN ('votacao','fazendo')`).bind(Number(id)).first();
  if (!r) throw new ErroHttp(404, 'Essa ideia não está mais em votação.');
  const ja = await env.DB.prepare('SELECT 1 FROM votos WHERE relato_id = ? AND usuario_id = ?').bind(r.id, u.id).first();
  if (ja) await env.DB.prepare('DELETE FROM votos WHERE relato_id = ? AND usuario_id = ?').bind(r.id, u.id).run();
  else await env.DB.prepare('INSERT INTO votos (relato_id, usuario_id, criado) VALUES (?, ?, ?)').bind(r.id, u.id, Date.now()).run();
  const n = await env.DB.prepare('SELECT COUNT(*) AS n FROM votos WHERE relato_id = ?').bind(r.id).first();
  return json(200, { ok: true, meu: !ja, votos: n.n }, request);
});
