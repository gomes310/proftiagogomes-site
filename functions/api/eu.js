// GET /api/eu → conta e progresso · PATCH {apelido} · DELETE → apaga a conta
import { rota, json, lerJson, ErroHttp, usuarioDaSessao, publico, limparApelido } from '../../lib/trilha-api.js';

export const onRequestGet = rota(async ({ request, env }) => {
  const u = await usuarioDaSessao(request, env);
  let progresso = null;
  try { progresso = u.progresso ? JSON.parse(u.progresso) : null; } catch { /* ignora */ }
  return json(200, { usuario: publico(u), progresso }, request);
});

export const onRequestPatch = rota(async ({ request, env }) => {
  const u = await usuarioDaSessao(request, env);
  const { apelido: bruto } = await lerJson(request, 1000);
  const apelido = limparApelido(bruto);
  if (!apelido) throw new ErroHttp(400, 'Escolha um apelido de 3 a 20 letras ou números.');
  const dono = await env.DB.prepare('SELECT id FROM usuarios WHERE apelido_min = ?').bind(apelido.toLowerCase()).first();
  if (dono && dono.id !== u.id) throw new ErroHttp(409, 'Esse apelido já está em uso. Escolha outro.');
  await env.DB.prepare('UPDATE usuarios SET apelido = ?, apelido_min = ? WHERE id = ?').bind(apelido, apelido.toLowerCase(), u.id).run();
  return json(200, { usuario: publico({ ...u, apelido }) }, request);
});

export const onRequestDelete = rota(async ({ request, env }) => {
  const u = await usuarioDaSessao(request, env);
  await env.DB.batch([
    env.DB.prepare('DELETE FROM xp_semana WHERE usuario_id = ?').bind(u.id),
    env.DB.prepare('DELETE FROM xp_dia WHERE usuario_id = ?').bind(u.id),
    env.DB.prepare('DELETE FROM sessoes WHERE usuario_id = ?').bind(u.id),
    env.DB.prepare('DELETE FROM usuarios WHERE id = ?').bind(u.id)
  ]);
  return json(200, { ok: true }, request);
});
