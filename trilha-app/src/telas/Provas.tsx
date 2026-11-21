// Questões de prova: banco de questões reais de concursos, resolvidas em vídeo no canal.
// Inspirado no que QConcursos e TEC fazem bem (filtros por banca/assunto, caderno de erros, simulado),
// com o diferencial da resolução em vídeo do próprio professor.
import { useEffect, useMemo, useRef, useState } from 'react';
import { BANCAS_PROVA, BANCA_DO_PERFIL, PROVAS, TEMAS_PROVA, type QuestaoProva } from '../dados/provas';
import { registrarProva, registrarSimulado, useEstado } from '../estado';
import { bancaEscolhida } from './BoasVindas';
import { Icone } from '../componentes/Icones';
import { EmblemaTema } from '../componentes/Tema';
import { UNIDADES, varsTema } from '../dados/licoes';
import Lumi from '../componentes/Lumi';
import { BotaoLeitura, BotaoMicrofone, useLeituraAuto } from '../componentes/Voz';
import { som } from '../som';

type Modo = 'todas' | 'novas' | 'erradas';
// etiqueta colorida com a cor do tema da trilha a que a questão pertence
function PilulaTema({ tema }: { tema: string }) {
  const t = UNIDADES.findIndex((u) => u.temas.includes(tema));
  if (t < 0) return <span className="pilula-tema sem">{tema}</span>;
  return <span className="pilula-tema" style={varsTema(t)}><EmblemaTema t={t} tamanho={20} />{tema}</span>;
}
const LETRA = (l: string) => l.toUpperCase();
const embaralhar = <T,>(a: T[]) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const fonte = (q: QuestaoProva) => 'Banca ' + q.banca; // só a banca, sem ano nem órgão

// Vídeo da resolução: só carrega o YouTube quando o aluno toca (página leve e sem rastreio antes do clique)
export function VideoResolucao({ id, titulo }: { id: string; titulo: string }) {
  const [aberto, setAberto] = useState(false);
  if (aberto) {
    return (
      <div className="video-res">
        <iframe src={'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0'} title={'Resolução em vídeo: ' + titulo}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen loading="lazy" />
        <a className="link-yt" href={'https://www.youtube.com/watch?v=' + id} target="_blank" rel="noopener">Abrir no YouTube</a>
      </div>
    );
  }
  return (
    <button type="button" className="video-capa" onClick={() => setAberto(true)} aria-label={'Ver a resolução em vídeo: ' + titulo}>
      <img src={'https://i.ytimg.com/vi/' + id + '/mqdefault.jpg'} alt="" loading="lazy" width="320" height="180" />
      <span className="video-play" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg></span>
      <span className="video-txt">Ver a resolução em vídeo</span>
    </button>
  );
}

function Alternativas({ q, escolha, revelar, onEscolher }: { q: QuestaoProva; escolha: string | null; revelar: boolean; onEscolher: (l: string) => void }) {
  return (
    <div className="opcoes" role="group" aria-label="Alternativas">
      {q.alternativas.map(([l, t]) => {
        const cls = revelar ? (l === q.gabarito ? ' certa' : l === escolha ? ' errada' : '') : '';
        return (
          <button key={l} type="button" className={'opcao' + cls} aria-pressed={escolha === l} disabled={revelar} onClick={() => onEscolher(l)}>
            <span className="tecla" aria-hidden="true">{LETRA(l)}</span><span><span className="sr">Letra {LETRA(l)}: </span>{t}</span>
          </button>
        );
      })}
    </div>
  );
}

// ---------- Simulado cronometrado ----------
function Simulado({ questoes, onFim }: { questoes: QuestaoProva[]; onFim: () => void }) {
  const [pos, setPos] = useState(0);
  const [resp, setResp] = useState<Record<string, string>>({});
  const [inicio] = useState(Date.now());
  const [agora, setAgora] = useState(Date.now());
  const [fim, setFim] = useState<{ ganho: number; segundos: number } | null>(null);
  const [sair, setSair] = useState(false);
  const [avisoVoz, setAvisoVoz] = useState('');
  const acaoRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (fim) return; const t = setInterval(() => setAgora(Date.now()), 1000); return () => clearInterval(t); }, [fim]);
  useEffect(() => { document.getElementById('sim-titulo')?.focus(); setAvisoVoz(''); }, [pos, fim]);
  useLeituraAuto(fim ? 'fim' : 'q' + pos, '');
  const q = questoes[pos];
  const seg = Math.floor(((fim ? inicio + fim.segundos * 1000 : agora) - inicio) / 1000);
  const relogio = String(Math.floor(seg / 60)).padStart(2, '0') + ':' + String(seg % 60).padStart(2, '0');
  const respondidas = Object.keys(resp).length;

  function entregar() {
    const lista = questoes.map((x) => ({ id: x.id, ok: resp[x.id] === x.gabarito }));
    const segundos = (Date.now() - inicio) / 1000;
    const ganho = registrarSimulado(lista, segundos);
    som(lista.filter((x) => x.ok).length / lista.length >= 0.7 ? 'fim' : 'nivel');
    setFim({ ganho, segundos });
  }

  const acertos = questoes.filter((x) => resp[x.id] === x.gabarito).length;
  const pct = Math.round((acertos / questoes.length) * 100);

  return (
    <div className="licao aberta simulado" role="dialog" aria-modal="true" aria-labelledby="sim-titulo">
      <div className="licao-topo">
        <button className="fechar" type="button" onClick={() => (fim || !respondidas ? onFim() : setSair(true))} aria-label="Sair do simulado">×</button>
        <div className="trilho" aria-hidden="true"><span style={{ width: ((fim ? questoes.length : pos) / questoes.length) * 100 + '%' }} /></div>
        <BotaoLeitura />
        <span className="relogio" aria-label={'Tempo: ' + relogio}><Icone nome="relogio" tamanho={22} />{relogio}</span>
      </div>
      <div className="licao-corpo"><div className="wrap" key={fim ? 'fim' : pos}><div className="cartao">
        {fim ? (
          <div className="fim sim-fim">
            <Lumi humor={pct >= 70 ? 'festa' : pct >= 50 ? 'feliz' : 'pensando'} tamanho={84} />
            <h2 id="sim-titulo" tabIndex={-1}>{pct >= 70 ? 'Nota de aprovação!' : pct >= 50 ? 'Quase lá!' : 'Bom treino. Bora revisar!'}</h2>
            <div className="placar">
              <div><b>{acertos}/{questoes.length}</b><small>acertos ({pct}%)</small></div>
              <div><b>{Math.round(fim.segundos / questoes.length)} s</b><small>por questão</small></div>
              <div><b>+{fim.ganho}</b><small>XP</small></div>
            </div>
            <p className="lead">{pct >= 70 ? 'Na maioria dos concursos, 70% em Raciocínio Lógico já te deixa bem colocado.' : 'Veja abaixo a correção. As que você errou ficam no filtro "Que errei" para treinar de novo.'}</p>
            <ol className="sim-correcao">
              {questoes.map((x, k) => {
                const ok = resp[x.id] === x.gabarito;
                return (
                  <li key={x.id} className={ok ? 'ok' : 'erro'}>
                    <details>
                      <summary>
                        <span className="sim-marca" aria-hidden="true">{ok ? <Icone nome="verdade" tamanho={18} /> : '✗'}</span>
                        <span><strong>Questão {k + 1}</strong> <PilulaTema tema={x.tema} /><small>{ok ? 'Acertou' : resp[x.id] ? 'Você marcou ' + LETRA(resp[x.id]) + ', gabarito ' + LETRA(x.gabarito) : 'Em branco, gabarito ' + LETRA(x.gabarito)}</small></span>
                      </summary>
                      <p className="sim-enun">{x.enunciado}</p>
                      {x.resolucao && <div className="resolucao"><strong>Resolução</strong><p>{x.resolucao}</p></div>}
                      {x.video && <VideoResolucao id={x.video} titulo={'questão ' + (k + 1)} />}
                    </details>
                  </li>
                );
              })}
            </ol>
          </div>
        ) : (
          <>
            <p className="rotulo">Questão {pos + 1} de {questoes.length} · {fonte(q)}</p>
            <h2 id="sim-titulo" tabIndex={-1} className="enunciado">{q.enunciado}</h2>
            <Alternativas q={q} escolha={resp[q.id] ?? null} revelar={false} onEscolher={(l) => { som('toque'); setResp({ ...resp, [q.id]: l }); }} />
          </>
        )}
      </div></div></div>
      <div className="licao-base">
        <div className="wrap">
          <div className="retorno" aria-live="polite">{avisoVoz ? <span className="aviso-voz">{avisoVoz}</span> : !fim && <span className="nota">{respondidas} de {questoes.length} respondidas · o gabarito sai no fim</span>}</div>
          {!fim && <BotaoMicrofone acao={() => acaoRef.current?.click()} aviso={setAvisoVoz} />}
          {fim
            ? <button className="btn btn-ok" type="button" onClick={onFim}>Concluir</button>
            : pos < questoes.length - 1
              ? <button ref={acaoRef} className="btn btn-ok" type="button" onClick={() => setPos(pos + 1)}>{resp[q.id] ? 'Próxima' : 'Pular'}</button>
              : <button ref={acaoRef} className="btn btn-ok" type="button" onClick={entregar}>Entregar simulado</button>}
        </div>
      </div>
      {sair && (
        <div className="sim-sair" role="alertdialog" aria-modal="true" aria-labelledby="sair-t">
          <div className="card">
            <h2 id="sair-t">Sair do simulado?</h2>
            <p>Você respondeu {respondidas} de {questoes.length}. Se sair agora, essas respostas não contam.</p>
            <button type="button" className="btn btn-ok largo" onClick={() => setSair(false)}>Continuar o simulado</button>
            <button type="button" className="btn largo perigo" onClick={onFim}>Sair e descartar</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Tela principal ----------
export default function Provas({ irPara, temaInicial }: { irPara: (r: string) => void; temaInicial?: string }) {
  const e = useEstado();
  const perfil = BANCA_DO_PERFIL[bancaEscolhida()];
  const [banca, setBanca] = useState(() => (perfil && BANCAS_PROVA.some(([b]) => b === perfil) ? perfil : ''));
  const [tema, setTema] = useState(temaInicial && TEMAS_PROVA.some(([t]) => t === temaInicial) ? temaInicial : '');
  const [modo, setModo] = useState<Modo>('todas');
  const [idx, setIdx] = useState(0);
  const [escolha, setEscolha] = useState<string | null>(null);
  const [revelar, setRevelar] = useState(false);
  const [ganho, setGanho] = useState(0);
  const [simulado, setSimulado] = useState<QuestaoProva[] | null>(null);
  const [semente] = useState(() => Math.random());

  const lista = useMemo(() => PROVAS.filter((q) => (!banca || q.banca === banca) && (!tema || q.tema === tema)
    && (modo === 'todas' || (modo === 'novas' ? !e.provas[q.id] : e.provas[q.id] && !e.provas[q.id].u)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [banca, tema, modo, semente, revelar ? '' : e.provas]);
  useEffect(() => { setIdx(0); setEscolha(null); setRevelar(false); }, [banca, tema, modo]);

  const q = lista[Math.min(idx, lista.length - 1)];
  const resolvidas = Object.keys(e.provas).filter((k) => PROVAS.some((p) => p.id === k));
  const acertosTot = resolvidas.reduce((s, k) => s + e.provas[k].a, 0), tentTot = resolvidas.reduce((s, k) => s + e.provas[k].t, 0);
  const erradas = PROVAS.filter((p) => e.provas[p.id] && !e.provas[p.id].u).length;

  const filtradas = PROVAS.filter((x) => (!banca || x.banca === banca) && (!tema || x.tema === tema));
  const baseSim = filtradas.length >= 5 ? filtradas : PROVAS; // com poucas questões no filtro, o simulado usa o banco todo
  const nSim = Math.min(10, baseSim.length);
  function responder() {
    if (!q || !escolha) return;
    const ok = escolha === q.gabarito;
    som(ok ? 'certo' : 'erro');
    setGanho(registrarProva(q.id, ok));
    setRevelar(true);
  }
  function proxima() {
    // em "Não resolvidas" a questão respondida sai da lista; em "Que errei" sai se acertou: o índice fica no lugar
    const sai = revelar && (modo === 'novas' || (modo === 'erradas' && escolha === q?.gabarito));
    const n = sai ? lista.length - 1 : lista.length;
    setEscolha(null); setRevelar(false); setGanho(0); setIdx((i) => { const j = sai ? i : i + 1; return j >= n ? 0 : j; }); document.getElementById('prova-q')?.scrollIntoView({ block: 'start', behavior: 'smooth' }); }
  function comecarSimulado() {
    const fonteSim = baseSim;
    const novas = embaralhar(fonteSim.filter((x) => !e.provas[x.id])), velhas = embaralhar(fonteSim.filter((x) => e.provas[x.id]));
    som('toque'); setSimulado([...novas, ...velhas].slice(0, 10));
  }

  return (
    <div className="provas">
      <p className="voltar"><button type="button" className="link" onClick={() => irPara('praticar')}>‹ Praticar</button></p>
      <h1>Questões de Concursos</h1>

      <div className="prova-stats" role="list">
        <div role="listitem"><b>{resolvidas.length}<small>/{PROVAS.length}</small></b><span>resolvidas</span></div>
        <div role="listitem"><b>{tentTot ? Math.round((acertosTot / tentTot) * 100) + '%' : '–'}</b><span>de acerto</span></div>
        <div role="listitem"><b>{e.simulados.length}</b><span>simulados</span></div>
      </div>

      <section className="card sim-card" aria-labelledby="sim-t">
        <Icone nome="relogio" tamanho={34} />
        <div><h2 id="sim-t">Simulado cronometrado</h2><p>{nSim} questões{baseSim === PROVAS ? '' : ' de ' + [banca, tema].filter(Boolean).join(' · ')}, gabarito só no fim, como na prova.</p></div>
        <button type="button" className="btn btn-pri" onClick={comecarSimulado}>Fazer simulado</button>
      </section>

      <section className="filtros" aria-label="Filtros">
        <label className="campo">Banca
          <select value={banca} onChange={(ev) => setBanca(ev.target.value)}>
            <option value="">Todas as bancas ({PROVAS.length})</option>
            {BANCAS_PROVA.map(([b, n]) => <option key={b} value={b}>{b} ({n})</option>)}
          </select>
        </label>
        <label className="campo">Assunto
          <select value={tema} onChange={(ev) => setTema(ev.target.value)}>
            <option value="">Todos os assuntos</option>
            {TEMAS_PROVA.map(([t, n]) => <option key={t} value={t}>{t} ({n})</option>)}
          </select>
        </label>
        <div className="segmento" role="radiogroup" aria-label="Quais questões">
          {([['todas', 'Todas'], ['novas', 'Não resolvidas'], ['erradas', 'Que errei' + (erradas ? ' (' + erradas + ')' : '')]] as [Modo, string][]).map(([m, n]) => (
            <button key={m} type="button" role="radio" aria-checked={modo === m} className={modo === m ? 'sel' : ''} onClick={() => setModo(m)}>{n}</button>
          ))}
        </div>
      </section>

      {!q ? (
        <div className="card vazio">
          <Lumi humor={modo === 'erradas' ? 'festa' : 'pensando'} tamanho={76} />
          <h2>{modo === 'erradas' ? 'Nenhum erro para refazer!' : modo === 'novas' ? 'Você já resolveu todas destes filtros' : 'Nenhuma questão com esses filtros'}</h2>
          <p>{modo === 'erradas' ? 'Tudo o que você errou já foi acertado depois. Muito bem!' : 'Troque a banca ou o assunto para ver mais questões.'}</p>
          <button type="button" className="btn btn-ok" onClick={() => { setBanca(''); setTema(''); setModo('todas'); }}>Ver todas as questões</button>
        </div>
      ) : (
        <article className="card prova-q" id="prova-q" aria-labelledby="prova-enun">
          <p className="rotulo">{Math.min(idx, lista.length - 1) + 1} de {lista.length} · {fonte(q)}</p>
          <p className="prova-tema"><PilulaTema tema={q.tema} />{e.provas[q.id] && !revelar ? (e.provas[q.id].u ? ' · você já acertou' : ' · você errou antes') : ''}</p>
          <h2 id="prova-enun" className="enunciado">{q.enunciado}</h2>
          <Alternativas q={q} escolha={escolha} revelar={revelar} onEscolher={(l) => { som('toque'); setEscolha(l); }} />
          {revelar && (
            <div className={'prova-ret ' + (escolha === q.gabarito ? 'ok' : 'erro')} role="status">
              <strong>{escolha === q.gabarito ? 'Certa! Gabarito: letra ' + LETRA(q.gabarito) : 'Não foi dessa vez. Gabarito: letra ' + LETRA(q.gabarito)}</strong>
              {ganho > 0 && <span className="chip">+{ganho} XP</span>}
            </div>
          )}
          {revelar && q.video && <VideoResolucao id={q.video} titulo={q.tema} />}
          {revelar && q.resolucao && <div className="resolucao"><strong>Resolução</strong><p>{q.resolucao}</p></div>}
          {revelar && !q.video && !q.resolucao && <p className="nota">Gabarito oficial da banca.</p>}
          <div className="prova-acoes">
            {revelar
              ? <button type="button" className="btn btn-ok largo" onClick={proxima}>Próxima questão</button>
              : <><button type="button" className="btn btn-ok largo" disabled={!escolha} onClick={responder}>Responder</button>
                <button type="button" className="link" onClick={proxima}>Pular esta</button></>}
          </div>
        </article>
      )}

      {simulado && <Simulado questoes={simulado} onFim={() => setSimulado(null)} />}
    </div>
  );
}
