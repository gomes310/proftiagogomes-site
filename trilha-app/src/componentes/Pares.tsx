// Exercício "Ligue os pares": toque num item da esquerda e no par da direita.
import { useMemo, useState } from 'react';
import { som } from '../som';
import { vibrar } from '../nativo';

function embaralhar<T>(a: T[], semente: number) {
  const r = [...a]; let s = semente || 1;
  for (let i = r.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}

export default function Pares({ pares, semente = 7, onFim }: { pares: [string, string][]; semente?: number; onFim: (erros: number) => void }) {
  const esq = useMemo(() => embaralhar(pares.map((p, i) => ({ t: p[0], i })), semente), [pares, semente]);
  const dir = useMemo(() => embaralhar(pares.map((p, i) => ({ t: p[1], i })), semente + 3), [pares, semente]);
  const [sel, setSel] = useState<{ lado: 'e' | 'd'; i: number } | null>(null);
  const [feitos, setFeitos] = useState<number[]>([]);
  const [errado, setErrado] = useState<string | null>(null);
  const [erros, setErros] = useState(0);

  function tocar(lado: 'e' | 'd', i: number) {
    if (feitos.includes(i)) return;
    if (!sel || sel.lado === lado) { setSel({ lado, i }); som('toque'); return; }
    if (sel.i === i) {
      const novos = [...feitos, i];
      setFeitos(novos); setSel(null); som('certo'); vibrar('toque');
      if (novos.length === pares.length) setTimeout(() => onFim(erros), 250);
    } else {
      setErrado(lado + i + '|' + sel.lado + sel.i); setErros(erros + 1); setSel(null); som('erro'); vibrar('erro');
      setTimeout(() => setErrado(null), 450);
    }
  }
  const cls = (lado: 'e' | 'd', i: number) => 'par' + (feitos.includes(i) ? ' feito' : '') + (sel && sel.lado === lado && sel.i === i ? ' sel' : '') + (errado && errado.split('|').includes(lado + i) ? ' errado' : '');

  return (
    <div className="pares" role="group" aria-label={'Ligue os pares: ' + feitos.length + ' de ' + pares.length + ' feitos'}>
      <div className="pares-col">{esq.map((x) => <button key={'e' + x.i} type="button" className={cls('e', x.i)} disabled={feitos.includes(x.i)} aria-pressed={sel?.lado === 'e' && sel.i === x.i} onClick={() => tocar('e', x.i)}>{x.t}</button>)}</div>
      <div className="pares-col">{dir.map((x) => <button key={'d' + x.i} type="button" className={cls('d', x.i)} disabled={feitos.includes(x.i)} aria-pressed={sel?.lado === 'd' && sel.i === x.i} onClick={() => tocar('d', x.i)}>{x.t}</button>)}</div>
    </div>
  );
}
