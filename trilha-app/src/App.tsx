import { useEffect, useState } from 'react';
import Trilha from './telas/Trilha';
import TelaLicao from './telas/Licao';
import Ranking from './telas/Ranking';
import Painel from './telas/Painel';
import Entrar from './telas/Entrar';
import { Meta, Missoes, Status } from './componentes/Widgets';
import { sincronizarAgora, useSessao } from './api';
import { APP } from './plataforma';

const ROTAS = ['', 'ranking', 'painel', 'entrar'] as const;
type Rota = (typeof ROTAS)[number];
const lerRota = (): Rota => { const r = location.hash.replace(/^#\/?/, '') as Rota; return ROTAS.includes(r) ? r : ''; };

const ICONES: Record<string, React.ReactNode> = {
  '': <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3 2 9l10 6 8-4.8V17h2V9L12 3Zm-6 9.2V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-3.8l-6 3.6-6-3.6Z" /></svg>,
  ranking: <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7 21v-8h4v8H7Zm6 0V8h4v13h-4ZM1 21v-5h4v5H1Zm18 0v-9h4v9h-4ZM12 2l1.5 3 3.3.5-2.4 2.3.6 3.3L12 9.6 9 11.1l.6-3.3-2.4-2.3 3.3-.5L12 2Z" /></svg>,
  painel: <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.4 0-8 2.2-8 5v3h16v-3c0-2.8-3.6-5-8-5Z" /></svg>
};

export default function App() {
  const [rota, setRota] = useState<Rota>(lerRota());
  const [licao, setLicao] = useState<number | null>(null);
  const sessao = useSessao();

  useEffect(() => {
    const f = () => { setRota(lerRota()); window.scrollTo(0, 0); };
    addEventListener('hashchange', f);
    return () => removeEventListener('hashchange', f);
  }, []);
  useEffect(() => { if (sessao) void sincronizarAgora().catch(() => {}); }, [sessao?.token]);
  useEffect(() => {
    document.title = { '': 'Trilha do RLM', ranking: 'Ranking · Trilha do RLM', painel: 'Meu painel · Trilha do RLM', entrar: 'Entrar · Trilha do RLM' }[rota];
  }, [rota]);

  const irPara = (r: string) => { location.hash = r ? '#/' + r : '#/'; };
  const itens: [Rota, string][] = [['', 'Trilha'], ['ranking', 'Ranking'], ['painel', sessao ? 'Meu painel' : 'Painel']];

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
          {rota === 'ranking' && <Ranking irPara={irPara} />}
          {rota === 'painel' && <><div className="so-celular"><Meta /><Missoes /></div><Painel irPara={irPara} /></>}
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
      {licao !== null && <TelaLicao key={licao} idx={licao} onFechar={() => setLicao(null)} />}
    </div>
  );
}
