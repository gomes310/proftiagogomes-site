// Estado do aluno: guardado no aparelho e, com login, sincronizado com o servidor.
// Compatível com o formato da versão 1 (chave 'trilha-rlm-v1').
import { useSyncExternalStore } from 'react';
import { LICOES, UNIDADES } from './dados/licoes';

export const XP_NIVEL = 60;
export const META_PADRAO = 30;
const CHAVE = 'trilha-rlm-v1';

export interface Estado {
  v: 2;
  xp: number;
  estrelas: Record<string, number>;
  ofensiva: number;
  maiorOfensiva: number;
  ultimoDia: string | null; // AAAA-MM-DD
  xpDia: Record<string, number>; // XP ganho por dia (últimos 60 dias)
  respostas: number;
  acertos: number;
  maiorCombo: number;
  perfeitas: number;
  licoesFeitas: number; // inclui repetições
  meta: number; // meta diária de XP
  missoes: { dia: string; feitas: string[]; combo: number; licoes: number; perfeitas: number };
  conquistas: Record<string, string>; // id -> data
  atualizado: number;
}

export function diaLocal(d = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}
function diaAntes(dia: string, n = 1) {
  const [a, m, d] = dia.split('-').map(Number);
  return diaLocal(new Date(a, m - 1, d - n));
}
// a v1 gravava "2026-11-5"; normaliza
function normalizaDia(s: string | null | undefined): string | null {
  if (!s) return null;
  const p = String(s).split('-').map(Number);
  if (p.length !== 3 || p.some(isNaN)) return null;
  return diaLocal(new Date(p[0], p[1] - 1, p[2]));
}

function novo(): Estado {
  return {
    v: 2, xp: 0, estrelas: {}, ofensiva: 0, maiorOfensiva: 0, ultimoDia: null, xpDia: {}, respostas: 0, acertos: 0,
    maiorCombo: 0, perfeitas: 0, licoesFeitas: 0, meta: META_PADRAO,
    missoes: { dia: diaLocal(), feitas: [], combo: 0, licoes: 0, perfeitas: 0 }, conquistas: {}, atualizado: 0
  };
}

export function normalizar(bruto: unknown): Estado {
  const e = novo();
  if (!bruto || typeof bruto !== 'object') return e;
  const s = bruto as Partial<Estado>;
  const num = (x: unknown, max = 1e7) => (typeof x === 'number' && isFinite(x) && x >= 0 ? Math.min(Math.floor(x), max) : 0);
  e.xp = num(s.xp);
  if (s.estrelas && typeof s.estrelas === 'object') {
    for (const [k, v] of Object.entries(s.estrelas)) {
      const i = Number(k);
      if (Number.isInteger(i) && i >= 0 && i < LICOES.length) e.estrelas[i] = Math.min(3, Math.max(1, num(v, 3) || 1));
    }
  }
  e.ofensiva = num(s.ofensiva, 10000);
  e.maiorOfensiva = Math.max(num(s.maiorOfensiva, 10000), e.ofensiva);
  e.ultimoDia = normalizaDia(s.ultimoDia);
  if (s.xpDia && typeof s.xpDia === 'object') for (const [k, v] of Object.entries(s.xpDia)) { const d = normalizaDia(k); if (d) e.xpDia[d] = num(v, 100000); }
  e.respostas = num(s.respostas); e.acertos = Math.min(num(s.acertos), e.respostas);
  e.maiorCombo = num(s.maiorCombo, 1000); e.perfeitas = num(s.perfeitas); e.licoesFeitas = num(s.licoesFeitas);
  e.licoesFeitas = Math.max(e.licoesFeitas, Object.keys(e.estrelas).length);
  e.meta = [10, 30, 50, 80].includes(num(s.meta)) ? num(s.meta) : META_PADRAO;
  if (s.missoes && typeof s.missoes === 'object' && s.missoes.dia === diaLocal()) {
    e.missoes = { dia: s.missoes.dia, feitas: Array.isArray(s.missoes.feitas) ? s.missoes.feitas.filter((x) => typeof x === 'string').slice(0, 10) : [], combo: num(s.missoes.combo, 1000), licoes: num(s.missoes.licoes, 1000), perfeitas: num(s.missoes.perfeitas, 1000) };
  }
  if (s.conquistas && typeof s.conquistas === 'object') for (const [k, v] of Object.entries(s.conquistas)) if (typeof v === 'string' && k.length < 40) e.conquistas[k] = v;
  e.atualizado = num(s.atualizado, 1e14);
  // ofensiva quebrada se passou mais de um dia sem estudar
  const hoje = diaLocal();
  if (e.ultimoDia && e.ultimoDia !== hoje && e.ultimoDia !== diaAntes(hoje)) e.ofensiva = 0;
  // guarda só os últimos 60 dias de XP diário
  const corte = diaAntes(hoje, 60);
  for (const d of Object.keys(e.xpDia)) if (d < corte) delete e.xpDia[d];
  return e;
}

let estado: Estado = (() => { try { return normalizar(JSON.parse(localStorage.getItem(CHAVE) || 'null')); } catch { return novo(); } })();
const ouvintes = new Set<() => void>();
const aoMudar = new Set<(e: Estado) => void>();

export function obter() { return estado; }
export function definir(e: Estado, avisarServidor = true) {
  estado = e;
  try { localStorage.setItem(CHAVE, JSON.stringify(e)); } catch { /* sem espaço */ }
  ouvintes.forEach((f) => f());
  if (avisarServidor) aoMudar.forEach((f) => f(e));
}
export function ouvirMudancas(f: (e: Estado) => void) { aoMudar.add(f); return () => aoMudar.delete(f); }
export function useEstado() {
  return useSyncExternalStore((f) => { ouvintes.add(f); return () => ouvintes.delete(f); }, () => estado);
}

// ---------- derivados ----------
export const nivelDe = (xp: number) => Math.floor(xp / XP_NIVEL) + 1;
export const liberada = (e: Estado, i: number) => i === 0 || e.estrelas[i - 1] != null;
export const totalEstrelas = (e: Estado) => Object.values(e.estrelas).reduce((s, n) => s + n, 0);
export const xpHoje = (e: Estado) => e.xpDia[diaLocal()] || 0;
export function ultimos7(e: Estado) {
  const hoje = diaLocal();
  return Array.from({ length: 7 }, (_, k) => { const d = diaAntes(hoje, 6 - k); return { dia: d, xp: e.xpDia[d] || 0 }; });
}

// ---------- missões do dia ----------
export interface Missao { id: string; titulo: string; alvo: number; progresso: (e: Estado) => number; bonus: number }
const POOL: Missao[] = [
  { id: 'meta', titulo: 'Bata sua meta de XP do dia', alvo: 1, progresso: (e) => Math.min(1, xpHoje(e) / e.meta), bonus: 5 },
  { id: 'licao1', titulo: 'Complete 1 lição', alvo: 1, progresso: (e) => e.missoes.licoes, bonus: 5 },
  { id: 'licao2', titulo: 'Complete 2 lições', alvo: 2, progresso: (e) => e.missoes.licoes, bonus: 5 },
  { id: 'combo5', titulo: 'Acerte 5 seguidas', alvo: 5, progresso: (e) => e.missoes.combo, bonus: 5 },
  { id: 'combo3', titulo: 'Acerte 3 seguidas', alvo: 3, progresso: (e) => e.missoes.combo, bonus: 5 },
  { id: 'perfeita', titulo: 'Faça 1 lição sem errar', alvo: 1, progresso: (e) => e.missoes.perfeitas, bonus: 5 }
];
export function missoesDoDia(dia = diaLocal()): Missao[] {
  // 3 missões por dia, escolhidas pela data: todos veem as mesmas no mesmo dia
  let h = 0; for (const c of dia) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const lista = [POOL[0]];
  const resto = POOL.slice(1);
  while (lista.length < 3) { const k = h % resto.length; lista.push(resto.splice(k, 1)[0]); h = Math.floor(h / 7) + 13; }
  return lista;
}

// ---------- conquistas ----------
export interface Conquista { id: string; nome: string; desc: string; icone: string; ok: (e: Estado) => boolean }
export const CONQUISTAS: Conquista[] = [
  { id: 'primeira', nome: 'Primeiro passo', desc: 'Concluiu a primeira lição', icone: '👣', ok: (e) => e.licoesFeitas >= 1 },
  { id: 'perfeita', nome: 'Gabaritou', desc: 'Fez uma lição sem errar nada', icone: '🎯', ok: (e) => e.perfeitas >= 1 },
  { id: 'combo5', nome: 'Embalado', desc: 'Acertou 5 seguidas', icone: '⚡', ok: (e) => e.maiorCombo >= 5 },
  { id: 'combo10', nome: 'Imparável', desc: 'Acertou 10 seguidas', icone: '🚀', ok: (e) => e.maiorCombo >= 10 },
  { id: 'ofensiva3', nome: 'Pegando o ritmo', desc: '3 dias seguidos estudando', icone: '🔥', ok: (e) => e.maiorOfensiva >= 3 },
  { id: 'ofensiva7', nome: 'Uma semana firme', desc: '7 dias seguidos estudando', icone: '📅', ok: (e) => e.maiorOfensiva >= 7 },
  { id: 'xp300', nome: '300 XP', desc: 'Juntou 300 pontos de experiência', icone: '💎', ok: (e) => e.xp >= 300 },
  ...UNIDADES.map((u, k) => ({ id: 'unidade' + (k + 1), nome: u.selo, desc: 'Fechou a ' + u.nome.split(' · ')[0], icone: '🏅', ok: (e: Estado) => u.licoes.every((i) => e.estrelas[i] != null) })),
  { id: 'trilha', nome: 'Trilha completa', desc: 'Terminou as 11 lições', icone: '🏆', ok: (e) => Object.keys(e.estrelas).length === LICOES.length },
  { id: 'estrelas', nome: 'Colecionador', desc: 'Todas as lições com 3 estrelas', icone: '⭐', ok: (e) => LICOES.every((_, i) => e.estrelas[i] === 3) }
];

// ---------- eventos ----------
export function registrarResposta(ok: boolean, combo: number) {
  const e = normalizar(estado);
  e.respostas++; if (ok) e.acertos++;
  e.maiorCombo = Math.max(e.maiorCombo, combo);
  e.missoes.combo = Math.max(e.missoes.combo, combo);
  e.atualizado = Date.now();
  definir(e, false);
}

export interface ResultadoLicao {
  ganho: number; bonusMissoes: number; estrelas: number; nivelAntes: number; nivelDepois: number;
  primeiraVez: boolean; unidadeFechada: number | null; novasConquistas: Conquista[]; missoesConcluidas: Missao[]; metaBatida: boolean;
}

export function registrarLicao(idx: number, acertosPrimeira: number, total: number): ResultadoLicao {
  const e = normalizar(estado);
  const hoje = diaLocal();
  const estrelas = acertosPrimeira === total ? 3 : acertosPrimeira === total - 1 ? 2 : 1;
  const primeiraVez = e.estrelas[idx] == null;
  let ganho = acertosPrimeira * 10 + (estrelas === 3 ? 5 : 0);
  if (!primeiraVez) ganho = Math.round(ganho / 2);
  const nivelAntes = nivelDe(e.xp);
  const metaAntes = (e.xpDia[hoje] || 0) >= e.meta;
  const missoes = missoesDoDia(hoje);
  const conquistasAntes = new Set(Object.keys(e.conquistas));

  e.estrelas[idx] = Math.max(e.estrelas[idx] || 0, estrelas);
  e.licoesFeitas++;
  if (estrelas === 3) { e.perfeitas++; e.missoes.perfeitas++; }
  e.missoes.licoes++;
  if (e.ultimoDia !== hoje) { e.ofensiva = e.ultimoDia === diaAntes(hoje) ? e.ofensiva + 1 : 1; e.ultimoDia = hoje; }
  e.maiorOfensiva = Math.max(e.maiorOfensiva, e.ofensiva);
  e.xp += ganho; e.xpDia[hoje] = (e.xpDia[hoje] || 0) + ganho;

  // missões que fecharam agora dão bônus
  const concluidas: Missao[] = [];
  let bonus = 0;
  for (const m of missoes) {
    if (!e.missoes.feitas.includes(m.id) && m.progresso(e) >= m.alvo) { e.missoes.feitas.push(m.id); concluidas.push(m); bonus += m.bonus; }
  }
  e.xp += bonus; e.xpDia[hoje] += bonus;

  const novas: Conquista[] = [];
  for (const c of CONQUISTAS) if (!conquistasAntes.has(c.id) && c.ok(e)) { e.conquistas[c.id] = hoje; novas.push(c); }
  const unidade = UNIDADES.findIndex((u) => u.licoes.includes(idx));
  const unidadeFechada = primeiraVez && UNIDADES[unidade].licoes.every((i) => e.estrelas[i] != null) ? unidade : null;
  e.atualizado = Date.now();
  definir(e);
  return {
    ganho, bonusMissoes: bonus, estrelas, nivelAntes, nivelDepois: nivelDe(e.xp), primeiraVez, unidadeFechada,
    novasConquistas: novas, missoesConcluidas: concluidas, metaBatida: !metaAntes && (e.xpDia[hoje] || 0) >= e.meta
  };
}

export function mudarMeta(meta: number) { const e = normalizar(estado); e.meta = meta; e.atualizado = Date.now(); definir(e); }

// Junta o progresso do aparelho com o da conta (nunca perde estrelas nem XP)
export function mesclar(a: Estado, b: Estado): Estado {
  const r = normalizar(a.atualizado >= b.atualizado ? a : b);
  const outro = a.atualizado >= b.atualizado ? b : a;
  r.xp = Math.max(a.xp, b.xp);
  for (const [k, v] of Object.entries(outro.estrelas)) r.estrelas[k] = Math.max(r.estrelas[k] || 0, v);
  for (const [k, v] of Object.entries(outro.xpDia)) r.xpDia[k] = Math.max(r.xpDia[k] || 0, v);
  r.maiorOfensiva = Math.max(a.maiorOfensiva, b.maiorOfensiva);
  r.maiorCombo = Math.max(a.maiorCombo, b.maiorCombo);
  r.respostas = Math.max(a.respostas, b.respostas); r.acertos = Math.max(a.acertos, b.acertos);
  r.perfeitas = Math.max(a.perfeitas, b.perfeitas); r.licoesFeitas = Math.max(a.licoesFeitas, b.licoesFeitas);
  for (const [k, v] of Object.entries(outro.conquistas)) if (!r.conquistas[k]) r.conquistas[k] = v;
  r.atualizado = Math.max(a.atualizado, b.atualizado);
  return r;
}
