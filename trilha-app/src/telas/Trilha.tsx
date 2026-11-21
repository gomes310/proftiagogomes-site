// Trilha por tema: o aluno escolhe o tema e sobe do básico ao avançado, terminando nas questões de prova.
import { useEffect, useRef, useState } from 'react';
import { LICOES, NOMES_NIVEL, UNIDADES, varsTema } from '../dados/licoes';
import { EmblemaTema, EscadaNivel } from '../componentes/Tema';
import {
  MOEDAS_BAU, NOME_NIVEL_ALUNO, abrirBau, bauLiberado, desempenhoProvaTema, faltamParaProva, escolherTema, liberada, nivelTema, useEstado
} from '../estado';
import { useSessao } from '../api';
import { APP } from '../plataforma';
import { Icone } from '../componentes/Icones';
import Lumi, { Efe, Ve, Balao, type Humor } from '../componentes/Lumi';
import { som } from '../som';

const CADEADO = <Icone nome="cadeado" tamanho={30} />;
const OK = <Icone nome="verdade" tamanho={30} />;
const ZIGUE = [0, -1, 0, 1]; // deslocamento dos nós no caminho

// quem acompanha cada tema e o que diz quando o aluno toca nele
const GUIAS: { quem: typeof Lumi; nome: string; falas: string[] }[] = [
  { quem: Lumi, nome: 'Lumi', falas: ['Conjunto é só uma coleção. Desenhe os círculos!', 'Preencha o diagrama de Venn do centro para fora.', 'União soma, interseção desconta.'] },
  { quem: Ve, nome: 'Vê', falas: ['Proposição é o que dá para julgar V ou F.', '“Mas” vale “e”. Guarde isso!', 'O suficiente vai antes da seta.'] },
  { quem: Efe, nome: 'Efe', falas: ['Psiu… a condicional só é falsa em V → F.', 'Com n letras, a tabela tem 2ⁿ linhas.', 'Comece pelo caso que só tem um jeito.'] },
  { quem: Ve, nome: 'Vê', falas: ['Negar “e” vira “ou”, negando tudo.', 'Contrapositiva: inverte e nega.', 'Negar “todo” é “algum… não”.'] },
  { quem: Efe, nome: 'Efe', falas: ['Eu adoro conclusões que não decorrem das premissas!', 'Confirmar o q não prova o p. Pegadinha minha!', 'Teste um contraexemplo antes de marcar.'] },
  { quem: Lumi, nome: 'Lumi', falas: ['Monte a tabela antes de chutar.', 'Frases contraditórias: uma é V, a outra é F.', 'Um ✓ por linha e por coluna.'] },
  { quem: Ve, nome: 'Vê', falas: ['Olhe primeiro a diferença entre os termos.', 'Ciclo? Use o resto da divisão.', 'Soma dos dois anteriores: Fibonacci!'] },
  { quem: Efe, nome: 'Efe', falas: ['Pense no azar máximo antes de garantir.', '2100 não vai ser bissexto. Eu juro!', 'Divida os dias por 7 e olhe o resto.'] }
];

function Bau({ estado }: { estado: 'bloqueado' | 'pronto' | 'aberto' }) {
  const ouro = estado === 'pronto';
  return (
    <svg width="64" height="56" viewBox="0 0 64 56" aria-hidden="true" className={'bau-svg ' + estado}>
      <ellipse cx="32" cy="52" rx="24" ry="3.5" fill="#000" opacity=".08" />
      <rect x="6" y="24" width="52" height="26" rx="5" fill={ouro ? '#C27A1A' : '#A3AFC2'} stroke={ouro ? '#7A4A0C' : '#7D8AA0'} strokeWidth="2.5" />
      <path d="M6 32h52" stroke={ouro ? '#7A4A0C' : '#7D8AA0'} strokeWidth="2.5" />
      {estado === 'aberto'
        ? <path d="M8 22 12 6h40l4 16z" fill="#C8D1DE" stroke="#7D8AA0" strokeWidth="2.5" strokeLinejoin="round" />
        : <path d="M6 24c0-10 6-16 14-16h24c8 0 14 6 14 16z" fill={ouro ? '#E09A2D' : '#B9C3D2'} stroke={ouro ? '#7A4A0C' : '#7D8AA0'} strokeWidth="2.5" />}
      {estado === 'aberto' && <g fill="#F2C230" stroke="#C99A0A" strokeWidth="1.2"><circle cx="24" cy="24" r="5" /><circle cx="34" cy="21" r="5" /><circle cx="42" cy="25" r="4.5" /></g>}
      {estado !== 'aberto' && <><rect x="25" y="26" width="14" height="14" rx="3" fill={ouro ? '#F2C230' : '#E3E8EF'} stroke={ouro ? '#7A4A0C' : '#7D8AA0'} strokeWidth="2" />
        <g fill={ouro ? '#7A4A0C' : '#7D8AA0'}><circle cx="32" cy="30" r="1.4" /><circle cx="29.2" cy="35" r="1.4" /><circle cx="34.8" cy="35" r="1.4" /></g></>}
    </svg>
  );
}

function Guia({ t }: { t: number }) {
  const g = GUIAS[t % GUIAS.length];
  const [fala, setFala] = useState<number | null>(null);
  const [humor, setHumor] = useState<Humor>('feliz');
  const t1 = useRef<number | undefined>(undefined), t2 = useRef<number | undefined>(undefined);
  useEffect(() => () => { clearTimeout(t1.current); clearTimeout(t2.current); }, []);
  const Quem = g.quem;
  return (
    <div className={'guia guia-' + (t % 2 ? 'esq' : 'dir')}>
      {fala !== null && <Balao lado="baixo" className="guia-balao"><span role="status">{g.falas[fala]}</span></Balao>}
      <button type="button" className="guia-btn" aria-label={'Dica de ' + g.nome}
        onClick={() => {
          som('toque'); setFala((f) => (f === null ? 0 : (f + 1) % g.falas.length)); setHumor('festa');
          clearTimeout(t1.current); t1.current = window.setTimeout(() => setHumor('falando'), 700);
          clearTimeout(t2.current); t2.current = window.setTimeout(() => { setFala(null); setHumor('feliz'); }, 5000);
        }}>
        <Quem humor={humor} tamanho={84} />
      </button>
    </div>
  );
}

// ---------- Escolha do tema (como a grade de cursos do Duolingo) ----------
function EscolherTema({ onEscolher, irPara }: { onEscolher: (t: number) => void; irPara: (r: string) => void }) {
  const e = useEstado();
  const sessao = useSessao();
  const nada = Object.keys(e.estrelas).length === 0;
  return (
    <section className="temas" aria-labelledby="temas-t">
      <h1 id="temas-t">O que você quer aprender?</h1>
      <p className="lead">Escolha um tema. Cada um tem sua trilha, do básico ao avançado, terminando em questões de concursos. Você pode trocar quando quiser.</p>
      <ul className="temas-grade">
        {UNIDADES.map((u, t) => {
          const n = nivelTema(e, t);
          const feitas = u.licoes.filter((i) => e.estrelas[i] != null).length;
          return (
            <li key={u.id}>
              <button type="button" style={varsTema(t)} className={'tema-card' + (e.tema === t ? ' atual' : '')} onClick={() => { som('toque'); onEscolher(t); }}
                aria-label={u.nome + '. ' + NOME_NIVEL_ALUNO[n] + '. ' + feitas + ' de ' + u.licoes.length + ' lições.'}>
                <EmblemaTema t={t} tamanho={58} />
                <strong>{u.nome}</strong>
                <small>{u.desc}</small>
                <span className="tema-nivel">{n === 0 && nada && t === 0 ? 'Comece por aqui' : NOME_NIVEL_ALUNO[n]}</span>
                <EscadaNivel t={t} n={n} />
              </button>
            </li>
          );
        })}
      </ul>
      {!sessao && <p className="convite">Seu progresso fica salvo neste aparelho. <button type="button" className="link" onClick={() => irPara('entrar')}>Crie sua conta grátis</button> para guardar na nuvem e entrar no ranking.</p>}
      {!APP && <p className="links">Prefere ler tudo de uma vez? <a href="/trilha/roteiro/">Veja o roteiro completo</a> ou <a href="/trilha/trilha-de-estudos-raciocinio-logico.pdf" download>baixe em PDF</a>.</p>}
    </section>
  );
}

// ---------- Trilha de um tema ----------
export default function Trilha({ abrir, irPara, iniciar }: { abrir: (i: number) => void; irPara: (r: string) => void; iniciar: (ids: string[]) => void }) {
  const e = useEstado();
  const [escolhendo, setEscolhendo] = useState(false);
  const [ganhoBau, setGanhoBau] = useState<number | null>(null);
  useEffect(() => { if (escolhendo) window.scrollTo(0, 0); }, [escolhendo]);

  if (e.tema < 0 || escolhendo) return <EscolherTema irPara={irPara} onEscolher={(t) => { escolherTema(t); setEscolhendo(false); window.scrollTo(0, 0); }} />;

  const t = e.tema, u = UNIDADES[t];
  const n = nivelTema(e, t);
  const atual = u.licoes.find((i) => liberada(e, i) && e.estrelas[i] == null);
  const avancadoFeito = u.niveis[2].every((i) => e.estrelas[i] != null);
  const prova = desempenhoProvaTema(e, t);
  const bauEstado = e.baus.includes(t) ? 'aberto' : bauLiberado(e, t) ? 'pronto' : 'bloqueado';
  const tremer = (b: HTMLElement) => b.animate?.([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], { duration: 200 });

  // monta o caminho: separador de nível, lições, baú (fim do intermediário) e o nó de prova
  type Item = { tipo: 'nivel'; k: number } | { tipo: 'licao'; i: number } | { tipo: 'bau' } | { tipo: 'prova' };
  const itens: Item[] = [];
  u.niveis.forEach((nv, k) => { itens.push({ tipo: 'nivel', k }); nv.forEach((i) => itens.push({ tipo: 'licao', i })); if (k === 1) itens.push({ tipo: 'bau' }); });
  itens.push({ tipo: 'nivel', k: 3 }, { tipo: 'prova' });
  let passo = 0;

  return (
    <>
      <section className="unidade tema-trilha" style={varsTema(t)}>
        <div className="unidade-cab">
          <EmblemaTema t={t} tamanho={54} className="cab-emblema" />
          <div className="cab-texto">
            <p className="unidade-num">Tema {t + 1} de {UNIDADES.length}</p>
            <h1 className="tema-titulo">{u.nome}</h1>
            <span className="nivel-chip"><EscadaNivel t={t} n={n} tamanho={38} />{NOME_NIVEL_ALUNO[n]}</span>
          </div>
          <button type="button" className="btn-caderno" onClick={() => { som('toque'); setEscolhendo(true); }}><Icone nome="trilha" tamanho={22} />Trocar tema</button>
        </div>

        <div className="tema-caminho">
          <ol className="caminho tema">
            {itens.map((it) => {
              if (it.tipo === 'nivel') {
                const nv = it.k < 3 ? u.niveis[it.k] : [];
                const feito = it.k < 3 ? nv.every((i) => e.estrelas[i] != null) : n >= 4;
                return (
                  <li key={'n' + it.k} className={'nivel-sep' + (feito ? ' feito' : '')}>
                    <span>Nível {it.k + 1} · {NOMES_NIVEL[it.k]}{feito ? ' · concluído' : ''}</span>
                  </li>
                );
              }
              const x = ZIGUE[passo++ % 4];
              const estilo = { '--x': x } as React.CSSProperties;
              if (it.tipo === 'bau') {
                return (
                  <li key="bau" className="item-bau" style={estilo}>
                    <button type="button" className={'bau-no ' + bauEstado} aria-disabled={bauEstado !== 'pronto'}
                      aria-label={bauEstado === 'aberto' ? 'Baú já aberto' : bauEstado === 'pronto' ? 'Abrir o baú: ' + MOEDAS_BAU + ' moedas' : 'Baú trancado: termine as lições anteriores'}
                      onClick={(ev) => {
                        if (bauEstado !== 'pronto') { tremer(ev.currentTarget); return; }
                        const g = abrirBau(t); if (g) { som('nivel'); setGanhoBau(g); setTimeout(() => setGanhoBau(null), 2200); }
                      }}>
                      <Bau estado={bauEstado} />
                    </button>
                    {bauEstado === 'pronto' && <span className="no-nome">Baú liberado!</span>}
                  </li>
                );
              }
              if (it.tipo === 'prova') {
                const temQ = prova.questoes > 0;
                return (
                  <li key="prova" style={estilo}>
                    {avancadoFeito && atual === undefined && n < 4 && <span className="comecar" aria-hidden="true">PROVA</span>}
                    <button type="button" className={'no no-prova' + (avancadoFeito ? (n >= 4 ? '' : ' atual') : ' bloqueado')} aria-disabled={!avancadoFeito}
                      aria-label={(temQ ? 'Questões de Concursos de ' + u.nome : 'Revisão final de ' + u.nome) + (avancadoFeito ? '' : ', bloqueado: termine o nível avançado')}
                      onClick={(ev) => {
                        if (!avancadoFeito) { tremer(ev.currentTarget); return; }
                        if (temQ) irPara('provas/' + encodeURIComponent(u.temas[0]));
                        else iniciar(u.licoes.flatMap((i) => LICOES[i].questoes.map((_, q) => i + '-' + q)));
                      }}>
                      {avancadoFeito ? <Icone nome="precisao" tamanho={32} /> : CADEADO}
                    </button>
                    <span className="no-nome">{temQ ? 'Questões de Concursos' : 'Revisão final do tema'}</span>
                    {temQ && prova.tentativas > 0 && n < 4 && <span className="no-sub">{Math.round(prova.taxa * 100)}% de acerto · {faltamParaProva(prova) === 1 ? 'falta 1 acerto' : 'faltam ' + faltamParaProva(prova) + ' acertos'} para 70%</span>}
                    {temQ && prova.tentativas > 0 && n >= 4 && <span className="no-sub">{Math.round(prova.taxa * 100)}% de acerto · pronto para a prova!</span>}
                  </li>
                );
              }
              const i = it.i, l = LICOES[i], feita = e.estrelas[i] != null, livre = liberada(e, i);
              const cls = feita ? '' : i === atual ? ' atual' : livre ? '' : ' bloqueado';
              const rotulo = l.titulo + (feita ? ', concluída com ' + e.estrelas[i] + ' de 3 estrelas' : livre ? ', disponível' : ', bloqueada: termine a lição anterior');
              const pos = u.licoes.indexOf(i) + 1;
              return (
                <li key={i} style={estilo}>
                  {i === atual && <span className="comecar" aria-hidden="true">{u.licoes.every((j) => e.estrelas[j] == null) ? 'COMEÇAR' : 'PRÓXIMA'}</span>}
                  <button className={'no' + cls} type="button" aria-label={'Lição ' + pos + ': ' + rotulo} aria-disabled={!livre}
                    onClick={(ev) => { if (!livre) { tremer(ev.currentTarget); return; } abrir(i); }}>
                    {feita ? OK : livre ? pos : CADEADO}
                  </button>
                  <span className="no-nome">{l.titulo}</span>
                  {feita && <span className="estrelas" aria-hidden="true">{[0, 1, 2].map((s) => <Icone key={s} nome="estrela" tamanho={16} className={s < e.estrelas[i] ? '' : 'apagada'} />)}</span>}
                </li>
              );
            })}
          </ol>
          <Guia t={t} />
        </div>
        {n >= 4 && <p className="bau">Tema dominado! Selo <strong>{u.selo}</strong> garantido. Que tal <button type="button" className="link" onClick={() => setEscolhendo(true)}>escolher outro tema</button>?</p>}
        {n === 3 && !APP && <p className="bau">Avançado concluído! Aprofunde com o <a href="/guia/">Guia do Raciocínio Lógico</a>.</p>}
      </section>

      {ganhoBau !== null && (
        <div className="bau-ganho" role="status">
          <div className="bau-moedas" aria-hidden="true">{[0, 1, 2, 3, 4].map((k) => <Icone key={k} nome="moeda" tamanho={34} />)}</div>
          <strong>+{ganhoBau} moedas!</strong>
        </div>
      )}
    </>
  );
}
