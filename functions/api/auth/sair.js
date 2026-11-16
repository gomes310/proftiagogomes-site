// POST /api/auth/sair → encerra a sessão deste aparelho
import { rota, json, usuarioDaSessao } from '../../../lib/trilha-api.js';

export const onRequestPost = rota(async ({ request, env }) => {
  const u = await usuarioDaSessao(request, env);
  await env.DB.prepare('DELETE FROM sessoes WHERE hash = ?').bind(u.sessao).run();
  return json(200, { ok: true }, request);
});
