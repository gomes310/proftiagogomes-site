// Aba Praticar: revisão inteligente (Rosetta Stone), desafio relâmpago (Duolingo), caderno de regras e loja.
import { useState } from 'react';
import { LICOES } from '../dados/licoes';
import { CONTEUDO } from '../dados/imersao';
import { PRECO_ESCUDO, comprarEscudo, questoesParaRevisar, useEstado } from '../estado';
import Lumi from '../componentes/Lumi';
import { som } from '../som';

function sortear<T>(a: T[], n: number) { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r.slice(0, n); }

export default function Praticar({ iniciar, irPara }: { iniciar: (tipo: 'revisao' | 'relampago', ids: string[]) => void; irPara: (r: string) => void }) {
  const e = useEstado();
  const [msgLoja, setMsgLoja] = useState('');
  const feitas = LICOES.map((_, i) => i).filter((i) => e.estrelas[i] != null);
  const pendentes = questoesParaRevisar(e);
  const todasFeitas = feitas.flatMap((i) => LICOES[i].questoes.map((_, q) => i + '-' + q));

  if (!feitas.length) return (
    <div className="praticar">
      <h1>Praticar</h1>
      <div className="card vazio">
        <Lumi humor="piscando" tamanho={84} />
        <h2>Primeiro, uma lição</h2>
        <p>A prática usa o que você já estudou. Conclua a primeira lição da trilha para liberar a revisão, o desafio relâmpago e o caderno de regras.</p>
        <button type="button" className="btn btn-ok" onClick={() => irPara('')}>Ir para a trilha</button>
      </div>
    </div>
  );

  return (
    <div className="praticar">
      <h1>Praticar</h1>

      <section className="card pratica-card destaque-rev" aria-labelledby="rev-t">
        <div className="pratica-ico" aria-hidden="true">🧠</div>
        <div className="pratica-txt">
          <h2 id="rev-t">Revisão inteligente</h2>
          {pendentes.length
            ? <p><strong>{pendentes.length} {pendentes.length === 1 ? 'questão está' : 'questões estão'}</strong> no ponto de revisar. Quem revisa no tempo certo guarda a matéria por muito mais tempo.</p>
            : <p>Tudo revisado por hoje! As questões voltam no dia certo. Quer reforçar mesmo assim?</p>}
        </div>
        <button type="button" className="btn btn-ok" onClick={() => iniciar('revisao', pendentes.length ? pendentes.slice(0, 10) : sortear(todasFeitas, 8))}>
          {pendentes.length ? 'Revisar ' + Math.min(10, pendentes.length) + (pendentes.length === 1 ? ' questão' : ' questões') : 'Revisão extra'}
        </button>
      </section>

      <section className="card pratica-card" aria-labelledby="rel-t">
        <div className="pratica-ico" aria-hidden="true">⚡</div>
        <div className="pratica-txt">
          <h2 id="rel-t">Desafio relâmpago</h2>
          <p>60 segundos para acertar o máximo de questões das lições que você já fez. {e.recordeRelampago ? <>Seu recorde: <strong>{e.recordeRelampago}</strong>.</> : 'Defina seu primeiro recorde!'}</p>
        </div>
        <button type="button" className="btn btn-pri" onClick={() => iniciar('relampago', sortear(todasFeitas, todasFeitas.length).concat(sortear(todasFeitas, todasFeitas.length)))}>Começar desafio</button>
      </section>

      <section className="card" aria-labelledby="cad-t">
        <h2 id="cad-t">📒 Caderno de regras</h2>
        <p className="nota">O resumo de cada lição fica aqui depois que você a conclui. Ótimo para revisar antes da prova.</p>
        <div className="caderno">
          {LICOES.map((l, i) => {
            const livre = e.estrelas[i] != null;
            if (!livre) return <div key={i} className="caderno-item bloqueado"><span>🔒 {i + 1}. {l.titulo}</span><small>Conclua a lição para liberar</small></div>;
            const c = CONTEUDO[i].caderno;
            return (
              <details key={i} className="caderno-item">
                <summary onClick={() => som('toque')}>{i + 1}. {l.titulo}</summary>
                <ul>{c.regras.map((r, k) => <li key={k}>{r}</li>)}</ul>
                <p className="dica-prova"><strong>Dica de prova:</strong> {c.dica}</p>
              </details>
            );
          })}
        </div>
      </section>

      <section className="card loja" aria-labelledby="loja-t">
        <div className="card-cab"><h2 id="loja-t">Loja</h2><span className="chip" aria-label={e.moedas + ' moedas'}>🪙 {e.moedas}</span></div>
        <div className="loja-item">
          <span className="pratica-ico" aria-hidden="true">🛡️</span>
          <div className="pratica-txt">
            <strong>Escudo de ofensiva</strong>
            <p>Protege sua ofensiva se você ficar um dia sem estudar. Você tem <strong>{e.escudos} de 2</strong>.</p>
          </div>
          <button type="button" className="btn" disabled={e.escudos >= 2} onClick={() => { const m = comprarEscudo(); setMsgLoja(m || 'Escudo comprado! Ele é usado sozinho se você faltar um dia.'); som(m ? 'erro' : 'certo'); }}>
            {e.escudos >= 2 ? 'Máximo' : 'Comprar · 🪙 ' + PRECO_ESCUDO}
          </button>
        </div>
        {msgLoja && <p className="nota" role="status">{msgLoja}</p>}
        <p className="nota">Ganhe moedas concluindo lições (+5, +10 se perfeita), missões (+5) e práticas (+1 por acerto).</p>
      </section>
    </div>
  );
}
