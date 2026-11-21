export interface Questao { p: string; o: string[]; c: number; e: string }
export interface Licao { titulo: string; teoria: string[]; exemplo: string; questoes: Questao[] }
// Cada "unidade" agora é um TEMA com níveis: básico, intermediário e avançado (+ nível prova com questões reais).
export interface Unidade { id: string; nome: string; desc: string; selo: string; licoes: number[]; niveis: [number[], number[], number[]]; temas: string[]; cor: { p: string; e: string; c: string } }
export interface Extra { ex: [string, string]; vf: { t: string; v: boolean; e: string } }
