// Conteúdo da v2.2.
// - imersao: estilo Rosetta Stone. O aluno vê exemplos ANTES da explicação e descobre a regra sozinho.
// - pares: exercício "Ligue os pares" (estilo Duolingo), usado na lição e no desafio relâmpago.
// - caderno: resumo da lição que fica guardado no Caderno de regras depois que ela é concluída.

export interface Imersao { exemplos: [string, string][]; pergunta: string; opcoes: string[]; c: number; e: string }
export interface ConteudoExtra { imersao: Imersao; pares: [string, string][]; caderno: { regras: string[]; dica: string } }

export const CONTEUDO: ConteudoExtra[] = [
  { // 0 Conjuntos
    imersao: {
      exemplos: [['{1, 2} e {2, 3}', '{2}'], ['{a, b, c} e {b, c, d}', '{b, c}'], ['{5, 6} e {7, 8}', '{ } (vazio)']],
      pergunta: 'O que a operação faz com os dois conjuntos?',
      opcoes: ['Fica só com o que está nos dois', 'Junta todos os elementos', 'Tira os elementos repetidos'],
      c: 0, e: 'Essa operação é a interseção (∩): só o que é comum aos dois. Quando não há nada em comum, sobra o conjunto vazio.'
    },
    pares: [['A ∪ B', 'junta tudo'], ['A ∩ B', 'só o comum'], ['A − B', 'só de A'], ['{ }', 'conjunto vazio']],
    caderno: { regras: ['União (∪): junta tudo, sem repetir.', 'Interseção (∩): só o que está nos dois.', 'Diferença (A − B): está em A e não está em B.', 'n elementos → 2ⁿ subconjuntos.'], dica: 'Desenhe o diagrama de Venn e preencha do centro (interseção) para fora.' }
  },
  { // 1 Proposições
    imersao: {
      exemplos: [['"O Brasil fica na América."', 'é proposição'], ['"Que horas são?"', 'não é'], ['"2 + 2 = 5"', 'é proposição'], ['"Feche a janela!"', 'não é']],
      pergunta: 'O que as frases que são proposição têm em comum?',
      opcoes: ['Dá para dizer se são verdadeiras ou falsas', 'São todas verdadeiras', 'São frases curtas'],
      c: 0, e: 'Proposição é a frase que pode ser julgada V ou F, mesmo que seja falsa, como "2 + 2 = 5". Perguntas e ordens não podem ser julgadas.'
    },
    pares: [['∧', 'e'], ['∨', 'ou'], ['→', 'se… então'], ['↔', 'se e somente se']],
    caderno: { regras: ['Proposição: frase declarativa que pode ser V ou F.', 'Não são proposições: perguntas, ordens, exclamações e sentenças abertas (x + 2 = 5).', 'Conectivos: ∧ e, ∨ ou, ⊻ ou… ou…, → se… então, ↔ se e somente se, ~ não.'], dica: 'Se a frase tem uma variável sem valor (x, ele, ela), ela é aberta e não é proposição.' }
  },
  { // 2 Tabela-verdade
    imersao: {
      exemplos: [['V → V', 'V'], ['V → F', 'F'], ['F → V', 'V'], ['F → F', 'V']],
      pergunta: 'Quando a condicional "se p, então q" dá falso?',
      opcoes: ['Só quando p é V e q é F', 'Sempre que q é F', 'Quando p e q são iguais'],
      c: 0, e: 'A condicional só é falsa no caso "Vera Fischer": V → F. Em todos os outros casos ela é verdadeira.'
    },
    pares: [['p ∧ q', 'V só se as duas V'], ['p ∨ q', 'F só se as duas F'], ['p → q', 'F só em V → F'], ['p ↔ q', 'V se iguais']],
    caderno: { regras: ['n proposições → 2ⁿ linhas na tabela.', '∧: só é V com V e V.', '∨: só é F com F e F.', '→: só é F com V → F.', '↔: é V quando os dois valores são iguais.'], dica: 'Na prova, procure primeiro o único caso que muda o resultado: é mais rápido que montar a tabela inteira.' }
  },
  { // 3 Equivalências e negações
    imersao: {
      exemplos: [['"Ana estuda e trabalha"', 'nega: "Ana não estuda ou não trabalha"'], ['"Vou ao cinema ou ao teatro"', 'nega: "Não vou ao cinema e não vou ao teatro"']],
      pergunta: 'O que acontece com o conectivo quando negamos?',
      opcoes: ['"e" vira "ou", "ou" vira "e", e as duas partes são negadas', 'O conectivo fica igual', 'Só a primeira parte é negada'],
      c: 0, e: 'São as Leis de De Morgan: ~(p ∧ q) = ~p ∨ ~q e ~(p ∨ q) = ~p ∧ ~q.'
    },
    pares: [['~(p ∧ q)', '~p ∨ ~q'], ['~(p ∨ q)', '~p ∧ ~q'], ['~(p → q)', 'p ∧ ~q'], ['p → q', '~q → ~p']],
    caderno: { regras: ['~(p ∧ q) = ~p ∨ ~q', '~(p ∨ q) = ~p ∧ ~q', '~(p → q) = p ∧ ~q  (mantém a 1ª, nega a 2ª)', 'p → q = ~q → ~p = ~p ∨ q'], dica: 'Para negar a condicional, lembre do "MANÉ": MAntém a primeira E NEga a segunda.' }
  },
  { // 4 Tautologia
    imersao: {
      exemplos: [['"Chove ou não chove"', 'sempre V'], ['"Chove e não chove"', 'sempre F'], ['"Chove e faz frio"', 'às vezes V, às vezes F']],
      pergunta: 'Como se chama a frase que é verdadeira em qualquer situação?',
      opcoes: ['Tautologia', 'Contradição', 'Contingência'],
      c: 0, e: 'Sempre V é tautologia; sempre F é contradição; quando depende dos valores, é contingência.'
    },
    pares: [['sempre V', 'tautologia'], ['sempre F', 'contradição'], ['V e F', 'contingência'], ['p ∨ ~p', 'tautologia clássica']],
    caderno: { regras: ['Tautologia: última coluna toda V (ex.: p ∨ ~p).', 'Contradição: última coluna toda F (ex.: p ∧ ~p).', 'Contingência: a última coluna tem V e F.'], dica: 'Teste o único caso que poderia dar F. Se não existe, é tautologia.' }
  },
  { // 5 Diagramas lógicos
    imersao: {
      exemplos: [['"Todo gato é mamífero"', 'círculo dos gatos dentro do dos mamíferos'], ['"Nenhum peixe é ave"', 'círculos separados'], ['"Algum aluno é atleta"', 'círculos com uma parte em comum']],
      pergunta: 'Como fica o desenho de "Todo A é B"?',
      opcoes: ['A inteiro dentro de B', 'A e B separados', 'B inteiro dentro de A'],
      c: 0, e: 'Todo elemento de A também está em B, então o círculo A fica dentro do círculo B.'
    },
    pares: [['Todo A é B', 'A dentro de B'], ['Nenhum A é B', 'círculos separados'], ['Algum A é B', 'parte em comum'], ['nega "Todo A é B"', 'Algum A não é B']],
    caderno: { regras: ['Todo A é B: A dentro de B.', 'Algum A é B: existe interseção.', 'Nenhum A é B: sem interseção.', 'Negações: Todo ↔ Algum… não; Nenhum ↔ Algum.'], dica: 'Para negar "Todo", basta um contraexemplo: "Algum… não é".' }
  },
  { // 6 Implicações
    imersao: {
      exemplos: [['Se chove, molha. Choveu.', 'Logo, molhou.'], ['Se chove, molha. Não molhou.', 'Logo, não choveu.'], ['Se chove, molha. Molhou.', 'Nada se conclui.']],
      pergunta: 'Em "se p, então q", o que garante uma conclusão?',
      opcoes: ['Afirmar p ou negar q', 'Afirmar q', 'Negar p'],
      c: 0, e: 'Afirmar p dá q (modus ponens). Negar q dá não p (modus tollens). Afirmar q ou negar p não garante nada.'
    },
    pares: [['afirma p', 'conclui q'], ['nega q', 'conclui não p'], ['afirma q', 'não conclui'], ['nega p', 'não conclui']],
    caderno: { regras: ['Modus ponens: p → q, p ⊢ q.', 'Modus tollens: p → q, ~q ⊢ ~p.', 'Falácias: afirmar o consequente e negar o antecedente.'], dica: 'Monte a corrente das condicionais e caminhe só no sentido da seta, ou ao contrário negando.' }
  },
  { // 7 Associação
    imersao: {
      exemplos: [['Pista: "Ana não tem gato"', '✗ na casa Ana–gato'], ['Ana só pode ter cão ou peixe; "Ana não tem peixe"', '✓ Ana–cão'], ['Ana tem o cão', '✗ no resto da linha e da coluna']],
      pergunta: 'Quando você marca um ✓, o que mais pode marcar na hora?',
      opcoes: ['✗ em todo o resto da linha e da coluna', 'Nada, só aquela casa', 'Outro ✓ na mesma linha'],
      c: 0, e: 'Cada pessoa tem uma só característica e cada característica é de uma só pessoa. Um ✓ elimina a linha e a coluna inteiras.'
    },
    pares: [['pista negativa', 'marque ✗'], ['sobrou uma opção', 'marque ✓'], ['um ✓', '✗ na linha e coluna'], ['comece por', 'pistas diretas']],
    caderno: { regras: ['Tabela: pessoas nas linhas, características nas colunas.', 'Pistas diretas primeiro; depois, as que dependem de outras.', 'Cada linha e cada coluna tem um único ✓.'], dica: 'Quando travar, procure a linha ou coluna com só uma casa livre.' }
  },
  { // 8 Sequências
    imersao: {
      exemplos: [['3, 6, 9, 12', '+3 a cada passo'], ['2, 4, 8, 16', '×2 a cada passo'], ['1, 4, 9, 16', 'quadrados: 1², 2², 3², 4²']],
      pergunta: 'Qual o primeiro teste para descobrir uma sequência?',
      opcoes: ['Ver a diferença entre vizinhos', 'Somar todos os termos', 'Olhar só o último termo'],
      c: 0, e: 'Comece pela diferença entre termos vizinhos. Se ela não for constante, teste multiplicação, quadrados ou um padrão nas próprias diferenças.'
    },
    pares: [['2, 5, 8, 11', '+3'], ['3, 9, 27', '×3'], ['1, 4, 9, 16', 'quadrados'], ['A, C, E, G', 'pula uma letra']],
    caderno: { regras: ['1º teste: diferença entre vizinhos.', '2º: multiplicação ou divisão.', '3º: quadrados, cubos e posição das letras (A = 1).', 'Sequência que se repete: use o resto da divisão.'], dica: 'Se as diferenças crescem 2, 4, 6…, o próximo salto segue o mesmo padrão.' }
  },
  { // 9 Casa dos pombos
    imersao: {
      exemplos: [['3 pessoas, 2 cores de camisa', 'pelo menos 2 com a mesma cor'], ['13 pessoas, 12 meses', 'pelo menos 2 no mesmo mês'], ['5 meias, 4 cores', 'pelo menos um par da mesma cor']],
      pergunta: 'Qual o padrão desses exemplos?',
      opcoes: ['Se há mais itens que caixas, alguma caixa repete', 'Sempre sobra uma caixa vazia', 'Cada caixa recebe o mesmo número'],
      c: 0, e: 'É o princípio da casa dos pombos: mais pombos do que casas obriga uma casa a ter dois.'
    },
    pares: [['12 meses', '13 pessoas'], ['7 dias da semana', '8 pessoas'], ['4 cores', '5 meias'], ['2 faces da moeda', '3 lançamentos']],
    caderno: { regras: ['Mais pombos que casas → alguma casa com 2.', 'Pior caso: distribua o máximo sem cumprir e some 1.'], dica: 'Pergunte: "qual o azar máximo?". A resposta é o azar máximo + 1.' }
  },
  { // 10 Datas
    imersao: {
      exemplos: [['Hoje é segunda. Daqui a 7 dias…', 'segunda'], ['Hoje é segunda. Daqui a 14 dias…', 'segunda'], ['Hoje é segunda. Daqui a 15 dias…', 'terça']],
      pergunta: 'O que decide o dia da semana depois de muitos dias?',
      opcoes: ['O resto da divisão por 7', 'O número de dias dividido por 2', 'O mês em que estamos'],
      c: 0, e: 'Cada 7 dias a semana se repete. Só o resto da divisão por 7 importa: 15 = 2 × 7 + 1, então anda 1 dia.'
    },
    pares: [['7 dias', 'mesmo dia'], ['8 dias', '+1 dia'], ['ano comum', '+1 dia da semana'], ['ano bissexto', '+2 dias da semana']],
    caderno: { regras: ['Divida os dias por 7 e use o resto.', 'Ano comum = 52 semanas + 1 dia.', 'Bissexto = 52 semanas + 2 dias (fevereiro com 29).'], dica: 'Conte o resto a partir do dia de hoje: resto 0 é o mesmo dia.' }
  }
];
