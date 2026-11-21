// Desempenho por assunto (mapa de domínio): junta as estrelas das lições com o acerto nas questões de prova.
import { ASSUNTOS, PROVAS } from '../dados/provas';
import type { Estado } from '../estado';

const NIVEIS = ['Não começou', 'Iniciante', 'Praticando', 'Bom', 'Dominado'] as const;

export function calcularDominio(e: Estado) {
  return ASSUNTOS.map((a) => {
    const feitas = a.licoes.filter((i) => e.estrelas[i] != null);
    const licao = a.licoes.length ? a.licoes.reduce((s, i) => s + (e.estrelas[i] || 0), 0) / (a.licoes.length * 3) : 0;
    const qs = PROVAS.filter((q) => a.temas.includes(q.tema));
    let t = 0, ac = 0;
    for (const q of qs) { const p = e.provas[q.id]; if (p) { t += p.t; ac += p.a; } }
    const prova = t ? ac / t : 0;
    const comeco = feitas.length > 0 || t > 0;
    const nota = t >= 3 ? (feitas.length ? 0.5 * licao + 0.5 * prova : prova) : licao;
    const nivel = !comeco ? 0 : nota < 0.4 ? 1 : nota < 0.7 ? 2 : nota < 0.9 || (qs.length > 0 && t < 3) ? 3 : 4;
    return { ...a, nota, nivel, tentativas: t, acerto: t ? Math.round(prova * 100) : null, temQuestoes: qs.length > 0 };
  });
}

export default function Desempenho({ e, irPara }: { e: Estado; irPara: (r: string) => void }) {
  const d = calcularDominio(e);
  const comecados = d.filter((x) => x.nivel > 0);
  const fraco = [...comecados].sort((a, b) => a.nota - b.nota)[0];
  const treinar = (x: (typeof d)[number]) => irPara(x.temQuestoes ? 'provas/' + encodeURIComponent(x.temas[0]) : '');
  return (
    <section className="card desempenho" aria-labelledby="des-t">
      <h2 id="des-t">Desempenho por assunto</h2>
      <p className="nota">Junta suas estrelas nas lições com o acerto nas questões de prova. Dominado = lições bem feitas e boa taxa em questões reais.</p>
      {fraco && fraco.nivel < 4 && (
        <div className="ponto-fraco">
          <p><strong>Ponto a reforçar:</strong> {fraco.nome}{fraco.acerto != null ? ' (' + fraco.acerto + '% em questões de prova)' : ''}</p>
          <button type="button" className="btn btn-pri" onClick={() => treinar(fraco)}>{fraco.temQuestoes ? 'Treinar com questões' : 'Rever na trilha'}</button>
        </div>
      )}
      <ul className="dominio">
        {d.map((x) => (
          <li key={x.nome}>
            <div className="dom-cab"><span>{x.nome}</span><small className={'dom-nivel n' + x.nivel}>{NIVEIS[x.nivel]}</small></div>
            <div className="dom-barra" role="img" aria-label={x.nome + ': ' + NIVEIS[x.nivel]}>
              {[1, 2, 3, 4].map((k) => <i key={k} className={k <= x.nivel ? 'on n' + x.nivel : ''} />)}
            </div>
            {x.acerto != null && <small className="dom-det">{x.acerto}% de acerto em {x.tentativas} {x.tentativas === 1 ? 'resposta' : 'respostas'} de prova</small>}
          </li>
        ))}
      </ul>
    </section>
  );
}
