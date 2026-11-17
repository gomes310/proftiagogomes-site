// A turma da Trilha do RLM: personagens originais em SVG, animados só com CSS.
// Lumi (a lâmpada das ideias), Vê (a Verdade) e Efe (o Falso).
export type Humor = 'feliz' | 'pensando' | 'festa' | 'triste' | 'piscando' | 'acenando' | 'falando' | 'ops';

const TINTA = '#172238';

// olhos expressivos: esclera branca, pupila e brilho; piscam sozinhos
function Olhos({ x1, x2, y, rx = 9, ry = 10, humor }: { x1: number; x2: number; y: number; rx?: number; ry?: number; humor: Humor }) {
  if (humor === 'piscando' || humor === 'festa') {
    return <g fill="none" stroke={TINTA} strokeWidth="4.5" strokeLinecap="round"><path d={`M${x1 - 6} ${y + 2}q6-7 12 0`} /><path d={`M${x2 - 6} ${y + 2}q6-7 12 0`} /></g>;
  }
  const dx = humor === 'pensando' ? 3 : humor === 'ops' ? -2 : 1.5;
  const dy = humor === 'pensando' ? -4 : humor === 'triste' ? 3 : 2;
  return (
    <g className="pers-olhos">
      {[x1, x2].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#fff" stroke={TINTA} strokeWidth="2.2" />
          <circle cx={x + dx} cy={y + dy} r={rx * 0.5} fill={TINTA} />
          <circle cx={x + dx + 1.8} cy={y + dy - 2} r={rx * 0.17} fill="#fff" />
        </g>
      ))}
    </g>
  );
}

function Boca({ x, y, humor, larg = 12 }: { x: number; y: number; humor: Humor; larg?: number }) {
  const t = { fill: 'none', stroke: TINTA, strokeWidth: 4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  if (humor === 'triste') return <path {...t} d={`M${x - larg + 2} ${y + 6}q${larg - 2}-9 ${2 * (larg - 2)} 0`} />;
  if (humor === 'pensando') return <path {...t} d={`M${x - 6} ${y + 2}h12`} />;
  if (humor === 'ops') return <path {...t} d={`M${x - larg + 2} ${y + 3}q4-5 8 0t8 0`} />;
  if (humor === 'festa') return <path d={`M${x - larg} ${y - 2}q${larg} 20 ${2 * larg} 0z`} fill={TINTA} />;
  if (humor === 'falando') return <ellipse className="pers-fala" cx={x} cy={y + 3} rx={larg * 0.55} ry="5.5" fill={TINTA} />;
  return <path {...t} d={`M${x - larg} ${y - 1}q${larg} 13 ${2 * larg} 0`} />;
}

// braços: o direito acena quando humor = "acenando" ou comemora em "festa"
function Bracos({ e, d, cor, mao, humor }: { e: [number, number]; d: [number, number]; cor: string; mao: string; humor: Humor }) {
  const alto = humor === 'acenando' || humor === 'festa';
  const ombroE = humor === 'ops' ? `M${e[0]} ${e[1]}q-14-4-16-18` : humor === 'festa' ? `M${e[0]} ${e[1]}q-12-10-14-26` : `M${e[0]} ${e[1]}q-12 6-11 20`;
  const fimE = humor === 'ops' ? [e[0] - 16, e[1] - 18] : humor === 'festa' ? [e[0] - 14, e[1] - 26] : [e[0] - 11, e[1] + 20];
  const ombroD = alto ? `M${d[0]} ${d[1]}q12-10 13-26` : humor === 'ops' ? `M${d[0]} ${d[1]}q14-4 16-18` : `M${d[0]} ${d[1]}q12 6 11 20`;
  const fimD = alto ? [d[0] + 13, d[1] - 26] : humor === 'ops' ? [d[0] + 16, d[1] - 18] : [d[0] + 11, d[1] + 20];
  return (
    <>
      <g className="pers-braco-e"><path d={ombroE} fill="none" stroke={cor} strokeWidth="6" strokeLinecap="round" /><circle cx={fimE[0]} cy={fimE[1]} r="5.5" fill={mao} stroke={cor} strokeWidth="2" /></g>
      <g className={'pers-braco-d' + (humor === 'acenando' ? ' acena' : '')} style={{ transformOrigin: `${d[0]}px ${d[1]}px` }}>
        <path d={ombroD} fill="none" stroke={cor} strokeWidth="6" strokeLinecap="round" /><circle cx={fimD[0]} cy={fimD[1]} r="5.5" fill={mao} stroke={cor} strokeWidth="2" />
      </g>
    </>
  );
}

type Props = { humor?: Humor; tamanho?: number; className?: string; parado?: boolean };
const classe = (nome: string, humor: Humor, className: string, parado?: boolean) =>
  'pers pers-' + nome + ' humor-' + humor + (parado ? ' parado' : '') + (className ? ' ' + className : '');

export default function Lumi({ humor = 'feliz', tamanho = 96, className = '', parado }: Props) {
  return (
    <svg className={classe('lumi', humor, 'lumi lumi-' + humor + ' ' + className, parado)} width={tamanho} height={tamanho * 1.094} viewBox="-8 0 128 140" aria-hidden="true">
      {humor === 'festa' && <g className="pers-raios" stroke="#E0B400" strokeWidth="5" strokeLinecap="round"><path d="M56 2v10" /><path d="M16 18l8 7" /><path d="M96 18l-8 7" /></g>}
      <g className="pers-corpo">
        <Bracos e={[20, 76]} d={[92, 76]} cor="#C9A92B" mao="#FFE680" humor={humor} />
        <path d="M56 18c-24 0-42 18-42 40 0 15 8 26 18 33 4 3 6 7 6 11v4h36v-4c0-4 2-8 6-11 10-7 18-18 18-33 0-22-18-40-42-40z" fill="#FFD84D" stroke="#C9A92B" strokeWidth="3" />
        <ellipse cx="36" cy="34" rx="7" ry="11" fill="#FFF3B8" opacity=".9" transform="rotate(-25 36 34)" />
        <Olhos x1={43} x2={69} y={52} humor={humor} />
        <Boca x={56} y={68} humor={humor} />
        {humor !== 'triste' && humor !== 'ops' && <><circle cx="29" cy="66" r="5" fill="#F59E8B" opacity=".55" /><circle cx="83" cy="66" r="5" fill="#F59E8B" opacity=".55" /></>}
        <rect x="38" y="108" width="36" height="9" rx="4" fill={TINTA} />
        <rect x="40" y="119" width="32" height="8" rx="4" fill="#2C3D63" />
        <rect x="46" y="129" width="20" height="7" rx="3.5" fill={TINTA} />
      </g>
      {humor === 'pensando' && <g fill="#3B7BD9"><circle cx="100" cy="22" r="4" /><circle cx="108" cy="9" r="6" /></g>}
    </svg>
  );
}

// Vê: a Verdade. Corpo em forma de V, coroinha em "VV" e um V na barriga.
export function Ve({ humor = 'feliz', tamanho = 96, className = '', parado }: Props) {
  return (
    <svg className={classe('ve', humor, className, parado)} width={tamanho} height={tamanho * 1.04} viewBox="-12 -4 144 150" aria-hidden="true">
      <g className="pers-corpo">
        <ellipse cx="60" cy="140" rx="30" ry="5" fill="#000" opacity=".08" />
        <ellipse cx="48" cy="133" rx="9" ry="5" fill="#135233" /><ellipse cx="72" cy="133" rx="9" ry="5" fill="#135233" />
        <Bracos e={[22, 66]} d={[98, 66]} cor="#1E7A4C" mao="#7CD6A5" humor={humor} />
        <path d="M46 14 52 2l7 10 7-10 6 12" fill="#2FA36B" stroke="#1E7A4C" strokeWidth="3" strokeLinejoin="round" />
        <path d="M14 36C14 20 30 12 60 12s46 8 46 24c0 36-22 70-46 92C36 106 14 72 14 36z" fill="#2FA36B" stroke="#1E7A4C" strokeWidth="3" />
        <path d="M30 22c6-5 14-7 22-7" fill="none" stroke="#7CD6A5" strokeWidth="4" strokeLinecap="round" />
        <Olhos x1={44} x2={76} y={44} rx={10.5} ry={11.5} humor={humor} />
        <Boca x={60} y={64} humor={humor} larg={11} />
        <path d="m51 86 9 16 9-16" fill="none" stroke="#E6F4EC" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

// Efe: o Falso. Corpo quadradinho meio torto, topete em forma de F e sobrancelha arteira.
export function Efe({ humor = 'feliz', tamanho = 96, className = '', parado }: Props) {
  return (
    <svg className={classe('efe', humor, className, parado)} width={tamanho} height={tamanho * 1.04} viewBox="-12 -4 144 150" aria-hidden="true">
      <g className="pers-corpo">
        <ellipse cx="62" cy="140" rx="32" ry="5" fill="#000" opacity=".08" />
        <ellipse cx="48" cy="132" rx="9" ry="5" fill="#9A3412" /><ellipse cx="76" cy="132" rx="9" ry="5" fill="#9A3412" />
        <g transform="rotate(-5 62 76)">
          <Bracos e={[24, 82]} d={[100, 82]} cor="#C2410C" mao="#FFC59A" humor={humor} />
          <path d="M44 26V6h30M44 16h22" fill="none" stroke="#C2410C" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 46c0-14 8-22 22-22h32c14 0 22 8 22 22v58c0 14-8 22-22 22H46c-14 0-22-8-22-22z" fill="#FF8A3D" stroke="#C2410C" strokeWidth="3" />
          <path d="M34 36c3-4 7-6 12-6" fill="none" stroke="#FFC59A" strokeWidth="4" strokeLinecap="round" />
          <Olhos x1={48} x2={78} y={60} rx={10} ry={11} humor={humor} />
          {humor !== 'festa' && humor !== 'piscando' && <g fill="none" stroke={TINTA} strokeWidth="3.5" strokeLinecap="round"><path d="M39 44l15 2" /><path d="M70 42q8-6 16-1" /></g>}
          <Boca x={63} y={86} humor={humor === 'feliz' ? 'feliz' : humor} larg={11} />
          {(humor === 'feliz' || humor === 'acenando') && <circle cx="86" cy="80" r="4.5" fill="#F59E8B" opacity=".6" />}
        </g>
      </g>
    </svg>
  );
}

// Balão de fala, usado pelos personagens
export function Balao({ children, lado = 'baixo', className = '' }: { children: React.ReactNode; lado?: 'baixo' | 'esquerda'; className?: string }) {
  return <div className={'balao balao-' + lado + (className ? ' ' + className : '')}>{children}</div>;
}
