// Conteúdo da trilha: unidades e lições (portado da versão 1).
import type { Unidade, Licao, Extra } from './tipos';
export const UNIDADES: Unidade[] = [
    { nome: 'Unidade 1 · A base', desc: 'A linguagem dos conjuntos', selo: 'Base sólida', licoes: [0] },
    { nome: 'Unidade 2 · Lógica proposicional', desc: 'O coração do Raciocínio Lógico', selo: 'Lógico de carteirinha', licoes: [1, 2, 3, 4] },
    { nome: 'Unidade 3 · Argumentação', desc: 'Conclusões que valem e as que não valem', selo: 'Argumentador', licoes: [5, 6] },
    { nome: 'Unidade 4 · Raciocínio aplicado', desc: 'Organização e atenção para ganhar pontos', selo: 'Mestre do raciocínio', licoes: [7, 8, 9, 10] }
  ];

export const LICOES: Licao[] = [
    { titulo: 'Conjuntos', teoria: ['Conjunto é uma coleção de elementos, escrita entre chaves: {1, 2, 3}.', 'União (∪) junta tudo; interseção (∩) fica só com o que é comum; diferença (A − B) fica com o que é de A e não é de B.', 'Um conjunto com n elementos tem 2ⁿ subconjuntos.'],
      exemplo: 'A = {1, 2, 3, 4} e B = {3, 4, 5}: A ∩ B = {3, 4}, A ∪ B = {1, 2, 3, 4, 5} e A − B = {1, 2}.',
      questoes: [
        { p: 'Se A = {1, 2, 3, 4} e B = {3, 4, 5}, quanto é A ∩ B?', o: ['{3, 4}', '{1, 2, 3, 4, 5}', '{1, 2}', '{5}'], c: 0, e: 'A interseção fica só com os elementos que estão nos dois conjuntos: 3 e 4.' },
        { p: 'Com os mesmos A e B, quanto é A ∪ B?', o: ['{3, 4}', '{1, 2, 5}', '{1, 2, 3, 4, 5}', '{1, 2}'], c: 2, e: 'A união junta todos os elementos, sem repetir: 1, 2, 3, 4 e 5.' },
        { p: 'Quantos subconjuntos tem o conjunto {a, b, c}?', o: ['3', '6', '8', '9'], c: 2, e: 'São 3 elementos, então 2³ = 8 subconjuntos (contando o vazio e o próprio conjunto).' }
      ] },
    { titulo: 'Proposições', teoria: ['Proposição é uma frase declarativa que pode ser julgada verdadeira (V) ou falsa (F).', 'Perguntas, ordens e exclamações não são proposições.', 'Conectivos ligam proposições: e (∧), ou (∨), ou… ou… (⊻), se… então (→), se e somente se (↔). A negação é ~.'],
      exemplo: '"Brasília é a capital do Brasil" é proposição. "Que horas são?" não é.',
      questoes: [
        { p: 'Qual destas frases é uma proposição?', o: ['Que horas são?', 'Feche a porta!', 'Brasília é a capital do Brasil.', 'Que dia lindo!'], c: 2, e: 'É a única frase declarativa: dá para dizer que é verdadeira.' },
        { p: '"Estudo e trabalho" é uma proposição:', o: ['simples', 'composta, com conjunção', 'composta, com disjunção', 'que não é proposição'], c: 1, e: 'São duas proposições ligadas pelo "e", que é a conjunção.' },
        { p: 'Com p = "chove" e q = "fico em casa", como se escreve "Se chove, então fico em casa"?', o: ['p ∧ q', 'p ∨ q', 'p → q', 'p ↔ q'], c: 2, e: '"Se… então" é a condicional, representada por →.' }
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
      ] }
  ];


export const EXTRA: Extra[] = [
    { ex: ['A = {1, 2, 3, 4} e B = {3, 4, 5}. Quanto é A ∩ B?', 'A ∩ B = {3, 4}: são os elementos que estão nos dois conjuntos ao mesmo tempo.'],
      vf: { t: '{1, 2} ∪ {2, 3} = {2}', v: false, e: 'União junta tudo: {1, 2, 3}. O {2} seria a interseção.' } },
    { ex: ['"Feche a porta." Isso é uma proposição?', 'Não. É uma ordem: não dá para dizer se é verdadeira ou falsa.'],
      vf: { t: '"5 é maior que 8" é uma proposição.', v: true, e: 'É uma frase declarativa. Ela é falsa, mas pode ser julgada, então é proposição.' } },
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
      vf: { t: 'Daqui a 21 dias será o mesmo dia da semana de hoje.', v: true, e: '21 é múltiplo de 7: o resto é 0.' } }
  ];

