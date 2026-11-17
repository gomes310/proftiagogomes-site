import { useEffect, useState } from 'react';
import { META_PADRAO, mudarMeta } from '../estado';
import { APP } from '../plataforma';
import { salvarLembrete } from '../nativo';
import { som } from '../som';
import { Selo } from '../componentes/Icones';
import Lumi, { Efe, Ve } from '../componentes/Lumi';
import { InterruptorLeitura } from '../componentes/Voz';
import { falar, leituraLigada, parar } from '../voz';

const CHAVE = 'trilha-boas-vindas';
export const jaViuBoasVindas = () => { try { return localStorage.getItem(CHAVE) === '1'; } catch { return true; } };
const marcar = () => { try { localStorage.setItem(CHAVE, '1'); } catch { /* ok */ } };

const METAS = [
  { xp: 10, nome: 'Leve', tempo: '5 min por dia' },
  { xp: 30, nome: 'Regular', tempo: '10 min por dia', rec: true },
  { xp: 50, nome: 'Puxado', tempo: '15 min por dia' },
  { xp: 80, nome: 'Intenso', tempo: '20 min por dia' }
];
const HORAS = [8, 12, 19, 21];

export const BANCAS = [
  { id: 'idecan', nome: 'IDECAN', sigla: 'ID', cor: 'azul' },
  { id: 'cebraspe', nome: 'Cebraspe', sigla: 'CE', cor: 'verde' },
  { id: 'fgv', nome: 'FGV', sigla: 'FG', cor: 'laranja' },
  { id: 'fcc', nome: 'FCC', sigla: 'FC', cor: 'prata' },
  { id: 'vunesp', nome: 'Vunesp', sigla: 'VU', cor: 'bronze' },
  { id: 'outra', nome: 'Outra ou ainda não sei', sigla: '?', cor: 'ouro' }
] as const;
const CHAVE_BANCA = 'trilha-banca';
export const bancaEscolhida = () => { try { return localStorage.getItem(CHAVE_BANCA) || ''; } catch { return ''; } };

const OI = 'Oi! Eu sou a Lumi, a lâmpada das ideias. Vou te guiar na Trilha do RLM!';
const SIMBOLOS = ['∧', '∨', '¬', '→', '∴', '≡', 'V', 'F', '↔', '∀'];

// texto que aparece letra por letra (leitores de tela recebem tudo de uma vez)
function Digitando({ texto }: { texto: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(texto.length); return; }
    setN(0); let i = 0;
    const t = setInterval(() => { i += 1; setN(i); if (i >= texto.length) clearInterval(t); }, 28);
    return () => clearInterval(t);
  }, [texto]);
  return <><span className="sr">{texto}</span><span className="digita" aria-hidden="true"><span className="digita-fantasma">{texto}</span><span className="digita-vis">{texto.slice(0, n)}</span></span></>;
}

// a Lumi fala em um balão; o texto do balão é o título da tela
function Fala({ texto, humor = 'falando', menor }: { texto: string; humor?: 'falando' | 'acenando' | 'feliz' | 'pensando'; menor?: boolean }) {
  useEffect(() => { if (leituraLigada()) void falar(texto); return () => { void parar(); }; }, [texto]);
  return (
    <div className={'bv-fala' + (menor ? ' menor' : '')}>
      <Lumi humor={humor} tamanho={menor ? 70 : 150} className="bv-fala-lumi" />
      <h1 id="bv-titulo" tabIndex={-1} className="balao balao-esquerda"><Digitando texto={texto} /></h1>
    </div>
  );
}

export default function BoasVindas({ onFim, irPara }: { onFim: (comecar: boolean) => void; irPara: (r: string) => void }) {
  // 0 abertura · 1 oi · 2 turma · 3 banca · 4 meta · 5 lembrete (só no app)
  const [passo, setPasso] = useState(0);
  const [meta, setMeta] = useState(META_PADRAO);
  const [hora, setHora] = useState(19);
  const [banca, setBanca] = useState(bancaEscolhida());
  const [aviso, setAviso] = useState('');
  const total = APP ? 5 : 4;

  useEffect(() => { document.getElementById('bv-titulo')?.focus(); }, [passo]);

  function concluir(comecar: boolean) { marcar(); mudarMeta(meta); onFim(comecar); }
  function escolherBanca(id: string) {
    setBanca(id); som('toque');
    try { localStorage.setItem(CHAVE_BANCA, id); } catch { /* ok */ }
    setTimeout(() => setPasso(4), 220);
  }
  async function lembrete(ativar: boolean) {
    if (ativar) {
      const r = await salvarLembrete({ ativo: true, hora });
      if (!r.ok) { setAviso(r.motivo || ''); return; }
    }
    concluir(true);
  }

  if (passo === 0) {
    return (
      <div className="bv bv-abertura" role="dialog" aria-modal="true" aria-labelledby="bv-titulo">
        <div className="palco" aria-hidden="true">
          {SIMBOLOS.map((c, k) => <span key={k} className="flutua" style={{ left: [4, 86, 20, 70, 38, 93, 12, 58, 28, 78][k] + '%', animationDelay: -k * 1.7 + 's', fontSize: 18 + (k % 3) * 8 + 'px' }}>{c}</span>)}
          <div className="palco-chao" />
          <Ve humor="feliz" tamanho={92} className="palco-ve" />
          <Lumi humor="acenando" tamanho={118} className="palco-lumi" />
          <Efe humor="piscando" tamanho={92} className="palco-efe" />
        </div>
        <div className="bv-abertura-texto">
          <h1 id="bv-titulo" tabIndex={-1}>Raciocínio Lógico do zero, jogando.</h1>
          <p className="lead">Lições de 5 minutos, grátis, feitas para concursos. Aprenda errando sem medo e suba no ranking.</p>
        </div>
        <div className="bv-base">
          <button type="button" className="btn btn-ok largo" onClick={() => { som('toque'); setPasso(1); }}>Começar agora</button>
          <button type="button" className="btn largo" onClick={() => { marcar(); onFim(false); irPara('entrar'); }}>Já tenho conta</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bv" role="dialog" aria-modal="true" aria-labelledby="bv-titulo">
      <div className="bv-topo">
        <button type="button" className="fechar" aria-label="Voltar" onClick={() => setPasso(passo - 1)}>‹</button>
        <div className="bv-progresso" role="progressbar" aria-label="Apresentação" aria-valuemin={1} aria-valuemax={total} aria-valuenow={passo}><span style={{ width: (passo / total) * 100 + '%' }} /></div>
        <button type="button" className="link bv-pular" onClick={() => concluir(false)}>Pular</button>
      </div>

      <div className="bv-corpo" key={passo}>
        {passo === 1 && <div className="bv-centro">
          <Fala humor="acenando" texto={OI} />
          <div className="bv-voz"><InterruptorLeitura aoLigar={() => void falar(OI)} /></div>
        </div>}
        {passo === 2 && <div className="bv-centro">
          <Fala texto="Estes são o Vê e o Efe. Um sempre diz a verdade… o outro, nem sempre. Descobrir quem tem razão é com você!" menor />
          <div className="bv-turma" aria-hidden="true">
            <figure><Ve humor="acenando" tamanho={104} className="entra" /><figcaption>Vê<small>a Verdade</small></figcaption></figure>
            <figure><Efe humor="feliz" tamanho={104} className="entra atraso" /><figcaption>Efe<small>o Falso</small></figcaption></figure>
          </div>
        </div>}
        {passo === 3 && <>
          <Fala texto="Para qual banca você estuda?" humor="pensando" menor />
          <div className="bv-bancas" role="radiogroup" aria-labelledby="bv-titulo">
            {BANCAS.map((b) => (
              <button key={b.id} type="button" role="radio" aria-checked={banca === b.id} className={'bv-banca' + (banca === b.id ? ' sel' : '')} onClick={() => escolherBanca(b.id)}>
                <Selo simbolo={b.sigla} cor={b.cor} tamanho={44} /><strong>{b.nome}</strong>
              </button>
            ))}
          </div>
        </>}
        {passo === 4 && <>
          <Fala texto="Qual vai ser sua meta diária?" humor="feliz" menor />
          <div className="bv-metas" role="radiogroup" aria-labelledby="bv-titulo">
            {METAS.map((m) => (
              <button key={m.xp} type="button" role="radio" aria-checked={meta === m.xp} className={'bv-meta' + (meta === m.xp ? ' sel' : '')} onClick={() => { setMeta(m.xp); som('toque'); }}>
                <strong>{m.nome}{m.rec && <em>recomendada</em>}</strong><span>{m.tempo}</span><b>{m.xp} XP</b>
              </button>
            ))}
          </div>
          <p className="nota">Dá para mudar quando quiser no painel.</p>
        </>}
        {passo === 5 && <>
          <Fala texto="Quer um lembrete para não perder a ofensiva?" humor="feliz" menor />
          <p className="lead">Uma notificação por dia, no horário que você escolher.</p>
          <div className="bv-horas" role="radiogroup" aria-label="Horário do lembrete">
            {HORAS.map((h) => <button key={h} type="button" role="radio" aria-checked={hora === h} className={'chip-b' + (hora === h ? ' sel' : '')} onClick={() => setHora(h)}>{h}h</button>)}
          </div>
          {aviso && <p className="msg-erro" role="alert">{aviso}</p>}
        </>}
      </div>

      <div className="bv-base">
        {(passo === 1 || passo === 2) && <button type="button" className="btn btn-ok largo" onClick={() => setPasso(passo + 1)}>Continuar</button>}
        {passo === 3 && <p className="nota bv-dica">Toque na sua banca para continuar.</p>}
        {passo === 4 && <button type="button" className="btn btn-ok largo" onClick={() => (APP ? setPasso(5) : concluir(true))}>{APP ? 'Continuar' : 'Começar a 1ª lição'}</button>}
        {passo === 5 && <>
          <button type="button" className="btn btn-ok largo" onClick={() => void lembrete(true)}>Ativar lembrete às {hora}h</button>
          <button type="button" className="btn largo" onClick={() => void lembrete(false)}>Agora não</button>
        </>}
      </div>
    </div>
  );
}
