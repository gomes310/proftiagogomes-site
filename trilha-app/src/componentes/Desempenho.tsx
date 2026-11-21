// Seus temas: o nível do aluno em cada tema (básico → intermediário → avançado → pronto para a prova).
import { UNIDADES } from '../dados/licoes';
import { NOME_NIVEL_ALUNO, desempenhoProvaTema, escolherTema, nivelTema, type Estado } from '../estado';

export default function Desempenho({ e, irPara }: { e: Estado; irPara: (r: string) => void }) {
  const d = UNIDADES.map((u, t) => ({ u, t, n: nivelTema(e, t), prova: desempenhoProvaTema(e, t), feitas: u.licoes.filter((i) => e.estrelas[i] != null).length }));
  const comecados = d.filter((x) => x.feitas > 0 || x.prova.tentativas > 0);
  // ponto a reforçar: o tema começado com menor nível; empate → menor taxa nas questões de prova
  const fraco = [...comecados].filter((x) => x.n < 4).sort((a, b) => a.n - b.n || a.prova.taxa - b.prova.taxa)[0];
  const ir = (t: number) => { escolherTema(t); irPara(''); };
  return (
    <section className="card desempenho" aria-labelledby="des-t">
      <h2 id="des-t">Seus temas</h2>
      <p className="nota">Cada tema tem o seu nível: Básico, Intermediário, Avançado e, por fim, Pronto para a prova (70% ou mais nas questões reais).</p>
      {fraco && (
        <div className="ponto-fraco">
          <p><strong>Para reforçar:</strong> {fraco.u.nome} ({NOME_NIVEL_ALUNO[fraco.n].toLowerCase()})</p>
          <button type="button" className="btn btn-pri" onClick={() => ir(fraco.t)}>Continuar este tema</button>
        </div>
      )}
      <ul className="dominio">
        {d.map((x) => (
          <li key={x.u.id}>
            <button type="button" className="dom-item" onClick={() => ir(x.t)} aria-label={x.u.nome + ': ' + NOME_NIVEL_ALUNO[x.n] + '. Abrir a trilha do tema.'}>
              <span className="dom-cab"><span>{x.u.nome}</span><small className={'dom-nivel n' + x.n}>{NOME_NIVEL_ALUNO[x.n]}</small></span>
              <span className="dom-barra" aria-hidden="true">{[1, 2, 3, 4].map((k) => <i key={k} className={k <= x.n ? 'on n' + x.n : ''} />)}</span>
              <small className="dom-det">{x.feitas}/{x.u.licoes.length} lições{x.prova.tentativas ? ' · ' + Math.round(x.prova.taxa * 100) + '% em questões de prova' : ''}</small>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
