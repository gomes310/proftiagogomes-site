// Comunidade: testadores relatam erros e ideias; o professor publica as boas ideias para votação
// e mostra o que já foi feito a pedido de vocês.
import { useCallback, useEffect, useState } from 'react';
import { buscarComunidade, meusRelatos, moderarRelato, relatosParaModerar, useSessao, votarIdeia,
  type Comunidade as C, type Relato, type StatusRelato } from '../api';
import { FolhaRelato } from '../componentes/Reportar';
import { Icone } from '../componentes/Icones';
import Lumi from '../componentes/Lumi';

const NOME_STATUS: Record<StatusRelato, string> = { novo: 'Recebido', votacao: 'Em votação', fazendo: 'Em andamento', feito: 'Feito', arquivado: 'Analisado' };
const NOME_TIPO = { questao: 'Erro na questão', explicacao: 'Explicação', ideia: 'Ideia', app: 'Problema no app' } as const;
const data = (t: number) => new Date(t).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

export default function Comunidade({ irPara }: { irPara: (r: string) => void }) {
  const sessao = useSessao();
  const [dados, setDados] = useState<C | null>(null);
  const [meus, setMeus] = useState<Relato[] | null>(null);
  const [erro, setErro] = useState('');
  const [folha, setFolha] = useState(false);
  const [votando, setVotando] = useState<number | null>(null);

  const carregar = useCallback(async () => {
    setErro('');
    try {
      setDados(await buscarComunidade());
      if (sessao) setMeus((await meusRelatos()).relatos);
    } catch (e) { setErro((e as Error).message); }
  }, [sessao]);
  useEffect(() => { void carregar(); }, [carregar]);

  async function votar(id: number) {
    if (!sessao) { irPara('entrar'); return; }
    setVotando(id);
    try {
      const r = await votarIdeia(id);
      setDados((d) => d && { ...d, ideias: d.ideias.map((i) => (i.id === id ? { ...i, votos: r.votos, meu: r.meu ? 1 : 0 } : i)) });
    } catch (e) { setErro((e as Error).message); } finally { setVotando(null); }
  }

  return (
    <div className="comunidade">
      <div className="com-cab">
        <Lumi humor="feliz" tamanho={56} />
        <div>
          <h1>Comunidade</h1>
          <p className="lead">Achou um erro ou teve uma ideia? Conte aqui. O professor lê tudo e as melhores ideias vão para votação.</p>
        </div>
      </div>
      <button className="btn btn-pri largo" type="button" onClick={() => setFolha(true)}>Enviar erro ou ideia</button>
      <p className="nota com-dica">Dentro das lições e questões, use a bandeira <Icone nome="bandeira" tamanho={18} /> no topo: o relato já vai com a tela onde você está.</p>

      {erro && <div className="card aviso-erro" role="alert"><p>{erro}</p><button className="btn" type="button" onClick={() => void carregar()}>Tentar de novo</button></div>}
      {!dados && !erro && <div className="card esqueleto" aria-busy="true" aria-label="Carregando a comunidade"><span /><span /><span /></div>}

      {dados && (
        <>
          <section className="card">
            <h2>Ideias em votação</h2>
            {dados.ideias.length === 0
              ? <p className="nota">Ainda não há ideias em votação. Mande a sua: as melhores aparecem aqui para todo mundo apoiar.</p>
              : <ul className="com-lista">{dados.ideias.map((i) => (
                <li key={i.id} className="com-ideia">
                  <div><strong>{i.titulo}</strong>{i.status === 'fazendo' && <span className="chip chip-fazendo">Em andamento</span>}{i.resposta && <p className="nota">{i.resposta}</p>}</div>
                  <button type="button" className={'btn-voto' + (i.meu ? ' ativo' : '')} aria-pressed={!!i.meu} disabled={votando === i.id} onClick={() => void votar(i.id)}
                    aria-label={(i.meu ? 'Tirar apoio. ' : 'Apoiar esta ideia. ') + i.votos + ' apoios'}>
                    <span aria-hidden="true">▲</span><b>{i.votos}</b>
                  </button>
                </li>))}</ul>}
            {!sessao && dados.ideias.length > 0 && <p className="nota"><a href="#/entrar">Entre na sua conta</a> para apoiar ideias.</p>}
          </section>

          <section className="card">
            <h2>Feito a pedido de vocês</h2>
            {dados.feitos.length === 0
              ? <p className="nota">As melhorias que vierem de relatos da comunidade vão aparecer aqui.</p>
              : <><p className="nota">{dados.totalResolvidos} {dados.totalResolvidos === 1 ? 'relato resolvido' : 'relatos resolvidos'} até agora.</p>
                <ul className="com-lista">{dados.feitos.map((f) => (
                  <li key={f.id} className="com-feito"><Icone nome="missaoFeita" tamanho={22} /><div><strong>{f.titulo}</strong>{f.resposta && <p className="nota">{f.resposta}</p>}<small>{data(f.atualizado)}</small></div></li>
                ))}</ul></>}
          </section>

          {sessao ? (
            <section className="card">
              <h2>Meus relatos</h2>
              {!meus ? <p className="nota">Carregando…</p> : meus.length === 0
                ? <p className="nota">Você ainda não enviou nenhum relato. Quando enviar, acompanha a resposta por aqui.</p>
                : <ul className="com-lista">{meus.map((r) => (
                  <li key={r.id} className="com-meu">
                    <div className="com-meu-topo"><span className={'chip st-' + r.status}>{NOME_STATUS[r.status]}</span><small>{NOME_TIPO[r.tipo]} · {data(r.criado)}</small></div>
                    <p>{r.texto}</p>
                    {r.resposta && <p className="com-resposta"><strong>Resposta do professor:</strong> {r.resposta}</p>}
                  </li>))}</ul>}
            </section>
          ) : (
            <section className="card"><h2>Acompanhe seus relatos</h2><p className="nota">Você pode relatar sem conta. Com a conta grátis, vê a resposta do professor e apoia ideias.</p><a className="btn largo" href="#/entrar">Entrar ou criar conta</a></section>
          )}

          {dados.admin && <Moderar aoMudar={() => void carregar()} />}
        </>
      )}
      {folha && <FolhaRelato onde="Comunidade" onFechar={() => { setFolha(false); void carregar(); }} />}
    </div>
  );
}

// ---------- só para o professor ----------
const ABAS: StatusRelato[] = ['novo', 'votacao', 'fazendo', 'feito', 'arquivado'];

function Moderar({ aoMudar }: { aoMudar: () => void }) {
  const [aba, setAba] = useState<StatusRelato>('novo');
  const [lista, setLista] = useState<Relato[] | null>(null);
  const [cont, setCont] = useState<Partial<Record<StatusRelato, number>>>({});
  const [erro, setErro] = useState('');
  const carregar = useCallback(async () => {
    setErro(''); setLista(null);
    try { const r = await relatosParaModerar(aba); setLista(r.relatos); setCont(r.contagem); } catch (e) { setErro((e as Error).message); }
  }, [aba]);
  useEffect(() => { void carregar(); }, [carregar]);

  return (
    <section className="card moderar">
      <h2>Moderar (só você vê)</h2>
      <div className="abas" role="tablist">
        {ABAS.map((s) => <button key={s} role="tab" type="button" aria-selected={aba === s} className={aba === s ? 'ativo' : ''} onClick={() => setAba(s)}>{NOME_STATUS[s]} {cont[s] ? '(' + cont[s] + ')' : ''}</button>)}
      </div>
      {erro && <p className="folha-erro" role="alert">{erro}</p>}
      {!lista && !erro && <p className="nota">Carregando…</p>}
      {lista && lista.length === 0 && <p className="nota">Nada aqui.</p>}
      {lista && lista.map((r) => <ItemModerar key={r.id} r={r} aoMudar={() => { void carregar(); aoMudar(); }} />)}
    </section>
  );
}

function ItemModerar({ r, aoMudar }: { r: Relato; aoMudar: () => void }) {
  const [titulo, setTitulo] = useState(r.titulo || '');
  const [resposta, setResposta] = useState(r.resposta || '');
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState('');
  let ctx: Record<string, unknown> = {};
  try { ctx = r.contexto ? JSON.parse(r.contexto) : {}; } catch { /* ok */ }
  async function mudar(s: StatusRelato) {
    setOcupado(true); setErro('');
    try { await moderarRelato(r.id, s, titulo, resposta); aoMudar(); } catch (e) { setErro((e as Error).message); setOcupado(false); }
  }
  return (
    <article className="mod-item">
      <p className="mod-meta"><span className="chip">{NOME_TIPO[r.tipo]}</span> {data(r.criado)} · {r.apelido || 'sem conta'}{r.votos ? ' · ' + r.votos + ' apoios' : ''}</p>
      {r.onde && <p className="nota">{r.onde}</p>}
      <p className="mod-texto">{r.texto}</p>
      {ctx.versao ? <p className="nota">v{String(ctx.versao)} · {String(ctx.plataforma)} · {String(ctx.largura)} px</p> : null}
      <label className="folha-label" htmlFor={'t' + r.id}>Título público (aparece na votação e em "Feito")</label>
      <input id={'t' + r.id} value={titulo} maxLength={140} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex.: Corrigido o gabarito da questão de precedência" />
      <label className="folha-label" htmlFor={'r' + r.id}>Resposta para quem enviou</label>
      <textarea id={'r' + r.id} rows={2} value={resposta} onChange={(e) => setResposta(e.target.value)} placeholder="Ex.: Você tinha razão, já corrigi. Obrigado!" />
      {erro && <p className="folha-erro" role="alert">{erro}</p>}
      <div className="mod-acoes">
        <button className="btn" type="button" disabled={ocupado} onClick={() => void mudar('votacao')}>Pôr em votação</button>
        <button className="btn" type="button" disabled={ocupado} onClick={() => void mudar('fazendo')}>Estou fazendo</button>
        <button className="btn btn-ok" type="button" disabled={ocupado} onClick={() => void mudar('feito')}>Marcar como feito</button>
        <button className="btn btn-fantasma" type="button" disabled={ocupado} onClick={() => void mudar('arquivado')}>Arquivar</button>
      </div>
    </article>
  );
}
