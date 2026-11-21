// Canal dos testadores: relatar erro em questão, explicação confusa, ideia ou problema no app.
// Abre uma folha por cima da tela, sem tirar o aluno do que estava fazendo.
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { enviarRelato, useSessao, type TipoRelato } from '../api';
import { Icone } from './Icones';

const TIPOS: [TipoRelato, string, string][] = [
  ['questao', 'Erro na questão', 'Gabarito, enunciado ou alternativa errada'],
  ['explicacao', 'Explicação confusa', 'Não entendi ou dá para explicar melhor'],
  ['ideia', 'Ideia', 'Algo que deixaria a Trilha melhor'],
  ['app', 'Problema no app', 'Travou, botão não funciona, tela estranha']
];
const DICA: Record<TipoRelato, string> = {
  questao: 'Ex.: "A letra B também está certa, porque…"',
  explicacao: 'Ex.: "No passo 2 não entendi por que…"',
  ideia: 'Ex.: "Seria legal ter um modo só com questões da IDECAN."',
  app: 'Ex.: "Toquei em Verificar e nada aconteceu."'
};

export function FolhaRelato({ onde, tipoInicial, onFechar }: { onde: string; tipoInicial?: TipoRelato; onFechar: () => void }) {
  const sessao = useSessao();
  const [tipo, setTipo] = useState<TipoRelato | null>(tipoInicial || null);
  const [texto, setTexto] = useState('');
  const [estado, setEstado] = useState<'editando' | 'enviando' | 'enviado'>('editando');
  const [erro, setErro] = useState('');
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const antes = document.activeElement as HTMLElement | null;
    caixa.current?.querySelector<HTMLElement>('h2')?.focus();
    const tecla = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.stopPropagation(); onFechar(); } };
    addEventListener('keydown', tecla, true);
    return () => { removeEventListener('keydown', tecla, true); antes?.focus?.(); };
  }, [onFechar]);

  async function enviar() {
    if (!tipo) { setErro('Escolha o tipo.'); return; }
    if (texto.trim().length < 5) { setErro('Conte em uma frase o que aconteceu.'); return; }
    setErro(''); setEstado('enviando');
    try { await enviarRelato(tipo, onde, texto.trim()); setEstado('enviado'); }
    catch (e) { setErro((e as Error).message); setEstado('editando'); }
  }

  return createPortal(
    <div className="folha-fundo" onClick={(e) => { if (e.target === e.currentTarget) onFechar(); }}>
      <div className="folha" role="dialog" aria-modal="true" aria-labelledby="folha-titulo" ref={caixa} onKeyDown={(e) => e.stopPropagation()}>
        <button className="fechar folha-x" type="button" onClick={onFechar} aria-label="Fechar">×</button>
        {estado === 'enviado' ? (
          <div className="folha-ok">
            <Icone nome="missaoFeita" tamanho={48} />
            <h2 id="folha-titulo" tabIndex={-1}>Recebido. Obrigado!</h2>
            <p>O professor lê cada relato. {sessao ? 'Você acompanha a resposta em Comunidade › Meus relatos.' : 'Entre na sua conta da próxima vez para acompanhar a resposta.'}</p>
            <button className="btn btn-pri largo" type="button" onClick={onFechar}>Voltar ao que eu estava fazendo</button>
          </div>
        ) : (
          <>
            <h2 id="folha-titulo" tabIndex={-1}>O que você encontrou?</h2>
            {onde && <p className="nota folha-onde">Sobre: {onde}</p>}
            <div className="folha-tipos" role="radiogroup" aria-label="Tipo do relato">
              {TIPOS.map(([t, nome, desc]) => (
                <button key={t} type="button" role="radio" aria-checked={tipo === t} className={'folha-tipo' + (tipo === t ? ' ativo' : '')} onClick={() => setTipo(t)}>
                  <strong>{nome}</strong><small>{desc}</small>
                </button>
              ))}
            </div>
            <label className="folha-label" htmlFor="relato-texto">Conte com suas palavras</label>
            <textarea id="relato-texto" rows={4} maxLength={1500} value={texto} placeholder={tipo ? DICA[tipo] : 'Escolha o tipo acima e escreva aqui.'}
              onChange={(e) => setTexto(e.target.value)} aria-describedby="relato-erro" />
            <p id="relato-erro" className="folha-erro" role="alert">{erro}</p>
            <button className="btn btn-pri largo" type="button" disabled={estado === 'enviando'} onClick={enviar}>{estado === 'enviando' ? 'Enviando…' : 'Enviar relato'}</button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

// botão pequeno com bandeira, para o topo da lição e das questões
export function BotaoReportar({ onde, classe = 'fechar', rotulo = false }: { onde: string; classe?: string; rotulo?: boolean }) {
  const [aberto, setAberto] = useState(false);
  return (
    <>
      <button type="button" className={classe} onClick={() => setAberto(true)} aria-label={rotulo ? undefined : 'Relatar um problema nesta tela'} title="Relatar um problema">
        <Icone nome="bandeira" tamanho={22} />{rotulo && <span>Relatar problema</span>}
      </button>
      {aberto && <FolhaRelato onde={onde} onFechar={() => setAberto(false)} />}
    </>
  );
}
