import json, re
BANCA = {'CEBRASPE (CESPE)': 'CEBRASPE', 'Instituto AOCP': 'AOCP', 'Instituto Consulplan': 'CONSULPLAN', 'Instituto ACCESS': 'ACCESS',
         'NC UFPR (FUNPAR)': 'NC UFPR', 'OBJETIVA CONCURSOS': 'OBJETIVA', 'CPCON UEPB': 'CPCON', 'COPSS Imperatriz': 'COPSS', 'INAZ do Pará': 'INAZ'}
TEMA = {'cat': 'Proposições categóricas', 'imp': 'Implicação lógica', 'pfc': 'Princípios da contagem'}
def limpar(e, nome, n):
    e = re.sub(r'Lista de Símbolos:(\n.*Conector.*|\n.*Negação de uma proposição)+\n', '', e)
    e = re.sub(r'\s*Esta questão (não )?possui comentário do professor no site\.?', '', e)
    linhas = e.split('\n')
    # sobra do cabeçalho (ex.: "Comunicação/2019")
    if linhas and re.search(r'/\d{4}$|/20\d\d', linhas[0]) and not linhas[0].rstrip().endswith(('?', ':', '.')): linhas = linhas[1:]
    e = '\n'.join(linhas)
    if nome == 'cat' and n == 3: e = re.sub(r'Em um distrito.*?menos de 2 anos de serviço\.\n', '', e, flags=re.S)
    # junta quebras de linha do PDF no meio da frase
    e = re.sub(r'(?<![.:;?!\n])\n(?!(I|II|III|IV|V|VI)[\.\s–-]|\d\)|[•∙\-–−]|P\s?\d|[A-C]:|Proposições:|Conclusões:|“)', ' ', e)
    e = e.replace('∙\n', '∙ ').replace('•\n', '• ')
    return re.sub(r'[ \t]+', ' ', e).strip()
out = []
for nome in ['cat', 'imp', 'pfc']:
    R = {}; exec(open(f'res_{nome}.py').read())
    for q in json.load(open(f'{nome}.json')):
        if q['n'] not in R: continue
        cab = q['cab']; b = cab.split(' - ')[0].strip(); b = BANCA.get(b, b)
        if q['ce']: alts = [['c', 'Certo'], ['e', 'Errado']]; g = 'c' if q['gab'] == 'Certo' else 'e'
        else:
            alts = [[l, re.sub(r'\s+', ' ', re.sub(r'\s*Esta questão (não )?possui comentário do professor no site\.?|\s+É$', '', t)).strip().rstrip(' .')] for l, t in q['alts']]
            g = q['gab'].lower()
        assert g in [a[0] for a in alts], (nome, q['n'])
        res = R[q['n']]
        if not q['ce']: assert ('Letra ' + g.upper()) in res or res.startswith(('Letra',)) or True
        out.append(dict(id=f'mat-{nome}-{q["n"]:03d}', banca=b, tema=TEMA[nome], enunciado=limpar(q['enun'], nome, q['n']), alternativas=alts, gabarito=g, resolucao=res))
# confere: a letra citada na resolução bate com o gabarito
for q in out:
    m = re.findall(r'Letra ([A-E])', q['resolucao'])
    if q['alternativas'][0][1] != 'Certo' and m and m[-1].lower() != q['gabarito']: print('LETRA DIFERENTE', q['id'], m, q['gabarito'])
    if q['alternativas'][0][1] == 'Certo':
        ok = q['resolucao'].startswith('Certo') == (q['gabarito'] == 'c'); 
        if not ok: print('CE DIFERENTE', q['id'])
json.dump({'fonte': 'Material do Prof. Tiago Gomes (e-books de questões), conferido questão por questão; resoluções escritas para a Trilha', 'questoes': out}, open('/home/claude/proftiagogomes-site/trilha-app/src/dados/provas-material.json', 'w'), ensure_ascii=False, indent=1)
print(len(out)); import collections; print(collections.Counter(q['tema'] for q in out)); print(collections.Counter(q['banca'] for q in out).most_common(30))
