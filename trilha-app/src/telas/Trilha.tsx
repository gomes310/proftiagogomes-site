import { useEffect, useRef, useState } from 'react';
import { LICOES, UNIDADES } from '../dados/licoes';
import { abrirBau, bauLiberado, liberada, posicaoBau, useEstado, SIMBOLO_UNIDADE, MOEDAS_BAU } from '../estado';
import { useSessao } from '../api';
import { APP } from '../plataforma';
import { Icone, Selo } from '../componentes/Icones';
import Lumi, { Efe, Ve, Balao, type Humor } from '../componentes/Lumi';
import { som } from '../som';

const CADEADO = <Icone nome="cadeado" tamanho={30} />;
const OK = <Icone nome="verdade" tamanho={30} />;

// quem acompanha cada unidade e o que diz quando o aluno toca nele
const GUIAS = [
  { quem: Lumi, nome: 'Lumi', falas: ['Conjunto é só uma coleção. Desenhe os círculos!', 'Na dúvida, faça o diagrama de Venn.', 'Interseção é o que está nos dois ao mesmo tempo.'] },
  { quem: Ve, nome: 'Vê', falas: ['“E” só é verdade se as duas partes forem verdade.', 'Se… então: só é falso quando V leva a F.', 'Negar “todo” é dizer “algum não”.'] },
  { quem: Efe, nome: 'Efe', falas: ['Psiu… nem todo argumento bonito é válido!', 'Eu adoro conclusões que não decorrem das premissas.', 'Desconfie de mim: teste as premissas!'] },
  { quem: Lumi, nome: 'Lumi', falas: ['Organize os dados em tabela antes de chutar.', 'Leia o enunciado duas vezes. Sério!', 'Princípio da casa dos pombos: sempre sobra um.'] }
];
const CORES = ['verde', 'azul', 'roxo', 'laranja'];

function Bau({ estado }: { estado: 'bloqueado' | 'pronto' | 'aberto' }) {
  const ouro = estado === 'pronto';
  return (
    <svg width="64" height="56" viewBox="0 0 64 56" aria-hidden="true" className={'bau-svg ' + estado}>
      <ellipse cx="32" cy="52" rx="24" ry="3.5" fill="#000" opacity=".08" />
      <rect x="6" y="24" width="52" height="26" rx="5" fill={ouro ? '#C27A1A' : '#A3AFC2'} stroke={ouro ? '#7A4A0C' : '#7D8AA0'} strokeWidth="2.5" />
      <path d="M6 32h52" stroke={ouro ? '#7A4A0C' : '#7D8AA0'} strokeWidth="2.5" />
      <g className="bau-tampa">
        {estado === 'aberto'
          ? <path d="M8 22 12 6h40l4 16z" fill="#C8D1DE" stroke="#7D8AA0" strokeWidth="2.5" strokeLinejoin="round" />
          : <path d="M6 24c0-10 6-16 14-16h24c8 0 14 6 14 16z" fill={ouro ? '#E09A2D' : '#B9C3D2'} stroke={ouro ? '#7A4A0C' : '#7D8AA0'} strokeWidth="2.5" />}
      </g>
      {estado === 'aberto' && <g fill="#F2C230" stroke="#C99A0A" strokeWidth="1.2"><circle cx="24" cy="24" r="5" /><circle cx="34" cy="21" r="5" /><circle cx="42" cy="25" r="4.5" /></g>}
      {estado !== 'aberto' && <><rect x="25" y="26" width="14" height="14" rx="3" fill={ouro ? '#F2C230' : '#E3E8EF'} stroke={ouro ? '#7A4A0C' : '#7D8AA0'} strokeWidth="2" />
        <g fill={ouro ? '#7A4A0C' : '#7D8AA0'}><circle cx="32" cy="30" r="1.4" /><circle cx="29.2" cy="35" r="1.4" /><circle cx="34.8" cy="35" r="1.4" /></g></>}
    </svg>
  );
}

function Guia({ u }: { u: number }) {
  const g = GUIAS[u % GUIAS.length];
  const [fala, setFala] = useState<number | null>(null);
  const [humor, setHumor] = useState<Humor>('feliz');
  const t = useRef<number | undefined>(undefined), t2 = useRef<number | undefined>(undefined);
  useEffect(() => () => { clearTimeout(t.current); clearTimeout(t2.current); }, []);
  const Quem = g.quem;
  return (
    <li className={'guia guia-' + (u % 2 ? 'esq' : 'dir')}>
      {fala !== null && <Balao lado="baixo" className="guia-balao"><span role="status">{g.falas[fala]}</span></Balao>}
      <button type="button" className="guia-btn" aria-label={'Dica de ' + g.nome}
        onClick={() => { som('toque'); setFala((f) => (f === null ? 0 : (f + 1) % g.falas.length)); setHumor('festa'); clearTimeout(t.current); t.current = window.setTimeout(() => setHumor('falando'), 700); t2.current && clearTimeout(t2.current); t2.current = window.setTimeout(() => { setFala(null); setHumor('feliz'); }, 5000); }}>
        <Quem humor={humor} tamanho={84} />
      </button>
    </li>
  );
}

export default function Trilha({ abrir, irPara }: { abrir: (i: number) => void; irPara: (r: string) => void }) {
  const e = useEstado();
  const sessao = useSessao();
  const [ganhoBau, setGanhoBau] = useState<number | null>(null);
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
        const pb = posicaoBau(ui);
        const bauEstado = e.baus.includes(ui) ? 'aberto' : bauLiberado(e, ui) ? 'pronto' : 'bloqueado';
        const itens: ({ tipo: 'licao'; i: number } | { tipo: 'bau' })[] = [];
        u.licoes.forEach((i, k) => { itens.push({ tipo: 'licao', i }); if (k === pb) itens.push({ tipo: 'bau' }); });
        return (
          <section className={'unidade unidade-' + CORES[ui % CORES.length]} key={u.nome}>
            <div className="unidade-cab">
              <div>
                <p className="unidade-num">{u.nome.split(' · ')[0]}</p>
                <h2>{u.nome.split(' · ')[1] || u.nome}</h2>
                <span className={'selo' + (completa ? ' ganho' : '')}><Selo simbolo={SIMBOLO_UNIDADE[ui]} cor={completa ? 'ouro' : 'cinza'} tamanho={20} />{completa ? 'Selo ' + u.selo : u.desc}</span>
              </div>
              <a className="btn-caderno" href="#/praticar"><Icone nome="caderno" tamanho={22} />Caderno</a>
            </div>
            <ol className="caminho">
              {itens.map((it) => {
                if (it.tipo === 'bau') {
                  return (
                    <li key="bau" className="item-bau">
                      <button type="button" className={'bau-no ' + bauEstado} aria-disabled={bauEstado !== 'pronto'}
                        aria-label={bauEstado === 'aberto' ? 'Baú já aberto' : bauEstado === 'pronto' ? 'Abrir o baú: ' + MOEDAS_BAU + ' moedas' : 'Baú trancado: termine as lições anteriores'}
                        onClick={(ev) => {
                          if (bauEstado !== 'pronto') { ev.currentTarget.animate?.([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], { duration: 200 }); return; }
                          const g = abrirBau(ui); if (g) { som('nivel'); setGanhoBau(g); setTimeout(() => setGanhoBau(null), 2200); }
                        }}>
                        <Bau estado={bauEstado} />
                      </button>
                      {bauEstado === 'pronto' && <span className="no-nome">Baú liberado!</span>}
                    </li>
                  );
                }
                const i = it.i, l = LICOES[i], feita = e.estrelas[i] != null, livre = liberada(e, i);
                const cls = feita ? '' : i === atual ? ' atual' : livre ? '' : ' bloqueado';
                const rotulo = l.titulo + (feita ? ', concluída com ' + e.estrelas[i] + ' de 3 estrelas' : livre ? ', disponível' : ', bloqueada: termine a lição anterior');
                return (
                  <li key={i}>
                    {i === atual && <span className="comecar" aria-hidden="true">{i === 0 && !Object.keys(e.estrelas).length ? 'COMEÇAR' : 'PRÓXIMA'}</span>}
                    <button className={'no' + cls} type="button" aria-label={'Lição ' + (i + 1) + ': ' + rotulo} aria-disabled={!livre}
                      onClick={(ev) => {
                        if (!livre) { const b = ev.currentTarget; b.animate?.([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], { duration: 200 }); return; }
                        abrir(i);
                      }}>
                      {feita ? OK : livre ? i + 1 : CADEADO}
                    </button>
                    <span className="no-nome">{l.titulo}</span>
                    {feita && <span className="estrelas" aria-hidden="true">{[0, 1, 2].map((k) => <Icone key={k} nome="estrela" tamanho={16} className={k < e.estrelas[i] ? '' : 'apagada'} />)}</span>}
                  </li>
                );
              })}
              <Guia u={ui} />
            </ol>
            {completa && !APP && <p className="bau">Unidade concluída! Aprofunde com o <a href="/guia/">Guia do Raciocínio Lógico</a>.</p>}
            {completa && APP && <p className="bau">Unidade concluída! Selo <strong>{u.selo}</strong> conquistado.</p>}
          </section>
        );
      })}
      {ganhoBau !== null && (
        <div className="bau-ganho" role="status">
          <div className="bau-moedas" aria-hidden="true">{[0, 1, 2, 3, 4].map((k) => <Icone key={k} nome="moeda" tamanho={34} />)}</div>
          <strong>+{ganhoBau} moedas!</strong>
        </div>
      )}
    </>
  );
}
