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
  },
  { // 11 Contando elementos
    imersao: {
      exemplos: [["n(A) = 5, n(B) = 4, nada em comum", "n(A ∪ B) = 9"], ["n(A) = 5, n(B) = 4, 1 em comum", "n(A ∪ B) = 8"], ["n(A) = 5, n(B) = 4, 3 em comum", "n(A ∪ B) = 6"]],
      pergunta: "O que acontece com a união quando a interseção cresce?",
      opcoes: ["Fica sempre igual a 9", "Aumenta junto com a interseção", "Diminui: a interseção é descontada uma vez"],
      c: 2, e: "n(A ∪ B) = n(A) + n(B) − n(A ∩ B). Quem está nos dois seria contado duas vezes; por isso se subtrai."
    },
    pares: [["n(A ∪ B)", "pelo menos um"], ["n(A ∩ B)", "os dois"], ["n(A) − n(A ∩ B)", "só A"], ["total − n(A ∪ B)", "nenhum"]],
    caderno: { regras: ["n(A ∪ B) = n(A) + n(B) − n(A ∩ B).", "Só A = n(A) − n(A ∩ B).", "Nenhum = total − n(A ∪ B)."], dica: "Comece o diagrama pelo centro (a interseção) e vá para fora." }
  },
  { // 12 Três conjuntos
    imersao: {
      exemplos: [["A ∩ B ∩ C", "o centro do diagrama"], ["A ∩ B, sem C", "a faixa entre A e B"], ["só A", "a parte de A sem os outros"]],
      pergunta: "Por onde se começa a preencher o diagrama de três conjuntos?",
      opcoes: ["Pelas partes de \"só\"", "Pelo centro, onde estão os três", "Pelo total de pessoas"],
      c: 1, e: "O centro faz parte de todas as interseções. Preenchido primeiro, ele permite descontar certo as faixas de dois e depois as de \"só\"."
    },
    pares: [["A ∩ B ∩ C", "os três"], ["complementar de A", "fora de A"], ["(A ∩ B) − C", "A e B, sem C"], ["A ∪ B ∪ C", "pelo menos um"]],
    caderno: { regras: ["n(A ∪ B ∪ C) = soma dos três − interseções de dois + os três.", "Preencha o diagrama do centro para fora.", "Complementar: tudo do universo que não está no conjunto."], dica: "Quando o enunciado diz \"exatamente dois\", ele não inclui quem está nos três." }
  },
  { // 13 Valor lógico dos conectivos
    imersao: {
      exemplos: [["V ou F", "V"], ["F ou V", "V"], ["V ou V", "V"], ["F ou F", "F"]],
      pergunta: "Quando o \"ou\" dá falso?",
      opcoes: ["Quando as duas são verdadeiras", "Só quando as duas partes são falsas", "Quando uma das partes é falsa"],
      c: 1, e: "O \"ou\" comum precisa de apenas uma parte verdadeira. Só dá F quando as duas são F."
    },
    pares: [["∧", "V só com V e V"], ["∨", "F só com F e F"], ["⊻", "V com exatamente uma V"], ["↔", "V com valores iguais"]],
    caderno: { regras: ["∧: V só se as duas forem V.", "∨: F só se as duas forem F.", "⊻: V se exatamente uma for V.", "→: F só em V → F.", "↔: V quando os valores são iguais."], dica: "Decore o único caso \"diferente\" de cada conectivo: é ele que a banca cobra." }
  },
  { // 14 Traduzindo frases para símbolos
    imersao: {
      exemplos: [["\"Se estudo, passo.\"", "e → p"], ["\"Passo se estudo.\"", "e → p"], ["\"Estudar é suficiente para passar.\"", "e → p"]],
      pergunta: "Nas três frases, o que fica antes da seta?",
      opcoes: ["Sempre a primeira palavra da frase", "A condição: o que vem depois do \"se\" ou o que é \"suficiente\"", "A consequência"],
      c: 1, e: "A ordem das palavras engana. Antes da seta vai a condição: o que vem depois do \"se\" ou o que é \"suficiente\"."
    },
    pares: [["nem p nem q", "~p ∧ ~q"], ["p, mas q", "p ∧ q"], ["q, se p", "p → q"], ["p somente se q", "p → q (somente se)"]],
    caderno: { regras: ["Nem p nem q: ~p ∧ ~q.", "Mas, embora, porém: valem \"e\".", "Suficiente vai antes da seta; necessário vai depois.", "\"p somente se q\" = p → q."], dica: "Reescreva a frase no formato \"Se…, então…\" antes de traduzir." }
  },
  { // 15 Descobrindo valores lógicos
    imersao: {
      exemplos: [["p → q é falsa", "p = V e q = F"], ["p ∧ q é verdadeira", "p = V e q = V"], ["p ∨ q é falsa", "p = F e q = F"]],
      pergunta: "O que esses três casos têm em comum?",
      opcoes: ["Cada um só acontece de um jeito", "São todos tautologias", "Todos dão sempre V"],
      c: 0, e: "São os casos \"travados\": cada um só acontece com uma combinação de valores. Comece por eles para descobrir o resto."
    },
    pares: [["p → q falsa", "p V e q F"], ["p ∧ q verdadeira", "p V e q V"], ["p ∨ q falsa", "p F e q F"], ["p ↔ q falsa", "valores diferentes"]],
    caderno: { regras: ["Condicional falsa: V → F.", "\"E\" verdadeiro: tudo V.", "\"Ou\" falso: tudo F.", "Comece pela informação que só tem um jeito de acontecer."], dica: "Anote o valor ao lado de cada letra e vá propagando, como num sudoku." }
  },
  { // 16 Equivalências da condicional
    imersao: {
      exemplos: [["Se chove, molha.", "Se não molhou, não choveu."], ["Se é ouro, brilha.", "Se não brilha, não é ouro."], ["Se passo, comemoro.", "Se não comemorei, não passei."]],
      pergunta: "O que foi feito para chegar às frases da direita?",
      opcoes: ["Só negou a primeira parte", "Trocou \"se\" por \"e\"", "Inverteu a ordem e negou as duas partes"],
      c: 2, e: "Essa é a contrapositiva (~q → ~p). Ela diz exatamente o mesmo que a condicional original."
    },
    pares: [["contrapositiva", "~q → ~p"], ["~p ∨ q", "equivale a p → q"], ["p ↔ q", "ida e volta"], ["recíproca", "q → p (não equivale)"]],
    caderno: { regras: ["p → q = ~q → ~p (contrapositiva).", "p → q = ~p ∨ q.", "p ↔ q = (p → q) ∧ (q → p).", "Recíproca e contrária não são equivalentes."], dica: "Contrapositiva: inverta e negue. Forma com \"ou\": negue a primeira e troque a seta por \"ou\"." }
  },
  { // 17 Negações difíceis
    imersao: {
      exemplos: [["Todo A é B", "Algum A não é B"], ["Algum A é B", "Nenhum A é B"], ["Nenhum A é B", "Algum A é B"]],
      pergunta: "Qual é o padrão dessas negações?",
      opcoes: ["Trocar sempre por \"todo\"", "Dizer o mínimo que derruba a frase original", "Trocar sempre por \"nenhum\""],
      c: 1, e: "Para negar, mostre o mínimo que derruba a frase: um contraexemplo derruba o \"todo\", e \"nenhum\" derruba o \"algum\"."
    },
    pares: [["~(p ∨ q)", "nem p nem q"], ["~(p ↔ q)", "ou p ou q"], ["negação de \"todo\"", "algum… não"], ["negação de \"algum\"", "nenhum"]],
    caderno: { regras: ["~(p ∨ q) = ~p ∧ ~q.", "~(p ↔ q) = p ⊻ q.", "~(p → q) = p ∧ ~q.", "Todo ↔ algum… não; algum ↔ nenhum."], dica: "A negação de \"todo\" nunca é \"nenhum\": essa é uma das pegadinhas favoritas das bancas." }
  },
  { // 18 Argumento válido ou falácia?
    imersao: {
      exemplos: [["p → q e p, logo q", "válido"], ["p → q e ~q, logo ~p", "válido"], ["p → q e q, logo p", "falácia"], ["p → q e ~p, logo ~q", "falácia"]],
      pergunta: "O que as duas falácias têm em comum?",
      opcoes: ["Confirmam a segunda parte ou negam a primeira", "Usam \"e\" em vez de \"se\"", "Têm conclusões sempre verdadeiras"],
      c: 0, e: "Só vale partir da primeira parte (modus ponens) ou negar a segunda (modus tollens). Confirmar q ou negar p não garante nada."
    },
    pares: [["modus ponens", "p → q, p, logo q"], ["modus tollens", "p → q, ~q, logo ~p"], ["afirmar o consequente", "falácia"], ["silogismo disjuntivo", "p ∨ q, ~p, logo q"]],
    caderno: { regras: ["Válidos: modus ponens, modus tollens, silogismo disjuntivo e silogismo hipotético.", "Falácias: afirmar o consequente e negar o antecedente.", "\"Algum\" no meio não liga as pontas do argumento."], dica: "Na dúvida, procure um contraexemplo: premissas verdadeiras e conclusão falsa. Achou? É inválido." }
  },
  { // 19 Verdades e mentiras
    imersao: {
      exemplos: [["\"Fui eu\" × \"Não foi ele\"", "uma V, outra F"], ["\"Choveu\" × \"Não choveu\"", "uma V, outra F"], ["\"Todos vieram\" × \"Alguém faltou\"", "uma V, outra F"]],
      pergunta: "O que acontece com duas frases contraditórias?",
      opcoes: ["As duas podem ser falsas", "As duas são verdadeiras", "Exatamente uma é verdadeira"],
      c: 2, e: "Uma é a negação da outra, então sempre uma é V e a outra é F. Isso destrava muitos problemas de verdade e mentira."
    },
    pares: [["sempre diz a verdade", "só frases V"], ["sempre mente", "só frases F"], ["frases contraditórias", "uma V, outra F"], ["\"Eu sou mentiroso\"", "ninguém pode dizer"]],
    caderno: { regras: ["Suponha um caso e procure contradição.", "Frases contraditórias: exatamente uma é verdadeira.", "\"Eu sou mentiroso\" não pode ser dito por ninguém."], dica: "Quando o enunciado diz \"só um fala a verdade\", procure duas frases contraditórias: a verdade está numa delas." }
  },
  { // 20 Associação com várias pistas
    imersao: {
      exemplos: [["Linha com ✗, ✗ e um espaço vazio", "o vazio vira ✓"], ["Coluna com um ✓", "o resto vira ✗"], ["Linha com ✗, vazio e ✗", "o do meio vira ✓"]],
      pergunta: "Qual é a regra da tabela?",
      opcoes: ["Cada linha e cada coluna tem um único ✓", "Uma linha pode ter vários ✓", "A tabela começa cheia de ✓"],
      c: 0, e: "Um único ✓ por linha e por coluna. Marcou um ✓? Preencha ✗ no resto da linha e da coluna."
    },
    pares: [["pista direta", "marca ✓"], ["pista negativa", "marca ✗"], ["sobrou uma opção", "vira ✓"], ["marcou ✓", "✗ no resto da linha"]],
    caderno: { regras: ["Pistas diretas primeiro, negativas depois.", "Um ✓ por linha e por coluna.", "A cada ✓, complete os ✗ e releia as pistas."], dica: "Pistas de comparação (\"mais novo que\", \"à esquerda de\") eliminam duas pessoas de uma vez: a das pontas." }
  },
  { // 21 Letras e ciclos
    imersao: {
      exemplos: [["7º termo de A, B, C, …", "resto 1: A"], ["8º termo de A, B, C, …", "resto 2: B"], ["9º termo de A, B, C, …", "resto 0: C"]],
      pergunta: "Como achar um termo distante de uma sequência que se repete?",
      opcoes: ["Usar o resto da divisão pelo tamanho do ciclo", "Escrever todos os termos", "Multiplicar a posição pelo ciclo"],
      c: 0, e: "O resto diz a posição dentro do bloco. Resto 0 é o último do bloco."
    },
    pares: [["A", "1ª letra"], ["J", "10ª letra"], ["T", "20ª letra"], ["Z", "26ª letra"]],
    caderno: { regras: ["Letras viram números: A = 1, …, Z = 26.", "Ciclos: use o resto da divisão pelo tamanho do bloco.", "Resto 0 = último do bloco."], dica: "Escreva o alfabeto numerado na margem da prova: economiza tempo e evita erro." }
  },
  { // 22 Sequências que dependem dos anteriores
    imersao: {
      exemplos: [["depois de 2, 3", "vem 5"], ["depois de 3, 5", "vem 8"], ["depois de 5, 8", "vem 13"]],
      pergunta: "Qual é a regra?",
      opcoes: ["Multiplica sempre por 2", "Soma sempre 2", "Cada termo é a soma dos dois anteriores"],
      c: 2, e: "É a sequência de Fibonacci. Nas provas ela aparece disfarçada, começando com outros números."
    },
    pares: [["Fibonacci", "soma dos dois anteriores"], ["multiplicação constante", "vezes o mesmo número"], ["intercalada", "duas regras alternadas"], ["diferença constante", "soma sempre o mesmo"]],
    caderno: { regras: ["Fibonacci: soma dos dois anteriores.", "Intercalada: separe posições ímpares e pares.", "Ordem de teste: diferença, multiplicação, soma dos anteriores, intercalada."], dica: "Se as diferenças entre os termos formam uma sequência conhecida, a resposta está nela." }
  },
  { // 23 Pior caso e anos bissextos
    imersao: {
      exemplos: [["garantir 2 iguais com 3 cores", "1 × 3 + 1 = 4"], ["garantir 3 iguais com 3 cores", "2 × 3 + 1 = 7"], ["garantir 4 iguais com 3 cores", "3 × 3 + 1 = 10"]],
      pergunta: "Qual é a regra para garantir k itens iguais?",
      opcoes: ["(k − 1) × número de tipos + 1", "número de tipos + k", "k × número de tipos"],
      c: 0, e: "No pior caso você pega (k − 1) de cada tipo sem completar k. A próxima retirada obriga a completar."
    },
    pares: [["ano comum", "data anda 1 dia"], ["ano bissexto", "data anda 2 dias"], ["1900", "não foi bissexto"], ["2000", "foi bissexto"]],
    caderno: { regras: ["Garantir k iguais: (k − 1) × tipos + 1.", "Bissexto: divisível por 4; se terminar em 00, só se for divisível por 400.", "A data anda 1 dia da semana em ano comum e 2 em ano bissexto."], dica: "Em problemas de \"garantir\", pense sempre no azar máximo: tudo dá errado até a última retirada." }
  }
];
