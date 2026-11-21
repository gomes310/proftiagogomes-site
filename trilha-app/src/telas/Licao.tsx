import { useEffect, useMemo, useRef, useState } from 'react';
import { EXTRA, LICOES, UNIDADES } from '../dados/licoes';
import type { Questao } from '../dados/tipos';
import { LABS, bol } from '../labs/labs';
import { registrarLicao, registrarResposta, type ResultadoLicao } from '../estado';
import { alternarSom, som, somLigado } from '../som';
import { confete } from '../componentes/confete';
import { APP } from '../plataforma';
import { vibrar } from '../nativo';
import { CONTEUDO } from '../dados/imersao';
import Pares from '../componentes/Pares';
import Lumi, { Efe, Ve } from '../componentes/Lumi';
import { Icone, Selo } from '../componentes/Icones';
import { SIMBOLO_UNIDADE } from '../estado';
import { EmblemaTema, EscadaNivel } from '../componentes/Tema';
import { NOME_NIVEL_ALUNO, temaDaLicao } from '../estado';
import { varsTema } from '../dados/licoes';
import { BotaoLeitura, BotaoMicrofone, LumiFalando, useLeituraAuto } from '../componentes/Voz';

type Passo = { tipo: 'imersao' } | { tipo: 'ideia'; t: string; k: number } | { tipo: 'lab' } | { tipo: 'pares' } | { tipo: 'exemplo' } | { tipo: 'vf' };
type Item = { q: Questao; tentativa: number };
const REDUZ = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const ELOGIOS = ['Mandou bem!', 'Isso aí!', 'Perfeito!', 'Boa!', 'Certíssimo!'];

function Lab({ idx }: { idx: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) { ref.current.innerHTML = LABS[idx].html; LABS[idx].init(ref.current); } }, [idx]);
  return <div className="lab" ref={ref} />;
}
const Html = ({ h, as: Tag = 'span', ...r }: { h: string; as?: 'span' | 'h2' | 'p' | 'div'; className?: string; id?: string }) => <Tag {...r} dangerouslySetInnerHTML={{ __html: h }} />;

export default function TelaLicao({ idx, onFechar }: { idx: number; onFechar: () => void }) {
  const L = LICOES[idx];
  const E = EXTRA[idx];
  const passos = useMemo<Passo[]>(() => {
    // Rosetta Stone: primeiro os exemplos, o aluno descobre a regra; depois a explicação
    const p: Passo[] = [{ tipo: 'imersao' }, ...L.teoria.map((t, k) => ({ tipo: 'ideia' as const, t, k }))];
    if (LABS[idx]) p.push({ tipo: 'lab' });
    p.push({ tipo: 'pares' });
    p.push({ tipo: 'exemplo' }, { tipo: 'vf' });
    return p;
  }, [idx, L]);
  const total = L.questoes.length;

  const [etapa, setEtapa] = useState<'aprenda' | 'questao' | 'fim'>('aprenda');
  const [passo, setPasso] = useState(0);
  const [revelado, setRevelado] = useState(false);
  const [vf, setVf] = useState<boolean | null>(null);
  const [imer, setImer] = useState<number | null>(null);
  const [paresOk, setParesOk] = useState(false);
  const C = CONTEUDO[idx];
  // embaralha as opções da imersão (a certa não fica sempre em primeiro)
  const ordemImer = useMemo(() => C.imersao.opcoes.map((_, k) => (k + idx) % C.imersao.opcoes.length), [idx, C]);
  const [fila, setFila] = useState<Item[]>(() => L.questoes.map((q) => ({ q, tentativa: 0 })));
  const [escolha, setEscolha] = useState<number | null>(null);
  const [verificado, setVerificado] = useState<null | { ok: boolean; item: Item }>(null);
  const [combo, setCombo] = useState(0);
  const [acertosPrimeira, setAcertosPrimeira] = useState(0);
  const [resultado, setResultado] = useState<ResultadoLicao | null>(null);
  const [sons, setSons] = useState(somLigado());
  const acaoRef = useRef<HTMLButtonElement>(null);
  const [avisoVoz, setAvisoVoz] = useState('');
  useEffect(() => setAvisoVoz(''), [etapa, passo, fila.length, escolha]);
  const elogio = useRef(ELOGIOS[0]);

  const respondidas = total - fila.length;
  const progresso = etapa === 'fim' ? 1 : etapa === 'aprenda' ? passo / (passos.length + total) : (passos.length + respondidas) / (passos.length + total);

  useEffect(() => { const h = document.getElementById('licao-titulo'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); } }, [etapa, passo, fila.length]);
  useEffect(() => { document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = ''; document.querySelectorAll('.confete').forEach((c) => c.remove()); }; }, []);

  // ---------- ações ----------
  const p = passos[passo];
  let acaoTexto = 'Continuar', acaoOk = true, acao: () => void = () => setPasso(passo + 1);
  if (etapa === 'aprenda') {
    if (p.tipo === 'exemplo' && !revelado) acaoOk = false;
    if (p.tipo === 'imersao') acaoOk = imer !== null;
    if (p.tipo === 'pares') acaoOk = paresOk;
    if (p.tipo === 'vf') { acaoTexto = 'Praticar'; acaoOk = vf !== null; acao = () => setEtapa('questao'); }
  } else if (etapa === 'questao') {
    if (!verificado) { acaoTexto = 'Verificar'; acaoOk = escolha !== null; acao = verificar; }
    else { acaoTexto = 'Continuar'; acao = proxima; }
  } else { acaoTexto = 'Continuar a trilha'; acao = onFechar; }

  function verificar() {
    if (escolha === null) return;
    const item = fila[0];
    const ok = escolha === item.q.c;
    const novoCombo = ok ? combo + 1 : 0;
    setCombo(novoCombo);
    if (ok && !item.tentativa) setAcertosPrimeira((n) => n + 1);
    elogio.current = ELOGIOS[Math.floor(Math.random() * ELOGIOS.length)];
    registrarResposta(ok, novoCombo, idx + '-' + L.questoes.indexOf(item.q));
    som(ok ? 'certo' : 'erro'); vibrar(ok ? 'certo' : 'erro');
    setVerificado({ ok, item });
  }
  function proxima() {
    const v = verificado!;
    let nova = fila.slice(1);
    if (!v.ok) nova = [...nova, { q: v.item.q, tentativa: v.item.tentativa + 1 }];
    setVerificado(null); setEscolha(null);
    if (nova.length) { setFila(nova); return; }
    setFila(nova);
    const r = registrarLicao(idx, acertosPrimeira, total);
    setResultado(r); setEtapa('fim');
    som(r.nivelDepois > r.nivelAntes ? 'nivel' : 'fim'); vibrar('fim');
    if (r.estrelas === 3 || r.unidadeFechada !== null || r.nivelDepois > r.nivelAntes) confete();
  }

  // teclado: Enter continua, 1–4 escolhe, Esc sai
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      const t = (e.target as HTMLElement).tagName;
      if (e.key === 'Escape') { onFechar(); return; }
      if (t === 'INPUT' || (t === 'BUTTON' && e.key === 'Enter')) return;
      if (e.key === 'Enter' && acaoOk) { e.preventDefault(); acaoRef.current?.click(); }
      else if (etapa === 'questao' && !verificado && /^[1-4]$/.test(e.key)) { const k = Number(e.key) - 1; if (k < fila[0].q.o.length) setEscolha(k); }
    };
    document.addEventListener('keydown', f);
    return () => document.removeEventListener('keydown', f);
  });

  // ---------- telas ----------
  let corpo: React.ReactNode = null;
  if (etapa === 'aprenda') {
    const topo = (
      <div className="passo-topo">
        <p className="rotulo">Lição {idx + 1} de {LICOES.length} · {L.titulo}</p>
        {passo > 0 && <button type="button" className="voltar" onClick={() => setPasso(passo - 1)}>‹ Voltar</button>}
      </div>
    );
    if (p.tipo === 'ideia') corpo = <>{topo}<p className="contador">Ideia {p.k + 1} de {L.teoria.length}</p>
      <Html as="h2" h={p.t} className="ideia" id="licao-titulo" />
      <div className="pontos" aria-hidden="true">{L.teoria.map((_, k) => <i key={k} className={k <= p.k ? 'on' : ''} />)}</div></>;
    else if (p.tipo === 'imersao') corpo = <>{topo}<p className="contador">Descubra a regra</p>
      <div className="imersao">
        <Lumi humor={imer === null ? 'pensando' : imer === C.imersao.c ? 'festa' : 'feliz'} tamanho={64} className="imersao-lumi" />
        <ol className="exemplos" aria-label="Exemplos">
          {C.imersao.exemplos.map(([a, b], k) => <li key={k} style={{ animationDelay: k * 0.18 + 's' }}><span>{a}</span><b aria-hidden="true">→</b><strong>{b}</strong></li>)}
        </ol>
      </div>
      <h2 id="licao-titulo">{C.imersao.pergunta}</h2>
      <div className="opcoes" role="group" aria-label="Sua resposta">
        {ordemImer.map((k, pos) => {
          const o = C.imersao.opcoes[k];
          const cls = imer === null ? '' : k === C.imersao.c ? ' certa' : k === imer ? ' errada' : '';
          return <button key={k} type="button" className={'opcao' + cls} disabled={imer !== null} onClick={() => { setImer(k); const ok = k === C.imersao.c; som(ok ? 'certo' : 'erro'); vibrar(ok ? 'certo' : 'erro'); }}><span className="tecla" aria-hidden="true">{pos + 1}</span>{o}</button>;
        })}
      </div></>;
    else if (p.tipo === 'pares') corpo = <>{topo}<p className="contador">Ligue os pares</p><h2 id="licao-titulo">Toque em um item de cada lado para formar os pares.</h2>
      <Pares pares={C.pares} semente={idx + 3} onFim={() => setParesOk(true)} />
      {paresOk && <p className="pares-ok" role="status"><Lumi humor="festa" tamanho={36} /> Todos os pares certos!</p>}</>;
    else if (p.tipo === 'lab') corpo = <>{topo}<p className="contador">Experimente</p><Html as="h2" h={LABS[idx].dica} id="licao-titulo" /><Lab idx={idx} /></>;
    else if (p.tipo === 'exemplo') corpo = <>{topo}<p className="contador">Exemplo resolvido</p><Html as="h2" h={E.ex[0]} id="licao-titulo" />
      {!revelado ? <button type="button" className="revelar" onClick={() => { som('toque'); setRevelado(true); }}>Pense um pouco e toque para ver a resolução</button>
        : <div className="caixa-ex"><strong>Resolução:</strong> <Html h={E.ex[1]} /></div>}</>;
    else corpo = <>{topo}<p className="contador">Verdadeiro ou falso?</p><Html as="h2" h={E.vf.t} id="licao-titulo" />
      <div className="vf" role="group" aria-label="Sua resposta">
        {[true, false].map((v) => {
          const cls = vf === null ? '' : v === E.vf.v ? ' certa' : v === vf ? ' errada' : '';
          return <button key={String(v)} type="button" className={'opcao vf-b' + cls} disabled={vf !== null}
            onClick={() => { setVf(v); som(v === E.vf.v ? 'certo' : 'erro'); vibrar(v === E.vf.v ? 'certo' : 'erro'); }}><Html h={bol(v)} /> {v ? 'Verdadeiro' : 'Falso'}</button>;
        })}
      </div></>;
  } else if (etapa === 'questao') {
    const item = verificado ? verificado.item : fila[0];
    corpo = <>
      <p className="rotulo">{item.tentativa ? 'Tente de novo' : 'Exercício'}</p>
      <Html as="h2" h={item.q.p} id="licao-titulo" />
      <div className="opcoes" role="group" aria-label="Alternativas">
        {item.q.o.map((t, k) => {
          let cls = 'opcao';
          if (verificado) { if (k === item.q.c) cls += ' certa'; else if (k === escolha) cls += ' errada'; }
          return <button key={k} type="button" className={cls} aria-pressed={escolha === k} disabled={!!verificado}
            onClick={() => setEscolha(k)}
            ref={(b) => { if (b && verificado?.ok && k === item.q.c && !REDUZ && b.animate) b.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.04)' }, { transform: 'scale(1)' }], { duration: 260 }); }}>
            <span className="tecla" aria-hidden="true">{k + 1}</span><Html h={t} /></button>;
        })}
      </div>
    </>;
  } else if (resultado) {
    const r = resultado;
    const u = r.unidadeFechada !== null ? UNIDADES[r.unidadeFechada] : null;
    const compart = encodeURIComponent((u ? 'Ganhei o selo "' + u.selo + '" na' : 'Estou fazendo a') + ' Trilha do RLM, grátis, do Prof. Tiago Gomes: https://proftiagogomes.com.br/trilha/');
    corpo = <div className="fim">
      {r.nivelTemaDepois > r.nivelTemaAntes && (
        <div className="marco" role="status">
          <EmblemaTema t={r.tema} tamanho={56} />
          <div>
            <strong>Novo nível em {UNIDADES[r.tema].nome}!</strong>
            <small><EscadaNivel t={r.tema} n={r.nivelTemaDepois} tamanho={40} /> Agora você é <b>{NOME_NIVEL_ALUNO[r.nivelTemaDepois]}</b>{r.nivelTemaDepois === 3 ? '. Falta o nível Prova!' : r.nivelTemaDepois < 3 ? '. O próximo nível já está liberado.' : ''}</small>
          </div>
        </div>
      )}
      <div className="fim-turma" aria-hidden="true">
        <Ve humor={r.estrelas >= 2 ? 'festa' : 'feliz'} tamanho={62} className="entra" />
        <Lumi humor={r.estrelas === 3 ? 'festa' : 'feliz'} tamanho={88} />
        <Efe humor={r.estrelas === 3 ? 'festa' : 'acenando'} tamanho={62} className="entra atraso" />
      </div>
      <p className="grande" role="img" aria-label={r.estrelas + ' de 3 estrelas'}>{[0, 1, 2].map((i) => <Icone key={i} nome="estrela" tamanho={52} className={i < r.estrelas ? '' : 'apagada'} />)}</p>
      <h2 id="licao-titulo">{r.estrelas === 3 ? 'Lição perfeita!' : 'Lição concluída!'}</h2>
      {r.estrelas < 3 && <p className="quase">{total - acertosPrimeira - (r.estrelas === 2 ? 0 : 1) <= 1 ? 'Faltou 1 acerto de primeira' : 'Faltaram ' + (total - acertosPrimeira - (r.estrelas === 2 ? 0 : 1)) + ' acertos de primeira'} para {r.estrelas === 2 ? '3' : '2'} estrelas. Dá para refazer a lição quando quiser.</p>}
      <div className="placar">
        <div><b>+{r.ganho + r.bonusMissoes}</b><small>XP</small></div>
        <div><b>+{r.moedas}</b><small>moedas</small></div>
        <div><b>{acertosPrimeira}/{total}</b><small>de primeira</small></div>
        <div><b>{Math.round(acertosPrimeira / total * 100)}%</b><small>precisão</small></div>
      </div>
      {(r.metaBatida || r.missoesConcluidas.length > 0 || r.novasConquistas.length > 0) && (
        <ul className="ganhos" aria-label="O que você ganhou">
          {r.metaBatida && <li><Icone nome="meta" tamanho={20} /> Meta do dia batida</li>}
          {r.missoesConcluidas.map((m) => <li key={m.id}><Icone nome="missaoFeita" tamanho={20} /> {m.titulo} <small>+{m.bonus} XP</small></li>)}
          {r.novasConquistas.map((c) => <li key={c.id}><Selo simbolo={c.simbolo} cor={c.cor} tamanho={22} /> {c.nome}</li>)}
        </ul>
      )}
      {u && <div className="conquista"><strong className="selo-titulo"><Selo simbolo={SIMBOLO_UNIDADE[r.unidadeFechada!]} cor="ouro" tamanho={30} /> Selo conquistado: {u.selo}</strong>{APP ? <p>Você fechou a {u.nome.split(' · ')[0]}. Siga para a próxima unidade!</p> : <><p>Você fechou a {u.nome.split(' · ')[0]}. Quer se aprofundar? O Guia do RLM tem a teoria completa e muitas questões resolvidas.</p><a className="btn btn-guia" href="https://proftiagogomes.com.br/guia/" target="_blank" rel="noopener">Conhecer o Guia do RLM</a></>}</div>}
      <p><a href={'https://wa.me/?text=' + compart} target="_blank" rel="noopener">Compartilhar no WhatsApp</a></p>
    </div>;
  }

  const base = etapa === 'questao' && verificado ? (verificado.ok ? ' acerto' : ' erro')
    : etapa === 'aprenda' && p.tipo === 'vf' && vf !== null ? (vf === E.vf.v ? ' acerto' : ' erro')
      : etapa === 'aprenda' && p.tipo === 'imersao' && imer !== null ? (imer === C.imersao.c ? ' acerto' : ' erro') : '';
  let retorno: React.ReactNode = null;
  if (etapa === 'questao' && verificado) retorno = <><strong>{verificado.ok ? (combo >= 2 ? <><Icone nome="ofensiva" tamanho={20} /> {combo} seguidas!</> : elogio.current) : <>Resposta certa: <Html h={verificado.item.q.o[verificado.item.q.c]} /></>}</strong><Html h={verificado.item.q.e} /></>;
  else if (etapa === 'aprenda' && p.tipo === 'imersao' && imer !== null) retorno = <><strong>{imer === C.imersao.c ? 'Você descobriu a regra!' : 'Quase! Veja de novo os exemplos.'}</strong>{C.imersao.e}</>;
  else if (etapa === 'aprenda' && p.tipo === 'vf' && vf !== null) retorno = <><strong>{vf === E.vf.v ? 'Isso! Agora é hora de praticar.' : 'Quase! A resposta é ' + (E.vf.v ? 'verdadeiro' : 'falso') + '.'}</strong><Html h={E.vf.e} /></>;
  else if (etapa === 'aprenda' && p.tipo === 'exemplo' && !revelado) retorno = <span className="dica-base">Tente responder de cabeça antes de abrir.</span>;

  const chaveTela = etapa + '-' + passo + '-' + fila.length + (resultado ? '-fim' : '');
  useLeituraAuto(chaveTela, base ? chaveTela + base + (verificado ? respondidas : '') : '');
  return (
    <div style={varsTema(temaDaLicao(idx))} className="licao aberta" role="dialog" aria-modal="true" aria-labelledby="licao-titulo">
      <div className="licao-topo">
        <button className="fechar" type="button" onClick={onFechar} aria-label="Sair da lição">×</button>
        <div className="trilho" aria-hidden="true"><span style={{ width: progresso * 100 + '%' }} /></div>
        {combo >= 2 && etapa === 'questao' && <span className="combo" aria-label={combo + ' acertos seguidos'}><Icone nome="ofensiva" tamanho={22} />{combo}</span>}
        <BotaoLeitura />
        <button className="fechar som" type="button" aria-pressed={sons} aria-label={sons ? 'Desligar sons' : 'Ligar sons'} onClick={() => setSons(alternarSom())}><Icone nome={sons ? 'som' : 'semSom'} /></button>
      </div>
      <div className="licao-corpo"><div className="wrap" key={etapa + passo + fila.length}><div className="cartao">{corpo}</div></div></div>
      <div className={'licao-base' + base}><div className="wrap">
        <LumiFalando esconder={!!base} />
        {base && retorno && <span className="reacao" aria-hidden="true">{base === ' acerto' ? <Ve key="ve" humor="festa" tamanho={64} /> : <Efe key="efe" humor="ops" tamanho={64} />}</span>}
        <div className="retorno" aria-live="polite">{avisoVoz ? <span className="aviso-voz">{avisoVoz}</span> : retorno}</div>
        {etapa !== 'fim' && !resultado && <BotaoMicrofone acao={() => acaoRef.current && !acaoRef.current.disabled && acaoRef.current.click()} aviso={setAvisoVoz} />}
        <button ref={acaoRef} className={'btn btn-ok' + (resultado ? ' btn-tema' : '')} type="button" disabled={!acaoOk} onClick={acao}>{acaoTexto}</button>
      </div></div>
    </div>
  );
}
