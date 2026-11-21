// Questões de concursos resolvidas em vídeo no canal do Prof. Tiago Gomes.
// Fonte única: data/questoes.json (gerado das descrições dos vídeos). Só entram as completas e sem figura.
import bruto from '../../../data/questoes.json';

export type QuestaoProva = {
  id: string; // id do vídeo no YouTube
  banca: string;
  ano?: number;
  orgao?: string;
  tema: string;
  enunciado: string;
  alternativas: [string, string][];
  gabarito: string; // letra
  numero?: number;
};

type Bruta = { video: string; banca?: string | null; ano?: number | null; orgao?: string | null; tema?: string | null; enunciado?: string | null; alternativas?: [string, string][] | null; gabarito?: string | null; lacunas?: string[]; numero_serie?: number | null };

const limpar = (t: string) => t.replace(/\s+/g, ' ').trim();

export const PROVAS: QuestaoProva[] = ((bruto as { questoes: Bruta[] }).questoes)
  .filter((q) => q.video && q.enunciado && q.alternativas && q.alternativas.length >= 2 && q.gabarito
    && !(q.lacunas || []).some((l) => /figura|imagem|tabela/i.test(l))
    && q.alternativas.some(([l]) => l.toLowerCase() === String(q.gabarito).toLowerCase()))
  .map((q) => ({
    id: q.video,
    banca: q.banca || 'Banca não informada',
    ano: q.ano ?? undefined,
    orgao: q.orgao ?? undefined,
    tema: q.tema || 'Outros',
    enunciado: limpar(q.enunciado!),
    alternativas: q.alternativas!.map(([l, t]) => [l.toLowerCase(), limpar(t)] as [string, string]),
    gabarito: String(q.gabarito).toLowerCase(),
    numero: q.numero_serie ?? undefined
  }));

const contar = (xs: string[]) => [...xs.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map<string, number>())].sort((a, b) => b[1] - a[1]);
export const BANCAS_PROVA = contar(PROVAS.map((q) => q.banca));
export const TEMAS_PROVA = contar(PROVAS.map((q) => q.tema));

// banca escolhida na apresentação → nome no banco de questões
export const BANCA_DO_PERFIL: Record<string, string> = { idecan: 'IDECAN', cebraspe: 'CEBRASPE', fgv: 'FGV', fcc: 'FCC', vunesp: 'VUNESP' };
