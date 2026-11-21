// GET /api/comunidade → ideias em votação (com votos) e melhorias já feitas. Só mostra o título escrito pelo professor.
import { rota, json, semDb, usuarioOpcional } from '../../../lib/trilha-api.js';

export const onRequestGet = rota(async ({ request, env }) => {
  semDb(env);
  const u = await usuarioOpcional(request, env);
  const ideias = await env.DB.prepare(`SELECT r.id, r.titulo, r.resposta, r.status, r.atualizado,
      (SELECT COUNT(*) FROM votos v WHERE v.relato_id = r.id) AS votos,
      (SELECT COUNT(*) FROM votos v WHERE v.relato_id = r.id AND v.usuario_id = ?) AS meu
    FROM relatos r WHERE r.status IN ('votacao','fazendo') AND r.titulo IS NOT NULL ORDER BY votos DESC, r.atualizado DESC LIMIT 50`).bind(u ? u.id : '').all();
  const feitos = await env.DB.prepare(`SELECT id, titulo, resposta, atualizado FROM relatos WHERE status = 'feito' AND titulo IS NOT NULL ORDER BY atualizado DESC LIMIT 30`).all();
  const n = await env.DB.prepare(`SELECT COUNT(*) AS n FROM relatos WHERE status = 'feito'`).first();
  return json(200, { ideias: ideias.results, feitos: feitos.results, totalResolvidos: n ? n.n : 0, admin: !!(u && u.admin) }, request);
});
