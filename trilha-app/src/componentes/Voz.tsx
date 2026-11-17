import { useEffect, useRef, useState } from 'react';
import { Icone } from './Icones';
import Lumi from './Lumi';
import { entender, falar, leituraLigada, ligarLeitura, microfoneDisponivel, ouvir, parar, textoDoBloco, useFalando, useLeitura, vozDisponivel } from '../voz';
import { som } from '../som';

// Lê a tela sozinho quando a leitura está ligada: o cartão ao mudar de tela e o retorno quando aparece
export function useLeituraAuto(chaveTela: string, chaveRetorno: string) {
  const ligada = useLeitura();
  useEffect(() => {
    if (!ligada) return;
    const t = setTimeout(() => void falar(textoDoBloco(document.querySelector('.licao .cartao'))), 250);
    return () => clearTimeout(t);
  }, [chaveTela, ligada]);
  useEffect(() => {
    if (!ligada || !chaveRetorno) return;
    const t = setTimeout(() => void falar(textoDoBloco(document.querySelector('.licao-base .retorno'))), 450);
    return () => clearTimeout(t);
  }, [chaveRetorno, ligada]);
  useEffect(() => () => { void parar(); }, []);
}

// Botão da barra de cima: liga/desliga a leitura em voz alta
export function BotaoLeitura() {
  const ligada = useLeitura();
  if (!vozDisponivel()) return null;
  return (
    <button className={'fechar voz-btn' + (ligada ? ' ligada' : '')} type="button" aria-pressed={ligada}
      aria-label={ligada ? 'Parar de ler em voz alta' : 'Ler em voz alta'}
      onClick={() => {
        const v = !ligada; ligarLeitura(v);
        if (v) void falar(textoDoBloco(document.querySelector('.licao .cartao')));
      }}>
      <Icone nome="voz" />
    </button>
  );
}

// A Lumi aparece mexendo a boca enquanto lê
export function LumiFalando({ esconder }: { esconder?: boolean }) {
  const falando = useFalando();
  if (!falando || esconder) return null;
  return <span className="reacao" aria-hidden="true"><Lumi humor="falando" tamanho={56} /></span>;
}

// Responder falando: "letra B", "segunda", "verdadeiro", "continuar", "repetir"
export function BotaoMicrofone({ acao, aviso }: { acao: () => void; aviso: (m: string) => void }) {
  const [ouvindo, setOuvindo] = useState(false);
  const vivo = useRef(true);
  useEffect(() => () => { vivo.current = false; }, []);
  if (!microfoneDisponivel()) return null;
  async function escutar() {
    if (ouvindo) return;
    setOuvindo(true); som('toque'); aviso('');
    try {
      const botoes = Array.from(document.querySelectorAll<HTMLButtonElement>('.licao .cartao .opcao'));
      const frases = await ouvir();
      if (!vivo.current) return;
      const c = entender(frases, botoes.map((b) => { const x = b.cloneNode(true) as Element; x.querySelectorAll('[aria-hidden="true"]').forEach((n) => n.remove()); return x.textContent || ''; }));
      if (!c) aviso('Não entendi “' + (frases[0] || '') + '”. Diga, por exemplo, “letra B” ou “continuar”.');
      else if (c.tipo === 'opcao') { const b = botoes[c.k]; if (b && !b.disabled) b.click(); else aviso('Essa já foi respondida. Diga “continuar”.'); }
      else if (c.tipo === 'acao') acao();
      else void falar(textoDoBloco(document.querySelector('.licao .cartao')));
    } catch (e) {
      if (vivo.current) aviso(e instanceof Error ? e.message : 'Não consegui ouvir. Tente de novo.');
    } finally { if (vivo.current) setOuvindo(false); }
  }
  return (
    <button type="button" className={'btn mic-btn' + (ouvindo ? ' ouvindo' : '')} onClick={() => void escutar()}
      aria-label={ouvindo ? 'Ouvindo… fale sua resposta' : 'Responder falando'}>
      <Icone nome="microfone" tamanho={26} />
    </button>
  );
}

// Interruptor usado na apresentação e no painel
export function InterruptorLeitura({ aoLigar }: { aoLigar?: () => void }) {
  const ligada = useLeitura();
  if (!vozDisponivel()) return null;
  return (
    <button type="button" role="switch" aria-checked={ligada} className={'interruptor' + (ligada ? ' on' : '')}
      onClick={() => { const v = !leituraLigada(); ligarLeitura(v); if (v) aoLigar?.(); }}>
      <Icone nome="voz" tamanho={26} />
      <span><strong>Ler tudo em voz alta para mim</strong><small>A Lumi lê as lições e você pode responder falando.</small></span>
      <i aria-hidden="true" />
    </button>
  );
}
