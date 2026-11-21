// Identidade dos temas: cada tema tem cor própria e um emblema desenhado.
// Regra do sistema: a COR identifica o tema; a FORMA (escadinha de degraus) mostra o nível do aluno.
import { UNIDADES } from '../dados/licoes';

const T = { fill: 'none', stroke: '#fff', strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

// emblemas em 24×24, traço branco
const EMBLEMAS: React.ReactNode[] = [
  // Conjuntos: dois círculos com a interseção preenchida
  <g key="0"><path d="M12 6.23A6.5 6.5 0 0 1 12 17.77 6.5 6.5 0 0 1 12 6.23z" fill="#fff" opacity=".9" /><circle cx="9" cy="12" r="6.5" {...T} /><circle cx="15" cy="12" r="6.5" {...T} /></g>,
  // Proposições: balão de fala com ∧
  <g key="1" {...T}><path d="M4 4.5h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8.5L7 20.5v-4H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" /><path d="M8.5 13.5 12 7.5l3.5 6" /></g>,
  // Tabela-verdade: grade 2×2 com V e F
  <g key="2" {...T} strokeWidth={1.9}><rect x="2.5" y="2.5" width="19" height="19" rx="2.5" /><path d="M12 2.5v19M2.5 12h19" /><path d="M5 5.5l2 4.2 2-4.2M15 10V5.5h3.3M15 7.7h2.4M5.5 19v-4.5h3.3M5.5 16.7h2.4M14.5 14.6l2 4.2 2-4.2" /></g>,
  // Equivalências e negações: setas opostas e o sinal de negação
  <g key="3" {...T}><path d="M4 10h14l-3.5-3.5M20 15H6l3.5 3.5" /><path d="M3.5 4h5v2.6" /></g>,
  // Argumentos: ∴ (premissas) sobre a linha (conclusão)
  <g key="4"><g fill="#fff"><circle cx="12" cy="6" r="2.1" /><circle cx="7" cy="13" r="2.1" /><circle cx="17" cy="13" r="2.1" /></g><path d="M3.5 19.5h17" {...T} /></g>,
  // Associação / verdades e mentiras: lupa com ✓
  <g key="5" {...T}><circle cx="10" cy="10" r="6.5" /><path d="M14.8 14.8 20.5 20.5" /><path d="M7.2 10.2l2 2 3.7-4" /></g>,
  // Sequências: barras crescentes e um "?"
  <g key="6"><g fill="#fff"><rect x="2.5" y="14" width="3.6" height="7" rx="1" /><rect x="7.6" y="10" width="3.6" height="11" rx="1" /><rect x="12.7" y="6" width="3.6" height="15" rx="1" /><circle cx="19.6" cy="19.6" r="1.3" /></g><path d="M17.6 7.6a2.1 2.1 0 1 1 3 1.9c-.8.4-1 .9-1 1.7v2.4" {...T} strokeWidth={2} /></g>,
  // Casa dos pombos e calendários: folha de calendário com uma "casa" de 2 pombos
  <g key="7"><g {...T} strokeWidth={1.9}><rect x="2.5" y="4.5" width="19" height="17" rx="2.5" /><path d="M7.5 2.5v4M16.5 2.5v4M2.5 10h19M12 10v11.5M2.5 15.7h19" /></g><g fill="#fff"><circle cx="5.6" cy="12.9" r="1.3" /><circle cx="8.9" cy="12.9" r="1.3" /></g></g>,
  // Proposições categóricas: círculo pequeno dentro do grande ("todo A é B") com o ∃
  <g key="8"><g {...T}><circle cx="12" cy="12" r="9.5" /><circle cx="9.5" cy="13.5" r="4.2" /></g><path d="M15.2 4.8h3.8v6.4h-3.8M15.6 8h3" {...T} strokeWidth={1.8} /></g>,
  // Princípios da contagem: árvore de possibilidades (1 → 2 → 4)
  <g key="9"><g {...T} strokeWidth={1.9}><path d="M4 12h4M8 12l5-6M8 12l5 6M13 6h3l4-2.5M16 6l4 2.5M13 18h3l4-2.5M16 18l4 2.5" /></g><g fill="#fff"><circle cx="4" cy="12" r="2" /><circle cx="13" cy="6" r="1.7" /><circle cx="13" cy="18" r="1.7" /></g></g>
];

export function EmblemaTema({ t, tamanho = 48, className = '' }: { t: number; tamanho?: number; className?: string }) {
  const c = UNIDADES[t].cor;
  return (
    <svg className={'emblema ' + className} width={tamanho} height={tamanho * 52 / 48} viewBox="0 0 48 52" aria-hidden="true">
      <path d="M24 5 44 16.5v22L24 50 4 38.5v-22z" fill={c.e} />
      <path d="M24 2 44 13.5v22L24 47 4 35.5v-22z" fill={c.p} stroke={c.e} strokeWidth="2" />
      <g transform="translate(12 12.5)">{EMBLEMAS[t]}</g>
    </svg>
  );
}

// Escadinha do nível: 3 degraus na cor do tema (básico, intermediário, avançado) + coroa dourada (pronto para a prova)
export function EscadaNivel({ t, n, tamanho = 44 }: { t: number; n: number; tamanho?: number }) {
  const c = UNIDADES[t].cor;
  const alt = [6, 10, 14];
  return (
    <svg className="escada" width={tamanho} height={tamanho * 20 / 44} viewBox="0 0 44 20" aria-hidden="true">
      {alt.map((h, k) => <rect key={k} x={k * 10} y={20 - h} width="8.5" height={h} rx="1.6" fill={k < n ? c.p : '#D6DCE6'} />)}
      <path d="M31 19.5v-9l3 3 3-5 3 5 3-3v9z" fill={n >= 4 ? '#F2C230' : '#D6DCE6'} stroke={n >= 4 ? '#B98900' : 'none'} strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
