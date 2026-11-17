import { LICOES, UNIDADES } from '../dados/licoes';
import { liberada, useEstado } from '../estado';
import { useSessao } from '../api';
import { APP } from '../plataforma';
import { Icone, Selo } from '../componentes/Icones';
import { SIMBOLO_UNIDADE } from '../estado';

const CADEADO = <Icone nome="cadeado" tamanho={30} />;
const OK = <Icone nome="verdade" tamanho={30} />;

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

      {UNIDADES.map((u, ui) => {
        const completa = u.licoes.every((i) => e.estrelas[i] != null);
        return (
          <section className="unidade" key={u.nome}>
            <div className="unidade-cab">
              <div><h2>{u.nome}</h2><p>{u.desc}</p></div>
              <span className={'selo' + (completa ? ' ganho' : '')}><Selo simbolo={SIMBOLO_UNIDADE[ui]} cor={completa ? 'ouro' : 'cinza'} tamanho={22} />{u.selo}</span>
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
                    {feita ? <span className="estrelas" aria-hidden="true">{[0, 1, 2].map((k) => <Icone key={k} nome="estrela" tamanho={16} className={k < e.estrelas[i] ? '' : 'apagada'} />)}</span>
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
