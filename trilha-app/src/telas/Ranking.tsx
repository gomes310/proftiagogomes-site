import { useEffect, useState } from 'react';
import { buscarRanking, useSessao, ErroApi, type Ranking as R } from '../api';
import { useEstado } from '../estado';

const MEDALHA = ['🥇', '🥈', '🥉'];

function fimDaSemana(iso: string) {
  const fim = new Date(iso);
  const h = Math.max(0, fim.getTime() - Date.now()) / 36e5;
  if (h < 24) return 'termina em ' + Math.max(1, Math.round(h)) + ' h';
  return 'termina em ' + Math.ceil(h / 24) + ' dias';
}

export default function Ranking({ irPara }: { irPara: (r: string) => void }) {
  const sessao = useSessao();
  const e = useEstado();
  const [dados, setDados] = useState<R | null>(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  async function carregar() {
    setCarregando(true); setErro('');
    try { setDados(await buscarRanking()); } catch (x) { setErro(x instanceof ErroApi ? x.message : 'Não deu para carregar o ranking.'); } finally { setCarregando(false); }
  }
  // recarrega quando o XP muda (acabou de fazer uma lição)
  useEffect(() => { void carregar(); }, [sessao?.token, e.xp]);

  return (
    <div className="ranking">
      <h1>Liga da semana</h1>
      <p className="lead">Quem mais ganhar XP de segunda a domingo fica no topo. Toda segunda-feira a liga recomeça do zero{dados ? ' · ' + fimDaSemana(dados.fim) : ''}.</p>

      {!sessao && (
        <div className="card destaque">
          <h2>Entre para disputar</h2>
          <p>Crie sua conta grátis com seu e-mail. Seu XP desta semana passa a contar no ranking e seu progresso fica salvo na nuvem.</p>
          <button type="button" className="btn btn-pri" onClick={() => irPara('entrar')}>Criar conta ou entrar</button>
        </div>
      )}

      {carregando && !dados && <ol className="lista-ranking esqueleto" aria-label="Carregando ranking">{Array.from({ length: 6 }, (_, k) => <li key={k}><span /></li>)}</ol>}
      {erro && <div className="card"><p className="msg-erro" role="alert">{erro}</p><button type="button" className="btn" onClick={() => void carregar()}>Tentar de novo</button></div>}

      {dados && (
        dados.lista.length === 0 ? (
          <div className="card vazio"><p>Ninguém pontuou nesta semana ainda. Faça uma lição e seja o primeiro da liga!</p><button type="button" className="btn btn-pri" onClick={() => irPara('')}>Ir para a trilha</button></div>
        ) : (
          <>
            <ol className="lista-ranking" aria-label={'Ranking da semana, ' + dados.total + ' participantes'}>
              {dados.lista.map((l) => (
                <li key={l.pos + l.apelido} className={(l.eu ? 'eu ' : '') + (l.pos <= 3 ? 'podio' : '')}>
                  <span className="pos">{l.pos <= 3 ? <span aria-label={l.pos + 'º'}>{MEDALHA[l.pos - 1]}</span> : l.pos}</span>
                  <span className="avatar" aria-hidden="true">{l.apelido.slice(0, 1).toUpperCase()}</span>
                  <span className="nome">{l.apelido}{l.eu && <small> (você)</small>}</span>
                  <span className="xp">{l.xp} XP</span>
                </li>
              ))}
            </ol>
            {dados.eu && !dados.lista.some((l) => l.eu) && (
              <ol className="lista-ranking" start={dados.eu.pos} aria-label="Sua posição">
                <li className="eu"><span className="pos">{dados.eu.pos}</span><span className="avatar" aria-hidden="true">{dados.eu.apelido.slice(0, 1).toUpperCase()}</span><span className="nome">{dados.eu.apelido} <small>(você)</small></span><span className="xp">{dados.eu.xp} XP</span></li>
              </ol>
            )}
            {sessao && !dados.eu && <p className="nota">Você ainda não pontuou nesta semana. Faça uma lição para entrar na liga.</p>}
          </>
        )
      )}
      <p className="nota">No ranking aparece só o seu apelido. Repetir uma lição já feita vale metade do XP.</p>
    </div>
  );
}
