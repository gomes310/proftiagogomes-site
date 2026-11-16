// POST /api/auth/entrar {email, codigo, apelido?} → confere o código e cria a sessão
import { rota, json, lerJson, ErroHttp, semDb, emailValido, sha256, aleatorio, limparApelido, publico, limiteIp } from '../../../lib/trilha-api.js';

export const onRequestPost = rota(async ({ request, env }) => {
  semDb(env);
  await limiteIp(request, env, 60);
  const corpo = await lerJson(request, 2000);
  const email = String(corpo.email || '').trim().toLowerCase();
  const cod = String(corpo.codigo || '').replace(/\D/g, '');
  if (!emailValido(email) || cod.length !== 6) throw new ErroHttp(400, 'Confira o e-mail e o código de 6 dígitos.');

  const c = await env.DB.prepare('SELECT * FROM codigos WHERE email = ?').bind(email).first();
  if (!c || c.expira < Date.now()) throw new ErroHttp(400, 'Esse código expirou. Peça um novo.');
  if (c.tentativas >= 5) throw new ErroHttp(429, 'Muitas tentativas erradas. Peça um novo código.');
  const hash = await sha256(email + ':' + cod + ':' + (env.AUTH_SEGREDO || ''));
  if (hash !== c.hash) {
    await env.DB.prepare('UPDATE codigos SET tentativas = tentativas + 1 WHERE email = ?').bind(email).run();
    throw new ErroHttp(400, 'Código incorreto. Confira o último e-mail que chegou.');
  }

  let u = await env.DB.prepare('SELECT * FROM usuarios WHERE email = ?').bind(email).first();
  if (!u) {
    const apelido = limparApelido(corpo.apelido);
    if (!apelido) throw new ErroHttp(400, 'Escolha um apelido de 3 a 20 letras ou números.');
    const dono = await env.DB.prepare('SELECT 1 FROM usuarios WHERE apelido_min = ?').bind(apelido.toLowerCase()).first();
    if (dono) throw new ErroHttp(409, 'Esse apelido já está em uso. Escolha outro.');
    const id = aleatorio(12);
    const criado = new Date().toISOString();
    await env.DB.prepare('INSERT INTO usuarios (id, email, apelido, apelido_min, criado) VALUES (?, ?, ?, ?, ?)').bind(id, email, apelido, apelido.toLowerCase(), criado).run();
    u = { id, email, apelido, criado, progresso: null };
  }
  await env.DB.prepare('DELETE FROM codigos WHERE email = ?').bind(email).run();

  const token = aleatorio(32);
  const agora = Date.now();
  await env.DB.batch([
    env.DB.prepare('INSERT INTO sessoes (hash, usuario_id, expira, criado) VALUES (?, ?, ?, ?)').bind(await sha256(token), u.id, agora + 180 * 864e5, agora),
    env.DB.prepare('DELETE FROM sessoes WHERE expira < ?').bind(agora)
  ]);
  let progresso = null;
  try { progresso = u.progresso ? JSON.parse(u.progresso) : null; } catch { /* ignora */ }
  return json(200, { token, usuario: publico(u), progresso }, request);
});
