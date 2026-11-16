// POST /api/xp {ganho} → soma XP na liga da semana, com limites contra trapaça
import { rota, json, lerJson, ErroHttp, usuarioDaSessao, semanaAtual, diaBrasilia } from '../../lib/trilha-api.js';

const MAX_POR_LICAO = 60;   // 30 de acertos + 5 perfeita + bônus de missões
const MAX_POR_DIA = 600;
const INTERVALO_MIN = 15e3; // uma lição leva mais que 15 segundos

export const onRequestPost = rota(async ({ request, env }) => {
  const u = await usuarioDaSessao(request, env);
  const { ganho } = await lerJson(request, 500);
  const g = Math.floor(Number(ganho));
  if (!Number.isFinite(g) || g < 1) throw new ErroHttp(400, 'XP inválido.');
  const agora = Date.now(), dia = diaBrasilia(agora), semana = semanaAtual(agora).id;
  const d = await env.DB.prepare('SELECT xp, ultimo FROM xp_dia WHERE usuario_id = ? AND dia = ?').bind(u.id, dia).first();
  if (d && agora - d.ultimo < INTERVALO_MIN) throw new ErroHttp(429, 'Calma! Termine a próxima lição para somar mais XP.');
  const valido = Math.max(0, Math.min(g, MAX_POR_LICAO, MAX_POR_DIA - (d ? d.xp : 0)));
  if (valido > 0) {
    await env.DB.batch([
      env.DB.prepare('INSERT INTO xp_dia (usuario_id, dia, xp, ultimo) VALUES (?, ?, ?, ?) ON CONFLICT(usuario_id, dia) DO UPDATE SET xp = xp + excluded.xp, ultimo = excluded.ultimo').bind(u.id, dia, valido, agora),
      env.DB.prepare('INSERT INTO xp_semana (usuario_id, semana, xp, atualizado) VALUES (?, ?, ?, ?) ON CONFLICT(usuario_id, semana) DO UPDATE SET xp = xp + excluded.xp, atualizado = excluded.atualizado').bind(u.id, semana, valido, agora)
    ]);
  }
  return json(200, { ok: true, contado: valido }, request);
});
