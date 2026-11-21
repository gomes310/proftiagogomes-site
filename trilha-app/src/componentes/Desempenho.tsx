// Seus temas: mapa de progresso. Cor = tema; escadinha = nível; e sempre o próximo passo concreto.
import { LICOES, NOMES_NIVEL, UNIDADES, varsTema } from '../dados/licoes';
import { NOME_NIVEL_ALUNO, desempenhoProvaTema, escolherTema, faltamParaProva, liberada, nivelDaLicao, nivelTema, type Estado } from '../estado';
import { EmblemaTema, EscadaNivel } from './Tema';

export function proximoPasso(e: Estado, t: number) {
  const u = UNIDADES[t], n = nivelTema(e, t);
  const prox = u.licoes.find((i) => liberada(e, i) && e.estrelas[i] == null);
  if (prox !== undefined) return 'Próximo: ' + LICOES[prox].titulo + ' · ' + NOMES_NIVEL[nivelDaLicao(prox)];
  if (n >= 4) return 'Tema dominado. Revise de vez em quando para não esquecer.';
  const d = desempenhoProvaTema(e, t);
  if (d.questoes) { const f = faltamParaProva(d); return 'Questões de Concursos: ' + (f === 1 ? 'falta 1 acerto' : 'faltam ' + f + ' acertos') + ' para 70%'; }
  const faltam = u.licoes.filter((i) => e.estrelas[i] !== 3).length;
  return 'Revisão final: ' + faltam + (faltam === 1 ? ' lição' : ' lições') + ' sem 3 estrelas';
}

export default function Desempenho({ e, irPara }: { e: Estado; irPara: (r: string) => void }) {
  const d = UNIDADES.map((u, t) => ({ u, t, n: nivelTema(e, t), prova: desempenhoProvaTema(e, t), feitas: u.licoes.filter((i) => e.estrelas[i] != null).length }));
  const andamento = d.filter((x) => x.feitas > 0 || x.prova.tentativas > 0).sort((a, b) => (a.t === e.tema ? -1 : b.t === e.tema ? 1 : b.n - a.n));
  const novos = d.filter((x) => !andamento.includes(x));
  const fraco = [...andamento].filter((x) => x.n < 4).sort((a, b) => a.n - b.n || a.prova.taxa - b.prova.taxa)[0];
  const ir = (t: number) => { escolherTema(t); irPara(''); };
  return (
    <section className="card desempenho" aria-labelledby="des-t">
      <h2 id="des-t">Seus temas</h2>
      <p className="nota">Cada cor é um tema. Os degraus mostram seu nível: Básico, Intermediário, Avançado e a coroa de Pronto para a prova (70% nas questões de concursos).</p>

      {fraco && (
        <div className="ponto-fraco" style={varsTema(fraco.t)}>
          <EmblemaTema t={fraco.t} tamanho={40} />
          <p><strong>Para reforçar: {fraco.u.nome}</strong><small>{proximoPasso(e, fraco.t)}</small></p>
          <button type="button" className="btn btn-tema" onClick={() => ir(fraco.t)}>Continuar</button>
        </div>
      )}

      {andamento.length > 0 && (
        <ul className="mapa-temas">
          {andamento.map((x) => (
            <li key={x.u.id} style={varsTema(x.t)}>
              <button type="button" className={'mapa-item' + (x.t === e.tema ? ' atual' : '')} onClick={() => ir(x.t)}
                aria-label={x.u.nome + ': ' + NOME_NIVEL_ALUNO[x.n] + '. ' + proximoPasso(e, x.t) + '. Abrir a trilha do tema.'}>
                <EmblemaTema t={x.t} tamanho={44} />
                <span className="mapa-txt">
                  <strong>{x.u.nome}</strong>
                  <span className="mapa-nivel"><EscadaNivel t={x.t} n={x.n} tamanho={40} />{NOME_NIVEL_ALUNO[x.n]}</span>
                  <small>{proximoPasso(e, x.t)}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {novos.length > 0 && (
        <>
          <h3 className="mapa-sub">{andamento.length ? 'Temas para começar' : 'Escolha um tema para começar'}</h3>
          <ul className="mapa-novos">
            {novos.map((x) => (
              <li key={x.u.id}>
                <button type="button" className="novo-item" style={varsTema(x.t)} onClick={() => ir(x.t)} aria-label={'Começar ' + x.u.nome}>
                  <EmblemaTema t={x.t} tamanho={40} /><span>{x.u.nome}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
