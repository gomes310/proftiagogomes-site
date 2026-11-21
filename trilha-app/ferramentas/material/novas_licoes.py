# Lições novas da Trilha (índices 27 a 34), a partir do material do Prof. Tiago Gomes:
# Proposições categóricas (pasta 05), Implicação lógica tipos 1 e 2 (pasta 07), Princípios da contagem (pasta 09).
def Q(p, o, c, e): return dict(p=p, o=o, c=c, e=e)
def EX(t, r, porque, ok=True): return dict(t=t, r=r, ok=ok, porque=porque)
def PASSO(titulo, conceito, exemplos, p, o, c, dica, e): return dict(titulo=titulo, conceito=conceito, exemplos=exemplos, suaVez=dict(p=p, o=o, c=c, dica=dica, e=e))

L = {}

# ---------------- 27 Quantificadores (categóricas · básico) ----------------
L[27] = dict(
  licao=dict(titulo='Todo, algum e nenhum',
    teoria=['Proposição categórica usa um quantificador: todo, algum (existe, pelo menos um) ou nenhum.',
            'Universais: "Todo A é B" e "Nenhum A é B". Particulares: "Algum A é B" e "Algum A não é B".',
            'Afirmativa não tem "não"; negativa tem. "Algum A não é B" é particular negativa.'],
    exemplo='"Todos os atletas são saudáveis" é universal afirmativa. "Alguns atletas não são saudáveis" é particular negativa.',
    questoes=[
      Q('"Nenhum gato é verde." Essa proposição é:', ['Universal negativa', 'Universal afirmativa', 'Particular negativa', 'Particular afirmativa'], 0, '"Nenhum" fala de todos os gatos (universal) e nega (negativa).'),
      Q('(Banca Legalle) Qual tem quantificador particular e afirmativo?', ['Algum bosque possui muitas flores.', 'Algum bosque não possui muitas flores.', 'Todo bosque possui muitas flores.', 'Nenhum bosque possui muitas flores.'], 0, '"Algum" é particular, e a frase não tem "não": afirmativa.'),
      Q('"Pelo menos um aluno faltou" tem o mesmo sentido de:', ['Algum aluno faltou.', 'Todo aluno faltou.', 'Nenhum aluno faltou.', 'Algum aluno não faltou.'], 0, '"Pelo menos um", "existe" e "algum" são o mesmo quantificador.'),
      Q('"Todo médico é formado." No diagrama:', ['O círculo dos médicos fica dentro do dos formados.', 'O dos formados fica dentro do dos médicos.', 'Os círculos não se tocam.', 'Os círculos são iguais.'], 0, 'Todo médico está entre os formados, mas pode haver formado que não é médico.'),
      Q('"Nenhum peixe é mamífero." No diagrama:', ['Os círculos não se tocam.', 'O dos peixes fica dentro do dos mamíferos.', 'Os círculos se cruzam.', 'O dos mamíferos fica dentro do dos peixes.'], 0, '"Nenhum" significa que os conjuntos não têm nada em comum.'),
      Q('"Alguns professores são poetas." Então, com certeza:', ['Alguns poetas são professores.', 'Todo poeta é professor.', 'Todo professor é poeta.', 'Alguns professores não são poetas.'], 0, '"Algum A é B" vale nos dois sentidos: algum B é A. As outras não são garantidas.')
    ]),
  extra=dict(ex=['"Existem ministros que não são advogados." Qual é o tipo?', 'Particular negativa: "existem" é particular, e o "não" a torna negativa. É o mesmo que "Algum ministro não é advogado".'],
             vf=dict(t='"Qualquer engenheiro sabe Matemática" é uma universal afirmativa.', v=True, e='"Qualquer" tem o mesmo sentido de "todo".')),
  conteudo=dict(
    imersao=dict(exemplos=[['"Todo A é B"', 'universal afirmativa'], ['"Nenhum A é B"', 'universal negativa'], ['"Algum A é B"', 'particular afirmativa'], ['"Algum A não é B"', 'particular negativa']],
                 pergunta='O que torna uma proposição categórica "particular"?', opcoes=['Ter a palavra "não"', 'Falar de alguns (algum, existe, pelo menos um)', 'Falar de todos'], c=1,
                 e='Particular fala de parte do grupo: algum, existe, pelo menos um. Universal fala do grupo inteiro: todo, nenhum.'),
    pares=[['todo', 'universal afirmativa'], ['nenhum', 'universal negativa'], ['algum… é', 'particular afirmativa'], ['algum… não é', 'particular negativa']],
    caderno=dict(regras=['Universal: todo, qualquer, nenhum. Particular: algum, existe, pelo menos um.', 'Afirmativa: sem "não". Negativa: com "não" (ou "nenhum").', '"Todo A é B": círculo A dentro de B. "Nenhum A é B": círculos separados. "Algum A é B": círculos que se cruzam.'],
                 dica='"Algum A é B" vale nos dois sentidos (algum B é A). "Todo A é B" não: não dá para inverter para "todo B é A".')),
  guia=[
    PASSO('Os quatro tipos', 'Uma **proposição categórica** diz quantos de um grupo têm uma característica. Ela usa **todo**, **nenhum** ou **algum**.',
      [EX('Todo atleta é saudável.', 'universal afirmativa', 'Fala de todos os atletas e afirma.'),
       EX('Nenhum atleta é saudável.', 'universal negativa', 'Fala de todos e nega.'),
       EX('Algum atleta é saudável.', 'particular afirmativa', 'Fala de parte dos atletas e afirma.'),
       EX('Algum atleta não é saudável.', 'particular negativa', 'Fala de parte e nega.')],
      '"Existem candidatos que não estudaram." É:', ['particular negativa', 'universal negativa', 'particular afirmativa'], 0,
      '"Existem" fala de todos ou de alguns? E tem "não"?', '"Existem" = algum (particular), e o "não" torna negativa.'),
    PASSO('Palavras com o mesmo sentido', '**Algum** = **existe** = **pelo menos um**. **Todo** = **qualquer** = **cada**. As bancas trocam as palavras para confundir.',
      [EX('Existe policial que é atirador.', 'Algum policial é atirador.', 'Mesmo sentido.'),
       EX('Qualquer servidor tem crachá.', 'Todo servidor tem crachá.', 'Mesmo sentido.'),
       EX('Pelo menos um aluno faltou.', 'Algum aluno faltou.', 'Mesmo sentido.')],
      '"Cada funcionário recebeu um brinde" tem o mesmo sentido de:', ['Todo funcionário recebeu um brinde.', 'Algum funcionário recebeu um brinde.', 'Nenhum funcionário recebeu um brinde.'], 0,
      '"Cada" fala de um ou de todos?', '"Cada" fala de todos, um por um: é universal.'),
    PASSO('Desenhando com círculos', 'Cada tipo vira um desenho. **Todo A é B**: A dentro de B. **Nenhum A é B**: círculos separados. **Algum A é B**: círculos que se cruzam.',
      [EX('Todo pirata é marinheiro.', 'piratas dentro de marinheiros', 'Pode haver marinheiro que não é pirata.'),
       EX('Nenhum peixe é mamífero.', 'círculos separados', 'Os grupos não têm nada em comum.'),
       EX('Algum médico é poliglota.', 'círculos que se cruzam', 'Há pelo menos um na parte comum.')],
      '"Todo carioca é brasileiro." Qual frase é garantida?', ['O conjunto dos brasileiros contém o dos cariocas.', 'Todo brasileiro é carioca.', 'Os dois conjuntos são iguais.'], 0,
      'Quem fica dentro de quem?', 'Os cariocas ficam dentro dos brasileiros; o contrário não é garantido.')])

# ---------------- 28 Negação e equivalência das categóricas (intermediário) ----------------
L[28] = dict(
  licao=dict(titulo='Negar e trocar categóricas',
    teoria=['Negação de "Todo A é B": "Algum A não é B" (existe, pelo menos um… não é).',
            'Negação de "Nenhum A é B": "Algum A é B". Negação de "Algum A é B": "Nenhum A é B".',
            'Equivalente a "Todo A é B": "Se é A, é B" e "Se não é B, não é A". "Nenhum A é B" = "Todo A não é B".'],
    exemplo='"Todos os peixes vivem no mar" é negada por "Existe peixe que não vive no mar".',
    questoes=[
      Q('(Banca IADES) Negação de "Todo policial militar é um exímio atirador":', ['Algum policial militar não é um exímio atirador.', 'Nenhum policial militar é um exímio atirador.', 'Todo policial militar não é um exímio atirador.', 'Pelo menos um policial militar é um exímio atirador.'], 0, 'Para derrubar o "todo", basta um caso contrário. "Nenhum" exagera.'),
      Q('Negação de "Nenhum outono é quente":', ['Algum outono é quente.', 'Todo outono é quente.', 'Algum outono não é quente.', 'Nenhum outono é frio.'], 0, 'Para derrubar o "nenhum", basta existir um.'),
      Q('Negação de "Algum assistente social acompanhou o julgamento":', ['Nenhum assistente social acompanhou o julgamento.', 'Algum assistente social não acompanhou.', 'Todos acompanharam.', 'Nem todos acompanharam.'], 0, 'Negar "existe" é dizer que não existe nenhum.'),
      Q('(Banca FGV) "Todo vegetal verde é saudável." Também é verdade que:', ['Todo vegetal que não é saudável não é verde.', 'Todo vegetal saudável é verde.', 'Todo vegetal que não é verde não é saudável.', 'Alguns vegetais verdes não são saudáveis.'], 0, 'É a contrapositiva: "se não é saudável, não é verde".'),
      Q('"Nenhum recifense é carioca" equivale a:', ['Todo recifense não é carioca.', 'Algum recifense não é carioca.', 'Todo carioca é recifense.', 'Algum recifense é carioca.'], 0, '"Nenhum A é B" = "Todo A não é B".'),
      Q('(Banca CEBRASPE) Se "Todas as casas das ruas A e B foram visitadas" é falsa, então:', ['Alguma casa de A não foi visitada ou alguma casa de B não foi visitada.', 'Nenhuma casa foi visitada.', 'Alguma casa de A e alguma casa de B não foram visitadas.', 'Todas as casas de A não foram visitadas.'], 0, 'Nega o "todas" (alguma… não) e troca o "e" por "ou".')
    ]),
  extra=dict(ex=['Qual é a negação de "Todos os candidatos estão presentes"?', '"Pelo menos um candidato não está presente." Não é "nenhum está presente": isso exagera.'],
             vf=dict(t='A negação de "Todos os amigos de Bianca são paulistas" é "Nenhum amigo de Bianca é paulista".', v=False, e='A negação é "Algum amigo de Bianca não é paulista".')),
  conteudo=dict(
    imersao=dict(exemplos=[['Todo A é B', 'Algum A não é B'], ['Nenhum A é B', 'Algum A é B'], ['Algum A é B', 'Nenhum A é B'], ['Algum A não é B', 'Todo A é B']],
                 pergunta='O que acontece com o quantificador quando você nega?', opcoes=['Ele continua igual', 'Universal vira particular e particular vira universal', 'Tudo vira "nenhum"'], c=1,
                 e='A negação troca o tipo: todo ↔ algum… não, nenhum ↔ algum.'),
    pares=[['Todo A é B', 'negação: algum A não é B'], ['Nenhum A é B', 'negação: algum A é B'], ['Algum A é B', 'negação: nenhum A é B'], ['Todo A é B', 'equivale: se não é B, não é A']],
    caderno=dict(regras=['~(Todo A é B) = Algum A não é B.', '~(Nenhum A é B) = Algum A é B. ~(Algum A é B) = Nenhum A é B.', '"Todo A é B" = "se é A, é B" = "se não é B, não é A". "Nenhum A é B" = "Todo A não é B".'],
                 dica='Pegadinha clássica: a negação de "todo" NÃO é "nenhum". Para derrubar um "todo", basta um caso contrário.')),
  guia=[
    PASSO('Negando o "todo"', 'Para mostrar que **"Todo A é B"** é falsa, basta **um** A que não seja B. A negação é **"Algum A não é B"**.',
      [EX('Todos os peixes vivem no mar.', 'Existe peixe que não vive no mar.', 'Um peixe de rio já derruba a frase.'),
       EX('Todo policial é atirador.', 'Nenhum policial é atirador.', '"Nenhum" exagera: não é a negação.', ok=False)],
      'Negação de "Todas as lâmpadas estão acesas":', ['Pelo menos uma lâmpada está apagada.', 'Todas as lâmpadas estão apagadas.', 'Nenhuma lâmpada está acesa.'], 0,
      'Quantas lâmpadas apagadas bastam para a frase ser falsa?', 'Basta uma apagada.'),
    PASSO('Negando "nenhum" e "algum"', '**"Nenhum A é B"** é negada por **"Algum A é B"**. E **"Algum A é B"** é negada por **"Nenhum A é B"**. Uma desmente a outra.',
      [EX('Nenhum carro é movido a etanol.', 'Algum carro é movido a etanol.', 'Basta existir um carro a etanol.'),
       EX('Algum aluno colou.', 'Nenhum aluno colou.', 'A negação de "existe" é "não existe nenhum".')],
      'Negação de "Algum vereador faltou":', ['Nenhum vereador faltou.', 'Algum vereador não faltou.', 'Todo vereador faltou.'], 0,
      'Qual frase desmente "existe pelo menos um que faltou"?', 'Só "nenhum faltou" desmente.'),
    PASSO('Dizendo o mesmo de outro jeito', '**"Todo A é B"** equivale a **"Se é A, é B"** e a **"Se não é B, não é A"**. E **"Nenhum A é B"** equivale a **"Todo A não é B"**.',
      [EX('Todo recifense é pernambucano.', 'Quem não é pernambucano não é recifense.', 'É a contrapositiva.'),
       EX('Todo recifense é pernambucano.', 'Todo pernambucano é recifense.', 'Inverter sem negar muda o sentido.', ok=False),
       EX('Nenhum natalense é pernambucano.', 'Todo natalense não é pernambucano.', 'Mesmo sentido.')],
      '"Todo político é corrupto" equivale a:', ['Todos que não são corruptos não são políticos.', 'Todo corrupto é político.', 'Quem não é político não é corrupto.'], 0,
      'Inverta e negue as duas partes.', 'Contrapositiva: se não é corrupto, não é político.')])

# ---------------- 29 Silogismos: o que se conclui (avançado) ----------------
L[29] = dict(
  licao=dict(titulo='Silogismos: o que dá para concluir',
    teoria=['Desenhe as premissas com círculos e veja o que acontece em TODOS os desenhos possíveis.',
            'Uma conclusão só vale se for verdadeira em todos os desenhos. Se depende do desenho, a resposta é "pode ser".',
            'Atalhos: duas premissas com "algum" não garantem nada; se uma premissa tem "não", a conclusão também tem.'],
    exemplo='"Nenhum professor é mentiroso" e "Alguns advogados são mentirosos": os advogados mentirosos não são professores, então alguns advogados não são professores.',
    questoes=[
      Q('(Banca VUNESP) "Todos os tutores são professores" e "Alguns coordenadores são professores". Conclui-se que:', ['Há professores que são tutores.', 'Há coordenadores que são tutores.', 'Todos os coordenadores são professores.', 'Há tutores que não são professores.'], 0, 'Os tutores estão dentro dos professores. Os coordenadores podem nem tocar nos tutores.'),
      Q('(Banca SELECON) "Nenhum professor é mentiroso" e "Alguns advogados são mentirosos". Conclui-se que:', ['Alguns advogados não são professores.', 'Alguns advogados são professores.', 'Nenhum professor é advogado.', 'Alguns professores são advogados.'], 0, 'Os advogados mentirosos ficam fora do círculo dos professores.'),
      Q('(Banca FUNDATEC) "Todo eletricista estuda física" e "Maria estuda física". Então:', ['Maria pode ser eletricista.', 'Maria certamente é eletricista.', 'Maria certamente não é eletricista.', 'Maria não estuda Matemática.'], 0, 'Maria está em "estuda física", que é maior que "eletricista". Ela pode estar dentro ou fora.'),
      Q('"Alguns médicos são poliglotas" e "Alguns professores são poliglotas". Conclusão: "Alguns médicos são professores". O argumento é:', ['Inválido', 'Válido'], 0, 'Os médicos poliglotas podem ser outros, diferentes dos professores poliglotas. Com dois "algum", nada é garantido.'),
      Q('(Banca IBADE) "Todo morador de Vila Velha gosta de praia" e "João não gosta de praia". Conclui-se que:', ['João não mora em Vila Velha.', 'João não mora no Espírito Santo.', 'João mora em Vila Velha.', 'João gosta de cachoeira.'], 0, 'Quem não gosta de praia está fora do círculo, então não é morador de Vila Velha. Pode morar em outra cidade do ES.'),
      Q('(Banca FCC) "Todo amapaense é brasileiro" e "Todo brasileiro é sul-americano". É correto afirmar:', ['É possível existir sul-americano que não seja amapaense.', 'Todo sul-americano é brasileiro.', 'Existe amapaense que não é brasileiro.', 'Todo brasileiro é amapaense.'], 0, 'Os círculos ficam um dentro do outro: amapaense ⊂ brasileiro ⊂ sul-americano.')
    ]),
  extra=dict(ex=['"Alguns corintianos são chatos" e "Todos os corintianos são fanáticos". Conclusão: "Alguns fanáticos são chatos". Vale?', 'Vale. Os corintianos chatos estão dentro dos fanáticos, então existem fanáticos chatos.'],
             vf=dict(t='De "Todo A é B" e "Algum C é B" dá para concluir que "Algum C é A".', v=False, e='Os C que são B podem estar fora de A. Faça o desenho com C cruzando só a parte de B fora de A.')),
  conteudo=dict(
    imersao=dict(exemplos=[['Todo A é B + Todo B é C', 'Todo A é C (vale)'], ['Algum A é B + Algum B é C', 'nada garantido'], ['Nenhum A é B + Algum C é B', 'Algum C não é A (vale)']],
                 pergunta='Quando uma conclusão vale?', opcoes=['Quando ela pode ser verdade', 'Quando ela é verdade em todos os desenhos possíveis', 'Quando parece lógica'], c=1,
                 e='Válido é o que não depende do desenho: em qualquer jeito de desenhar as premissas, a conclusão aparece.'),
    pares=[['dois "algum"', 'nada se conclui'], ['premissa negativa', 'conclusão negativa'], ['Todo A é B + x não é B', 'x não é A'], ['Todo A é B + x é B', 'x pode ser A']],
    caderno=dict(regras=['Desenhe as premissas e teste todos os desenhos possíveis.', 'Duas premissas particulares (algum) não garantem conclusão. Duas negativas também não.', 'Se uma premissa é negativa, a conclusão é negativa. Se uma é particular, a conclusão é particular.'],
                 dica='"Pode ser" é diferente de "certamente". Se a pessoa está no círculo maior, ela pode estar ou não no menor.')),
  guia=[
    PASSO('Desenhe e encaixe', 'Desenhe cada premissa com círculos e **encaixe** os desenhos. A conclusão certa é a que aparece **em qualquer** desenho possível.',
      [EX('Todo A é B e todo B é C.', 'Todo A é C.', 'A fica dentro de B, que fica dentro de C.'),
       EX('Todo pianista toca violino. Alguns coristas são pianistas.', 'Alguns coristas tocam violino.', 'Os coristas pianistas estão dentro de "toca violino".')],
      '"Todo professor é especialista" e "todo especialista é mestre". O coordenador é especialista. Então ele:', ['é mestre', 'é professor', 'não é professor'], 0,
      'Em qual círculo ele está? Esse círculo fica dentro de qual?', 'Especialista está dentro de mestre. Se ele é professor, não dá para saber.'),
    PASSO('"Pode ser" × "certamente"', 'Se alguém está no círculo **maior**, ele **pode** estar no menor, mas não **certamente**. Se está **fora** do maior, está **fora** do menor também.',
      [EX('Todo motorista opera máquinas. Fagundes opera máquinas.', 'Fagundes pode ser motorista.', 'Está no círculo maior: pode estar no menor.'),
       EX('Todo morador gosta de praia. João não gosta de praia.', 'João não é morador.', 'Fora do maior, fora do menor.')],
      '"Todo vigilante conhece a lei" e "Marco conhece a lei". Então:', ['Marco pode ser vigilante.', 'Marco certamente é vigilante.', 'Marco certamente não é vigilante.'], 0,
      'Marco está no círculo maior ou no menor?', 'Ele está no maior ("conhece a lei"). Pode ou não ser vigilante.'),
    PASSO('Quando nada se conclui', 'Com **duas premissas "algum"**, nada é garantido. Com **duas negativas**, também não. E se uma premissa é **negativa**, a conclusão também é.',
      [EX('Alguns médicos são poliglotas. Alguns professores são poliglotas.', 'Alguns médicos são professores?', 'Não dá: podem ser poliglotas diferentes.', ok=False),
       EX('Nenhum professor mente. Alguns advogados mentem.', 'Alguns advogados não são professores.', 'Premissa negativa, conclusão negativa.')],
      '"Algum jogador é educador" e "Algum educador é graduado". Conclui-se que algum jogador é graduado?', ['Não: nada é garantido', 'Sim, sempre', 'Sim, se houver muitos jogadores'], 0,
      'Quantos "algum" há nas premissas?', 'Duas particulares: nenhuma conclusão é garantida.')])

# ---------------- 30 Implicação tipo 1 (argumentos · intermediário) ----------------
L[30] = dict(
  licao=dict(titulo='Implicação tipo 1: comece pelo fato',
    teoria=['Tipo 1: há um ponto de partida "travado", que só tem um jeito de acontecer.',
            'Pontos de partida: uma proposição simples, um "e" verdadeiro (tudo V), um "ou" falso (tudo F) ou uma condicional falsa (V → F).',
            'Do ponto de partida, vá substituindo nas outras frases, uma por vez, como num efeito dominó.'],
    exemplo='"Se Joana é dentista, montou o consultório. Joana não montou o consultório." O fato é "não montou"; pela contrapositiva, Joana não é dentista.',
    questoes=[
      Q('(Banca IBADE) "Se a parede não é branca, o cachorro late. Se a parede é branca, o canário não canta. O canário canta." Logo:', ['A parede não é branca e o cachorro late.', 'A parede é branca e o cachorro late.', 'A parede não é branca e o cachorro não late.', 'A parede é branca e o cachorro não late.'], 0, 'O fato é "o canário canta". Então a parede não é branca, e o cachorro late.'),
      Q('(Banca IDIB) "Se André é cantor, Bruna é bailarina" é FALSA. Então:', ['André é cantor e Bruna não é bailarina.', 'André não é cantor.', 'Bruna é bailarina.', 'Nada se conclui.'], 0, 'A condicional só é falsa em V → F.'),
      Q('(Banca IBADE) "Como ou durmo. Bebo ou não como. Jogo ou não durmo. Ora, não jogo." Portanto:', ['Como e bebo.', 'Durmo e bebo.', 'Não bebo e como.', 'Durmo e não bebo.'], 0, 'Não jogo → não durmo → como → bebo.'),
      Q('"Rui canta e dança" é verdadeira, e "Se Rui dança, Lia toca" também. Então:', ['Lia toca.', 'Lia não toca.', 'Rui não canta.', 'Nada se conclui.'], 0, '"E" verdadeiro: Rui dança. Pela condicional, Lia toca.'),
      Q('(Banca CEBRASPE) "Paulo fiscal → João motorista" é V e "Maria enfermeira ou João motorista" é F. Então:', ['Maria não é enfermeira, João não é motorista e Paulo não é fiscal.', 'Maria é enfermeira e Paulo é fiscal.', 'João é motorista.', 'Paulo é fiscal.'], 0, '"Ou" falso: tudo F. Com João não motorista, Paulo não pode ser fiscal.'),
      Q('(Banca VUNESP) "Se a temperatura cair, me agasalho. Se me agasalho, não corro. A temperatura caiu." Então:', ['Não corri e me agasalhei.', 'Corri e não cheguei tarde.', 'Não corri e não me agasalhei.', 'Cheguei tarde.'], 0, 'O fato é a queda da temperatura: agasalho, e então não corro.')
    ]),
  extra=dict(ex=['"Ana estuda ou trabalha" é falsa. O que se sabe?', 'Tudo: Ana não estuda e não trabalha. O "ou" só é falso quando as duas partes são falsas.'],
             vf=dict(t='"Se p, então q" verdadeira e "p" verdadeira garantem que q é verdadeira.', v=True, e='Começando com V, a condicional só é verdadeira se terminar em V.')),
  conteudo=dict(
    imersao=dict(exemplos=[['"p" sozinha, verdadeira', 'p = V (fato)'], ['"p e q" verdadeira', 'p = V e q = V'], ['"p ou q" falsa', 'p = F e q = F'], ['"p → q" falsa', 'p = V e q = F']],
                 pergunta='O que essas quatro situações têm em comum?', opcoes=['Só têm um jeito de acontecer', 'São todas falsas', 'São todas condicionais'], c=0,
                 e='São os pontos de partida do tipo 1: cada uma trava o valor das partes.'),
    pares=[['simples verdadeira', 'fato direto'], ['"e" verdadeiro', 'tudo V'], ['"ou" falso', 'tudo F'], ['condicional falsa', 'V → F']],
    caderno=dict(regras=['Tipo 1: comece por uma simples, um "e" verdadeiro, um "ou" falso ou uma condicional falsa.', 'Do fato, substitua nas outras frases, uma de cada vez.', 'Na condicional verdadeira: se o fim é F, o começo é F (contrapositiva).'],
                 dica='Considere todas as premissas verdadeiras, a não ser que a banca diga que alguma é falsa.')),
  guia=[
    PASSO('Ache o ponto de partida', 'No **tipo 1**, uma frase só tem **um jeito** de acontecer: uma **simples**, um **"e" verdadeiro**, um **"ou" falso** ou uma **condicional falsa**. Comece por ela.',
      [EX('"Lia estuda e trabalha" é V.', 'estuda = V, trabalha = V', '"E" verdadeiro: tudo V.'),
       EX('"Lia estuda ou trabalha" é F.', 'estuda = F, trabalha = F', '"Ou" falso: tudo F.'),
       EX('"Se chove, molha" é F.', 'chove = V, molha = F', 'Condicional falsa: V → F.')],
      '"Se o prédio é alto, a casa é feia" é falsa. Então:', ['O prédio é alto e a casa não é feia.', 'O prédio não é alto.', 'A casa é feia.'], 0,
      'Quando a condicional é falsa?', 'Só em V → F: prédio alto e casa não feia.'),
    PASSO('Efeito dominó', 'Descoberto um valor, **leve-o para as outras frases**. Cada frase verdadeira obriga a próxima.',
      [EX('Não jogo. "Jogo ou não durmo."', 'não durmo', 'O "ou" precisa de uma parte V.'),
       EX('Não durmo. "Como ou durmo."', 'como', 'De novo, falta a parte V.'),
       EX('Como. "Bebo ou não como."', 'bebo', 'Fim da cadeia.')],
      '"Ana é bonita. Se Bruno é pequeno, Ana não é bonita. Se Carlos usa boné, Bruno é pequeno." Então:', ['Carlos não usa boné.', 'Carlos usa boné.', 'Bruno é pequeno.'], 0,
      'Comece pelo fato: Ana é bonita.', 'Ana bonita → Bruno não é pequeno → Carlos não usa boné.'),
    PASSO('A contrapositiva na cadeia', 'Na condicional verdadeira, se o **fim é F**, o **começo é F**. É o que faz a cadeia andar "de trás para frente".',
      [EX('Se A, então B. Se B, então C. C é F.', 'B = F e A = F', 'Cada fim F derruba o começo.'),
       EX('Se Joana é dentista, montou o consultório. Não montou.', 'Joana não é dentista.', 'Contrapositiva.')],
      '"Se estudo, passo. Se passo, sou nomeado. Não fui nomeado." Então:', ['Não passei e não estudei.', 'Estudei e não passei.', 'Passei.'], 0,
      'Ande de trás para frente.', 'Não nomeado → não passou → não estudou.')])

# ---------------- 31 Implicação tipo 2 (argumentos · avançado) ----------------
L[31] = dict(
  licao=dict(titulo='Implicação tipo 2: encadeando condicionais',
    teoria=['Tipo 2: não há fato travado, só compostas. A resposta costuma ser outra composta (condicional ou "ou").',
            'Ligue as condicionais em cadeia: se p → q e q → r, então p → r. Use a contrapositiva para encaixar os elos.',
            'Para julgar um item "se X, então Y": suponha X verdadeiro e veja se as premissas obrigam Y.'],
    exemplo='"Se compro um carro, não viajo de avião. Se não viajo de avião, assisto a filmes." Encadeando: "Se compro um carro, assisto a filmes".',
    questoes=[
      Q('"Se A, então B. Se B, então C." Conclui-se que:', ['Se A, então C.', 'Se C, então A.', 'A é verdadeira.', 'Se não A, então não C.'], 0, 'É a cadeia (silogismo hipotético): A leva a B, que leva a C.'),
      Q('(Banca QUADRIX) "1) Faço doação ou compro carro. 2) Se compro carro, não viajo de avião. 4) Se não viajo de avião, assisto a filmes." Julgue: "Se não faço doação, assisto a filmes."', ['Certo', 'Errado'], 0, 'Sem doação, compro o carro (1). Então não viajo (2). Então assisto a filmes (4).'),
      Q('(Banca QUADRIX) Com as mesmas frases, julgue: "Se assisto a filmes, então compro um carro."', ['Errado', 'Certo'], 0, 'Assistir a filmes é o fim da cadeia; não obriga a voltar ao começo.'),
      Q('(Banca NC UFPR) "Se chove, faz frio. O mar não está calmo ou posso mergulhar. Chove ou o mar está calmo." Conclui-se:', ['Faz frio ou posso mergulhar.', 'Chove e posso mergulhar.', 'O mar está calmo.', 'Se faz frio, chove.'], 0, 'Se chove, faz frio; se o mar está calmo, posso mergulhar. Como um dos dois acontece, vale "frio ou mergulho".'),
      Q('(Banca FCC) "Todo trapezista é malabarista. Se é contorcionista e não equilibrista, não é malabarista." Se é trapezista, então:', ['é equilibrista ou não é contorcionista', 'não é malabarista', 'é contorcionista e não equilibrista', 'não é equilibrista'], 0, 'Trapezista → malabarista → não (contorcionista e não equilibrista) = não contorcionista ou equilibrista.'),
      Q('"Se Paulo é pedreiro, Pedro não é porteiro. Se Pedro não é porteiro, João é encanador." Qual conclusão é válida?', ['Se João não é encanador, Paulo não é pedreiro.', 'Se João é encanador, Paulo é pedreiro.', 'Paulo é pedreiro.', 'Se Pedro é porteiro, João é encanador.'], 0, 'A cadeia dá "Paulo pedreiro → João encanador". A contrapositiva também vale.')
    ]),
  extra=dict(ex=['"Se o ar está seco, a temperatura cai." Dá para concluir "se a temperatura cai, o ar está seco"?', 'Não. Isso é a recíproca, que não equivale. A temperatura pode cair por outro motivo.'],
             vf=dict(t='De "p ou q" pode-se escrever "se não p, então q".', v=True, e='Se uma das partes do "ou" falha, a outra tem que valer.')),
  conteudo=dict(
    imersao=dict(exemplos=[['A → B e B → C', 'A → C'], ['A ∨ B', '~A → B'], ['A → B', '~B → ~A']],
                 pergunta='Para que servem essas trocas no tipo 2?', opcoes=['Para encaixar as frases numa cadeia', 'Para achar um fato simples', 'Para negar as premissas'], c=0,
                 e='Sem fato travado, você reescreve as frases como condicionais e liga uma na outra.'),
    pares=[['A → B, B → C', 'A → C'], ['A ∨ B', '~A → B'], ['A → B', '~B → ~A'], ['B → A', 'recíproca: não vale']],
    caderno=dict(regras=['Tipo 2: só compostas. Reescreva tudo como condicional.', '"p ou q" vira "se não p, então q". "p → q" também vale como "~q → ~p".', 'Ligue os elos: p → q → r dá p → r. Nunca volte do fim para o começo (recíproca).'],
                 dica='Para julgar "se X, então Y", suponha X e veja se a cadeia chega obrigatoriamente em Y.')),
  guia=[
    PASSO('Tudo vira condicional', 'Sem fato travado, reescreva as frases como **condicionais**. **"p ou q"** vira **"se não p, então q"**. E toda condicional tem a **contrapositiva**.',
      [EX('Faço doação ou compro carro.', 'Se não faço doação, compro carro.', 'Se uma parte do "ou" falha, a outra vale.'),
       EX('Se viajo, vou à Flórida.', 'Se não vou à Flórida, não viajo.', 'Contrapositiva.')],
      '"Carlos é dentista ou fisiologista" equivale a:', ['Se Carlos não é dentista, é fisiologista.', 'Se Carlos é dentista, não é fisiologista.', 'Carlos é dentista e fisiologista.'], 0,
      'Se a primeira parte do "ou" falha, o que acontece?', '"p ou q" = "se não p, então q".'),
    PASSO('Monte a cadeia', 'Encaixe o **fim** de uma condicional no **começo** de outra: **p → q** e **q → r** dão **p → r**.',
      [EX('Compro carro → não viajo. Não viajo → assisto filmes.', 'Compro carro → assisto filmes', 'O elo "não viajo" liga as duas.'),
       EX('Corina lê → conta histórias. Conta histórias → João sorri.', 'Corina lê → João sorri', 'Mesma ideia.')],
      '"Se A, então B" e "se B, então C". Qual é válida?', ['Se A, então C.', 'Se C, então A.', 'Se B, então A.'], 0,
      'Siga as setas no sentido em que elas apontam.', 'A → B → C: A leva a C.'),
    PASSO('Julgando o item', 'Para julgar **"se X, então Y"**: suponha **X verdadeiro** e siga a cadeia. Se chegar **obrigatoriamente** em Y, está **certo**. Andar contra as setas é erro.',
      [EX('Se viajo de avião, faço doação?', 'Certo', 'Viajo → não compro carro (contrapositiva) → faço doação (pelo "ou").'),
       EX('Se assisto a filmes, compro um carro?', 'Errado', 'Andou contra as setas: filmes era o fim da cadeia.', ok=False)],
      '"Se o ar está seco, a temperatura cai." Julgue: "Se a temperatura cai, o ar está seco."', ['Errado', 'Certo'], 0,
      'Você está seguindo a seta ou andando contra ela?', 'É a recíproca: não é garantida.')])

# ---------------- 32 Princípio multiplicativo (contagem · básico) ----------------
L[32] = dict(
  licao=dict(titulo='Princípio multiplicativo',
    teoria=['Se uma escolha acontece E depois outra, multiplique as possibilidades de cada etapa.',
            'Desenhe um traço para cada etapa e escreva quantas opções há em cada uma: _ × _ × _.',
            'Atenção: "distintos" ou "sem repetir" diminui as opções a cada etapa; "pode repetir" mantém.'],
    exemplo='3 camisas e 4 calças: 3 × 4 = 12 jeitos de se vestir.',
    questoes=[
      Q('(Banca OBJETIVA) Juliana tem 5 calças e 6 camisas. De quantos jeitos ela escolhe uma calça e uma camisa?', ['30', '11', '20', '15'], 0, 'Uma calça E uma camisa: 5 × 6 = 30.'),
      Q('(Banca IBADE) 4 caminhos de A para B e 6 de B para C. Quantos caminhos de A para C passando por B?', ['24', '10', '20', '16'], 0, 'Os dois trechos acontecem: 4 × 6 = 24.'),
      Q('Quantas senhas de 3 dígitos (0 a 9) existem, podendo repetir?', ['1.000', '720', '30', '999'], 0, '10 × 10 × 10 = 1.000.'),
      Q('E se os 3 dígitos forem distintos?', ['720', '1.000', '30', '504'], 0, '10 × 9 × 8 = 720: cada etapa perde uma opção.'),
      Q('(Banca Consulplan) Um secador tem 3 temperaturas e 3 velocidades. Quantos ajustes?', ['9', '6', '18', '27'], 0, '3 × 3 = 9.'),
      Q('(Banca CETREDE) Quantos números de 2 algarismos distintos podem ser formados com 0, 1, …, 9?', ['81', '90', '100', '45'], 0, 'A dezena não pode ser 0: 9 opções. A unidade: 9 (os 10 menos o já usado). 9 × 9 = 81.')
    ]),
  extra=dict(ex=['Uma placa tem 2 letras (26 opções cada) e 1 número (0 a 9). Quantas placas?', '26 × 26 × 10 = 6.760. Letras podem repetir, então cada etapa tem 26.'],
             vf=dict(t='Para escolher um prato E uma bebida, somamos as opções.', v=False, e='Com "E" (as duas escolhas acontecem), multiplicamos.')),
  conteudo=dict(
    imersao=dict(exemplos=[['2 sucos e 3 lanches', '2 × 3 = 6 combos'], ['3 portas e 2 escadas', '3 × 2 = 6 caminhos'], ['4 cores, 2 tamanhos', '4 × 2 = 8 camisetas']],
                 pergunta='Quando escolhas acontecem juntas (uma E outra), o que se faz?', opcoes=['Somar', 'Multiplicar', 'Subtrair'], c=1,
                 e='Cada opção da primeira etapa combina com todas da segunda: multiplica.'),
    pares=[['etapa E etapa', 'multiplica'], ['pode repetir', 'opções iguais em cada etapa'], ['sem repetir', 'uma opção a menos por etapa'], ['3 × 4', '12 combinações']],
    caderno=dict(regras=['Etapas que acontecem juntas (E): multiplique.', 'Desenhe um traço por etapa: _ × _ × _.', 'Distintos: cada etapa perde uma opção. Pode repetir: todas têm o total.'],
                 dica='Comece pela etapa com restrição (ex.: a dezena que não pode ser 0, o último dígito que tem que ser par).')),
  guia=[
    PASSO('Etapas que se multiplicam', 'Se a escolha tem **etapas** que acontecem **juntas** (uma **E** outra), **multiplique** o número de opções de cada uma.',
      [EX('3 camisas e 4 calças', '3 × 4 = 12', 'Cada camisa combina com as 4 calças.'),
       EX('2 entradas, 3 pratos, 2 sobremesas', '2 × 3 × 2 = 12', 'Três etapas.')],
      '5 sabores de sorvete e 3 coberturas. Quantas combinações de 1 sabor e 1 cobertura?', ['15', '8', '53'], 0,
      'Escolhe um sabor E uma cobertura.', '5 × 3 = 15.'),
    PASSO('Um traço para cada posição', 'Para senhas, placas e números, desenhe **um traço por posição** e escreva as opções. **Pode repetir**: todas têm o total.',
      [EX('Senha de 4 dígitos, pode repetir', '10 × 10 × 10 × 10 = 10.000', 'Cada posição tem 10 opções.'),
       EX('Senha de 5 dígitos só com 1, 3, 5, 7, 9', '5⁵ = 3.125', 'Cada posição tem 5 opções.')],
      'Senha de 2 letras (26 opções), podendo repetir. Quantas?', ['676', '52', '650'], 0,
      'Dois traços, cada um com 26.', '26 × 26 = 676.'),
    PASSO('Sem repetir e restrições', '**Distintos** = a cada posição, **uma opção a menos**. E comece **pela restrição**: o primeiro algarismo não pode ser 0, o último tem que ser par…',
      [EX('3 dígitos distintos', '10 × 9 × 8 = 720', 'Cada um usado sai da lista.'),
       EX('2 algarismos distintos (0 a 9)', '9 × 9 = 81', 'Dezena sem o 0: 9. Unidade: 10 − 1 = 9.')],
      'Com 1, 2, 3, 4, 5, quantos números de 2 algarismos distintos são pares?', ['8', '10', '20'], 0,
      'Comece pelo último: ele tem que ser 2 ou 4.', 'Último: 2 opções. Primeiro: 4 restantes. 2 × 4 = 8.')])

# ---------------- 33 Princípio aditivo e fatorial (contagem · intermediário) ----------------
L[33] = dict(
  licao=dict(titulo='Somar ou multiplicar? E o fatorial',
    teoria=['"OU" (uma opção ou outra, não as duas): some. "E" (as duas acontecem): multiplique.',
            'Fatorial: n! = n × (n − 1) × … × 1. Ex.: 4! = 24, 5! = 120, 6! = 720, 7! = 5.040.',
            'Arrumar n pessoas (ou objetos) diferentes em fila: n! jeitos (permutação).'],
    exemplo='5 pessoas numa fila: 5! = 5 × 4 × 3 × 2 × 1 = 120 jeitos.',
    questoes=[
      Q('(Banca AOCP) Doar para uma de 3 entidades do bairro A OU uma de 4 ONGs do bairro B. Quantas opções?', ['7', '12', '34', '15'], 0, 'É uma OU outra: 3 + 4 = 7.'),
      Q('(Banca Legalle) 17 doces ou 20 salgados: de quantos modos escolher um produto?', ['37', '340', '40', '240'], 0, 'Princípio aditivo: 17 + 20 = 37.'),
      Q('Quanto vale 5!?', ['120', '25', '60', '15'], 0, '5 × 4 × 3 × 2 × 1 = 120.'),
      Q('(Banca FAFIPA) 7 pessoas sentam num banco para uma foto. Quantos jeitos?', ['5.040', '720', '49', '2.520'], 0, '7! = 5.040.'),
      Q('(Banca FEPESE) 7 atletas: de quantos modos podem chegar os 4 primeiros?', ['840', '5.040', '28', '35'], 0, 'Só 4 posições: 7 × 6 × 5 × 4 = 840.'),
      Q('(Banca IBADE) Dois casais posam para uma foto, cada casal junto. Quantos jeitos?', ['8', '4', '24', '2'], 0, 'Os 2 blocos trocam de lugar (2!) e cada casal troca por dentro (2 × 2): 2 × 2 × 2 = 8.')
    ]),
  extra=dict(ex=['Quanto é 6!/4!?', '6 × 5 = 30. O 4! se cancela: 6! = 6 × 5 × 4!.'],
             vf=dict(t='Arrumar 4 livros diferentes numa estante dá 4! = 24 jeitos.', v=True, e='Primeiro lugar: 4 opções, depois 3, 2 e 1.')),
  conteudo=dict(
    imersao=dict(exemplos=[['um doce OU um salgado (3 e 4)', '3 + 4 = 7'], ['um doce E um salgado (3 e 4)', '3 × 4 = 12'], ['4 pessoas em fila', '4! = 24']],
                 pergunta='Quando se soma em vez de multiplicar?', opcoes=['Quando a escolha é uma OU outra', 'Quando há muitas opções', 'Quando a ordem importa'], c=0,
                 e='"Ou" (só uma das escolhas acontece) soma. "E" (as duas acontecem) multiplica.'),
    pares=[['uma OU outra', 'soma'], ['uma E outra', 'multiplica'], ['4!', '24'], ['n objetos em fila', 'n!']],
    caderno=dict(regras=['"Ou": soma. "E": multiplica.', 'n! = n × (n − 1) × … × 1. 4! = 24, 5! = 120, 6! = 720, 7! = 5.040.', 'n pessoas em fila: n!. Só k posições entre n: n × (n − 1) × … (k fatores).'],
                 dica='Itens que precisam ficar juntos viram um bloco: conte os blocos e depois multiplique pelas trocas dentro de cada bloco.')),
  guia=[
    PASSO('"Ou" soma, "e" multiplica', 'Se a pessoa escolhe **uma coisa OU outra** (só uma acontece), **some**. Se escolhe **uma E outra**, **multiplique**.',
      [EX('3 entidades OU 4 ONGs', '3 + 4 = 7', 'Só uma doação.'),
       EX('7 camisas E 6 gravatas', '7 × 6 = 42', 'Escolhe as duas peças.')],
      'Viajar de ônibus (3 horários) OU de avião (2 voos). Quantas opções?', ['5', '6', '1'], 0,
      'A pessoa vai de ônibus e de avião, ou só de um?', 'É um OU outro: 3 + 2 = 5.'),
    PASSO('O fatorial', '**n!** (lê-se "n fatorial") é **n × (n − 1) × … × 1**. Ele conta os jeitos de **arrumar n coisas diferentes em fila**.',
      [EX('3 pessoas em fila', '3! = 6', '3 × 2 × 1.'),
       EX('7 pessoas num banco', '7! = 5.040', '7 × 6 × 5 × 4 × 3 × 2 × 1.')],
      'De quantos jeitos 4 livros diferentes ficam numa prateleira?', ['24', '16', '4'], 0,
      'Primeiro lugar: 4 opções, depois 3…', '4! = 24.'),
    PASSO('Só alguns lugares e blocos', 'Se só **k posições** serão ocupadas, pare a multiplicação nelas: **7 × 6 × 5 × 4** para 4 lugares. Quem fica **junto** vira **um bloco**.',
      [EX('7 atletas, pódio de 4', '7 × 6 × 5 × 4 = 840', 'Só 4 posições.'),
       EX('2 casais juntos', '2! × 2 × 2 = 8', 'Blocos trocam, e cada casal troca por dentro.')],
      '8 cadeiras livres e 4 estudantes. Quantos jeitos de sentar?', ['1.680', '32', '40.320'], 0,
      'Cada estudante escolhe uma cadeira ainda livre.', '8 × 7 × 6 × 5 = 1.680.')])

# ---------------- 34 Anagramas (contagem · avançado) ----------------
L[34] = dict(
  licao=dict(titulo='Anagramas, repetições e restrições',
    teoria=['Anagrama é cada jeito de reordenar as letras de uma palavra. Letras todas diferentes: n!.',
            'Letras repetidas: divida pelo fatorial de cada repetição. ARARA: 5!/(3! × 2!) = 10.',
            'Restrição primeiro: fixe as letras obrigatórias (começa com…, termina com…) e permute o resto.'],
    exemplo='AMOR tem 4! = 24 anagramas; ROMA e MORA são dois deles.',
    questoes=[
      Q('Quantos anagramas tem a palavra SOL?', ['6', '3', '9', '27'], 0, '3 letras diferentes: 3! = 6.'),
      Q('(Banca ACCESS) Quantos anagramas tem PLACA?', ['60', '120', '30', '24'], 0, '5 letras com o A duas vezes: 5!/2! = 60.'),
      Q('(Banca Unifil) Quantos anagramas de ÂNGULO começam com Â?', ['120', '720', '240', '90'], 0, 'Fixe o Â e permute as outras 5: 5! = 120.'),
      Q('(Banca CETREDE) Anagramas de TUDO que começam com consoante e terminam com vogal:', ['8', '4', '16', '24'], 0, '2 consoantes × 2 vogais × 2! do meio = 8.'),
      Q('(Banca MSM) Anagramas de MALETA que começam por consoante:', ['180', '360', '2.160', '60'], 0, '3 consoantes para o início; as outras 5 letras têm A duas vezes: 5!/2! = 60. 3 × 60 = 180.'),
      Q('(Banca IBADE) Quantos números distintos se formam permutando os algarismos de 65957?', ['60', '120', '30', '24'], 0, '5 algarismos com o 5 repetido: 5!/2! = 60.')
    ]),
  extra=dict(ex=['Quantos anagramas tem BANANA?', '6 letras com A três vezes e N duas vezes: 6!/(3! × 2!) = 720/12 = 60.'],
             vf=dict(t='OVO tem 3! = 6 anagramas.', v=False, e='O O se repete: 3!/2! = 3 (OVO, OOV, VOO).')),
  conteudo=dict(
    imersao=dict(exemplos=[['AMOR (todas diferentes)', '4! = 24'], ['OVO (O repete 2 vezes)', '3!/2! = 3'], ['ARARA (A 3 vezes, R 2 vezes)', '5!/(3! × 2!) = 10']],
                 pergunta='Por que se divide quando há letras repetidas?', opcoes=['Porque trocar letras iguais de lugar não cria anagrama novo', 'Porque a palavra fica menor', 'Porque é regra da banca'], c=0,
                 e='Trocar os dois O de OVO dá a mesma palavra. A divisão tira essas contagens repetidas.'),
    pares=[['letras diferentes', 'n!'], ['letra repetida k vezes', 'divide por k!'], ['começa com…', 'fixa e permuta o resto'], ['OVO', '3']],
    caderno=dict(regras=['Anagramas com letras diferentes: n!.', 'Com repetição: n! dividido pelo fatorial de cada repetição.', 'Restrição primeiro: fixe as posições obrigatórias e permute só o que sobrou.'],
                 dica='Letras juntas (ex.: vogais juntas) viram um bloco. Conte o bloco como uma letra e multiplique pelas arrumações dentro dele.')),
  guia=[
    PASSO('Anagramas de letras diferentes', '**Anagrama** é cada jeito de **reordenar** as letras. Se todas as letras são **diferentes**, são **n!** anagramas.',
      [EX('SOL', '3! = 6', 'SOL, SLO, OSL, OLS, LSO, LOS.'),
       EX('AMOR', '4! = 24', 'ROMA, MORA e RAMO estão entre eles.')],
      'Quantos anagramas tem a palavra LIVRO?', ['120', '24', '25'], 0,
      'São 5 letras diferentes.', '5! = 120.'),
    PASSO('Letras repetidas', 'Com letra **repetida**, trocar as iguais de lugar não cria anagrama novo. **Divida** pelo fatorial de cada repetição.',
      [EX('OVO', '3!/2! = 3', 'O O repete 2 vezes.'),
       EX('PLACA', '5!/2! = 60', 'O A repete 2 vezes.'),
       EX('ARARA', '5!/(3! × 2!) = 10', 'A 3 vezes e R 2 vezes.')],
      'Quantos anagramas tem ASA?', ['3', '6', '2'], 0,
      'Quantas vezes o A aparece?', '3!/2! = 3: ASA, AAS, SAA.'),
    PASSO('Restrição primeiro', 'Se o anagrama **começa** ou **termina** com algo, **fixe** essa letra e permute só o **resto**.',
      [EX('ÂNGULO começando com Â', '5! = 120', 'Fixou o Â; sobram 5 letras.'),
       EX('TUDO: consoante no início e vogal no fim', '2 × 2! × 2 = 8', '2 consoantes, 2 vogais e 2 letras no meio.')],
      'Quantos anagramas de CASO começam com C?', ['6', '24', '4'], 0,
      'Fixe o C. Quantas letras sobram?', 'Sobram A, S, O: 3! = 6.')])
