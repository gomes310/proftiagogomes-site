import { CONQUISTAS, XP_NIVEL, missoesDoDia, nivelDe, totalEstrelas, useEstado, xpHoje } from '../estado';

export const IconeFogo = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#E8590C" d="M12 2s5 4.6 5 9.6A5 5 0 0 1 7 11.6C7 9 9 7 9 7s.4 2.6 2.4 3.6C11 6.6 12 2 12 2Zm0 20a7 7 0 0 1-7-7c0-1.4.4-2.7 1-3.8.2 3.7 3 6.8 6 6.8s5.8-3.1 6-6.8c.6 1.1 1 2.4 1 3.8a7 7 0 0 1-7 7Z" /></svg>;
export const IconeEstrela = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#E0B400" d="m12 2 3 6.6 7.2.7-5.4 4.8 1.6 7.1L12 17.5 5.6 21.2l1.6-7.1L1.8 9.3 9 8.6Z" /></svg>;

export function Status() {
  const e = useEstado();
  const nivel = nivelDe(e.xp);
  return (
    <div className="status-linha" aria-label="Seu progresso">
      <span className="chip" title="Dias seguidos estudando"><IconeFogo />{e.ofensiva}<span className="sr">&nbsp;{e.ofensiva === 1 ? 'dia seguido' : 'dias seguidos'}</span></span>
      <div className="nivel-barra"><small>Nível {nivel} · {e.xp} XP</small><div className="trilho" aria-hidden="true"><span style={{ width: (e.xp % XP_NIVEL) / XP_NIVEL * 100 + '%' }} /></div></div>
      <span className="chip" title="Estrelas conquistadas"><IconeEstrela />{totalEstrelas(e)}<span className="sr">&nbsp;estrelas</span></span>
    </div>
  );
}

export function Meta() {
  const e = useEstado();
  const feito = xpHoje(e);
  const pct = Math.min(1, feito / e.meta);
  const r = 26, C = 2 * Math.PI * r;
  return (
    <section className="card meta" aria-labelledby="meta-t">
      <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--linha)" strokeWidth="8" />
        <circle cx="32" cy="32" r={r} fill="none" stroke={pct >= 1 ? 'var(--verde)' : '#E0B400'} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - pct)} transform="rotate(-90 32 32)" />
      </svg>
      <div>
        <h2 id="meta-t">Meta do dia</h2>
        <p>{pct >= 1 ? <strong className="ok">Batida! {feito} XP hoje.</strong> : <><strong>{feito}</strong> de {e.meta} XP</>}</p>
      </div>
    </section>
  );
}

export function Missoes() {
  const e = useEstado();
  const lista = missoesDoDia();
  return (
    <section className="card" aria-labelledby="missoes-t">
      <h2 id="missoes-t">Missões do dia</h2>
      <ul className="missoes">
        {lista.map((m) => {
          const feita = e.missoes.feitas.includes(m.id);
          const prog = feita ? m.alvo : Math.min(m.alvo, m.progresso(e));
          const pct = prog / m.alvo;
          return (
            <li key={m.id} className={feita ? 'feita' : ''}>
              <span className="missao-ico" aria-hidden="true">{feita ? '✅' : '🎯'}</span>
              <div>
                <p>{m.titulo} <small>+{m.bonus} XP</small></p>
                <div className="trilho fino" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct * 100)} aria-label={m.titulo}><span style={{ width: pct * 100 + '%' }} /></div>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="nota">Novas missões todo dia à meia-noite.</p>
    </section>
  );
}

export function ConquistasResumo() {
  const e = useEstado();
  const ganhas = CONQUISTAS.filter((c) => e.conquistas[c.id]).length;
  return <p className="nota">{ganhas} de {CONQUISTAS.length} conquistas</p>;
}
