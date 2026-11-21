// POST /api/relatos {tipo, onde, texto, contexto} → testador relata erro, ideia ou problema (com ou sem conta)
// GET  /api/relatos → relatos da própria conta, com o andamento e a resposta do professor
import { rota, json, lerJson, ErroHttp, semDb, usuarioDaSessao, usuarioOpcional, limiteIp } from '../../lib/trilha-api.js';

const TIPOS = ['questao', 'explicacao', 'ideia', 'app'];

export const onRequestPost = rota(async ({ request, env }) => {
  semDb(env);
  await limiteIp(request, env, 30);
  const { tipo, onde, texto, contexto } = await lerJson(request, 6000);
  if (!TIPOS.includes(tipo)) throw new ErroHttp(400, 'Escolha o tipo do relato.');
  const t = String(texto || '').trim();
  if (t.length < 5) throw new ErroHttp(400, 'Conte um pouco mais (pelo menos uma frase curta).');
  if (t.length > 1500) throw new ErroHttp(400, 'O texto passou de 1.500 caracteres. Resuma um pouco.');
  const u = await usuarioOpcional(request, env);
  const ctx = contexto && typeof contexto === 'object' ? JSON.stringify(contexto).slice(0, 1500) : null;
  const agora = Date.now();
  const r = await env.DB.prepare('INSERT INTO relatos (criado, usuario_id, tipo, onde, texto, contexto, atualizado) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id')
    .bind(agora, u ? u.id : null, tipo, String(onde || '').slice(0, 200), t, ctx, agora).first();
  return json(201, { ok: true, id: r.id, comConta: !!u }, request);
});

export const onRequestGet = rota(async ({ request, env }) => {
  const u = await usuarioDaSessao(request, env);
  const { results } = await env.DB.prepare('SELECT id, criado, tipo, onde, texto, status, titulo, resposta, atualizado FROM relatos WHERE usuario_id = ? ORDER BY criado DESC LIMIT 50').bind(u.id).all();
  return json(200, { relatos: results }, request);
});
