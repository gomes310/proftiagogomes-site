// Funções compartilhadas da API da Trilha do RLM (Cloudflare Pages Functions + D1).
// Variáveis: DB (D1), BREVO_API_KEY (secreta), AUTH_SEGREDO (secreta, texto aleatório longo).

export const ORIGENS = ['https://proftiagogomes.com.br', 'https://localhost', 'http://localhost', 'capacitor://localhost', 'http://localhost:5173', 'http://localhost:4173'];

export function cors(request) {
  const o = request.headers.get('Origin') || '';
  if (!ORIGENS.includes(o)) return {};
  return { 'Access-Control-Allow-Origin': o, 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS', 'Access-Control-Max-Age': '86400', Vary: 'Origin' };
}

export function json(status, dados, request) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...(request ? cors(request) : {}) }
  });
}
export const erro = (status, msg, request) => json(status, { erro: msg }, request);

export async function lerJson(request, max = 40000) {
  const t = await request.text();
  if (t.length > max) throw new ErroHttp(413, 'Dados grandes demais.');
  try { return t ? JSON.parse(t) : {}; } catch { throw new ErroHttp(400, 'Dados inválidos.'); }
}
export class ErroHttp extends Error { constructor(status, msg) { super(msg); this.status = status; } }

export function semDb(env) {
  if (!env.DB) throw new ErroHttp(503, 'O login da trilha ainda está sendo ativado. Enquanto isso, seu progresso fica salvo neste aparelho.');
}

export async function sha256(texto) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
}
export function aleatorio(bytes = 32) {
  const a = crypto.getRandomValues(new Uint8Array(bytes));
  return btoa(String.fromCharCode(...a)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function codigo6() {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
  return String(n).padStart(6, '0');
}

export const emailValido = (e) => typeof e === 'string' && e.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
export function limparApelido(a) {
  if (typeof a !== 'string') return null;
  const s = a.normalize('NFC').replace(/\s+/g, ' ').trim();
  if (s.length < 3 || s.length > 20) return null;
  if (!/^[\p{L}\p{N} ._-]+$/u.test(s)) return null;
  if (/https?:|www\.|@/i.test(s)) return null;
  return s;
}

// semana de segunda a domingo no horário de Brasília (UTC-3)
export function semanaAtual(agora = Date.now()) {
  const br = new Date(agora - 3 * 3600e3);
  const dow = (br.getUTCDay() + 6) % 7; // 0 = segunda
  const seg = new Date(Date.UTC(br.getUTCFullYear(), br.getUTCMonth(), br.getUTCDate() - dow));
  const id = seg.toISOString().slice(0, 10);
  const fim = new Date(seg.getTime() + 7 * 864e5 + 3 * 3600e3).toISOString();
  return { id, fim };
}
export function diaBrasilia(agora = Date.now()) { return new Date(agora - 3 * 3600e3).toISOString().slice(0, 10); }

export async function usuarioDaSessao(request, env) {
  semDb(env);
  const m = /^Bearer\s+([A-Za-z0-9_-]{20,100})$/.exec(request.headers.get('Authorization') || '');
  if (!m) throw new ErroHttp(401, 'Entre na sua conta para continuar.');
  const h = await sha256(m[1]);
  const r = await env.DB.prepare('SELECT u.*, s.hash AS sessao FROM sessoes s JOIN usuarios u ON u.id = s.usuario_id WHERE s.hash = ? AND s.expira > ?').bind(h, Date.now()).first();
  if (!r) throw new ErroHttp(401, 'Sua sessão expirou. Entre de novo.');
  return r;
}
export const publico = (u) => ({ apelido: u.apelido, email: u.email, criado: u.criado });

// limite simples por IP: n pedidos por hora
export async function limiteIp(request, env, max) {
  const ip = request.headers.get('CF-Connecting-IP') || 'desconhecido';
  const janela = Math.floor(Date.now() / 3600e3);
  const r = await env.DB.prepare('INSERT INTO limites_ip (ip, janela, n) VALUES (?, ?, 1) ON CONFLICT(ip, janela) DO UPDATE SET n = n + 1 RETURNING n').bind(ip, janela).first();
  if (r && r.n > max) throw new ErroHttp(429, 'Muitas tentativas. Espere um pouco e tente de novo.');
}

// envolve um handler: trata erros e CORS
export function rota(fn) {
  return async (ctx) => {
    try { return await fn(ctx); }
    catch (e) {
      if (e instanceof ErroHttp) return erro(e.status, e.message, ctx.request);
      console.error('trilha-api', e && e.stack || e);
      return erro(500, 'Erro no servidor. Tente de novo em instantes.', ctx.request);
    }
  };
}
