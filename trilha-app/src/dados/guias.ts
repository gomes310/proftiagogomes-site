// Ensino guiado de cada lição: conceito curto → exemplos simples (um de cada vez) → "sua vez" com dica.
import bruto from './guias.json';
import { EXTRA, LICOES } from './licoes';
import { CONTEUDO } from './imersao';

export type ExemploGuia = { t: string; r: string; ok?: boolean; porque: string };
export type PassoGuia = { titulo: string; conceito: string; exemplos: ExemploGuia[]; suaVez?: { p: string; o: string[]; c: number; dica: string; e: string } };

const GUIAS = bruto as unknown as Record<string, PassoGuia[]>;

// Lições ainda sem guia próprio: monta um a partir da teoria, dos exemplos e da pergunta da imersão
function guiaAutomatico(idx: number): PassoGuia[] {
  const L = LICOES[idx], C = CONTEUDO[idx], E = EXTRA[idx];
  const ex: ExemploGuia[] = C.imersao.exemplos.map(([t, r]) => ({ t, r, porque: '' }));
  return L.teoria.map((t, k) => ({
    titulo: k === 0 ? L.titulo : 'Continuando: ' + L.titulo.toLowerCase(),
    conceito: t,
    exemplos: k === 0 ? ex.map((x) => ({ ...x, porque: 'Observe o padrão.' })) : k === 1 ? [{ t: E.ex[0], r: 'Resolução', porque: E.ex[1] }] : [],
    suaVez: k === L.teoria.length - 1 ? { p: C.imersao.pergunta, o: C.imersao.opcoes, c: C.imersao.c, dica: 'Volte aos exemplos e procure o padrão.', e: C.imersao.e } : undefined
  }));
}

export const guiaDaLicao = (idx: number): PassoGuia[] => GUIAS[String(idx)] || guiaAutomatico(idx);

// **negrito** → <strong>, escapando o resto
export const marcar = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
