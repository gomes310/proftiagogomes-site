import { useEffect, useState } from 'react';
import Trilha from './telas/Trilha';
import TelaLicao from './telas/Licao';
import Ranking from './telas/Ranking';
import Painel from './telas/Painel';
import Entrar from './telas/Entrar';
import Praticar from './telas/Praticar';
import Sessao from './telas/Sessao';
import { Meta, Missoes, Status } from './componentes/Widgets';
import { sincronizarAgora, useSessao } from './api';
import { APP } from './plataforma';
import { Icone } from './componentes/Icones';
import BoasVindas, { jaViuBoasVindas } from './telas/BoasVindas';
import { aoVoltar } from './nativo';
import { obter } from './estado';

const ROTAS = ['', 'praticar', 'ranking', 'painel', 'entrar'] as const;
type Rota = (typeof ROTAS)[number];
const lerRota = (): Rota => { const r = location.hash.replace(/^#\/?/, '') as Rota; return ROTAS.includes(r) ? r : ''; };

const ICONES: Record<string, React.ReactNode> = {
  '': <Icone nome="trilha" tamanho={26} />,
  praticar: <Icone nome="praticar" tamanho={26} />,
  ranking: <Icone nome="ranking" tamanho={26} />,
  painel: <Icone nome="painel" tamanho={26} />
};

export default function App() {
  const [rota, setRota] = useState<Rota>(lerRota());
  const [licao, setLicao] = useState<number | null>(null);
  const [sessao2, setSessao2] = useState<null | { tipo: 'revisao' | 'relampago'; ids: string[]; n: number }>(null);
  const sessao = useSessao();
  const [boasVindas, setBoasVindas] = useState(() => !jaViuBoasVindas() && obter().licoesFeitas === 0 && lerRota() === '');

  // botão "voltar" do Android: fecha a lição, depois volta para a trilha, depois minimiza
  useEffect(() => aoVoltar(() => {
    if (licao !== null) { setLicao(null); return true; }
    if (sessao2) { setSessao2(null); return true; }
    if (lerRota() !== '') { history.back(); return true; }
    return false;
  }), [licao, sessao2]);

  useEffect(() => {
    const f = () => { setRota(lerRota()); window.scrollTo(0, 0); };
    addEventListener('hashchange', f);
    return () => removeEventListener('hashchange', f);
  }, []);
  useEffect(() => { if (sessao) void sincronizarAgora().catch(() => {}); }, [sessao?.token]);
  useEffect(() => {
    document.title = { '': 'Trilha do RLM', praticar: 'Praticar · Trilha do RLM', ranking: 'Ranking · Trilha do RLM', painel: 'Meu painel · Trilha do RLM', entrar: 'Entrar · Trilha do RLM' }[rota];
  }, [rota]);

  const irPara = (r: string) => { location.hash = r ? '#/' + r : '#/'; };
  const itens: [Rota, string][] = [['', 'Trilha'], ['praticar', 'Praticar'], ['ranking', 'Ranking'], ['painel', sessao ? 'Meu painel' : 'Painel']];

  return (
    <div className={'app' + (APP ? ' no-app' : '')}>
      {!APP && (
        <header className="wrap-largo topo">
          <a className="marca" href="/">Prof. Tiago Gomes</a>
          <nav aria-label="Site"><a href="/questoes/">Banco de questões</a><a href="/guia/">Guia do RLM</a></nav>
        </header>
      )}
      <div className="status"><div className="wrap-largo"><Status /></div></div>

      <div className="wrap-largo grade-app">
        <nav className="nav-lateral" aria-label="Trilha">
          {itens.map(([r, nome]) => (
            <a key={r} href={'#/' + r} className={rota === r ? 'ativo' : ''} aria-current={rota === r ? 'page' : undefined}>{ICONES[r]}<span>{nome}</span></a>
          ))}
          {!sessao && <a href="#/entrar" className={'entrar-link' + (rota === 'entrar' ? ' ativo' : '')}>Entrar</a>}
        </nav>

        <main id="conteudo">
          {rota === '' && <Trilha abrir={setLicao} irPara={irPara} />}
          {rota === 'praticar' && <Praticar irPara={irPara} iniciar={(tipo, ids) => setSessao2({ tipo, ids, n: Date.now() })} />}
          {rota === 'ranking' && <Ranking irPara={irPara} />}
          {rota === 'painel' && <Painel irPara={irPara} />}
          {rota === 'entrar' && <Entrar irPara={irPara} />}
        </main>

        <aside className="lateral" aria-label="Metas e missões">
          <Meta />
          <Missoes />
          {!sessao && (
            <section className="card">
              <h2>Salve seu progresso</h2>
              <p className="nota">Com a conta grátis, seu XP vale no ranking e nada se perde se trocar de aparelho.</p>
              <a className="btn btn-pri largo" href="#/entrar">Criar conta</a>
            </section>
          )}
        </aside>
      </div>

      <nav className="nav-inferior" aria-label="Trilha">
        {itens.map(([r, nome]) => (
          <a key={r} href={'#/' + r} className={rota === r ? 'ativo' : ''} aria-current={rota === r ? 'page' : undefined}>{ICONES[r]}<span>{nome}</span></a>
        ))}
      </nav>

      {!APP && <footer className="wrap-largo rodape">Trilha gratuita do Prof. Tiago Gomes · <a href="/privacidade.html">Privacidade</a></footer>}
      {sessao2 && <Sessao key={sessao2.n} tipo={sessao2.tipo} ids={sessao2.ids} onFechar={() => setSessao2(null)} />}
      {licao !== null && <TelaLicao key={licao} idx={licao} onFechar={() => setLicao(null)} />}
      {boasVindas && licao === null && <BoasVindas irPara={irPara} onFim={(comecar) => { setBoasVindas(false); if (comecar) setLicao(0); }} />}
    </div>
  );
}
