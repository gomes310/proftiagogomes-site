import { useState } from 'react';
import { LICOES, UNIDADES } from '../dados/licoes';
import { CONQUISTAS, XP_NIVEL, mudarMeta, nivelDe, totalEstrelas, ultimos7, useEstado } from '../estado';
import { apagarConta, mudarApelido, sair, useSessao, ErroApi } from '../api';
import { IconeEstrela, IconeFogo } from '../componentes/Widgets';

const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

function Grafico7() {
  const e = useEstado();
  const d = ultimos7(e);
  const max = Math.max(e.meta, ...d.map((x) => x.xp));
  const W = 320, H = 150, base = H - 22, topo = 14, larg = W / 7;
  const y = (v: number) => base - (v / max) * (base - topo);
  return (
    <svg className="grafico" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={'XP nos últimos 7 dias: ' + d.map((x) => x.xp).join(', ')}>
      <line x1="0" x2={W} y1={y(e.meta)} y2={y(e.meta)} className="linha-meta" />
      <text x={W - 2} y={y(e.meta) - 4} textAnchor="end" className="rot-meta">meta {e.meta}</text>
      {d.map((x, k) => {
        const [a, m, dd] = x.dia.split('-').map(Number);
        const dia = DIAS[new Date(a, m - 1, dd).getDay()];
        const h = base - y(x.xp);
        return (
          <g key={x.dia}>
            <rect x={k * larg + larg * 0.2} width={larg * 0.6} y={y(x.xp)} height={Math.max(h, x.xp ? 2 : 0)} rx="4" className={x.xp >= e.meta ? 'barra ok' : 'barra'} />
            {x.xp > 0 && <text x={k * larg + larg / 2} y={y(x.xp) - 4} textAnchor="middle" className="valor">{x.xp}</text>}
            <text x={k * larg + larg / 2} y={H - 6} textAnchor="middle" className={k === 6 ? 'dia hoje' : 'dia'}>{k === 6 ? 'hoje' : dia}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Conta() {
  const sessao = useSessao();
  const [editando, setEditando] = useState(false);
  const [apelido, setApelido] = useState(sessao?.usuario.apelido || '');
  const [erro, setErro] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [confirmar, setConfirmar] = useState(false);
  if (!sessao) return null;
  return (
    <section className="card" aria-labelledby="conta-t">
      <h2 id="conta-t">Sua conta</h2>
      {!editando ? (
        <p>Apelido no ranking: <strong>{sessao.usuario.apelido}</strong> <button type="button" className="link" onClick={() => setEditando(true)}>Mudar</button><br /><small className="nota">{sessao.usuario.email}</small></p>
      ) : (
        <form className="form-linha" onSubmit={async (ev) => {
          ev.preventDefault(); setOcupado(true); setErro('');
          try { await mudarApelido(apelido.trim()); setEditando(false); } catch (x) { setErro(x instanceof ErroApi ? x.message : 'Não deu para salvar.'); } finally { setOcupado(false); }
        }}>
          <label className="campo">Novo apelido<input value={apelido} onChange={(ev) => setApelido(ev.target.value)} maxLength={20} minLength={3} required autoComplete="nickname" /></label>
          <button className="btn btn-pri" disabled={ocupado}>{ocupado ? 'Salvando…' : 'Salvar apelido'}</button>
          <button type="button" className="btn" onClick={() => setEditando(false)}>Cancelar</button>
          {erro && <p className="msg-erro" role="alert">{erro}</p>}
        </form>
      )}
      <div className="acoes-conta">
        <button type="button" className="btn" onClick={() => void sair()}>Sair da conta</button>
        {!confirmar ? <button type="button" className="link perigo" onClick={() => setConfirmar(true)}>Apagar minha conta</button> : (
          <div className="confirmar" role="alertdialog" aria-labelledby="apagar-t">
            <p id="apagar-t">Apagar a conta remove seu progresso da nuvem e seu nome do ranking. O progresso continua neste aparelho. Isso não pode ser desfeito.</p>
            <button type="button" className="btn btn-perigo" onClick={async () => { try { await apagarConta(); } catch (x) { setErro(x instanceof ErroApi ? x.message : 'Não deu para apagar.'); setConfirmar(false); } }}>Apagar conta</button>
            <button type="button" className="btn" onClick={() => setConfirmar(false)}>Manter conta</button>
          </div>
        )}
      </div>
      {erro && !editando && <p className="msg-erro" role="alert">{erro}</p>}
    </section>
  );
}

export default function Painel({ irPara }: { irPara: (r: string) => void }) {
  const e = useEstado();
  const sessao = useSessao();
  const nivel = nivelDe(e.xp);
  const precisao = e.respostas ? Math.round((e.acertos / e.respostas) * 100) : null;
  const feitas = Object.keys(e.estrelas).length;
  return (
    <div className="painel">
      <h1>{sessao ? 'Olá, ' + sessao.usuario.apelido : 'Seu painel'}</h1>
      {!sessao && <p className="convite">Seu progresso está só neste aparelho. <button type="button" className="link" onClick={() => irPara('entrar')}>Entre ou crie sua conta</button> para não perder nada e aparecer no ranking.</p>}

      <div className="kpis">
        <div className="card kpi"><IconeFogo /><b>{e.ofensiva}</b><small>{e.ofensiva === 1 ? 'dia seguido' : 'dias seguidos'}<br />recorde {e.maiorOfensiva}</small></div>
        <div className="card kpi"><span className="kpi-ico" aria-hidden="true">⚡</span><b>{e.xp}</b><small>XP total<br />nível {nivel}</small></div>
        <div className="card kpi"><IconeEstrela /><b>{totalEstrelas(e)}</b><small>de {LICOES.length * 3} estrelas</small></div>
        <div className="card kpi"><span className="kpi-ico" aria-hidden="true">🎯</span><b>{precisao === null ? '—' : precisao + '%'}</b><small>de acertos<br />{e.respostas} respostas</small></div>
      </div>

      <section className="card" aria-labelledby="sem-t">
        <div className="card-cab"><h2 id="sem-t">Seus últimos 7 dias</h2>
          <label className="campo inline">Meta diária
            <select value={e.meta} onChange={(ev) => mudarMeta(Number(ev.target.value))}>
              <option value={10}>10 XP · leve</option><option value={30}>30 XP · regular</option><option value={50}>50 XP · puxado</option><option value={80}>80 XP · intenso</option>
            </select>
          </label>
        </div>
        <Grafico7 />
        <div className="nivel-barra largo"><small>Nível {nivel}: faltam {XP_NIVEL - (e.xp % XP_NIVEL)} XP para o nível {nivel + 1}</small><div className="trilho" aria-hidden="true"><span style={{ width: (e.xp % XP_NIVEL) / XP_NIVEL * 100 + '%' }} /></div></div>
      </section>

      <section className="card" aria-labelledby="prog-t">
        <h2 id="prog-t">Progresso na trilha · {feitas} de {LICOES.length} lições</h2>
        <ul className="unidades-prog">
          {UNIDADES.map((u) => {
            const n = u.licoes.filter((i) => e.estrelas[i] != null).length;
            const est = u.licoes.reduce((s, i) => s + (e.estrelas[i] || 0), 0);
            return (
              <li key={u.nome}>
                <div><strong>{u.nome.split(' · ')[1]}</strong><small>{n}/{u.licoes.length} lições · {est}/{u.licoes.length * 3} ★</small></div>
                <div className="trilho fino" aria-hidden="true"><span style={{ width: (n / u.licoes.length) * 100 + '%' }} /></div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card" aria-labelledby="conq-t">
        <h2 id="conq-t">Conquistas · {CONQUISTAS.filter((c) => e.conquistas[c.id]).length} de {CONQUISTAS.length}</h2>
        <ul className="conquistas">
          {CONQUISTAS.map((c) => {
            const ganha = e.conquistas[c.id];
            return (
              <li key={c.id} className={ganha ? 'ganha' : ''}>
                <span className="medalha" aria-hidden="true">{ganha ? c.icone : '🔒'}</span>
                <strong>{c.nome}</strong>
                <small>{c.desc}{ganha ? ' · ' + ganha.split('-').reverse().join('/') : ''}</small>
              </li>
            );
          })}
        </ul>
      </section>

      <Conta />
    </div>
  );
}
