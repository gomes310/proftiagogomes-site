import { useEffect, useMemo, useRef, useState } from 'react';
import { EXTRA, LICOES, UNIDADES } from '../dados/licoes';
import type { Questao } from '../dados/tipos';
import { LABS, bol } from '../labs/labs';
import { registrarLicao, registrarResposta, type ResultadoLicao } from '../estado';
import { alternarSom, som, somLigado } from '../som';
import { confete } from '../componentes/confete';
import { APP } from '../plataforma';
import { vibrar } from '../nativo';

type Passo = { tipo: 'ideia'; t: string; k: number } | { tipo: 'lab' } | { tipo: 'exemplo' } | { tipo: 'vf' };
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
    const p: Passo[] = L.teoria.map((t, k) => ({ tipo: 'ideia' as const, t, k }));
    if (LABS[idx]) p.push({ tipo: 'lab' });
    p.push({ tipo: 'exemplo' }, { tipo: 'vf' });
    return p;
  }, [idx, L]);
  const total = L.questoes.length;

  const [etapa, setEtapa] = useState<'aprenda' | 'questao' | 'fim'>('aprenda');
  const [passo, setPasso] = useState(0);
  const [revelado, setRevelado] = useState(false);
  const [vf, setVf] = useState<boolean | null>(null);
  const [fila, setFila] = useState<Item[]>(() => L.questoes.map((q) => ({ q, tentativa: 0 })));
  const [escolha, setEscolha] = useState<number | null>(null);
  const [verificado, setVerificado] = useState<null | { ok: boolean; item: Item }>(null);
  const [combo, setCombo] = useState(0);
  const [acertosPrimeira, setAcertosPrimeira] = useState(0);
  const [resultado, setResultado] = useState<ResultadoLicao | null>(null);
  const [sons, setSons] = useState(somLigado());
  const acaoRef = useRef<HTMLButtonElement>(null);
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
    registrarResposta(ok, novoCombo);
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
      <p className="grande" aria-label={r.estrelas + ' de 3 estrelas'}>{[0, 1, 2].map((i) => <span key={i} className={i < r.estrelas ? '' : 'apagada'}>★</span>)}</p>
      <h2 id="licao-titulo">{r.estrelas === 3 ? 'Lição perfeita!' : 'Lição concluída!'}</h2>
      <div className="placar">
        <div><b>+{r.ganho + r.bonusMissoes}</b><small>XP</small></div>
        <div><b>{acertosPrimeira}/{total}</b><small>de primeira</small></div>
        <div><b>{Math.round(acertosPrimeira / total * 100)}%</b><small>precisão</small></div>
      </div>
      {(r.nivelDepois > r.nivelAntes || r.metaBatida || r.missoesConcluidas.length > 0 || r.novasConquistas.length > 0) && (
        <ul className="ganhos" aria-label="O que você ganhou">
          {r.nivelDepois > r.nivelAntes && <li className="destaque">⬆️ Nível {r.nivelDepois}!</li>}
          {r.metaBatida && <li>🎯 Meta do dia batida</li>}
          {r.missoesConcluidas.map((m) => <li key={m.id}>✅ {m.titulo} <small>+{m.bonus} XP</small></li>)}
          {r.novasConquistas.map((c) => <li key={c.id}>{c.icone} {c.nome}</li>)}
        </ul>
      )}
      {u && <div className="conquista"><strong>🏅 Selo conquistado: {u.selo}</strong>{APP ? <p>Você fechou a {u.nome.split(' · ')[0]}. Siga para a próxima unidade!</p> : <><p>Você fechou a {u.nome.split(' · ')[0]}. Quer se aprofundar? O Guia do RLM tem a teoria completa e muitas questões resolvidas.</p><a className="btn btn-guia" href="https://proftiagogomes.com.br/guia/" target="_blank" rel="noopener">Conhecer o Guia do RLM</a></>}</div>}
      <p><a href={'https://wa.me/?text=' + compart} target="_blank" rel="noopener">Compartilhar no WhatsApp</a></p>
    </div>;
  }

  const base = etapa === 'questao' && verificado ? (verificado.ok ? ' acerto' : ' erro') : etapa === 'aprenda' && p.tipo === 'vf' && vf !== null ? (vf === E.vf.v ? ' acerto' : ' erro') : '';
  let retorno: React.ReactNode = null;
  if (etapa === 'questao' && verificado) retorno = <><strong>{verificado.ok ? (combo >= 2 ? '🔥 ' + combo + ' seguidas!' : elogio.current) : <>Resposta certa: <Html h={verificado.item.q.o[verificado.item.q.c]} /></>}</strong><Html h={verificado.item.q.e} /></>;
  else if (etapa === 'aprenda' && p.tipo === 'vf' && vf !== null) retorno = <><strong>{vf === E.vf.v ? 'Isso! Agora é hora de praticar.' : 'Quase! A resposta é ' + (E.vf.v ? 'verdadeiro' : 'falso') + '.'}</strong><Html h={E.vf.e} /></>;
  else if (etapa === 'aprenda' && p.tipo === 'exemplo' && !revelado) retorno = <span className="dica-base">Tente responder de cabeça antes de abrir.</span>;

  return (
    <div className="licao aberta" role="dialog" aria-modal="true" aria-labelledby="licao-titulo">
      <div className="licao-topo">
        <button className="fechar" type="button" onClick={onFechar} aria-label="Sair da lição">×</button>
        <div className="trilho" aria-hidden="true"><span style={{ width: progresso * 100 + '%' }} /></div>
        {combo >= 2 && etapa === 'questao' && <span className="combo" aria-label={combo + ' acertos seguidos'}>🔥 {combo}</span>}
        <button className="fechar som" type="button" aria-pressed={sons} aria-label={sons ? 'Desligar sons' : 'Ligar sons'} onClick={() => setSons(alternarSom())}>{sons ? '🔊' : '🔇'}</button>
      </div>
      <div className="licao-corpo"><div className="wrap" key={etapa + passo + fila.length}><div className="cartao">{corpo}</div></div></div>
      <div className={'licao-base' + base}><div className="wrap">
        <div className="retorno" aria-live="polite">{retorno}</div>
        <button ref={acaoRef} className="btn btn-ok" type="button" disabled={!acaoOk} onClick={acao}>{acaoTexto}</button>
      </div></div>
    </div>
  );
}
