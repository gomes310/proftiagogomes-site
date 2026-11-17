// Lumi: mascote próprio da Trilha do RLM (uma lâmpada de ideias). Desenho original em SVG.
type Humor = 'feliz' | 'pensando' | 'festa' | 'triste' | 'piscando';

export default function Lumi({ humor = 'feliz', tamanho = 96, className = '' }: { humor?: Humor; tamanho?: number; className?: string }) {
  const olhos = humor === 'piscando' || humor === 'festa'
    ? <><path d="M38 52q5-5 10 0" /><path d="M64 52q5-5 10 0" /></>
    : humor === 'pensando'
      ? <><circle cx="44" cy="52" r="4.5" /><circle cx="70" cy="49" r="4.5" /></>
      : <><circle cx="43" cy="52" r="4.5" /><circle cx="69" cy="52" r="4.5" /></>;
  const boca = humor === 'triste' ? <path d="M46 72q10-8 20 0" />
    : humor === 'pensando' ? <path d="M48 70h14" />
      : humor === 'festa' ? <path d="M42 64q14 18 28 0z" fill="#172238" />
        : <path d="M44 66q12 12 24 0" />;
  return (
    <svg className={'lumi lumi-' + humor + ' ' + className} width={tamanho} height={tamanho * 1.25} viewBox="0 0 112 140" aria-hidden="true">
      {humor === 'festa' && <g className="lumi-raios" stroke="#E0B400" strokeWidth="5" strokeLinecap="round"><path d="M56 4v12" /><path d="M14 22l9 8" /><path d="M98 22l-9 8" /><path d="M4 58h12" /><path d="M96 58h12" /></g>}
      <path d="M56 18c-24 0-42 18-42 40 0 15 8 26 18 33 4 3 6 7 6 11v4h36v-4c0-4 2-8 6-11 10-7 18-18 18-33 0-22-18-40-42-40z" fill="#FFD84D" stroke="#C9A92B" strokeWidth="3" />
      <ellipse cx="38" cy="38" rx="8" ry="12" fill="#FFF3B8" opacity=".9" transform="rotate(-25 38 38)" />
      <g fill="none" stroke="#172238" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round">{olhos}{boca}</g>
      {humor !== 'triste' && <><circle cx="32" cy="64" r="5" fill="#F59E8B" opacity=".55" /><circle cx="80" cy="64" r="5" fill="#F59E8B" opacity=".55" /></>}
      <rect x="38" y="108" width="36" height="9" rx="4" fill="#172238" />
      <rect x="40" y="119" width="32" height="8" rx="4" fill="#2C3D63" />
      <rect x="46" y="129" width="20" height="7" rx="3.5" fill="#172238" />
      {humor === 'pensando' && <g fill="#3B7BD9"><circle cx="96" cy="20" r="4" /><circle cx="104" cy="8" r="6" /></g>}
    </svg>
  );
}
