// Estado do aluno: guardado no aparelho e, com login, sincronizado com o servidor.
// Compatível com o formato da versão 1 (chave 'trilha-rlm-v1').
import { useSyncExternalStore } from 'react';
import { LICOES, UNIDADES } from './dados/licoes';
import { PROVAS } from './dados/provas';

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
  moedas: number;
  escudos: number; // escudos de ofensiva guardados (máx. 2)
  diasEscudo: string[]; // dias salvos por escudo
  srs: Record<string, { cx: number; prox: string; erros: number }>; // revisão espaçada por questão "licao-indice"
  recordeRelampago: number;
  baus: number[]; // unidades cujo baú já foi aberto
  tema: number; // tema escolhido (-1 = ainda não escolheu)
  provas: Record<string, { t: number; a: number; u: 0 | 1 }>; // questões de prova: tentativas, acertos, última certa?
  simulados: { d: number; a: number; n: number; s: number }[]; // data, acertos, total, segundos (últimos 20)
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
    missoes: { dia: diaLocal(), feitas: [], combo: 0, licoes: 0, perfeitas: 0 }, conquistas: {}, moedas: 0, escudos: 0, diasEscudo: [], srs: {}, recordeRelampago: 0, baus: [], tema: -1, provas: {}, simulados: [], atualizado: 0
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
  e.moedas = num(s.moedas, 1e6); e.escudos = Math.min(2, num(s.escudos, 2)); e.recordeRelampago = num(s.recordeRelampago, 1000);
  e.baus = Array.isArray(s.baus) ? [...new Set(s.baus.filter((u) => Number.isInteger(u) && u >= 0 && u < UNIDADES.length))] : [];
  e.tema = Number.isInteger(s.tema) && (s.tema as number) >= 0 && (s.tema as number) < UNIDADES.length ? (s.tema as number) : -1;
  e.provas = {};
  if (s.provas && typeof s.provas === 'object') for (const [k, v] of Object.entries(s.provas)) { const x = v as { t?: number; a?: number; u?: number }; if (/^[\w-]{6,20}$/.test(k) && x) e.provas[k] = { t: Math.max(0, Math.floor(Number(x.t) || 0)), a: Math.max(0, Math.floor(Number(x.a) || 0)), u: x.u ? 1 : 0 }; }
  e.simulados = Array.isArray(s.simulados) ? s.simulados.filter((x) => x && Number.isFinite(x.d) && Number.isFinite(x.a) && Number.isFinite(x.n)).slice(-20) : [];
  e.diasEscudo = Array.isArray(s.diasEscudo) ? s.diasEscudo.filter((d) => typeof d === 'string').slice(-60) : [];
  if (s.srs && typeof s.srs === 'object') for (const [k, v] of Object.entries(s.srs)) {
    if (/^\d+-\d+$/.test(k) && v && typeof v === 'object') e.srs[k] = { cx: Math.min(5, Math.max(1, num(v.cx, 5) || 1)), prox: normalizaDia(v.prox) || diaLocal(), erros: num(v.erros, 1000) };
  }
  // ofensiva: escudos cobrem os dias perdidos; sem escudo suficiente, a ofensiva zera
  const hoje = diaLocal();
  if (e.ultimoDia && e.ultimoDia !== hoje && e.ultimoDia !== diaAntes(hoje)) {
    const perdidos: string[] = [];
    for (let d = diaAntes(hoje); d > e.ultimoDia; d = diaAntes(d)) perdidos.push(d);
    if (e.ofensiva > 0 && perdidos.length <= e.escudos) {
      e.escudos -= perdidos.length; e.diasEscudo.push(...perdidos.reverse()); e.ultimoDia = diaAntes(hoje);
    } else e.ofensiva = 0;
  }
  // guarda só os últimos 60 dias de XP diário
  const corte = diaAntes(hoje, 60);
  for (const d of Object.keys(e.xpDia)) if (d < corte) delete e.xpDia[d];
  return e;
}

let estado: Estado = (() => { try { return normalizar(JSON.parse(localStorage.getItem(CHAVE) || 'null')); } catch { return novo(); } })();
try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch { /* ok */ }
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
// Cada tema tem sua própria trilha: a 1ª lição de todo tema já começa liberada; as outras pedem a anterior do mesmo tema.
export const temaDaLicao = (i: number) => Math.max(0, UNIDADES.findIndex((u) => u.licoes.includes(i)));
export const nivelDaLicao = (i: number) => UNIDADES[temaDaLicao(i)].niveis.findIndex((n) => n.includes(i));
export const liberada = (e: Estado, i: number) => {
  const u = UNIDADES[temaDaLicao(i)], k = u.licoes.indexOf(i);
  return k <= 0 || e.estrelas[u.licoes[k - 1]] != null;
};
// Nível do aluno no tema: 0 novo · 1 básico · 2 intermediário · 3 avançado · 4 pronto para a prova
export function desempenhoProvaTema(e: Estado, t: number) {
  const temas = UNIDADES[t].temas;
  let tent = 0, ac = 0, qs = 0;
  for (const q of PROVAS) if (temas.includes(q.tema)) { qs++; const p = e.provas[q.id]; if (p) { tent += p.t; ac += p.a; } }
  return { questoes: qs, tentativas: tent, acertos: ac, taxa: tent ? ac / tent : 0 };
}
// quantos acertos seguidos ainda faltam para chegar a 70% (com pelo menos 3 respostas)
export function faltamParaProva(d: { tentativas: number; acertos: number }) {
  let k = 0;
  while (k < 200 && !((d.tentativas + k) >= 3 && (d.acertos + k) / (d.tentativas + k) >= 0.7)) k++;
  return k;
}
export function nivelTema(e: Estado, t: number) {
  const u = UNIDADES[t];
  let n = 0;
  for (const nv of u.niveis) { if (nv.every((i) => e.estrelas[i] != null)) n++; else break; }
  if (n === 3) {
    const d = desempenhoProvaTema(e, t);
    const pronto = d.questoes ? d.tentativas >= 3 && d.taxa >= 0.7 : u.licoes.every((i) => e.estrelas[i] === 3);
    if (pronto) n = 4;
  }
  return n;
}
export const NOME_NIVEL_ALUNO = ['Novo no tema', 'Básico', 'Intermediário', 'Avançado', 'Pronto para a prova'] as const;
export function escolherTema(t: number) { const e = normalizar(estado); e.tema = t; e.atualizado = Date.now(); definir(e); }
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
export interface Conquista { id: string; nome: string; desc: string; simbolo: string; cor: 'ouro' | 'prata' | 'bronze' | 'verde' | 'azul' | 'laranja'; ok: (e: Estado) => boolean }
// símbolo de cada unidade: conjuntos, conectivos, argumentação (portanto) e raciocínio aplicado
export const SIMBOLO_UNIDADE = ['∪', '∧', 'VF', '≡', '∴', '?', '#', '31', '∃', 'n!'];
export const CONQUISTAS: Conquista[] = [
  { id: 'primeira', nome: 'Primeiro passo', desc: 'Concluiu a primeira lição', simbolo: '1º', cor: 'verde', ok: (e) => e.licoesFeitas >= 1 },
  { id: 'perfeita', nome: 'Gabaritou', desc: 'Fez uma lição sem errar nada', simbolo: '≡', cor: 'ouro', ok: (e) => e.perfeitas >= 1 },
  { id: 'combo5', nome: 'Embalado', desc: 'Acertou 5 seguidas', simbolo: '⇒', cor: 'azul', ok: (e) => e.maiorCombo >= 5 },
  { id: 'combo10', nome: 'Imparável', desc: 'Acertou 10 seguidas', simbolo: '∞', cor: 'azul', ok: (e) => e.maiorCombo >= 10 },
  { id: 'ofensiva3', nome: 'Pegando o ritmo', desc: '3 dias seguidos estudando', simbolo: '3d', cor: 'laranja', ok: (e) => e.maiorOfensiva >= 3 },
  { id: 'ofensiva7', nome: 'Uma semana firme', desc: '7 dias seguidos estudando', simbolo: '7d', cor: 'laranja', ok: (e) => e.maiorOfensiva >= 7 },
  { id: 'xp300', nome: '300 XP', desc: 'Juntou 300 pontos de experiência', simbolo: 'Σ', cor: 'azul', ok: (e) => e.xp >= 300 },
  ...UNIDADES.map((u, k) => ({ id: 'unidade' + (k + 1), nome: u.selo, desc: 'Concluiu o tema ' + u.nome, simbolo: SIMBOLO_UNIDADE[k], cor: 'prata' as const, ok: (e: Estado) => u.licoes.every((i) => e.estrelas[i] != null) })),
  { id: 'relampago', nome: 'Raio', desc: '10 acertos no desafio relâmpago', simbolo: '↯', cor: 'ouro', ok: (e) => e.recordeRelampago >= 10 },
  { id: 'revisor', nome: 'Memória de elefante', desc: 'Levou 10 questões à caixa 3 da revisão', simbolo: '↻', cor: 'verde', ok: (e) => Object.values(e.srs).filter((v) => v.cx >= 3).length >= 10 },
  { id: 'trilha', nome: 'Trilha completa', desc: 'Terminou todas as lições de todos os temas', simbolo: '∀', cor: 'ouro', ok: (e) => Object.keys(e.estrelas).length === LICOES.length },
  { id: 'estrelas', nome: 'Colecionador', desc: 'Todas as lições com 3 estrelas', simbolo: '★', cor: 'ouro', ok: (e) => LICOES.every((_, i) => e.estrelas[i] === 3) },
  { id: 'prova10', nome: 'Concurseiro', desc: 'Acerte 10 questões de prova', simbolo: '10', cor: 'azul', ok: (e) => Object.values(e.provas || {}).filter((p) => p.a > 0).length >= 10 },
  { id: 'aprovado', nome: 'Aprovado!', desc: 'Tire 70% ou mais em um simulado', simbolo: '✓', cor: 'ouro', ok: (e) => (e.simulados || []).some((x) => x.n >= 5 && x.a / x.n >= 0.7) }
];

// ---------- eventos ----------
const INTERVALOS = [1, 3, 7, 14, 30]; // dias até rever, por caixa (método de Leitner)
function revisar(e: Estado, id: string, ok: boolean) {
  const h = diaLocal();
  const atual = e.srs[id] || { cx: 1, prox: h, erros: 0 };
  const cx = ok ? Math.min(5, atual.cx + (e.srs[id] ? 1 : 1)) : 1;
  const [a, m, d] = h.split('-').map(Number);
  e.srs[id] = { cx, prox: ok ? diaLocal(new Date(a, m - 1, d + INTERVALOS[cx - 1])) : h, erros: atual.erros + (ok ? 0 : 1) };
}
export function questoesParaRevisar(e: Estado) {
  const h = diaLocal();
  return Object.entries(e.srs).filter(([, v]) => v.prox <= h).sort((x, y) => x[1].cx - y[1].cx || y[1].erros - x[1].erros).map(([k]) => k);
}

export function registrarResposta(ok: boolean, combo: number, id?: string) {
  const e = normalizar(estado);
  if (id) revisar(e, id, ok);
  e.respostas++; if (ok) e.acertos++;
  e.maiorCombo = Math.max(e.maiorCombo, combo);
  e.missoes.combo = Math.max(e.missoes.combo, combo);
  e.atualizado = Date.now();
  definir(e, false);
}

export interface ResultadoLicao {
  moedas: number;
  ganho: number; bonusMissoes: number; estrelas: number; nivelAntes: number; nivelDepois: number;
  primeiraVez: boolean; unidadeFechada: number | null; tema: number; nivelTemaAntes: number; nivelTemaDepois: number; novasConquistas: Conquista[]; missoesConcluidas: Missao[]; metaBatida: boolean;
}

export function registrarLicao(idx: number, acertosPrimeira: number, total: number): ResultadoLicao {
  const e = normalizar(estado);
  const hoje = diaLocal();
  const tema = temaDaLicao(idx), nivelTemaAntes = nivelTema(e, tema);
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
  const moedas = 5 + (estrelas === 3 ? 5 : 0) + concluidas.length * 5;
  e.moedas += moedas;

  const novas: Conquista[] = [];
  for (const c of CONQUISTAS) if (!conquistasAntes.has(c.id) && c.ok(e)) { e.conquistas[c.id] = hoje; novas.push(c); }
  const unidade = UNIDADES.findIndex((u) => u.licoes.includes(idx));
  const unidadeFechada = primeiraVez && UNIDADES[unidade].licoes.every((i) => e.estrelas[i] != null) ? unidade : null;
  e.atualizado = Date.now();
  definir(e);
  return {
    moedas, ganho, bonusMissoes: bonus, estrelas, nivelAntes, nivelDepois: nivelDe(e.xp), primeiraVez, unidadeFechada, tema, nivelTemaAntes, nivelTemaDepois: nivelTema(e, tema),
    novasConquistas: novas, missoesConcluidas: concluidas, metaBatida: !metaAntes && (e.xpDia[hoje] || 0) >= e.meta
  };
}

// prática (revisão e desafio relâmpago): 2 XP por acerto, conta para a ofensiva e a meta
export function registrarPratica(acertos: number, tipo: 'revisao' | 'relampago') {
  const e = normalizar(estado);
  const hoje = diaLocal();
  const ganho = acertos * 2;
  if (acertos > 0 && e.ultimoDia !== hoje) { e.ofensiva = e.ultimoDia === diaAntes(hoje) ? e.ofensiva + 1 : 1; e.ultimoDia = hoje; }
  e.maiorOfensiva = Math.max(e.maiorOfensiva, e.ofensiva);
  e.xp += ganho; e.xpDia[hoje] = (e.xpDia[hoje] || 0) + ganho;
  e.moedas += acertos;
  const recorde = tipo === 'relampago' && acertos > e.recordeRelampago;
  if (recorde) e.recordeRelampago = acertos;
  for (const c of CONQUISTAS) if (!e.conquistas[c.id] && c.ok(e)) e.conquistas[c.id] = hoje;
  e.atualizado = Date.now();
  definir(e);
  return { ganho, moedas: acertos, recorde };
}
export const PRECO_ESCUDO = 50;
export function comprarEscudo(): string | null {
  const e = normalizar(estado);
  if (e.escudos >= 2) return 'Você já tem o máximo de 2 escudos.';
  if (e.moedas < PRECO_ESCUDO) return 'Faltam ' + (PRECO_ESCUDO - e.moedas) + ' moedas. Faça lições e práticas para juntar.';
  e.moedas -= PRECO_ESCUDO; e.escudos++; e.atualizado = Date.now(); definir(e); return null;
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
  for (const [k, v] of Object.entries(outro.srs)) if (!r.srs[k]) r.srs[k] = v;
  r.recordeRelampago = Math.max(a.recordeRelampago, b.recordeRelampago);
  r.baus = [...new Set([...a.baus, ...b.baus])];
  r.tema = a.tema >= 0 ? a.tema : b.tema;
  r.provas = { ...a.provas };
  for (const [k, v] of Object.entries(b.provas)) { const x = r.provas[k]; r.provas[k] = !x || v.t > x.t ? v : x; }
  r.simulados = [...a.simulados, ...b.simulados.filter((x) => !a.simulados.some((y) => y.d === x.d))].sort((x, y) => x.d - y.d).slice(-20);
  r.atualizado = Math.max(a.atualizado, b.atualizado);
  return r;
}

// Baú da unidade: fica no meio do caminho e abre quando as lições antes dele estão feitas
export const MOEDAS_BAU = 20;
export const posicaoBau = (u: number) => UNIDADES[u].niveis[0].length + UNIDADES[u].niveis[1].length - 1; // baú no fim do intermediário
export const bauLiberado = (e: Estado, u: number) => UNIDADES[u].licoes.slice(0, posicaoBau(u) + 1).every((i) => e.estrelas[i] != null);
export function abrirBau(u: number): number {
  const e = normalizar(estado);
  if (e.baus.includes(u) || !bauLiberado(e, u)) return 0;
  e.baus.push(u); e.moedas += MOEDAS_BAU; e.atualizado = Date.now(); definir(e);
  return MOEDAS_BAU;
}

// Questões de prova (banco do canal): cada resposta conta para o histórico, XP e meta do dia
export function registrarProva(id: string, ok: boolean, valeXp = true) {
  const e = normalizar(estado);
  const p = e.provas[id] || { t: 0, a: 0, u: 0 };
  e.provas[id] = { t: p.t + 1, a: p.a + (ok ? 1 : 0), u: ok ? 1 : 0 };
  let ganho = 0;
  if (valeXp) {
    const hoje = diaLocal();
    ganho = ok ? (p.t === 0 ? 5 : 2) : 1; // vale mais acertar de primeira
    if (e.ultimoDia !== hoje) { e.ofensiva = e.ultimoDia === diaAntes(hoje) ? e.ofensiva + 1 : 1; e.ultimoDia = hoje; }
    e.maiorOfensiva = Math.max(e.maiorOfensiva, e.ofensiva);
    e.xp += ganho; e.xpDia[hoje] = (e.xpDia[hoje] || 0) + ganho;
    if (ok) e.moedas += 1;
    for (const c of CONQUISTAS) if (!e.conquistas[c.id] && c.ok(e)) e.conquistas[c.id] = hoje;
  }
  e.atualizado = Date.now(); definir(e);
  return ganho;
}
export function registrarSimulado(respostas: { id: string; ok: boolean }[], segundos: number) {
  const e = normalizar(estado);
  const hoje = diaLocal();
  const a = respostas.filter((x) => x.ok).length;
  for (const x of respostas) { const p = e.provas[x.id] || { t: 0, a: 0, u: 0 }; e.provas[x.id] = { t: p.t + 1, a: p.a + (x.ok ? 1 : 0), u: x.ok ? 1 : 0 }; }
  const ganho = a * 4 + 10;
  if (e.ultimoDia !== hoje) { e.ofensiva = e.ultimoDia === diaAntes(hoje) ? e.ofensiva + 1 : 1; e.ultimoDia = hoje; }
  e.maiorOfensiva = Math.max(e.maiorOfensiva, e.ofensiva);
  e.xp += ganho; e.xpDia[hoje] = (e.xpDia[hoje] || 0) + ganho; e.moedas += a;
  e.simulados = [...e.simulados, { d: Date.now(), a, n: respostas.length, s: Math.round(segundos) }].slice(-20);
  for (const c of CONQUISTAS) if (!e.conquistas[c.id] && c.ok(e)) e.conquistas[c.id] = hoje;
  e.atualizado = Date.now(); definir(e);
  return ganho;
}
