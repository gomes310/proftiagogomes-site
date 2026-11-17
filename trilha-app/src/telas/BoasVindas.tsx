import { useEffect, useState } from 'react';
import { META_PADRAO, mudarMeta } from '../estado';
import { APP } from '../plataforma';
import { salvarLembrete } from '../nativo';
import { som } from '../som';
import { Icone } from '../componentes/Icones';

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

// ilustração própria: trilha em zigue-zague com nós e uma estrela no fim
const Ilustracao = () => (
  <svg className="bv-ilus" viewBox="0 0 240 180" aria-hidden="true">
    <path d="M40 160 C 40 120, 200 130, 200 95 S 60 70, 70 35" fill="none" stroke="#CDD5E1" strokeWidth="10" strokeLinecap="round" strokeDasharray="2 18" />
    <g><circle cx="40" cy="158" r="20" fill="#135233" /><circle cx="40" cy="152" r="20" fill="#1E7A4C" /><path d="M31 152l6 6 12-12" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></g>
    <g><circle cx="200" cy="99" r="22" fill="#C9A92B" /><circle cx="200" cy="93" r="22" fill="#FFD84D" /><text x="200" y="101" textAnchor="middle" fontSize="22" fontWeight="700" fill="#172238">2</text></g>
    <g><circle cx="70" cy="41" r="20" fill="#95A1B3" /><circle cx="70" cy="35" r="20" fill="#B9C3D2" /><path d="M64 33v-4a6 6 0 0 1 12 0v4m-14 0h16v12h-16z" fill="#fff" /></g>
    <path d="M165 22l4.5 9.5 10.5 1.4-7.6 7.3 1.9 10.4-9.3-5-9.3 5 1.9-10.4-7.6-7.3 10.5-1.4z" fill="#E0B400" />
  </svg>
);

export default function BoasVindas({ onFim, irPara }: { onFim: (comecar: boolean) => void; irPara: (r: string) => void }) {
  const [passo, setPasso] = useState(0);
  const [meta, setMeta] = useState(META_PADRAO);
  const [hora, setHora] = useState(19);
  const [aviso, setAviso] = useState('');
  const total = APP ? 3 : 2;

  useEffect(() => { document.getElementById('bv-titulo')?.focus(); }, [passo]);

  function concluir(comecar: boolean) { marcar(); mudarMeta(meta); onFim(comecar); }
  async function lembrete(ativar: boolean) {
    if (ativar) {
      const r = await salvarLembrete({ ativo: true, hora });
      if (!r.ok) { setAviso(r.motivo || ''); return; }
    }
    concluir(true);
  }

  return (
    <div className="bv" role="dialog" aria-modal="true" aria-labelledby="bv-titulo">
      <div className="bv-topo">
        {passo > 0 ? <button type="button" className="fechar" aria-label="Voltar" onClick={() => setPasso(passo - 1)}>‹</button> : <span className="bv-espaco" />}
        <div className="bv-pontos" role="img" aria-label={'Passo ' + (passo + 1) + ' de ' + total}>{Array.from({ length: total }, (_, k) => <i key={k} className={k <= passo ? 'on' : ''} />)}</div>
        <button type="button" className="link bv-pular" onClick={() => concluir(false)}>Pular</button>
      </div>

      <div className="bv-corpo" key={passo}>
        {passo === 0 && <>
          <Ilustracao />
          <h1 id="bv-titulo" tabIndex={-1}>Raciocínio Lógico do zero, jogando</h1>
          <ul className="bv-lista">
            <li><Icone nome="relogio" tamanho={34} /><div><strong>Lições de 5 minutos</strong><small>Uma ideia por tela, na ordem certa.</small></div></li>
            <li><Icone nome="venn" tamanho={34} /><div><strong>Aprenda praticando</strong><small>Experimente, erre sem medo e veja a explicação.</small></div></li>
            <li><Icone nome="xp" tamanho={34} /><div><strong>XP, ofensiva e ranking</strong><small>Estude um pouco todo dia e suba na liga.</small></div></li>
          </ul>
        </>}
        {passo === 1 && <>
          <h1 id="bv-titulo" tabIndex={-1}>Qual vai ser sua meta diária?</h1>
          <p className="lead">Dá para mudar quando quiser no painel.</p>
          <div className="bv-metas" role="radiogroup" aria-label="Meta diária">
            {METAS.map((m) => (
              <button key={m.xp} type="button" role="radio" aria-checked={meta === m.xp} className={'bv-meta' + (meta === m.xp ? ' sel' : '')} onClick={() => { setMeta(m.xp); som('toque'); }}>
                <strong>{m.nome}{m.rec && <em>recomendada</em>}</strong><span>{m.tempo}</span><b>{m.xp} XP</b>
              </button>
            ))}
          </div>
        </>}
        {passo === 2 && <>
          <h1 id="bv-titulo" tabIndex={-1}>Quer um lembrete para não perder a ofensiva?</h1>
          <p className="lead">Uma notificação por dia, no horário que você escolher.</p>
          <div className="bv-horas" role="radiogroup" aria-label="Horário do lembrete">
            {HORAS.map((h) => <button key={h} type="button" role="radio" aria-checked={hora === h} className={'chip-b' + (hora === h ? ' sel' : '')} onClick={() => setHora(h)}>{h}h</button>)}
          </div>
          {aviso && <p className="msg-erro" role="alert">{aviso}</p>}
        </>}
      </div>

      <div className="bv-base">
        {passo === 0 && <>
          <button type="button" className="btn btn-ok largo" onClick={() => setPasso(1)}>Começar agora</button>
          <button type="button" className="btn largo" onClick={() => { marcar(); onFim(false); irPara('entrar'); }}>Já tenho conta</button>
        </>}
        {passo === 1 && <button type="button" className="btn btn-ok largo" onClick={() => (APP ? setPasso(2) : concluir(true))}>{APP ? 'Continuar' : 'Começar a 1ª lição'}</button>}
        {passo === 2 && <>
          <button type="button" className="btn btn-ok largo" onClick={() => void lembrete(true)}>Ativar lembrete às {hora}h</button>
          <button type="button" className="btn largo" onClick={() => void lembrete(false)}>Agora não</button>
        </>}
      </div>
    </div>
  );
}
