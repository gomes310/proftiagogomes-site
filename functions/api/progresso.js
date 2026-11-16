// PUT /api/progresso {estado} → guarda o progresso do aluno na conta
import { rota, json, lerJson, ErroHttp, usuarioDaSessao } from '../../lib/trilha-api.js';

export const onRequestPut = rota(async ({ request, env }) => {
  const u = await usuarioDaSessao(request, env);
  const { estado } = await lerJson(request, 40000);
  if (!estado || typeof estado !== 'object' || typeof estado.xp !== 'number') throw new ErroHttp(400, 'Progresso inválido.');
  const texto = JSON.stringify(estado);
  if (texto.length > 30000) throw new ErroHttp(413, 'Progresso grande demais.');
  await env.DB.prepare('UPDATE usuarios SET progresso = ?, atualizado = ? WHERE id = ?').bind(texto, Date.now(), u.id).run();
  return json(200, { ok: true }, request);
});
