// Voz da Trilha: a Lumi lê a tela em voz alta e o aluno pode responder falando.
// No site usa as vozes do navegador (Web Speech API); no app Android usa os plugins nativos.
import { useSyncExternalStore } from 'react';
import { APP } from './plataforma';

// ---------- texto falável: troca símbolos de lógica por palavras ----------
const P = '(\\(?~?[a-z]\\)?)'; // proposição simples: p, ~q, (p)
export function falavel(bruto: string): string {
  let t = ' ' + bruto + ' ';
  t = t.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, ' e ');
  t = t.replace(/[“”"]/g, ' ');
  t = t.replace(/(\{\s*\}|∅)\s*\(?vazio\)?/g, ' conjunto vazio ').replace(/\{\s*\}|∅/g, ' conjunto vazio ');
  t = t.replace(/\{([^}]*)\}/g, ' o conjunto $1, ');
  t = t.replace(/\bn\(/g, ' n de (');
  t = t.replace(/~\(/g, ' a negação de (');
  t = t.replace(new RegExp(P + '\\s*↔\\s*' + P, 'g'), ' $1 se, e somente se, $2 ');
  t = t.replace(new RegExp(P + '\\s*→\\s*' + P, 'g'), ' se $1, então $2 ');
  t = t.replace(/[~¬]\s*([a-z])\b/g, ' não $1 ');
  t = t.replace(/⊻/g, ' ou… ou ').replace(/∧/g, ' e ').replace(/∨/g, ' ou ').replace(/↔|⇔/g, ' equivale a ').replace(/→|⇒/g, ' leva a ')
    .replace(/⊢/g, ', logo, ').replace(/∴/g, ' portanto ').replace(/≡/g, ' equivale a ')
    .replace(/∩/g, ' interseção ').replace(/∪/g, ' união ').replace(/∈/g, ' pertence a ').replace(/∉/g, ' não pertence a ')
    .replace(/⊂/g, ' está contido em ').replace(/⊄/g, ' não está contido em ').replace(/⊃/g, ' contém ')
    .replace(/≥/g, ' maior ou igual a ').replace(/≤/g, ' menor ou igual a ').replace(/≠/g, ' diferente de ')
    .replace(/(\d)\s*=\s*/g, '$1 igual a ').replace(/=/g, ' é igual a ')
    .replace(/\+/g, ' mais ').replace(/×/g, ' vezes ').replace(/÷/g, ' dividido por ').replace(/−/g, ' menos ')
    .replace(/([0-9a-z])ⁿ/g, '$1 elevado a n').replace(/²/g, ' ao quadrado').replace(/³/g, ' ao cubo')
    .replace(/∀/g, ' para todo ').replace(/∃/g, ' existe ')
    .replace(/✓/g, ' certo. ').replace(/✗/g, ' errado. ').replace(/[·•]/g, ', ').replace(/…/g, '… ');
  t = t.replace(/\bV\b/g, 'verdadeiro').replace(/\bF\b/g, 'falso');
  return t.replace(/[()]/g, ' ').replace(/\s+([,.;:!?])/g, '$1').replace(/([,.;:])\1+/g, '$1').replace(/\s+/g, ' ').replace(/\ba o conjunto/g, 'ao conjunto').replace(/([!?])\./g, '$1').replace(/(^|\s)(\S+) \2(?=[\s,.!?:;]|$)/g, '$1$2').trim();
}

// Lê o texto visível de um bloco da tela, anunciando as alternativas
export function textoDoBloco(el: Element | null): string {
  if (!el) return '';
  const c = el.cloneNode(true) as Element;
  c.querySelectorAll('[aria-hidden="true"], .sr, svg, .nao-ler, button.btn-ouvir').forEach((n) => n.remove());
  c.querySelectorAll('.opcoes .opcao, .vf .opcao').forEach((o, k) => o.prepend((o.closest('.vf') ? '' : 'Alternativa ' + (k + 1) + ': ')));
  c.querySelectorAll('p, li, h1, h2, h3, h4, .opcao, button, div, td, th, tr, strong').forEach((n) => n.append('. '));
  return falavel(c.textContent || '');
}

// ---------- estado (ligado/desligado, falando) ----------
const CHAVE = 'trilha-voz';
let ler = (() => { try { return localStorage.getItem(CHAVE) === '1'; } catch { return false; } })();
let falandoAgora = false;
const ouvintes = new Set<() => void>();
const avisar = () => ouvintes.forEach((f) => f());
const assinar = (f: () => void) => { ouvintes.add(f); return () => ouvintes.delete(f); };
export const useLeitura = () => useSyncExternalStore(assinar, () => ler);
export const useFalando = () => useSyncExternalStore(assinar, () => falandoAgora);
export function leituraLigada() { return ler; }
export function ligarLeitura(v: boolean) { ler = v; try { localStorage.setItem(CHAVE, v ? '1' : '0'); } catch { /* ok */ } if (!v) void parar(); avisar(); }
const setFalando = (v: boolean) => { if (falandoAgora !== v) { falandoAgora = v; avisar(); } };

// ---------- falar ----------
let tts: typeof import('@capacitor-community/text-to-speech') | null = null;
if (APP) void import('@capacitor-community/text-to-speech').then((m) => { tts = m; }).catch(() => {});
const temWeb = typeof window !== 'undefined' && 'speechSynthesis' in window;
export const vozDisponivel = () => APP || temWeb;

function vozPt(): SpeechSynthesisVoice | undefined {
  const vs = speechSynthesis.getVoices().filter((v) => /^pt(-|_)?BR/i.test(v.lang));
  return vs.find((v) => /google|francisca|natural|online/i.test(v.name)) || vs[0] || speechSynthesis.getVoices().find((v) => /^pt/i.test(v.lang));
}
if (temWeb) { speechSynthesis.getVoices(); speechSynthesis.addEventListener?.('voiceschanged', () => speechSynthesis.getVoices()); }

let fala = 0;
export async function falar(texto: string) {
  const t = falavel(texto); if (!t) return;
  const minha = ++fala;
  await parar(false);
  setFalando(true);
  try {
    if (APP && tts) {
      await tts.TextToSpeech.speak({ text: t, lang: 'pt-BR', rate: 1.0, pitch: 1.05, volume: 1, category: 'playback' });
      if (minha === fala) setFalando(false);
      return;
    }
    if (!temWeb) { setFalando(false); return; }
    // frases curtas: o Chrome corta falas longas
    const partes = t.match(/[^.!?]+[.!?]*/g) || [t];
    partes.forEach((p, k) => {
      const u = new SpeechSynthesisUtterance(p.trim());
      u.lang = 'pt-BR'; u.rate = 1.02; u.pitch = 1.05;
      const v = vozPt(); if (v) u.voice = v;
      if (k === partes.length - 1) { u.onend = () => { if (minha === fala) setFalando(false); }; u.onerror = u.onend; }
      speechSynthesis.speak(u);
    });
  } catch { setFalando(false); }
}
export async function parar(zerar = true) {
  if (zerar) fala++;
  try { if (APP && tts) await tts.TextToSpeech.stop(); else if (temWeb) speechSynthesis.cancel(); } catch { /* ok */ }
  setFalando(false);
}

// ---------- ouvir (responder falando) ----------
type Rec = { start(): void; stop(): void; abort(): void; lang: string; interimResults: boolean; maxAlternatives: number; onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onerror: ((e: { error: string }) => void) | null; onend: (() => void) | null };
const RecWeb = typeof window !== 'undefined' ? ((window as unknown as { SpeechRecognition?: new () => Rec; webkitSpeechRecognition?: new () => Rec }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: new () => Rec }).webkitSpeechRecognition) : undefined;
export const microfoneDisponivel = () => APP || !!RecWeb;

// devolve as frases que o reconhecimento ouviu (várias hipóteses), ou lança um erro com mensagem humana
export async function ouvir(): Promise<string[]> {
  await parar();
  if (APP) {
    const { SpeechRecognition } = await import('@capacitor-community/speech-recognition');
    const { available } = await SpeechRecognition.available();
    if (!available) throw new Error('Este aparelho não tem reconhecimento de voz.');
    let perm = await SpeechRecognition.checkPermissions();
    if (perm.speechRecognition !== 'granted') perm = await SpeechRecognition.requestPermissions();
    if (perm.speechRecognition !== 'granted') throw new Error('Sem permissão para o microfone. Ative nas configurações do Android.');
    const r = await SpeechRecognition.start({ language: 'pt-BR', maxResults: 4, partialResults: false, popup: false });
    return r.matches || [];
  }
  if (!RecWeb) throw new Error('Seu navegador não reconhece voz. Use o Chrome ou o app.');
  return new Promise((ok, falha) => {
    const r = new RecWeb();
    r.lang = 'pt-BR'; r.interimResults = false; r.maxAlternatives = 4;
    let deu = false;
    r.onresult = (e) => { deu = true; const alt = e.results[0]; ok(Array.from({ length: alt.length }, (_, k) => alt[k].transcript)); };
    r.onerror = (e) => { deu = true; falha(new Error(e.error === 'not-allowed' ? 'Sem permissão para o microfone. Libere no cadeado da barra de endereço.' : e.error === 'no-speech' ? 'Não ouvi nada. Toque e fale de novo.' : 'Não consegui ouvir. Tente de novo.')); };
    r.onend = () => { if (!deu) falha(new Error('Não ouvi nada. Toque e fale de novo.')); };
    r.start();
  });
}

// Entende a resposta falada: "letra b", "alternativa 2", "segunda", "verdadeiro", ou o próprio texto da opção
const ORD: Record<string, number> = { um: 1, uma: 1, primeira: 1, primeiro: 1, dois: 2, duas: 2, segunda: 2, segundo: 2, tres: 3, terceira: 3, terceiro: 3, quatro: 4, quarta: 4, quarto: 4, cinco: 5, quinta: 5 };
const sem = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
export type Comando = { tipo: 'opcao'; k: number } | { tipo: 'acao' } | { tipo: 'repetir' } | null;
export function entender(frases: string[], opcoes: string[]): Comando {
  const ops = opcoes.map((o) => sem(falavel(o)));
  for (const f0 of frases) {
    const f = sem(f0);
    if (!f) continue;
    if (/\b(verificar|confirmar|continuar|proxima|seguir|avancar|pronto)\b/.test(f)) return { tipo: 'acao' };
    if (/\b(repet\w*|de novo|ler|leia)\b/.test(f)) return { tipo: 'repetir' };
    const vf = ops.findIndex((o) => /\bverdadeiro\b/.test(o)), ff = ops.findIndex((o) => /\bfalso\b/.test(o));
    if (vf >= 0 && /\b(verdadeir\w*|verdade|sim|certo)\b/.test(f)) return { tipo: 'opcao', k: vf };
    if (ff >= 0 && /\b(fals\w*|nao|errado|mentira)\b/.test(f)) return { tipo: 'opcao', k: ff };
    const letra = f.match(/\b(?:letra|alternativa|opcao)\s+([a-e]|\d|\w+)\b/) || f.match(/^([a-e])$/) || f.match(/^(\d)$/) || f.match(/^(\w+)$/);
    if (letra) {
      const x = letra[1];
      const n = /^\d$/.test(x) ? Number(x) : /^[a-e]$/.test(x) ? x.charCodeAt(0) - 96 : ORD[x] || 0;
      if (n >= 1 && n <= opcoes.length) return { tipo: 'opcao', k: n - 1 };
    }
    const tok = f.split(' ').map((w) => (/^\d$/.test(w) ? Number(w) : ORD[w] || 0)).find((n) => n >= 1 && n <= opcoes.length);
    if (tok) return { tipo: 'opcao', k: tok - 1 };
    const igual = ops.findIndex((o) => o && (o === f || (o.length > 3 && f.includes(o))));
    if (igual >= 0) return { tipo: 'opcao', k: igual };
  }
  return null;
}
