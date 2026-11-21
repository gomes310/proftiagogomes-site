// Conteúdo da trilha: unidades e lições (portado da versão 1).
import type { Unidade, Licao, Extra } from './tipos';
export const UNIDADES: Unidade[] = [
    { id: "conjuntos", nome: "Conjuntos", desc: "União, interseção, Venn e contagem", selo: "Mestre dos conjuntos", licoes: [0, 11, 12], niveis: [[0], [11], [12]], temas: [], cor: { p: "#2F5BD3", e: "#1D3A8F", c: "#E3EAFC" } },
    { id: "proposicoes", nome: "Proposições e conectivos", desc: "A linguagem da lógica", selo: "Lógico de carteirinha", licoes: [1, 24, 25, 13, 26, 14], niveis: [[1, 24], [25, 13], [26, 14]], temas: ["Proposições e conectivos"], cor: { p: "#7442C8", e: "#4E2690", c: "#EEE6FA" } },
    { id: "tabela", nome: "Tabela-verdade", desc: "Valores lógicos, tautologia e contradição", selo: "Rei da tabela", licoes: [2, 4, 15], niveis: [[2], [4], [15]], temas: ["Tabela-verdade", "Tautologia, contradição e contingência", "Ordem de precedência dos conectivos"], cor: { p: "#0F766E", e: "#0A4F4A", c: "#DDF3F0" } },
    { id: "equivalencias", nome: "Equivalências e negações", desc: "Dizer o mesmo de outro jeito e negar certo", selo: "Sem pegadinha", licoes: [3, 16, 17], niveis: [[3], [16], [17]], temas: ["Equivalências e negações"], cor: { p: "#B02A6B", e: "#7A1A4A", c: "#FBE4EF" } },
    { id: "argumentos", nome: "Argumentos e diagramas", desc: "Conclusões que valem e as que não valem", selo: "Argumentador", licoes: [5, 6, 18], niveis: [[5], [6], [18]], temas: [], cor: { p: "#4D7C0F", e: "#335309", c: "#EAF3D9" } },
    { id: "associacao", nome: "Associação, verdades e mentiras", desc: "Tabelas, pistas e quem está mentindo", selo: "Detetive lógico", licoes: [7, 19, 20], niveis: [[7], [19], [20]], temas: ["Verdades e mentiras"], cor: { p: "#C2410C", e: "#8A2C06", c: "#FDE8DC" } },
    { id: "sequencias", nome: "Sequências lógicas", desc: "Números, letras e padrões", selo: "Caçador de padrões", licoes: [8, 21, 22], niveis: [[8], [21], [22]], temas: ["Sequências lógicas"], cor: { p: "#0A6E8C", e: "#064A5F", c: "#DDF0F6" } },
    { id: "pombos", nome: "Casa dos pombos e calendários", desc: "Pior caso, datas e dias da semana", selo: "Mestre do calendário", licoes: [9, 10, 23], niveis: [[9], [10], [23]], temas: ["Princípio da casa dos pombos", "Datas e calendários"], cor: { p: "#96580A", e: "#663B05", c: "#F8ECD9" } }
  ];
// variáveis CSS com as cores do tema (para usar em style={...})
export const varsTema = (t: number) => { const c = UNIDADES[t].cor; return { '--u': c.p, '--u-escuro': c.e, '--u-claro': c.c } as React.CSSProperties; };
export const NOMES_NIVEL = ['Básico', 'Intermediário', 'Avançado', 'Prova'] as const;

export const LICOES: Licao[] = [
    { titulo: 'Conjuntos', teoria: ['Conjunto é uma coleção de elementos, escrita entre chaves: {1, 2, 3}.', 'União (∪) junta tudo; interseção (∩) fica só com o que é comum; diferença (A − B) fica com o que é de A e não é de B.', 'Um conjunto com n elementos tem 2ⁿ subconjuntos.'],
      exemplo: 'A = {1, 2, 3, 4} e B = {3, 4, 5}: A ∩ B = {3, 4}, A ∪ B = {1, 2, 3, 4, 5} e A − B = {1, 2}.',
      questoes: [
        { p: 'Se A = {1, 2, 3, 4} e B = {3, 4, 5}, quanto é A ∩ B?', o: ['{3, 4}', '{1, 2, 3, 4, 5}', '{1, 2}', '{5}'], c: 0, e: 'A interseção fica só com os elementos que estão nos dois conjuntos: 3 e 4.' },
        { p: 'Com os mesmos A e B, quanto é A ∪ B?', o: ['{3, 4}', '{1, 2, 5}', '{1, 2, 3, 4, 5}', '{1, 2}'], c: 2, e: 'A união junta todos os elementos, sem repetir: 1, 2, 3, 4 e 5.' },
        { p: 'Quantos subconjuntos tem o conjunto {a, b, c}?', o: ['3', '6', '8', '9'], c: 2, e: 'São 3 elementos, então 2³ = 8 subconjuntos (contando o vazio e o próprio conjunto).' }
      ] },
    { titulo: "O que é proposição", teoria: ["Proposição é uma oração declarativa (tem verbo), afirmativa ou negativa, que admite um valor lógico: verdadeiro (V) ou falso (F).", "Não são proposições: perguntas, exclamações, ordens, frases sem verbo, sentenças abertas e paradoxos.", "Frase falsa ou negativa continua sendo proposição: \"2 × 2 = 6\" é proposição (falsa) e \"Arthur não dirige\" também é."],
      exemplo: "Banca IBFC: entre \"Façam silêncio.\", \"Que cansaço!\", \"Onde está meu chaveiro?\", \"Um belo exemplo de vida.\" e \"Ainda é cedo.\", só a última é proposição.",
      questoes: [
        { p: "(Banca IBFC) Qual destas é uma proposição?", o: ["Que cansaço!", "Um belo exemplo de vida.", "Façam silêncio.", "Ainda é cedo.", "Onde está meu chaveiro?"], c: 3, e: "\"Ainda é cedo\" é declarativa e pode ser julgada V ou F. As outras são, nesta ordem: ordem, exclamação, pergunta e frase sem verbo." },
        { p: "(Banca QUADRIX) Julgue: a frase \"Que beleza!\" é um exemplo de proposição.", o: ["Certo", "Errado"], c: 1, e: "É uma exclamação: não dá para julgar como verdadeira ou falsa." },
        { p: "(Banca FUNDATEC) São exemplos de proposições: I. 2 × 2 = 6. II. X + 2 = 0. III. W + Z = Y.", o: ["Apenas I.", "Apenas II.", "Apenas III.", "Apenas I e III.", "I, II e III."], c: 0, e: "Só a I pode ser julgada (é falsa, mas é proposição). II e III têm letras sem valor: são sentenças abertas." },
        { p: "(Banca FUNDATEC) Qual destas NÃO é uma proposição?", o: ["Não temos café?", "Argentina fica na América do Sul.", "O número 2 é maior que o número 5.", "Arthur não dirige.", "Carlos não come salada."], c: 0, e: "É uma pergunta. Frases negativas, como \"Arthur não dirige\", continuam sendo proposições." }
      ] },
    { titulo: 'Tabela-verdade', teoria: ['A tabela mostra o valor da proposição composta em todas as combinações de V e F.', 'Com n proposições simples, a tabela tem 2ⁿ linhas.', 'Regra mais cobrada: p → q só é falsa quando p é V e q é F.'],
      exemplo: '"Se 2 + 2 = 5, então a Lua é de queijo" é verdadeira: uma condicional que começa com F é sempre verdadeira.',
      questoes: [
        { p: 'Quantas linhas tem a tabela-verdade de uma proposição com 3 proposições simples?', o: ['3', '6', '8', '9'], c: 2, e: '2³ = 8 linhas.' },
        { p: 'Quando p → q é falsa?', o: ['p V e q F', 'p F e q V', 'p e q falsas', 'p e q verdadeiras'], c: 0, e: 'É o único caso falso da condicional: a primeira parte verdadeira e a segunda falsa.' },
        { p: 'Se p é V e q é F, qual o valor de p ∧ q?', o: ['V', 'F'], c: 1, e: 'A conjunção só é verdadeira quando as duas partes são verdadeiras.' }
      ] },
    { titulo: 'Equivalências e negações', teoria: ['Negar "e" vira "ou" (e vice-versa), negando as duas partes: ~(p ∧ q) = ~p ∨ ~q.', 'Negar a condicional: ~(p → q) = p ∧ ~q.', 'Equivalentes da condicional: p → q = ~q → ~p = ~p ∨ q.'],
      exemplo: 'A negação de "Se eu estudo, então eu passo" é "Eu estudo e não passo".',
      questoes: [
        { p: 'Qual é a negação de "Estudo e trabalho"?', o: ['Não estudo e não trabalho', 'Não estudo ou não trabalho', 'Estudo ou trabalho', 'Não estudo e trabalho'], c: 1, e: 'Nega as duas partes e troca o "e" por "ou".' },
        { p: 'Qual é a negação de "Se estudo, então passo"?', o: ['Se não estudo, então não passo', 'Não estudo e passo', 'Estudo e não passo', 'Se passo, então estudo'], c: 2, e: 'Mantém a primeira parte, troca por "e" e nega a segunda: p ∧ ~q.' },
        { p: 'Qual frase é equivalente a "Se chove, a rua molha"?', o: ['Se a rua molha, então chove', 'Se a rua não molha, então não chove', 'Se não chove, a rua não molha', 'Chove e a rua não molha'], c: 1, e: 'É a contrapositiva: inverte e nega as duas partes (~q → ~p).' }
      ] },
    { titulo: 'Tautologia', teoria: ['Tautologia: a última coluna da tabela é toda V, como p ∨ ~p.', 'Contradição: a última coluna é toda F, como p ∧ ~p.', 'Contingência: a última coluna tem V e F.'],
      exemplo: '"Ou chove ou não chove" (p ∨ ~p) é sempre verdadeira: é tautologia.',
      questoes: [
        { p: 'A proposição p ∨ ~p é:', o: ['tautologia', 'contradição', 'contingência'], c: 0, e: 'Uma das duas partes é sempre verdadeira, então o "ou" é sempre V.' },
        { p: 'A proposição p ∧ ~p é:', o: ['tautologia', 'contradição', 'contingência'], c: 1, e: 'p e ~p nunca são verdadeiras ao mesmo tempo, então o "e" é sempre F.' },
        { p: 'A proposição p ∧ q é:', o: ['tautologia', 'contradição', 'contingência'], c: 2, e: 'É V quando as duas são V e F nos outros casos: tem V e F, então é contingência.' }
      ] },
    { titulo: 'Diagramas lógicos', teoria: ['Frases com todo, algum e nenhum viram círculos: "Todo A é B" põe o círculo A dentro de B.', 'A negação de "Todo A é B" é "Algum A não é B".', 'A negação de "Nenhum A é B" é "Algum A é B".'],
      exemplo: '"Todo médico é responsável" e "Paulo é médico": então Paulo é responsável.',
      questoes: [
        { p: 'Qual é a negação de "Todo gato é preto"?', o: ['Nenhum gato é preto', 'Algum gato não é preto', 'Todo gato não é preto', 'Algum gato é preto'], c: 1, e: 'Para negar "todo", basta um exemplo contrário: algum gato não é preto.' },
        { p: '"Todo médico é responsável" e "Paulo é médico". Conclui-se que:', o: ['Paulo é responsável', 'Todo responsável é médico', 'Paulo não é responsável', 'Nada se pode concluir'], c: 0, e: 'Paulo está no círculo dos médicos, que fica dentro do círculo dos responsáveis.' },
        { p: 'Qual é a negação de "Nenhum aluno faltou"?', o: ['Todo aluno faltou', 'Algum aluno não faltou', 'Algum aluno faltou', 'Nenhum aluno compareceu'], c: 2, e: 'Basta um aluno ter faltado para a frase original ser falsa.' }
      ] },
    { titulo: 'Implicações lógicas', teoria: ['Modus ponens: de "p → q" e "p", conclui-se "q".', 'Modus tollens: de "p → q" e "não q", conclui-se "não p".', 'Cuidado: de "p → q" e "q", não dá para concluir "p".'],
      exemplo: '"Se chove, a rua fica molhada. A rua não está molhada." Logo, não choveu.',
      questoes: [
        { p: 'Se "p → q" e "p" são verdadeiras, o que se conclui?', o: ['q', 'não q', 'não p', 'nada'], c: 0, e: 'É o modus ponens: a condição aconteceu, então a consequência acontece.' },
        { p: '"Se chove, a rua molha. A rua não está molhada." Conclusão válida:', o: ['Choveu', 'Não choveu', 'A rua molhou', 'Nada se conclui'], c: 1, e: 'É o modus tollens: se tivesse chovido, a rua estaria molhada.' },
        { p: '"Se estudo, passo. Passei." Dá para concluir que estudei?', o: ['Sim', 'Não'], c: 1, e: 'Dá para passar por outro motivo. Concluir "estudei" é a falácia de afirmar o consequente.' }
      ] },
    { titulo: 'Associação de informações', teoria: ['Monte uma tabela: pessoas nas linhas, características nas colunas.', 'Marque ✓ e ✗ a cada pista, começando pelas diretas.', 'Cada linha e cada coluna tem um único ✓.'],
      exemplo: 'Ana, Bia e Caio têm carro, moto e bicicleta. Ana não tem carro nem moto; Caio não tem carro. Logo: Ana tem a bicicleta, Caio a moto e Bia o carro.',
      questoes: [
        { p: 'No exemplo acima, quem tem a moto?', o: ['Ana', 'Bia', 'Caio'], c: 2, e: 'Ana ficou com a bicicleta e Caio não tem carro, então Caio tem a moto.' },
        { p: 'Qual é o jeito mais seguro de resolver uma associação?', o: ['Chutar e testar', 'Tabela marcando ✓ e ✗', 'Decorar fórmulas'], c: 1, e: 'A tabela mostra o que já foi descartado e evita erro de memória.' },
        { p: 'Davi, Eva e Fábio comem maçã, uva e pera. Eva não come maçã nem uva; Davi não come uva. Quem come uva?', o: ['Davi', 'Eva', 'Fábio'], c: 2, e: 'Eva come pera. Davi não come uva, então come maçã. Sobra a uva para Fábio.' }
      ] },
    { titulo: 'Sequências lógicas', teoria: ['Olhe primeiro a diferença entre termos vizinhos.', 'Se não der, teste multiplicação, quadrados e a posição das letras no alfabeto.', 'Em sequências que se repetem, use o resto da divisão para achar um termo distante.'],
      exemplo: '2, 5, 10, 17, 26: as diferenças são 3, 5, 7, 9. A próxima é 11, então o próximo termo é 37.',
      questoes: [
        { p: 'Qual é o próximo termo de 2, 5, 10, 17, 26, …?', o: ['35', '36', '37', '39'], c: 2, e: 'As diferenças crescem de 2 em 2: +3, +5, +7, +9, +11. 26 + 11 = 37.' },
        { p: 'Qual é o próximo termo de 3, 6, 12, 24, …?', o: ['27', '30', '36', '48'], c: 3, e: 'Cada termo é o dobro do anterior: 24 × 2 = 48.' },
        { p: 'Qual é a próxima letra de A, C, E, G, …?', o: ['H', 'I', 'J', 'K'], c: 1, e: 'Pula uma letra a cada passo: A (b) C (d) E (f) G (h) I.' }
      ] },
    { titulo: 'Casa dos pombos', teoria: ['Se há mais pombos do que casas, pelo menos uma casa fica com dois.', 'Pense no pior caso: distribua o máximo sem cumprir a condição e some 1.'],
      exemplo: 'Para garantir duas pessoas nascidas no mesmo mês: 12 podem nascer em meses diferentes; a 13ª força a repetição.',
      questoes: [
        { p: 'Quantas pessoas, no mínimo, garantem duas nascidas no mesmo mês?', o: ['2', '12', '13', '24'], c: 2, e: 'São 12 meses (casas). Com 13 pessoas (pombos), algum mês se repete.' },
        { p: 'Uma gaveta tem meias pretas e brancas misturadas. Quantas tirar, no escuro, para garantir um par da mesma cor?', o: ['2', '3', '4', '5'], c: 1, e: 'No pior caso, as duas primeiras são de cores diferentes. A terceira forma par com uma delas.' },
        { p: 'Com 6 pombos em 5 casas, o que é garantido?', o: ['Todas as casas têm 2 pombos', 'Alguma casa fica vazia', 'Pelo menos uma casa tem 2 pombos', 'Cada casa tem 1 pombo'], c: 2, e: 'Mesmo distribuindo um em cada casa, sobra um pombo para dividir casa.' }
      ] },
    { titulo: 'Datas e calendários', teoria: ['A semana se repete a cada 7 dias: divida o número de dias por 7 e use o resto.', 'Ano comum: 365 dias = 52 semanas + 1 dia. Bissexto: 366 dias.'],
      exemplo: 'Hoje é sábado. Daqui a 829 dias: 829 ÷ 7 dá resto 3. Três dias depois de sábado é terça.',
      questoes: [
        { p: 'Hoje é sábado. Que dia será daqui a 829 dias?', o: ['Domingo', 'Segunda', 'Terça', 'Quarta'], c: 2, e: '829 = 7 × 118 + 3. Andando 3 dias a partir de sábado: domingo, segunda, terça.' },
        { p: 'Hoje é segunda. Que dia será daqui a 365 dias (ano comum)?', o: ['Segunda', 'Terça', 'Quarta', 'Domingo'], c: 1, e: '365 = 52 semanas + 1 dia. Um dia depois de segunda é terça.' },
        { p: 'Hoje é quinta. Que dia será daqui a 14 dias?', o: ['Quarta', 'Quinta', 'Sexta', 'Sábado'], c: 1, e: '14 é múltiplo de 7: o resto é 0, então cai no mesmo dia da semana.' }
      ] },
    { titulo: "Contando elementos", teoria: ["n(A) é o número de elementos do conjunto A.", "n(A ∪ B) = n(A) + n(B) − n(A ∩ B): subtrai a interseção porque ela foi contada duas vezes.", "No diagrama de Venn, preencha primeiro a interseção e depois as partes \"só A\" e \"só B\"."],
      exemplo: "Numa turma, 20 gostam de lógica, 15 de matemática e 8 das duas. Gostam de pelo menos uma: 20 + 15 − 8 = 27.",
      questoes: [
        { p: "Em um grupo, 30 pessoas leem jornal, 25 leem revista e 10 leem os dois. Quantas leem pelo menos um?", o: ["35", "40", "45", "55"], c: 2, e: "30 + 25 − 10 = 45. Os 10 que leem os dois tinham sido contados duas vezes." },
        { p: "n(A) = 12, n(B) = 9 e n(A ∪ B) = 17. Quanto vale n(A ∩ B)?", o: ["3", "21", "5", "4"], c: 3, e: "12 + 9 − n(A ∩ B) = 17, então n(A ∩ B) = 4." },
        { p: "Numa pesquisa com 50 pessoas, 28 usam o app X, 20 usam o Y e 7 usam os dois. Quantas não usam nenhum?", o: ["9", "2", "16", "41"], c: 0, e: "Usam pelo menos um: 28 + 20 − 7 = 41. Não usam nenhum: 50 − 41 = 9." },
        { p: "A tem 18 elementos e 10 deles também estão em B. Quantos estão só em A?", o: ["18", "28", "8", "10"], c: 2, e: "Só A = n(A) − n(A ∩ B) = 18 − 10 = 8." }
      ] },
    { titulo: "Três conjuntos", teoria: ["Com três conjuntos: n(A ∪ B ∪ C) = n(A) + n(B) + n(C) − n(A ∩ B) − n(A ∩ C) − n(B ∩ C) + n(A ∩ B ∩ C).", "No diagrama, preencha primeiro o centro (os três), depois as faixas de dois e por último as partes de \"só\".", "O complementar de A é tudo o que está no universo e não está em A."],
      exemplo: "Se 10 gostam de A, 8 de B, 6 de C, 3 de A e B, 2 de A e C, 2 de B e C e 1 dos três: 10 + 8 + 6 − 3 − 2 − 2 + 1 = 18 gostam de pelo menos um.",
      questoes: [
        { p: "n(A) = 15, n(B) = 12, n(C) = 10, n(A ∩ B) = 5, n(A ∩ C) = 4, n(B ∩ C) = 3 e n(A ∩ B ∩ C) = 2. Quanto é n(A ∪ B ∪ C)?", o: ["37", "29", "25", "27"], c: 3, e: "15 + 12 + 10 − 5 − 4 − 3 + 2 = 27." },
        { p: "n(A ∩ B) = 5 e n(A ∩ B ∩ C) = 2. Quantos estão em A e em B, mas não em C?", o: ["3", "5", "7", "2"], c: 0, e: "Da interseção de A e B, tire os que também estão em C: 5 − 2 = 3." },
        { p: "O universo é {1, 2, …, 10} e A = {2, 4, 6, 8, 10}. Quantos elementos tem o complementar de A?", o: ["5", "4", "6", "10"], c: 0, e: "O complementar é {1, 3, 5, 7, 9}: 5 elementos." },
        { p: "Num diagrama de três conjuntos: só A = 4, só B = 3, só C = 5, exatamente dois = 6 e os três = 2. Quantos elementos há ao todo?", o: ["20", "14", "18", "22"], c: 0, e: "As regiões não se sobrepõem, então basta somar: 4 + 3 + 5 + 6 + 2 = 20." }
      ] },
    { titulo: "Valor lógico dos conectivos", teoria: ["p ∧ q (\"e\") só é verdadeira quando as duas são verdadeiras.", "p ∨ q (\"ou\") só é falsa quando as duas são falsas. p ⊻ q (\"ou… ou…\") é verdadeira quando exatamente uma é verdadeira.", "p → q só é falsa no caso V → F. p ↔ q é verdadeira quando as duas têm o mesmo valor."],
      exemplo: "p: \"2 é par\" (V); q: \"3 é par\" (F). Então p ∧ q é F, p ∨ q é V, p → q é F e q → p é V.",
      questoes: [
        { p: "p é verdadeira e q é falsa. Qual destas é verdadeira?", o: ["p ↔ q", "p → q", "p ∧ q", "p ∨ q"], c: 3, e: "O \"ou\" precisa de uma só verdadeira. O \"e\" precisa das duas, a condicional falha em V → F e o bicondicional exige valores iguais." },
        { p: "p e q são verdadeiras. Quanto vale p ⊻ q (\"ou p ou q\")?", o: ["Não é proposição", "V", "F", "Depende do assunto"], c: 2, e: "O \"ou… ou…\" exige exatamente uma verdadeira. Com as duas verdadeiras, dá F." },
        { p: "Qual conectivo dá falso apenas quando a primeira parte é V e a segunda é F?", o: ["↔", "∨", "∧", "→"], c: 3, e: "É a condicional: só o caso V → F é falso." },
        { p: "p é falsa e q é falsa. Quanto vale p ↔ q?", o: ["V", "Depende de p", "F", "Não dá para saber"], c: 0, e: "O bicondicional é verdadeiro quando os valores são iguais, e F e F são iguais." }
      ] },
    { titulo: "Traduzindo frases para símbolos", teoria: ["\"Nem p nem q\" vira ~p ∧ ~q.", "\"p, mas q\", \"p, embora q\" e \"p, porém q\" viram p ∧ q.", "\"q, se p\", \"p é suficiente para q\", \"q é necessário para p\" e \"p somente se q\" viram p → q."],
      exemplo: "\"Vou à praia se fizer sol\" vira \"Se faz sol, então vou à praia\": s → p.",
      questoes: [
        { p: "p: \"Ana estuda\"; q: \"Ana trabalha\". Como fica \"Ana não estuda nem trabalha\"?", o: ["~p ∧ ~q", "~p ∨ ~q", "~(p ∧ q)", "p ∧ ~q"], c: 0, e: "\"Nem… nem…\" nega as duas partes ao mesmo tempo: ~p ∧ ~q." },
        { p: "\"Passo no concurso se estudar.\" Com e: \"estudo\" e c: \"passo\", a tradução é:", o: ["e ↔ c", "e ∧ c", "c → e", "e → c"], c: 3, e: "O que vem depois do \"se\" é a condição e vai antes da seta: e → c." },
        { p: "\"Ser aprovado é necessário para tomar posse.\" Com a: \"é aprovado\" e t: \"toma posse\":", o: ["t → a", "a → t", "a ∧ t", "~a → t"], c: 0, e: "O necessário fica depois da seta: se tomou posse, então foi aprovado." },
        { p: "\"Chove, mas não faz frio.\" Com c: \"chove\" e f: \"faz frio\":", o: ["c ∧ ~f", "c ∨ ~f", "c → ~f", "~c ∧ f"], c: 0, e: "\"Mas\" tem valor de \"e\": chove e não faz frio." }
      ] },
    { titulo: "Descobrindo valores lógicos", teoria: ["Quando o enunciado diz que uma proposição composta é verdadeira ou falsa, procure o caso que obriga os valores.", "Condicional falsa: antecedente V e consequente F. \"E\" verdadeiro: as duas V. \"Ou\" falso: as duas F.", "Comece pela informação que só tem um jeito de acontecer e vá propagando os valores."],
      exemplo: "\"Se Ana viaja, Beto fica\" é falsa. Então Ana viaja (V) e Beto não fica (F).",
      questoes: [
        { p: "A proposição \"Se chove, o jogo é adiado\" é falsa. Então:", o: ["Choveu e o jogo foi adiado", "Não choveu e o jogo não foi adiado", "Choveu e o jogo não foi adiado", "Não choveu e o jogo foi adiado"], c: 2, e: "A condicional só é falsa em V → F: choveu (V) e o jogo não foi adiado (F)." },
        { p: "\"Rui é médico ou Lia é advogada\" é falsa. Então:", o: ["Rui é médico e Lia não é advogada", "Rui não é médico e Lia não é advogada", "Rui não é médico e Lia é advogada", "Nada se pode concluir"], c: 1, e: "O \"ou\" só é falso quando as duas partes são falsas." },
        { p: "p ∧ q é verdadeira e q → r é falsa. Qual é o valor de r?", o: ["Pode ser V ou F", "F", "V", "Não existe"], c: 1, e: "Pelo \"e\", q é V. Para q → r ser falsa, é preciso V → F, então r é F." },
        { p: "Quantas linhas tem a tabela-verdade de (p ∧ q) → (r ∨ s)?", o: ["16", "32", "8", "4"], c: 0, e: "São 4 proposições simples (p, q, r, s): 2⁴ = 16 linhas." }
      ] },
    { titulo: "Equivalências da condicional", teoria: ["p → q é equivalente à contrapositiva ~q → ~p: inverte a ordem e nega as duas partes.", "p → q também é equivalente a ~p ∨ q (\"não p ou q\").", "Cuidado: a recíproca (q → p) e a contrária (~p → ~q) não são equivalentes a p → q."],
      exemplo: "\"Se estudo, passo\" é o mesmo que \"Se não passei, não estudei\" e o mesmo que \"Não estudo ou passo\".",
      questoes: [
        { p: "Qual é equivalente a \"Se Ana é juíza, então Ana é formada em Direito\"?", o: ["Ana é juíza e é formada em Direito", "Se Ana não é formada em Direito, então não é juíza", "Se Ana é formada em Direito, então é juíza", "Se Ana não é juíza, então não é formada em Direito"], c: 1, e: "É a contrapositiva: inverte a ordem e nega as duas partes." },
        { p: "\"Se chove, levo guarda-chuva\" é equivalente a:", o: ["Chove e levo guarda-chuva", "Chove ou não levo guarda-chuva", "Se levo guarda-chuva, então chove", "Não chove ou levo guarda-chuva"], c: 3, e: "p → q = ~p ∨ q: nega a primeira e troca a seta por \"ou\"." },
        { p: "\"Não estudo ou passo\" é equivalente a:", o: ["Se passo, estudo", "Se não estudo, não passo", "Se estudo, passo", "Estudo e não passo"], c: 2, e: "~p ∨ q volta a ser p → q: \"Se estudo, passo\"." },
        { p: "p ↔ q é equivalente a:", o: ["(p → q) ∧ (q → p)", "p ∧ q", "~p ∨ q", "(p → q) ∨ (q → p)"], c: 0, e: "O \"se e somente se\" é uma condicional de ida e outra de volta, ligadas por \"e\"." }
      ] },
    { titulo: "Negações difíceis", teoria: ["~(p ∨ q) = ~p ∧ ~q: a negação de \"ou\" é \"nem… nem…\".", "~(p ↔ q) = p ⊻ q: negar o \"se e somente se\" vira \"ou… ou…\".", "Negar quantificadores: \"todo\" vira \"algum… não\"; \"algum\" vira \"nenhum\"; \"nenhum\" vira \"algum\"."],
      exemplo: "A negação de \"Todo servidor é pontual\" é \"Algum servidor não é pontual\".",
      questoes: [
        { p: "A negação de \"Vou ao cinema ou ao teatro\" é:", o: ["Não vou ao cinema nem ao teatro", "Se não vou ao cinema, vou ao teatro", "Vou ao cinema e ao teatro", "Não vou ao cinema ou não vou ao teatro"], c: 0, e: "Negar \"ou\" vira \"e\", negando as duas partes: não vou a nenhum dos dois." },
        { p: "A negação de \"Algum candidato foi aprovado\" é:", o: ["Todo candidato foi aprovado", "Nenhum candidato foi aprovado", "Algum candidato não foi aprovado", "Só um candidato foi aprovado"], c: 1, e: "Para negar \"algum\", é preciso dizer que nenhum foi." },
        { p: "A negação de \"Ana casa se, e somente se, Beto aceita\" é:", o: ["Ou Ana casa ou Beto aceita", "Ana não casa e Beto não aceita", "Ana casa e Beto aceita", "Se Ana casa, Beto não aceita"], c: 0, e: "~(p ↔ q) = p ⊻ q: exatamente uma das duas acontece." },
        { p: "A negação de \"Se estudo, não durmo\" é:", o: ["Estudo e durmo", "Não estudo e durmo", "Se não estudo, durmo", "Estudo ou durmo"], c: 0, e: "Negar a condicional: mantém a primeira parte e nega a segunda. A negação de \"não durmo\" é \"durmo\"." }
      ] },
    { titulo: "Argumento válido ou falácia?", teoria: ["Um argumento é válido quando, se as premissas forem verdadeiras, a conclusão é obrigatoriamente verdadeira.", "Falácias clássicas: afirmar o consequente (p → q e q, logo p) e negar o antecedente (p → q e ~p, logo ~q).", "Silogismo disjuntivo: de \"p ou q\" e \"não p\", conclui-se q. Silogismo hipotético: p → q e q → r dão p → r."],
      exemplo: "\"Se chove, molha. Não choveu. Logo, não molhou.\" É falácia: pode ter molhado por outro motivo.",
      questoes: [
        { p: "\"Se Rui estuda, passa. Rui passou. Logo, Rui estudou.\" O argumento é:", o: ["Inválido: afirma o consequente", "Inválido: nega o consequente", "Válido: modus ponens", "Válido: modus tollens"], c: 0, e: "Rui pode ter passado por outro motivo. Confirmar a consequência não prova a causa." },
        { p: "\"Ou Lia vai de ônibus ou de metrô. Lia não foi de ônibus.\" Conclui-se:", o: ["Lia foi a pé", "Lia não foi de metrô", "Lia foi de metrô", "Nada se conclui"], c: 2, e: "Silogismo disjuntivo: eliminada uma opção, sobra a outra." },
        { p: "\"Todo fiscal é concursado. Algum concursado é paulista.\" Qual conclusão é garantida?", o: ["Algum fiscal é paulista", "Todo paulista é fiscal", "Nenhum fiscal é paulista", "Nenhuma das outras é garantida"], c: 3, e: "O concursado paulista pode não ser fiscal. No diagrama, o círculo dos paulistas pode tocar o dos concursados fora do círculo dos fiscais." },
        { p: "\"Se Ana é chefe, Beto é diretor. Se Beto é diretor, Caio é gerente. Ana é chefe.\" Conclui-se:", o: ["Beto não é diretor", "Caio não é gerente", "Caio é gerente", "Ana não é chefe"], c: 2, e: "Encadeando: Ana é chefe, então Beto é diretor, então Caio é gerente." }
      ] },
    { titulo: "Verdades e mentiras", teoria: ["Quem sempre fala a verdade só diz frases verdadeiras; quem sempre mente só diz frases falsas.", "Teste uma hipótese por vez: suponha que alguém diz a verdade e veja se aparece contradição.", "Duas frases contraditórias (uma nega a outra) têm valores opostos: exatamente uma é verdadeira."],
      exemplo: "A diz: \"B mente\". B diz: \"A e eu dizemos a verdade\". Se B dissesse a verdade, A também diria, e A afirma que B mente: contradição. Logo B mente e A diz a verdade.",
      questoes: [
        { p: "Ana diz: \"Eu sou mentirosa.\" Quem pode dizer essa frase?", o: ["Qualquer pessoa", "Só quem sempre diz a verdade", "Só quem sempre mente", "Ninguém: nem quem sempre diz a verdade nem quem sempre mente"], c: 3, e: "Se Ana sempre dissesse a verdade, a frase seria falsa; se sempre mentisse, a frase seria verdadeira. As duas hipóteses dão contradição." },
        { p: "Um deles quebrou o vaso. Ana: \"Foi o Beto.\" Beto: \"Não fui eu.\" Caio: \"Não fui eu.\" Só um dos três diz a verdade. Quem quebrou?", o: ["Caio", "Beto", "Ana", "Não dá para saber"], c: 0, e: "Teste cada um. Só com Caio culpado há exatamente uma frase verdadeira (a do Beto)." },
        { p: "Na ilha, uns sempre dizem a verdade e outros sempre mentem. Pedro diz: \"Eu e João somos mentirosos.\" O que se conclui?", o: ["Os dois dizem a verdade", "Os dois mentem", "Pedro diz a verdade e João mente", "Pedro mente e João diz a verdade"], c: 3, e: "Se Pedro dissesse a verdade, ele seria mentiroso: impossível. Então Pedro mente, e a frase é falsa: os dois não são mentirosos, logo João diz a verdade." },
        { p: "A diz: \"B diz a verdade.\" B diz: \"A e eu somos de tipos diferentes.\" O que se conclui?", o: ["A mente e B diz a verdade", "Os dois mentem", "Os dois dizem a verdade", "A diz a verdade e B mente"], c: 1, e: "Se A dissesse a verdade, B também diria, mas aí os dois seriam do mesmo tipo e a frase de B seria falsa. Então A mente, B também mente, e de fato são do mesmo tipo." }
      ] },
    { titulo: "Associação com várias pistas", teoria: ["Monte a tabela com tudo o que precisa ser ligado: pessoas × profissões, pessoas × cidades.", "Use as pistas negativas para marcar ✗. Quando sobrar uma só opção numa linha ou coluna, marque ✓.", "A cada ✓ novo, releia as pistas: uma informação libera outra."],
      exemplo: "Ana, Bia e Caio gostam de azul, verde e roxo. Ana não gosta de azul, e quem gosta de verde é homem. Então Caio gosta de verde, Ana de roxo e Bia de azul.",
      questoes: [
        { p: "Lia, Mel e Nina fizeram provas para TJ, TRT e INSS, uma para cada. Lia não fez TJ; Mel fez INSS. Quem fez TJ?", o: ["Mel", "Nina", "Lia", "Não dá para saber"], c: 1, e: "Mel fez INSS. Lia não fez TJ, então fez TRT. Sobra TJ para Nina." },
        { p: "Pedro, Rui e Saulo moram nas casas 1, 2 e 3. Pedro mora na casa 2, e o número da casa de Rui é maior que o da de Saulo. Onde mora Rui?", o: ["Casa 1", "Casa 3", "Casa 2", "Não dá para saber"], c: 1, e: "Sobram as casas 1 e 3 para Rui e Saulo. Como a de Rui é maior, Rui mora na 3." },
        { p: "Ana, Beto e Caio são médico, professor e advogado. O médico é irmão de Ana. Beto não é médico e é mais novo que o professor. Qual é a profissão de Ana?", o: ["Médica", "Advogada", "Professora", "Não dá para saber"], c: 2, e: "Ana não é o médico (é irmã dele) e Beto também não, então Caio é o médico. Beto é mais novo que o professor, logo não é o professor: é advogado. Sobra professora para Ana." },
        { p: "Numa tabela de associação com 4 pessoas e 4 profissões, quantos ✓ existem no final?", o: ["12", "16", "8", "4"], c: 3, e: "Cada linha tem um único ✓, e são 4 linhas." }
      ] },
    { titulo: "Letras e ciclos", teoria: ["Em sequências de letras, troque cada letra pela posição no alfabeto (A = 1, B = 2…). O alfabeto tem 26 letras, contando K, W e Y.", "Quando a sequência se repete em blocos (ciclos), divida a posição pelo tamanho do bloco e use o resto.", "Resto 0 significa o último elemento do bloco."],
      exemplo: "A sequência sol, lua, estrela, sol, lua, estrela… tem ciclo 3. O 50º termo: 50 ÷ 3 dá resto 2, então é \"lua\".",
      questoes: [
        { p: "A, C, E, G, … Qual é a próxima letra?", o: ["J", "K", "I", "H"], c: 2, e: "Pula uma letra a cada passo: A, C, E, G, I." },
        { p: "Na sequência A, B, C, A, B, C, …, qual é a 100ª letra?", o: ["A", "B", "C", "Não dá para saber"], c: 0, e: "O ciclo tem 3 letras. 100 ÷ 3 dá resto 1, então é a primeira do bloco: A." },
        { p: "B, E, H, K, … Qual é a próxima letra?", o: ["L", "N", "O", "M"], c: 1, e: "Em números: 2, 5, 8, 11. Somando 3, vem 14, que é a letra N." },
        { p: "Um semáforo repete verde, amarelo, vermelho, vermelho. Qual é a 30ª cor?", o: ["Vermelho", "Amarelo", "Verde", "Não dá para saber"], c: 1, e: "O ciclo tem 4 cores. 30 ÷ 4 dá resto 2: a segunda cor, amarelo." }
      ] },
    { titulo: "Sequências que dependem dos anteriores", teoria: ["Em algumas sequências, cada termo vem dos anteriores. Na de Fibonacci, cada termo é a soma dos dois anteriores: 1, 1, 2, 3, 5, 8…", "Outras intercalam duas regras: as posições ímpares seguem uma lei, e as pares, outra.", "Teste nesta ordem: diferença constante, multiplicação constante, soma dos anteriores, duas sequências intercaladas."],
      exemplo: "2, 3, 5, 8, 13, 21… Cada termo é a soma dos dois anteriores, então o próximo é 13 + 21 = 34.",
      questoes: [
        { p: "1, 2, 3, 5, 8, 13, … Qual é o próximo termo?", o: ["20", "26", "18", "21"], c: 3, e: "Soma dos dois anteriores: 8 + 13 = 21." },
        { p: "3, 10, 5, 20, 7, 30, … Qual é o próximo termo?", o: ["9", "11", "8", "40"], c: 0, e: "São duas sequências intercaladas: 3, 5, 7 (soma 2) e 10, 20, 30 (soma 10). O 7º termo é da primeira: 9." },
        { p: "2, 6, 18, 54, … Qual é o 6º termo?", o: ["216", "486", "162", "324"], c: 1, e: "Cada termo é o anterior vezes 3: 54, 162, 486." },
        { p: "1, 3, 4, 7, 11, 18, … Qual é o próximo termo?", o: ["26", "29", "36", "25"], c: 1, e: "Soma dos dois anteriores: 11 + 18 = 29." }
      ] },
    { titulo: "Pior caso e anos bissextos", teoria: ["Para garantir k itens iguais: pegue o pior caso, (k − 1) de cada tipo, e some 1.", "Ano bissexto: divisível por 4, exceto os terminados em 00 que não são divisíveis por 400. 2000 foi bissexto; 1900 não foi.", "De um ano para o seguinte, a mesma data anda 1 dia da semana em ano comum e 2 dias quando passa por um 29 de fevereiro."],
      exemplo: "Uma urna tem bolas de 5 cores. Para garantir 3 da mesma cor: no pior caso saem 2 de cada cor (10 bolas); a próxima completa 3. Resposta: 11.",
      questoes: [
        { p: "Uma gaveta tem meias de 3 cores. Quantas tirar, no escuro, para garantir 4 da mesma cor?", o: ["9", "12", "13", "10"], c: 3, e: "Pior caso: 3 de cada cor, 9 meias. A 10ª completa 4 de alguma cor." },
        { p: "Um grupo tem 25 pessoas. No mínimo, quantas nasceram no mesmo dia da semana?", o: ["3", "7", "4", "5"], c: 2, e: "Espalhando ao máximo, 3 por dia somam 21. Sobram 4 pessoas, que repetem algum dia: pelo menos um dia tem 4." },
        { p: "Qual destes anos é bissexto?", o: ["2000", "2100", "1900", "2023"], c: 0, e: "2000 termina em 00 e é divisível por 400, então é bissexto. 1900 e 2100 não são divisíveis por 400, e 2023 não é divisível por 4." },
        { p: "1º de janeiro de 2023 foi um domingo. Em que dia caiu 1º de janeiro de 2024?", o: ["Terça", "Segunda", "Domingo", "Sábado"], c: 1, e: "2023 foi ano comum (365 dias = 52 semanas + 1 dia): a data anda 1 dia, de domingo para segunda." }
      ] },
    { titulo: "Princípios da lógica", teoria: ["Princípio da identidade: uma proposição verdadeira é verdadeira; uma proposição falsa é falsa.", "Princípio da não contradição: nenhuma proposição pode ser verdadeira e falsa ao mesmo tempo.", "Princípio do terceiro excluído: uma proposição ou é verdadeira ou é falsa; não há terceira possibilidade. Por isso essa lógica é chamada de bivalente."],
      exemplo: "Quem diz que a banana é doce e depois diz que a mesma banana é amarga se contradiz: viola o princípio da não contradição (Banca URCA).",
      questoes: [
        { p: "(Banca PC-SP) São considerados princípios básicos da lógica bivalente:", o: ["Verdade, identidade e não contradição", "Terceiro excluído, identidade e não contradição", "Terceiro excluído, verdade e identidade", "Primeiro excluído, não contradição e identidade"], c: 1, e: "Os três princípios clássicos são identidade, não contradição e terceiro excluído. \"Princípio da verdade\" e \"primeiro excluído\" não existem." },
        { p: "Qual princípio diz que uma proposição não pode ser verdadeira e falsa ao mesmo tempo?", o: ["Dedução", "Terceiro excluído", "Não contradição", "Identidade"], c: 2, e: "É o princípio da não contradição: dois valores ao mesmo tempo são impossíveis." },
        { p: "\"Uma proposição ou é verdadeira ou é falsa, não existindo outra possibilidade.\" Esse é o princípio:", o: ["da identidade", "da dedução", "do terceiro excluído", "da não contradição"], c: 2, e: "O terceiro excluído \"exclui\" qualquer terceiro valor, como \"talvez\"." },
        { p: "(Banca CEBRASPE) Julgue: a lógica bivalente não obedece ao princípio da não contradição.", o: ["Certo", "Errado"], c: 1, e: "A lógica bivalente obedece, sim: uma proposição não assume dois valores lógicos ao mesmo tempo." }
      ] },
    { titulo: "Simples, compostas e conectivos", teoria: ["Proposição simples tem uma única ideia: \"Pedro é alto.\" Composta junta duas ou mais ideias por meio de conectivos: \"Pedro é alto e Maria é turista.\"", "Conectivos: conjunção ∧ (\"e\", \"mas\"), disjunção inclusiva ∨ (\"ou\"), disjunção exclusiva ⊻ (\"ou… ou…\"), condicional → (\"se…, então…\") e bicondicional ↔ (\"se, e somente se\").", "Proposições categóricas usam quantificadores: todo, algum e nenhum. Exemplo: \"Todo nordestino é brasileiro\"."],
      exemplo: "\"Maria é turista\" é simples. \"Maria e Pedro são turistas\" é composta: equivale a \"Maria é turista e Pedro é turista\".",
      questoes: [
        { p: "(Banca FUNDATEC) Qual alternativa apresenta uma proposição simples?", o: ["Maria é turista.", "Qual o sobrenome de Pedro?", "Algum entrevistado é turista americano?", "Maria e Pedro são turistas.", "Maria e Pedro são amigos?"], c: 0, e: "Tem uma ideia só. \"Maria e Pedro são turistas\" esconde duas ideias ligadas por \"e\", e as outras duas são perguntas." },
        { p: "(Banca IUDS) A proposição \"Ou p, ou q\" refere-se a qual conectivo?", o: ["Conjunção", "Disjunção exclusiva", "Disjunção inclusiva", "Condicional"], c: 1, e: "\"Ou… ou…\" é a disjunção exclusiva (⊻): só uma das duas pode acontecer." },
        { p: "\"Se o Coren zela pelo bom conceito da profissão, então os usuários serão beneficiados\" tem qual estrutura? (Banca UFMT)", o: ["Disjunção", "Conjunção", "Condicional", "Bicondicional"], c: 2, e: "\"Se…, então…\" é a condicional (→)." },
        { p: "(Banca PRÓ-MUNICÍPIO) Sentenças: \"Feliz aniversário!\", \"João é cozinheiro.\", \"Maria é nadadora ou veterinária.\", \"José é engraçado.\" e \"Qual a sua idade?\". Quantas são proposições simples?", o: ["2", "3", "1", "4"], c: 0, e: "Simples: \"João é cozinheiro\" e \"José é engraçado\". \"Maria é nadadora ou veterinária\" é composta, e as outras duas não são proposições." }
      ] },
    { titulo: "Sentenças abertas e paradoxos", teoria: ["Sentença aberta tem uma variável ou um sujeito indefinido (x, y, \"ele\", \"ela\"): \"x + 1 = 7\" e \"Ela é a melhor esposa do mundo\". Não é proposição.", "Quando a variável recebe valor, a sentença fecha e vira proposição: \"2 + x = 10, para x = 8\" é proposição (verdadeira).", "Paradoxos não podem ser valorados: \"Esta frase é falsa\" e \"Só sei que nada sei\" não são proposições."],
      exemplo: "\"x > 3\" é aberta. \"x > 3, para x = 5\" é fechada e verdadeira.",
      questoes: [
        { p: "Qual destas é uma sentença aberta?", o: ["5 + 4 = 8.", "2 + x = 10, para x = 8.", "Pelé nasceu em Minas Gerais.", "Ele foi o melhor aluno da turma."], c: 3, e: "\"Ele\" não diz quem é. Sem saber o sujeito, não dá para julgar. As outras podem ser julgadas V ou F." },
        { p: "\"x + y = 10\" é uma proposição?", o: ["Sim: é falsa", "Só quando x for igual a y", "Não: é uma sentença aberta", "Sim: é verdadeira"], c: 2, e: "Sem valores para x e y, não dá para dizer se é verdadeira ou falsa." },
        { p: "(Banca CEBRASPE) Quantas destas são proposições? I. Esta frase é falsa. II. O TCE/AC tem como função fiscalizar o orçamento do estado do Acre. III. Quantos são os conselheiros do TCE/AC?", o: ["1", "2", "3", "Nenhuma"], c: 0, e: "Só a II. A I é um paradoxo e a III é uma pergunta. Por isso o item \"há exatamente 2 proposições\" foi julgado errado." },
        { p: "Qual destas é uma proposição?", o: ["x > 3", "Ela é muito inteligente.", "x > 3, para x = 5", "Esta frase é falsa."], c: 2, e: "Com x = 5 a sentença fecha: 5 > 3 é verdadeira." }
      ] }
  ];


export const EXTRA: Extra[] = [
    { ex: ['A = {1, 2, 3, 4} e B = {3, 4, 5}. Quanto é A ∩ B?', 'A ∩ B = {3, 4}: são os elementos que estão nos dois conjuntos ao mesmo tempo.'],
      vf: { t: '{1, 2} ∪ {2, 3} = {2}', v: false, e: 'União junta tudo: {1, 2, 3}. O {2} seria a interseção.' } },
    { ex: ["\"Use a máscara.\" É proposição?", "Não. É uma ordem (frase imperativa): não pode ser julgada verdadeira ou falsa."],
      vf: { t: "\"O Brasil não fica na Europa\" é uma proposição.", v: true, e: "Proposição pode ser afirmativa ou negativa. Essa é declarativa e verdadeira." } },
    { ex: ['Quanto vale "Se 2 + 2 = 5, então a Lua é de queijo"?', 'Verdadeira. A condicional só é falsa no caso V → F, e aqui a primeira parte é F.'],
      vf: { t: 'Com 3 proposições simples, a tabela-verdade tem 6 linhas.', v: false, e: 'São 2³ = 8 linhas.' } },
    { ex: ['Qual é a negação de "Se eu estudo, então eu passo"?', '"Eu estudo e não passo." Mantém a primeira parte, troca por "e" e nega a segunda.'],
      vf: { t: 'A negação de "Ana canta e dança" é "Ana não canta ou não dança".', v: true, e: 'Negar "e" vira "ou", negando as duas partes.' } },
    { ex: ['"Ou chove ou não chove" (p ∨ ~p) é tautologia, contradição ou contingência?', 'Tautologia: dá V em todas as linhas da tabela.'],
      vf: { t: 'p ∧ ~p é uma tautologia.', v: false, e: 'É contradição: algo não pode ser e não ser ao mesmo tempo, então dá sempre F.' } },
    { ex: ['"Todo médico é responsável." Paulo é médico. O que se conclui?', 'Paulo é responsável: o círculo dos médicos está inteiro dentro do círculo dos responsáveis.'],
      vf: { t: 'A negação de "Todo aluno estuda" é "Nenhum aluno estuda".', v: false, e: 'Basta um contraexemplo: "Algum aluno não estuda".' } },
    { ex: ['"Se chove, a rua fica molhada." A rua não está molhada. O que se conclui?', 'Não choveu. É o modus tollens: negou a consequência, nega a causa.'],
      vf: { t: '"Se chove, a rua molha. A rua está molhada." Logo, choveu.', v: false, e: 'A rua pode ter molhado por outro motivo. Confirmar a consequência não prova a causa.' } },
    { ex: ['Ana, Bia e Caio têm carro, moto e bicicleta. Ana não tem carro nem moto; Caio não tem carro. Quem tem o quê?', 'Ana fica com a bicicleta. Caio não tem carro, então fica com a moto. Sobra o carro para Bia.'],
      vf: { t: 'Na tabela de associação, uma pessoa pode ter dois ✓ na mesma linha.', v: false, e: 'Cada linha e cada coluna tem um único ✓.' } },
    { ex: ['2, 5, 10, 17, 26, … Qual é o próximo termo?', '37. As diferenças são 3, 5, 7, 9; a próxima é 11, e 26 + 11 = 37.'],
      vf: { t: 'Na sequência 3, 6, 12, 24, o próximo termo é 48.', v: true, e: 'Cada termo é o dobro do anterior.' } },
    { ex: ['Quantas pessoas garantem duas nascidas no mesmo mês?', '13. No pior caso, 12 nascem em meses diferentes; a 13ª obriga a repetir.'],
      vf: { t: 'Uma gaveta tem meias de 4 cores. Pegando 5 meias no escuro, com certeza sai um par da mesma cor.', v: true, e: 'Pior caso: 4 meias de cores diferentes. A 5ª repete uma cor.' } },
    { ex: ['Hoje é sábado. Que dia será daqui a 829 dias?', 'Terça. 829 ÷ 7 dá resto 3, e três dias depois de sábado é terça.'],
      vf: { t: 'Daqui a 21 dias será o mesmo dia da semana de hoje.', v: true, e: '21 é múltiplo de 7: o resto é 0.' } },
    { ex: ["40 alunos fazem inglês ou espanhol: 25 fazem inglês e 20 fazem espanhol. Quantos fazem os dois?", "25 + 20 − 40 = 5. O que passa do total é exatamente a interseção."],
      vf: { t: "n(A ∪ B) é sempre igual a n(A) + n(B).", v: false, e: "Só quando A e B não têm nada em comum. Se têm, subtraia n(A ∩ B)." } },
    { ex: ["Por que a fórmula de três conjuntos soma de volta n(A ∩ B ∩ C)?", "Quem está nos três foi somado três vezes e depois subtraído três vezes (nas interseções de dois). Ficou de fora, então precisa voltar uma vez."],
      vf: { t: "Quem está nos três conjuntos também está em A ∩ B.", v: true, e: "Estar em A, B e C ao mesmo tempo inclui estar em A e em B." } },
    { ex: ["p: \"Choveu\" (F); q: \"Fez sol\" (V). Quanto vale \"Se choveu, então fez sol\"?", "V. A condicional começa com F, e uma condicional que começa com F é sempre verdadeira."],
      vf: { t: "Se p ∧ q é verdadeira, então p ∨ q também é.", v: true, e: "Se as duas são verdadeiras, pelo menos uma é verdadeira." } },
    { ex: ["\"Só saio se terminar o trabalho.\" Como traduzir?", "\"Se saio, então terminei o trabalho\": s → t. O \"somente se\" aponta a condição necessária, que fica depois da seta."],
      vf: { t: "\"p é suficiente para q\" é o mesmo que p → q.", v: true, e: "O suficiente fica antes da seta." } },
    { ex: ["\"Lia canta e dança\" é verdadeira, e \"Se Lia dança, então Rui toca\" também é. Rui toca?", "Sim. Pelo \"e\", Lia dança é V. Uma condicional que começa com V só é verdadeira se terminar com V, então Rui toca."],
      vf: { t: "Se p → q é verdadeira e q é falsa, então p é falsa.", v: true, e: "Se p fosse V, teríamos V → F, que é falso. Logo p é F (é o modus tollens)." } },
    { ex: ["Por que \"Se é carioca, é brasileiro\" não equivale a \"Se é brasileiro, é carioca\"?", "Porque a recíproca troca a condição. Todo carioca é brasileiro, mas nem todo brasileiro é carioca."],
      vf: { t: "p → q é equivalente a ~q → ~p.", v: true, e: "É a contrapositiva: troca a ordem e nega as duas partes." } },
    { ex: ["Qual é a negação de \"Nenhum gato é preto\"?", "\"Algum gato é preto.\" Basta um exemplo para derrubar o \"nenhum\"."],
      vf: { t: "A negação de \"Todo aluno passou\" é \"Nenhum aluno passou\".", v: false, e: "É \"Algum aluno não passou\". Um único aluno que não passou já derruba o \"todo\"." } },
    { ex: ["\"Se é ouro, brilha. Não é ouro. Logo, não brilha.\" Esse argumento vale?", "Não. É negar o antecedente. Um vidro também brilha sem ser ouro."],
      vf: { t: "Um argumento pode ser válido mesmo tendo uma conclusão falsa no mundo real.", v: true, e: "Validade é sobre a forma. Com uma premissa falsa, a conclusão de um argumento válido pode ser falsa." } },
    { ex: ["Por que começar supondo que alguém diz a verdade?", "Porque a suposição gera consequências. Se elas batem de frente com algum fato, a suposição estava errada e você testa a outra."],
      vf: { t: "Se duas pessoas dizem frases contraditórias, as duas podem estar mentindo.", v: false, e: "Frases contraditórias têm valores opostos: exatamente uma delas é verdadeira." } },
    { ex: ["Qual pista usar primeiro?", "A mais direta, que já afirma algo (\"Mel fez INSS\"). Depois as negativas, que vão eliminando opções."],
      vf: { t: "Quando uma coluna tem ✗ em todas as linhas menos uma, a que sobrou recebe ✓.", v: true, e: "Cada coluna tem exatamente um ✓." } },
    { ex: ["O que fazer quando o resto da divisão dá 0?", "Pegue o último elemento do bloco. Em A, B, C, a 9ª letra é C, porque 9 ÷ 3 dá resto 0."],
      vf: { t: "Na sequência Z, X, V, T, a próxima letra é R.", v: true, e: "Volta de 2 em 2 no alfabeto: Z, X, V, T, R." } },
    { ex: ["Como reconhecer uma sequência intercalada?", "Os termos sobem e descem alternadamente, ou as diferenças não têm padrão. Separe as posições ímpares das pares e olhe cada grupo."],
      vf: { t: "Em 1, 1, 2, 3, 5, 8, o próximo termo é 13.", v: true, e: "5 + 8 = 13." } },
    { ex: ["Quantas cartas tirar de um baralho com 4 naipes para garantir 2 do mesmo naipe?", "5. No pior caso, as 4 primeiras são de naipes diferentes; a 5ª obriga a repetir."],
      vf: { t: "2100 será um ano bissexto.", v: false, e: "Termina em 00 e não é divisível por 400, então não é bissexto." } },
    { ex: ["Por que \"Esta frase é falsa\" não é proposição?", "Se fosse verdadeira, seria falsa; se fosse falsa, seria verdadeira. Ela quebra os princípios da lógica: é um paradoxo."],
      vf: { t: "O princípio do terceiro excluído permite um terceiro valor lógico, como \"talvez\".", v: false, e: "É o contrário: ele exclui qualquer terceira opção. Só existem V e F." } },
    { ex: ["\"João é professor, mas Pedro é advogado.\" Qual é o conectivo?", "Conjunção (∧). O \"mas\" tem o mesmo valor lógico do \"e\"."],
      vf: { t: "\"Todo nordestino é brasileiro\" é uma proposição categórica.", v: true, e: "Ela usa o quantificador \"todo\"." } },
    { ex: ["\"Só sei que nada sei\" é proposição?", "Não. É um paradoxo: se fosse verdade que a pessoa nada sabe, ela não saberia nem isso."],
      vf: { t: "\"2 + x = 10, para x = 8\" é uma sentença fechada.", v: true, e: "A variável recebeu valor: 2 + 8 = 10, que é verdadeira." } }
  ];

