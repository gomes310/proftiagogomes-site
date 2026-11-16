export interface Questao { p: string; o: string[]; c: number; e: string }
export interface Licao { titulo: string; teoria: string[]; exemplo: string; questoes: Questao[] }
export interface Unidade { nome: string; desc: string; selo: string; licoes: number[] }
export interface Extra { ex: [string, string]; vf: { t: string; v: boolean; e: string } }
