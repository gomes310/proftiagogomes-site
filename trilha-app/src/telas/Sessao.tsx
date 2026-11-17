// Sessão de prática: revisão inteligente (repetição espaçada) ou desafio relâmpago (60 s).
import { useEffect, useMemo, useRef, useState } from 'react';
import { LICOES } from '../dados/licoes';
import { registrarPratica, registrarResposta } from '../estado';
import { som } from '../som';
import { vibrar } from '../nativo';
import Lumi from '../componentes/Lumi';
import { Icone } from '../componentes/Icones';
import { confete } from '../componentes/confete';

const Html = ({ h, as: Tag = 'span', ...r }: { h: string; as?: 'span' | 'h2'; id?: string }) => <Tag {...r} dangerouslySetInnerHTML={{ __html: h }} />;
const TEMPO = 60;

export default function Sessao({ tipo, ids, onFechar }: { tipo: 'revisao' | 'relampago'; ids: string[]; onFechar: () => void }) {
  const itens = useMemo(() => ids.map((id) => { const [l, q] = id.split('-').map(Number); return { id, q: LICOES[l].questoes[q], licao: LICOES[l].titulo }; }).filter((x) => x.q), [ids]);
  const [pos, setPos] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [combo, setCombo] = useState(0);
  const [resto, setResto] = useState(TEMPO);
  const [fim, setFim] = useState<null | { ganho: number; moedas: number; recorde: boolean }>(null);
  const acertosRef = useRef(0);

  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; }; }, []);
  useEffect(() => { document.getElementById('sessao-titulo')?.focus({ preventScroll: true }); }, [pos, fim]);
  // cronômetro do desafio relâmpago
  useEffect(() => {
    if (tipo !== 'relampago' || fim) return;
    if (resto <= 0) { terminar(); return; }
    const t = setTimeout(() => setResto((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resto, fim]);

  function terminar() {
    const r = registrarPratica(acertosRef.current, tipo);
    setFim(r); som('fim'); vibrar('fim');
    if (r.recorde || (tipo === 'revisao' && acertosRef.current === itens.length)) confete();
  }
  const item = itens[pos % Math.max(1, itens.length)];
  function responder(k: number) {
    if (escolha !== null || fim) return;
    setEscolha(k);
    const ok = k === item.q.c;
    const nc = ok ? combo + 1 : 0;
    setCombo(nc);
    if (ok) { acertosRef.current++; setAcertos(acertosRef.current); }
    registrarResposta(ok, nc, item.id);
    som(ok ? 'certo' : 'erro'); vibrar(ok ? 'certo' : 'erro');
    if (tipo === 'relampago') setTimeout(proxima, ok ? 450 : 900);
  }
  function proxima() {
    setEscolha(null);
    if (tipo === 'revisao' && pos + 1 >= itens.length) { terminar(); return; }
    setPos((p) => p + 1);
  }

  if (!itens.length) return null;
  const progresso = tipo === 'relampago' ? resto / TEMPO : (pos + (escolha !== null ? 1 : 0)) / itens.length;
  const ok = escolha !== null && escolha === item.q.c;

  return (
    <div className="licao aberta" role="dialog" aria-modal="true" aria-labelledby="sessao-titulo">
      <div className="licao-topo">
        <button className="fechar" type="button" onClick={onFechar} aria-label="Sair da prática">×</button>
        <div className={'trilho' + (tipo === 'relampago' ? ' tempo' + (resto <= 10 ? ' acabando' : '') : '')} aria-hidden="true"><span style={{ width: progresso * 100 + '%' }} /></div>
        {tipo === 'relampago' && !fim ? <span className="relogio" aria-live="off"><Icone nome="relogio" tamanho={22} />{resto}s</span> : combo >= 2 ? <span className="combo"><Icone nome="ofensiva" tamanho={22} />{combo}</span> : <span className="bv-espaco" />}
      </div>
      <div className="licao-corpo"><div className="wrap" key={fim ? 'fim' : pos}><div className="cartao">
        {fim ? (
          <div className="fim">
            <Lumi humor={fim.recorde || acertos > 0 ? 'festa' : 'feliz'} tamanho={88} className="fim-lumi" />
            <h2 id="sessao-titulo" tabIndex={-1}>{tipo === 'relampago' ? (fim.recorde ? 'Novo recorde!' : 'Tempo esgotado!') : 'Revisão concluída!'}</h2>
            <div className="placar">
              <div><b>{acertos}</b><small>{tipo === 'relampago' ? 'acertos em 60 s' : 'de ' + itens.length + ' certas'}</small></div>
              <div><b>+{fim.ganho}</b><small>XP</small></div>
              <div><b>+{fim.moedas}</b><small>moedas</small></div>
            </div>
            <p className="lead">{tipo === 'revisao' ? 'As que você errou voltam amanhã; as que acertou voltam em alguns dias. Assim a matéria fica na memória de longo prazo.' : 'Quanto mais você revisa, mais rápido fica. Tente bater seu recorde amanhã!'}</p>
          </div>
        ) : (
          <>
            <p className="rotulo">{tipo === 'relampago' ? 'Desafio relâmpago · ' + acertos + ' acertos' : 'Revisão ' + (pos + 1) + ' de ' + itens.length} · {item.licao}</p>
            <Html as="h2" h={item.q.p} id="sessao-titulo" />
            <div className="opcoes" role="group" aria-label="Alternativas">
              {item.q.o.map((t, k) => {
                let cls = 'opcao';
                if (escolha !== null) { if (k === item.q.c) cls += ' certa'; else if (k === escolha) cls += ' errada'; }
                return <button key={k} type="button" className={cls} disabled={escolha !== null} onClick={() => responder(k)}><span className="tecla" aria-hidden="true">{k + 1}</span><Html h={t} /></button>;
              })}
            </div>
          </>
        )}
      </div></div></div>
      <div className={'licao-base' + (escolha !== null && !fim ? (ok ? ' acerto' : ' erro') : '')}><div className="wrap">
        <div className="retorno" aria-live="polite">
          {!fim && escolha !== null && tipo === 'revisao' && <><strong>{ok ? 'Certo!' : 'Resposta certa: '}{!ok && <Html h={item.q.o[item.q.c]} />}</strong><Html h={item.q.e} /></>}
          {!fim && escolha !== null && tipo === 'relampago' && <strong>{ok ? 'Certo!' : 'Errou, vai a próxima!'}</strong>}
          {!fim && escolha === null && tipo === 'relampago' && <span className="dica-base">Responda o máximo que conseguir antes do tempo acabar.</span>}
        </div>
        {fim ? <button className="btn btn-ok" type="button" onClick={onFechar}>Concluir</button>
          : tipo === 'revisao' ? <button className="btn btn-ok" type="button" disabled={escolha === null} onClick={proxima}>{pos + 1 >= itens.length && escolha !== null ? 'Ver resultado' : 'Continuar'}</button>
            : <button className="btn" type="button" onClick={terminar}>Encerrar</button>}
      </div></div>
    </div>
  );
}
