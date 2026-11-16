import { LICOES, UNIDADES } from '../dados/licoes';
import { liberada, useEstado } from '../estado';
import { useSessao } from '../api';
import { APP } from '../plataforma';

const CADEADO = <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 0 1 4 0v2h-4Z" /></svg>;
const OK = <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M9.5 16.2 5.3 12l-1.4 1.4 5.6 5.6 11-11-1.4-1.4Z" /></svg>;

export default function Trilha({ abrir, irPara }: { abrir: (i: number) => void; irPara: (r: string) => void }) {
  const e = useEstado();
  const sessao = useSessao();
  const atual = LICOES.findIndex((_, i) => liberada(e, i) && e.estrelas[i] == null);

  return (
    <>
      <section className="abertura">
        <h1>Raciocínio Lógico do zero, uma lição por vez</h1>
        <p>11 lições curtas, na ordem certa para quem nunca estudou. Aprenda passo a passo, experimente, responda os exercícios e libere a próxima.</p>
        {!sessao && <p className="convite">Seu progresso fica salvo neste aparelho. <button type="button" className="link" onClick={() => irPara('entrar')}>Crie sua conta grátis</button> para guardar na nuvem e entrar no ranking.</p>}
        {!APP && <p className="links">Prefere ler tudo de uma vez? <a href="/trilha/roteiro/">Veja o roteiro completo</a> ou <a href="/trilha/trilha-de-estudos-raciocinio-logico.pdf" download>baixe em PDF</a>.</p>}
      </section>

      {UNIDADES.map((u) => {
        const completa = u.licoes.every((i) => e.estrelas[i] != null);
        return (
          <section className="unidade" key={u.nome}>
            <div className="unidade-cab">
              <div><h2>{u.nome}</h2><p>{u.desc}</p></div>
              <span className={'selo' + (completa ? ' ganho' : '')}>{completa ? '🏅 ' : ''}{u.selo}</span>
            </div>
            <ol className="caminho">
              {u.licoes.map((i) => {
                const l = LICOES[i], feita = e.estrelas[i] != null, livre = liberada(e, i);
                const cls = feita ? '' : i === atual ? ' atual' : livre ? '' : ' bloqueado';
                const rotulo = l.titulo + (feita ? ', concluída com ' + e.estrelas[i] + ' de 3 estrelas' : livre ? ', disponível' : ', bloqueada: termine a lição anterior');
                return (
                  <li key={i}>
                    <button className={'no' + cls} type="button" aria-label={'Lição ' + (i + 1) + ': ' + rotulo} aria-disabled={!livre}
                      onClick={(ev) => {
                        if (!livre) { const b = ev.currentTarget; b.animate?.([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], { duration: 200 }); return; }
                        abrir(i);
                      }}>
                      {feita ? OK : livre ? i + 1 : CADEADO}
                    </button>
                    <span className="no-nome">{l.titulo}</span>
                    {feita ? <span className="estrelas" aria-hidden="true">{[0, 1, 2].map((k) => <span key={k} className={k < e.estrelas[i] ? '' : 'apagada'}>★</span>)}</span>
                      : i === atual ? <span className="comecar">{i === 0 && !Object.keys(e.estrelas).length ? 'COMEÇAR' : 'PRÓXIMA'}</span> : null}
                  </li>
                );
              })}
            </ol>
            {completa && !APP && <p className="bau">Unidade concluída! Aprofunde com o <a href="/guia/">Guia do Raciocínio Lógico</a>.</p>}
            {completa && APP && <p className="bau">Unidade concluída! Selo <strong>{u.selo}</strong> conquistado.</p>}
          </section>
        );
      })}
    </>
  );
}
