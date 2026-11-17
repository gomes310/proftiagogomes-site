// Ícones autorais da Trilha do RLM. Cada um usa um símbolo da lógica:
// ∧ (e), ∨ (ou), ¬ (não), → (implica), ∴ (portanto), ≥, V/F, conjuntos, grafos e tabelas-verdade.
import type { ReactNode } from 'react';

export type NomeIcone =
  | 'ofensiva' | 'xp' | 'estrela' | 'moeda' | 'escudo'
  | 'trilha' | 'praticar' | 'ranking' | 'painel'
  | 'missao' | 'missaoFeita' | 'revisao' | 'relampago' | 'caderno' | 'cadeado' | 'verdade'
  | 'som' | 'semSom' | 'voz' | 'microfone' | 'relogio' | 'venn' | 'nivel' | 'meta' | 'loja' | 'precisao';

const L = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const DESENHOS: Record<NomeIcone, ReactNode> = {
  // chama com um "∧" (e) por dentro: estudar E voltar amanhã
  ofensiva: <><path d="M12 2.5c1.2 3 4.8 5 5.6 9.2A6.4 6.4 0 0 1 12 21.5a6.4 6.4 0 0 1-6.4-7.2c.3-2.7 2-4.4 3.1-5.9.4 1.6 1.1 2.6 2.1 3.1-.2-3.3.4-6 1.2-9z" fill="#F26B1D" /><path d="M9.2 17.6 12 12.2l2.8 5.4" fill="none" stroke="#FFE3C7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></>,
  // hexágono com "V" de verdadeiro
  xp: <><path d="M12 2.2 20.5 7v10L12 21.8 3.5 17V7z" fill="#3B7BD9" /><path d="m8.2 8.6 3.8 7.8 3.8-7.8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></>,
  // estrela desenhada como grafo: vértices ligados
  estrela: <><path d="m12 2.8 2.7 6 6.5.6-4.9 4.3 1.5 6.4L12 16.8l-5.8 3.3 1.5-6.4-4.9-4.3 6.5-.6z" fill="#F2C230" stroke="#C99A0A" strokeWidth="1.2" strokeLinejoin="round" /><g fill="#fff"><circle cx="12" cy="6.2" r="1.1" /><circle cx="8.3" cy="12.6" r="1.1" /><circle cx="15.7" cy="12.6" r="1.1" /></g><path d="M12 6.2 8.3 12.6h7.4z" fill="none" stroke="#fff" strokeWidth="1" opacity=".8" /></>,
  // moeda com "∴" (portanto)
  moeda: <><circle cx="12" cy="12" r="9.5" fill="#F2C230" stroke="#C99A0A" strokeWidth="1.4" /><circle cx="12" cy="12" r="6.6" fill="none" stroke="#C99A0A" strokeWidth="1.1" /><g fill="#7A5A00"><circle cx="12" cy="9.3" r="1.5" /><circle cx="9.2" cy="14.2" r="1.5" /><circle cx="14.8" cy="14.2" r="1.5" /></g></>,
  // escudo com "¬" (não): nega a perda da ofensiva
  escudo: <><path d="M12 2.5 19.5 5v6.3c0 4.7-3.2 8.4-7.5 10.2-4.3-1.8-7.5-5.5-7.5-10.2V5z" fill="#3B7BD9" /><path d="M8 10.2h8v4.3" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></>,

  // navegação (traço, herdam a cor)
  trilha: <g {...L}><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="12" r="2.5" /><circle cx="7" cy="5.5" r="2.5" /><path d="m7.8 17.3 8.4-4.1M16.2 10.9 9.3 6.7" /></g>,
  praticar: <><g {...L}><circle cx="9" cy="12" r="6" /><circle cx="15" cy="12" r="6" /></g><path d="M12 7.2a6 6 0 0 1 0 9.6 6 6 0 0 1 0-9.6z" fill="currentColor" /></>,
  ranking: <g {...L}><path d="M3 21V14h6v7M9 21V9.5h6V21M15 21v-5h6v5M2.5 21h19" /><path d="m10.5 3.4 3 1.4-3 1.4M10.5 7h3" strokeWidth="1.8" /></g>,
  painel: <g {...L}><rect x="3" y="3.5" width="18" height="17" rx="3" /><path d="M3 9.5h18M11 3.5v17" /><path d="m5.6 12.8 1.2 2.6 1.2-2.6M14 12.8h3M14 12.8v3.3M14 14.5h2.2" strokeWidth="1.7" /></g>,

  // missões: caixa com seta "→" (a fazer) ou com "V" (feita)
  missao: <g {...L}><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><path d="M8 12h8m-3-3 3 3-3 3" /></g>,
  missaoFeita: <><rect x="3" y="3" width="18" height="18" rx="4.5" fill="#1E7A4C" /><path d="m8 8.4 4 7.6 4-7.6" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></>,
  // setas em ciclo em volta de um "p"
  revisao: <><g {...L}><path d="M19.5 9.5A8 8 0 0 0 5 7.2M4.5 14.5A8 8 0 0 0 19 16.8" /><path d="M5 3.2v4h4M19 20.8v-4h-4" /></g><text x="12" y="15.4" textAnchor="middle" fontSize="9.5" fontWeight="700" fontStyle="italic" fill="currentColor" fontFamily="Georgia, serif">p</text></>,
  // raio que termina em seta de implicação
  relampago: <><path d="M13.5 2 5 13.2h6L9.8 22l9.2-12.4h-6.2z" fill="#F2C230" stroke="#C99A0A" strokeWidth="1.2" strokeLinejoin="round" /></>,
  // caderno com "∴"
  caderno: <><g {...L}><path d="M6 3.5h11.5A1.5 1.5 0 0 1 19 5v15.5H6A1.5 1.5 0 0 1 4.5 19V5A1.5 1.5 0 0 1 6 3.5z" /><path d="M8 3.5v17" /></g><g fill="currentColor"><circle cx="13.5" cy="9.3" r="1.3" /><circle cx="11.2" cy="13.6" r="1.3" /><circle cx="15.8" cy="13.6" r="1.3" /></g></>,
  // cadeado com "?" no lugar da fechadura
  cadeado: <><g {...L}><rect x="4.5" y="10" width="15" height="11" rx="2.5" /><path d="M8 10V7.5a4 4 0 0 1 8 0V10" /></g><path d="M10.4 14.1a1.7 1.7 0 1 1 2.5 1.5c-.6.3-.9.7-.9 1.3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><circle cx="12" cy="18.9" r=".9" fill="currentColor" /></>,
  // "V" de verdadeiro (lição concluída)
  verdade: <path d="m6 6 6 12.5L18 6" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />,
  som: <g {...L}><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></g>,
  semSom: <g {...L}><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" /><path d="M15.5 10h5v4" /></g>,
  // balão de fala com ondas: a Lumi lê em voz alta
  voz: <g {...L}><path d="M4 5.5h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3.5v-3.5H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z" /><path d="M6.5 10.5h1M9 9v3M11.5 8v5" /><path d="M19 8.5a4.5 4.5 0 0 1 0 6M21.3 6.5a7.5 7.5 0 0 1 0 10" /></g>,
  // microfone com a base em "∧"
  microfone: <g {...L}><rect x="9" y="2.8" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0" /><path d="M8.5 21.5 12 17.5l3.5 4" /></g>,
  // relógio com os ponteiros formando "∧"
  relogio: <><circle cx="12" cy="13" r="8.5" fill="#EAF2FD" stroke="#3B7BD9" strokeWidth="2" /><path d="M8.6 16.2 12 9.3l3.4 6.9" fill="none" stroke="#172238" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 2.5h4" stroke="#3B7BD9" strokeWidth="2.2" strokeLinecap="round" /></>,
  // diagrama de Venn com a interseção destacada
  venn: <><circle cx="9" cy="12" r="6.3" fill="#E6F4EC" stroke="#1E7A4C" strokeWidth="1.8" /><circle cx="15" cy="12" r="6.3" fill="none" stroke="#1E7A4C" strokeWidth="1.8" /><path d="M12 6.6a6.3 6.3 0 0 1 0 10.8 6.3 6.3 0 0 1 0-10.8z" fill="#1E7A4C" /></>,
  // seta para cima dentro do hexágono
  nivel: <><path d="M12 2.2 20.5 7v10L12 21.8 3.5 17V7z" fill="#1E7A4C" /><path d="M12 16.5v-8m-3.5 3.5L12 8.5l3.5 3.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></>,
  // bandeira com "V": meta cumprida é verdade
  meta: <><path d="M5.5 21V3.5" stroke="#172238" strokeWidth="2.2" strokeLinecap="round" /><path d="M5.5 4h12.5l-2.6 4.2 2.6 4.3H5.5z" fill="#E8590C" /><path d="m9.2 6 2 3.9 2-3.9" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></>,
  loja: <><g {...L}><path d="M5 8h14l-1.2 12.5H6.2z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></g><g fill="currentColor"><circle cx="12" cy="12.2" r="1.1" /><circle cx="10.3" cy="15.4" r="1.1" /><circle cx="13.7" cy="15.4" r="1.1" /></g></>,
  // alvo com "≡" (equivalente, acertou em cheio)
  precisao: <><circle cx="12" cy="12" r="9" fill="#FDE7D2" stroke="#E8590C" strokeWidth="2" /><path d="M8 9.5h8M8 12h8M8 14.5h8" stroke="#E8590C" strokeWidth="2" strokeLinecap="round" /></>
};

export function Icone({ nome, tamanho = 24, className = '', rotulo }: { nome: NomeIcone; tamanho?: number; className?: string; rotulo?: string }) {
  return (
    <svg className={'ic ic-' + nome + (className ? ' ' + className : '')} width={tamanho} height={tamanho} viewBox="0 0 24 24"
      role={rotulo ? 'img' : undefined} aria-label={rotulo} aria-hidden={rotulo ? undefined : true}>{DESENHOS[nome]}</svg>
  );
}

// Selo hexagonal com um símbolo de lógica (conquistas, medalhas e unidades)
export const CORES_SELO = { ouro: ['#F2C230', '#B98900', '#5A4300'], prata: ['#D5DCE6', '#8A97AB', '#2C3D63'], bronze: ['#E8A06A', '#A9561C', '#4A2209'], verde: ['#1E7A4C', '#135233', '#FFFFFF'], azul: ['#3B7BD9', '#1D4F99', '#FFFFFF'], laranja: ['#F26B1D', '#B04208', '#FFFFFF'], cinza: ['#E3E8EF', '#B9C3D2', '#95A1B3'] } as const;
export type CorSelo = keyof typeof CORES_SELO;
export function Selo({ simbolo, cor = 'ouro', tamanho = 48, rotulo }: { simbolo: string; cor?: CorSelo; tamanho?: number; rotulo?: string }) {
  const [fundo, borda, texto] = CORES_SELO[cor];
  const fs = simbolo.length >= 3 ? 8 : simbolo.length === 2 ? 10 : 13;
  return (
    <svg className="selo-hex" width={tamanho} height={tamanho * 1.08} viewBox="0 0 24 26" role={rotulo ? 'img' : undefined} aria-label={rotulo} aria-hidden={rotulo ? undefined : true}>
      <path d="M12 2.5 21 7.6v10.8L12 23.5 3 18.4V7.6z" fill={borda} transform="translate(0 1.2)" />
      <path d="M12 2.5 21 7.6v10.8L12 23.5 3 18.4V7.6z" fill={fundo} stroke={borda} strokeWidth="1" />
      <text x="12" y={13 + fs * 0.36} textAnchor="middle" fontSize={fs} fontWeight="700" fill={texto} fontFamily="'Familjen Grotesk', system-ui, sans-serif">{simbolo}</text>
    </svg>
  );
}
