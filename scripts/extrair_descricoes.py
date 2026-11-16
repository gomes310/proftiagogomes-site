"""Extrai questões estruturadas das descrições dos vídeos do canal (bruto.json -> questoes.json).

Só usa o que está escrito na descrição: cabeçalho da prova, assunto, enunciado, alternativas e gabarito.
Questões sem enunciado ou sem gabarito ficam marcadas como incompletas (não viram página própria).
"""
import json, re, sys, unicodedata

BANCAS = [  # (padrão no cabeçalho/título, nome exibido, slug)
    (r'instituto\s+aocp|\baocp\b', 'Instituto AOCP', 'aocp'),
    (r'\bibgp\b', 'IBGP', 'ibgp'),
    (r'\bibfc\b', 'IBFC', 'ibfc'),
    (r'\bidecan\b', 'IDECAN', 'idecan'),
    (r'cebraspe|\bcespe\b', 'CEBRASPE', 'cebraspe'),
    (r'\bms\s*\(sarmento\)|ms concursos', 'MS CONCURSOS', 'ms-concursos'),
    (r'consulplan', 'Consulplan', 'consulplan'),
    (r'\bselecon\b', 'Selecon', 'selecon'),
    (r'\bfgv\b', 'FGV', 'fgv'),
    (r'\bfundep\b', 'FUNDEP', 'fundep'),
    (r'\bfcc\b', 'FCC', 'fcc'),
    (r'cesgranrio', 'Cesgranrio', 'cesgranrio'),
    (r'avan[cç]asp', 'AVANÇASP', 'avancasp'),
    (r'verbena', 'Instituto Verbena', 'verbena'),
]

TEMAS = [  # (padrão no assunto, nome, slug) — a ordem importa
    (r'verdade\s*/\s*mentira|verdades e mentiras', 'Verdades e mentiras', 'verdades-e-mentiras'),
    (r'casa dos pombos', 'Princípio da casa dos pombos', 'casa-dos-pombos'),
    (r'datas e calend', 'Datas e calendários', 'datas-e-calendarios'),
    (r'sequ[eê]ncias', 'Sequências lógicas', 'sequencias-logicas'),
    (r'tautologia|contradi', 'Tautologia, contradição e contingência', 'tautologia'),
    (r'equival|nega[cç][aã]o', 'Equivalências e negações', 'equivalencias-e-negacoes'),
    (r'tabela.verdade', 'Tabela-verdade', 'tabela-verdade'),
    (r'operadores l[oó]gicos|proposi[cç]', 'Proposições e conectivos', 'proposicoes-e-conectivos'),
    (r'conjunto|uni[aã]o, da intersec', 'Conjuntos', 'conjuntos'),
    (r'porcentagem', 'Porcentagem', 'porcentagem'),
]

FIM = re.compile(r'^(-{5,}|✅\s*(Gabarito|Bons Estudos)|🚀|😍|📚|www\.tecconcursos|Quest[aã]o #|CURSO COMPLETO|Curso Completo|📚Link|Link para|LINK D|👇|Matéria:|#\d{5,}|concurso |oncurso |Concurso )', re.I)
ALT = re.compile(r'^\s*([a-eA-E])\)\s*(.*)$')


def slug(t):
    t = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+', '-', t).strip('-')


def achar_banca(txt):
    for p, nome, s in BANCAS:
        if re.search(p, txt, re.I):
            return nome, s
    return None, None


def achar_tema(txt):
    for p, nome, s in TEMAS:
        if re.search(p, txt or '', re.I):
            return nome, s
    return None, None


def extrair(v):
    d = v['description'].replace('\r', '')
    linhas = d.split('\n')
    q = {'video': v['id'], 'titulo_video': v['title'], 'publicado': v['publishedAt'], 'duracao': v['duration'],
         'views': v['viewCount'], 'thumb': f"https://i.ytimg.com/vi/{v['id']}/hqdefault.jpg"}
    # cabeçalho da prova: "BANCA - Cargo (Órgão)/Órgão/.../ANO"
    cab_i = None
    for i, l in enumerate(linhas):
        s = re.sub(r'^(Quest[aã]o\s*\d+:\s*|#\d+\s+)', '', l.strip())
        if re.search(r'\S+.* - .+/.+/\s*(19|20)\d\d\b', s) or re.search(r'^[A-ZÀ-Ü][\w ().ÀÇ-]+ - [^/]+\(.+\)/.+(19|20)\d\d', s):
            if achar_banca(s)[0]:
                cab_i, q['prova'] = i, re.sub(r'\s*\(e mais \d+ concursos?\)', '', s).strip()
                break
    m = re.search(r'Assunto:\s*(.+)', d) or re.search(r'^(?:Racioc[ií]nio L[oó]gico|Matem[aá]tica)\s+-\s+(.+)$', d, re.M)
    q['assunto'] = m.group(1).strip() if m else None
    texto_banca = (q.get('prova') or '') + ' ' + v['title']
    q['banca'], q['banca_slug'] = achar_banca(texto_banca)
    q['tema'], q['tema_slug'] = achar_tema(q['assunto'] or v['title'])
    ano = re.search(r'/((?:19|20)\d\d)\b', q.get('prova') or '')
    q['ano'] = int(ano.group(1)) if ano else None
    org = re.search(r'\)/([^/]+)/', q.get('prova') or '')
    q['orgao'] = org.group(1).strip() if org else None
    g = re.search(r'GABARITO(?: OFICIAL)?:\s*([A-E]|Certo|Errado)\b', d, re.I)
    q['gabarito'] = g.group(1).upper() if g else None
    if q['gabarito'] in ('CERTO', 'ERRADO'):
        q['gabarito'] = q['gabarito'].capitalize()
    # enunciado: do primeiro texto após cabeçalho/assunto até as alternativas
    ini = cab_i + 1 if cab_i is not None else None
    if ini is not None:
        if ini < len(linhas) and re.match(r'^(Assunto:|Racioc[ií]nio L[oó]gico\s+-|Matem[aá]tica\s+-)', linhas[ini].strip()):
            ini += 1
        corpo, alts = [], []
        for l in linhas[ini:]:
            s = l.strip()
            if re.match(r'^GABARITO', s, re.I) or FIM.match(s):
                break
            a = ALT.match(l)
            if a:
                alts.append([a.group(1).lower(), a.group(2).strip()])
            elif alts and s and not s.startswith(('✅', '📗')):
                alts[-1][1] = (alts[-1][1] + ' ' + s).strip()
            else:
                corpo.append(s)
        txt = '\n'.join(corpo).strip()
        txt = re.sub(r'^\d+\)\s*', '', txt)  # tira o número da questão
        txt = re.sub(r'\n{3,}', '\n\n', txt)
        q['enunciado'] = txt or None
        q['alternativas'] = alts
    else:
        q['enunciado'], q['alternativas'] = None, []
    # número na série (do título)
    n = re.search(r'Quest[aã]o\s*0*(\d+)', v['title'], re.I)
    q['numero_serie'] = int(n.group(1)) if n else None
    falta = []
    if not q.get('prova'): falta.append('cabeçalho da prova')
    if not q['enunciado'] or len(q['enunciado']) < 30: falta.append('enunciado')
    if not q['gabarito']: falta.append('gabarito')
    if q['alternativas'] and any(not t for _, t in q['alternativas']): falta.append('alternativas são imagens')
    if re.search(r'\b(figuras?|imagem|tabela abaixo|tabela-verdade a seguir|quadro a seguir|gr[aá]fico)\b', q['enunciado'] or '', re.I): falta.append('enunciado depende de figura')
    if not q['banca']: falta.append('banca')
    q['lacunas'] = falta
    q['completa'] = not falta
    return q


if __name__ == '__main__':
    bruto = json.load(open('bruto.json'))
    qs = [extrair(v) for v in bruto]
    json.dump(qs, open('questoes.json', 'w'), ensure_ascii=False, indent=1)
    ok = [q for q in qs if q['completa']]
    print('total', len(qs), 'completas', len(ok))
    from collections import Counter
    print(Counter(q['banca_slug'] for q in ok))
    print(Counter(q['tema_slug'] for q in ok))
    for q in qs:
        if not q['completa']:
            print('-', q['video'], q['titulo_video'][:60], '| falta:', ', '.join(q['lacunas']))
