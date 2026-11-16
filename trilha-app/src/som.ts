// Sons sintetizados no navegador (sem arquivos de áudio).
type Nome = 'certo' | 'erro' | 'toque' | 'fim' | 'nivel';
const CHAVE = 'trilha-som';
let ligado = true;
try { ligado = localStorage.getItem(CHAVE) !== '0'; } catch { /* sem storage */ }
let ctx: AudioContext | null = null;

function tom(freq: number, ini: number, dur: number, tipo: OscillatorType = 'sine', vol = 0.18) {
  if (!ctx) return;
  const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + ini;
  o.type = tipo; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + dur + 0.02);
}

export function som(nome: Nome) {
  if (!ligado) return;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = ctx || new AC();
    if (ctx.state === 'suspended') void ctx.resume();
  } catch { return; }
  if (nome === 'certo') { tom(659, 0, 0.14, 'triangle'); tom(988, 0.09, 0.26, 'triangle'); }
  else if (nome === 'erro') { tom(220, 0, 0.16, 'square', 0.07); tom(185, 0.12, 0.24, 'square', 0.07); }
  else if (nome === 'toque') { tom(880, 0, 0.06, 'sine', 0.07); }
  else if (nome === 'fim') { [523, 659, 784, 1047].forEach((f, i) => tom(f, i * 0.11, 0.3, 'triangle')); tom(1319, 0.48, 0.5, 'sine', 0.12); }
  else if (nome === 'nivel') { [392, 523, 659, 784, 1047].forEach((f, i) => tom(f, i * 0.08, 0.22, 'square', 0.06)); }
}

export function somLigado() { return ligado; }
export function alternarSom() {
  ligado = !ligado;
  try { localStorage.setItem(CHAVE, ligado ? '1' : '0'); } catch { /* ok */ }
  if (ligado) som('toque');
  return ligado;
}
