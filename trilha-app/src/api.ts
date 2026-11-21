// Conversa com o servidor (Cloudflare Pages Functions em proftiagogomes.com.br/api).
import { useSyncExternalStore } from 'react';
import { definir, mesclar, normalizar, obter, ouvirMudancas, type Estado } from './estado';

const SITE = 'https://proftiagogomes.com.br';
// no site usa o mesmo endereço; no app Android (Capacitor) e no teste local, usa o site
const BASE = typeof location !== 'undefined' && /proftiagogomes\.com\.br$/.test(location.hostname) ? '' : SITE;
const CHAVE = 'trilha-sessao';

export interface Usuario { apelido: string; email: string; criado: string }
interface Sessao { token: string; usuario: Usuario }

let sessao: Sessao | null = (() => { try { return JSON.parse(localStorage.getItem(CHAVE) || 'null'); } catch { return null; } })();
const ouvintes = new Set<() => void>();
function setSessao(s: Sessao | null) {
  sessao = s;
  try { if (s) localStorage.setItem(CHAVE, JSON.stringify(s)); else localStorage.removeItem(CHAVE); } catch { /* ok */ }
  ouvintes.forEach((f) => f());
}
export function useSessao() {
  return useSyncExternalStore((f) => { ouvintes.add(f); return () => ouvintes.delete(f); }, () => sessao);
}

let ultimoXp = obter().xp;

export class ErroApi extends Error { constructor(msg: string, public status = 0) { super(msg); } }

async function chamar<T>(caminho: string, opcoes: { metodo?: string; corpo?: unknown } = {}): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  let r: Response;
  try {
    r = await fetch(BASE + '/api' + caminho, {
      method: opcoes.metodo || (opcoes.corpo ? 'POST' : 'GET'),
      headers: { 'Content-Type': 'application/json', ...(sessao ? { Authorization: 'Bearer ' + sessao.token } : {}) },
      body: opcoes.corpo ? JSON.stringify(opcoes.corpo) : undefined,
      signal: ctrl.signal
    });
  } catch {
    throw new ErroApi('Sem conexão com o servidor. Confira sua internet e tente de novo.');
  } finally { clearTimeout(t); }
  let dados: { erro?: string } & Record<string, unknown> = {};
  try { dados = await r.json(); } catch { /* resposta vazia */ }
  if (r.status === 401 && sessao) setSessao(null);
  if (!r.ok) throw new ErroApi(dados.erro || 'Algo deu errado no servidor (' + r.status + '). Tente de novo em instantes.', r.status);
  return dados as T;
}

// ---------- login por código ----------
export function pedirCodigo(email: string) {
  return chamar<{ ok: true; novo: boolean }>('/auth/codigo', { corpo: { email } });
}
export async function entrar(email: string, codigo: string, apelido?: string) {
  const r = await chamar<{ token: string; usuario: Usuario; progresso: unknown }>('/auth/entrar', { corpo: { email, codigo, apelido } });
  setSessao({ token: r.token, usuario: r.usuario });
  // junta o que estava no aparelho com o que está na conta
  const juntos = mesclar(obter(), normalizar(r.progresso));
  ultimoXp = juntos.xp; // juntar contas não é XP novo para o ranking
  definir(juntos);
  return r.usuario;
}
export async function sair() {
  try { await chamar('/auth/sair', { corpo: {} }); } catch { /* sai mesmo assim */ }
  setSessao(null);
}
export async function apagarConta() {
  await chamar('/eu', { metodo: 'DELETE' });
  setSessao(null);
}
export function mudarApelido(apelido: string) {
  return chamar<{ usuario: Usuario }>('/eu', { metodo: 'PATCH', corpo: { apelido } }).then((r) => { if (sessao) setSessao({ ...sessao, usuario: r.usuario }); return r.usuario; });
}

// ---------- ranking ----------
export interface LinhaRanking { pos: number; apelido: string; xp: number; eu: boolean }
export interface Ranking { semana: string; fim: string; lista: LinhaRanking[]; eu: LinhaRanking | null; total: number }
export const buscarRanking = () => chamar<Ranking>('/ranking');

// ---------- sincronização ----------
let fila: Promise<unknown> = Promise.resolve();
export async function sincronizarAgora() {
  if (!sessao) return;
  const r = await chamar<{ progresso: unknown }>('/eu');
  definir(mesclar(obter(), normalizar(r.progresso)), false);
  ultimoXp = obter().xp;
  await chamar('/progresso', { metodo: 'PUT', corpo: { estado: obter() } });
}
ouvirMudancas((e: Estado) => {
  const ganho = e.xp - ultimoXp;
  ultimoXp = e.xp;
  if (!sessao) return;
  fila = fila.then(async () => {
    try {
      if (ganho > 0) await chamar('/xp', { corpo: { ganho } });
      await chamar('/progresso', { metodo: 'PUT', corpo: { estado: e } });
    } catch { /* fica salvo no aparelho e sobe na próxima vez */ }
  });
});

// ---------- comunidade: relatos dos testadores ----------
export type TipoRelato = 'questao' | 'explicacao' | 'ideia' | 'app';
export type StatusRelato = 'novo' | 'votacao' | 'fazendo' | 'feito' | 'arquivado';
export interface Relato { id: number; criado: number; tipo: TipoRelato; onde: string; texto: string; status: StatusRelato; titulo: string | null; resposta: string | null; atualizado: number; apelido?: string | null; contexto?: string | null; votos?: number }
export interface Ideia { id: number; titulo: string; resposta: string | null; status: StatusRelato; votos: number; meu: number }
export interface Comunidade { ideias: Ideia[]; feitos: { id: number; titulo: string; resposta: string | null; atualizado: number }[]; totalResolvidos: number; admin: boolean }

export function enviarRelato(tipo: TipoRelato, onde: string, texto: string) {
  const contexto = {
    versao: __VERSAO__,
    plataforma: (globalThis as { Capacitor?: unknown }).Capacitor ? 'android' : 'web',
    tela: location.hash || '#/',
    largura: innerWidth,
    navegador: navigator.userAgent.slice(0, 160)
  };
  return chamar<{ ok: true; id: number; comConta: boolean }>('/relatos', { corpo: { tipo, onde, texto, contexto } });
}
export const meusRelatos = () => chamar<{ relatos: Relato[] }>('/relatos');
export const buscarComunidade = () => chamar<Comunidade>('/comunidade');
export const votarIdeia = (id: number) => chamar<{ ok: true; meu: boolean; votos: number }>('/comunidade/votar', { corpo: { id } });
export const relatosParaModerar = (status: StatusRelato) => chamar<{ relatos: Relato[]; contagem: Partial<Record<StatusRelato, number>> }>('/comunidade/moderar?status=' + status);
export const moderarRelato = (id: number, status: StatusRelato, titulo?: string, resposta?: string) =>
  chamar<{ ok: true }>('/comunidade/moderar', { corpo: { id, status, titulo, resposta } });
