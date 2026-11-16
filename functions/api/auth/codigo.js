// POST /api/auth/codigo {email} → envia um código de 6 dígitos por e-mail (Brevo)
import { rota, json, lerJson, ErroHttp, semDb, emailValido, codigo6, sha256, limiteIp } from '../../../lib/trilha-api.js';

export const onRequestPost = rota(async ({ request, env }) => {
  semDb(env);
  const { email: bruto } = await lerJson(request, 2000);
  const email = String(bruto || '').trim().toLowerCase();
  if (!emailValido(email)) throw new ErroHttp(400, 'Esse e-mail não parece válido. Confira e tente de novo.');
  if (!env.BREVO_API_KEY) throw new ErroHttp(503, 'O envio de e-mails ainda está sendo configurado. Tente mais tarde.');
  await limiteIp(request, env, 20);

  const agora = Date.now(), janela = Math.floor(agora / 3600e3);
  const atual = await env.DB.prepare('SELECT enviados, janela, expira FROM codigos WHERE email = ?').bind(email).first();
  const enviados = atual && atual.janela === janela ? atual.enviados : 0;
  if (enviados >= 5) throw new ErroHttp(429, 'Você pediu muitos códigos nesta hora. Use o último que chegou ou tente daqui a pouco.');
  if (atual && atual.janela === janela && atual.expira - 10 * 60e3 > agora - 30e3) throw new ErroHttp(429, 'Espere 30 segundos para pedir outro código.');

  const cod = codigo6();
  const hash = await sha256(email + ':' + cod + ':' + (env.AUTH_SEGREDO || ''));
  await env.DB.prepare('INSERT INTO codigos (email, hash, expira, tentativas, enviados, janela) VALUES (?, ?, ?, 0, ?, ?) ON CONFLICT(email) DO UPDATE SET hash = excluded.hash, expira = excluded.expira, tentativas = 0, enviados = excluded.enviados, janela = excluded.janela')
    .bind(email, hash, agora + 10 * 60e3, enviados + 1, janela).run();

  const html = `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#172238">
  <h2 style="margin:0 0 12px">Seu código da Trilha do RLM</h2>
  <p>Use este código para entrar na trilha de Raciocínio Lógico:</p>
  <p style="font-size:34px;font-weight:bold;letter-spacing:8px;background:#F1F4F8;border-radius:8px;padding:14px;text-align:center">${cod}</p>
  <p>Ele vale por 10 minutos. Se não foi você que pediu, pode ignorar este e-mail.</p>
  <p style="color:#4E5A70;font-size:13px">Prof. Tiago Gomes · proftiagogomes.com.br</p></div>`;
  const r = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'Content-Type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: 'Prof. Tiago Gomes', email: 'contato@proftiagogomes.com.br' },
      to: [{ email }],
      subject: cod + ' é o seu código da Trilha do RLM',
      htmlContent: html,
      textContent: 'Seu código da Trilha do RLM: ' + cod + '\nVale por 10 minutos. Se não foi você, ignore este e-mail.',
      tags: ['trilha-login']
    })
  });
  if (!r.ok) {
    console.error('brevo', r.status, (await r.text()).slice(0, 300));
    throw new ErroHttp(502, 'Não conseguimos enviar o e-mail agora. Tente de novo em alguns minutos.');
  }
  const existe = await env.DB.prepare('SELECT 1 FROM usuarios WHERE email = ?').bind(email).first();
  return json(200, { ok: true, novo: !existe }, request);
});
