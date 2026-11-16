// GET /api/ranking → liga da semana: top 30 + a posição de quem está logado
import { rota, json, semDb, semanaAtual, usuarioDaSessao } from '../../lib/trilha-api.js';

export const onRequestGet = rota(async ({ request, env }) => {
  semDb(env);
  const { id: semana, fim } = semanaAtual();
  let eu = null;
  if (request.headers.get('Authorization')) { try { eu = await usuarioDaSessao(request, env); } catch { eu = null; } }
  const { results } = await env.DB.prepare('SELECT u.id, u.apelido, x.xp FROM xp_semana x JOIN usuarios u ON u.id = x.usuario_id WHERE x.semana = ? AND x.xp > 0 ORDER BY x.xp DESC, x.atualizado ASC LIMIT 30').bind(semana).all();
  const total = (await env.DB.prepare('SELECT COUNT(*) AS n FROM xp_semana WHERE semana = ? AND xp > 0').bind(semana).first()).n;
  const lista = results.map((r, i) => ({ pos: i + 1, apelido: r.apelido, xp: r.xp, eu: !!eu && r.id === eu.id }));
  let minha = null;
  if (eu) {
    const m = await env.DB.prepare('SELECT xp, atualizado FROM xp_semana WHERE usuario_id = ? AND semana = ?').bind(eu.id, semana).first();
    if (m && m.xp > 0) {
      const acima = await env.DB.prepare('SELECT COUNT(*) AS n FROM xp_semana WHERE semana = ? AND (xp > ? OR (xp = ? AND atualizado < ?))').bind(semana, m.xp, m.xp, m.atualizado).first();
      minha = { pos: acima.n + 1, apelido: eu.apelido, xp: m.xp, eu: true };
    }
  }
  return json(200, { semana, fim, lista, eu: minha, total }, request);
});
