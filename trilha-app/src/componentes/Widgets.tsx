import { Icone } from './Icones';
import { CONQUISTAS, XP_NIVEL, missoesDoDia, mudarMeta, nivelDe, totalEstrelas, useEstado, xpHoje } from '../estado';

export const IconeFogo = () => <Icone nome="ofensiva" />;
export const IconeEstrela = () => <Icone nome="estrela" />;

export function Status() {
  const e = useEstado();
  const nivel = nivelDe(e.xp);
  return (
    <div className="status-linha" aria-label="Seu progresso">
      <span className="chip" title={'Dias seguidos estudando' + (e.escudos ? ' · ' + e.escudos + ' escudo(s) guardado(s)' : '')}><IconeFogo />{e.ofensiva}{e.escudos > 0 && <Icone nome="escudo" tamanho={16} className="mini-escudo" />}<span className="sr">&nbsp;{e.ofensiva === 1 ? 'dia seguido' : 'dias seguidos'}</span></span>
      <div className="nivel-barra"><small>Nível {nivel} · {e.xp} XP</small><div className="trilho" aria-hidden="true"><span style={{ width: (e.xp % XP_NIVEL) / XP_NIVEL * 100 + '%' }} /></div></div>
      <span className="chips-dir">
        <span className="chip" title="Estrelas conquistadas"><IconeEstrela />{totalEstrelas(e)}<span className="sr">&nbsp;estrelas</span></span>
        <a className="chip" href="#/praticar" title="Moedas (use na loja da aba Praticar)"><Icone nome="moeda" />{e.moedas}<span className="sr">&nbsp;moedas</span></a>
      </span>
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
      <label className="meta-sel"><span className="sr">Mudar meta diária</span>
        <select value={e.meta} onChange={(ev) => mudarMeta(Number(ev.target.value))}>
          <option value={10}>10 XP</option><option value={30}>30 XP</option><option value={50}>50 XP</option><option value={80}>80 XP</option>
        </select>
      </label>
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
              <Icone nome={feita ? 'missaoFeita' : 'missao'} tamanho={26} className="missao-ico" />
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
