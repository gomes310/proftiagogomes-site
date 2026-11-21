import json, re
exec(open('/tmp/q3/novas_licoes.py').read())
D = '/home/claude/proftiagogomes-site/trilha-app/src/dados/'
FIXOS = [['Certo', 'Errado'], ['Válido', 'Inválido']]
def embaralhar(q, k, idx):
    o = q['o']; certo = o[q['c']]
    for f in FIXOS:
        if set(o) == set(f): return dict(q, o=f, c=f.index(certo))
    r = (idx * 2 + k * 3) % len(o)
    novo = o[r:] + o[:r]
    return dict(q, o=novo, c=novo.index(certo))
js = lambda x: json.dumps(x, ensure_ascii=False)
lic = open(D + 'licoes.ts').read()
assert "titulo: 'Todo, algum e nenhum'" not in lic and '"titulo": "Todo, algum e nenhum"' not in lic
blocos_l, blocos_e = [], []
for idx in sorted(L):
    li = L[idx]['licao']
    qs = [embaralhar(q, k, idx) for k, q in enumerate(li['questoes'])]
    cs = [q['c'] for q in qs]
    assert len(set(cs)) > 1, (idx, cs)
    linhas = ',\n'.join('        { p: %s, o: %s, c: %d, e: %s }' % (js(q['p']), js(q['o']), q['c'], js(q['e'])) for q in qs)
    blocos_l.append('    { titulo: %s, teoria: %s,\n      exemplo: %s,\n      questoes: [\n%s\n      ] }' % (js(li['titulo']), js(li['teoria']), js(li['exemplo']), linhas))
    ex = L[idx]['extra']
    blocos_e.append('    { ex: %s,\n      vf: { t: %s, v: %s, e: %s } }' % (js(ex['ex']), js(ex['vf']['t']), 'true' if ex['vf']['v'] else 'false', js(ex['vf']['e'])))
# LICOES termina na primeira linha "  ];" depois de "export const LICOES"; EXTRA na última
i_lic = lic.index('export const LICOES'); fim_lic = lic.index('\n  ];', i_lic)
lic = lic[:fim_lic] + ',\n' + ',\n'.join(blocos_l) + lic[fim_lic:]
i_ex = lic.index('export const EXTRA'); fim_ex = lic.rindex('\n  ];')
lic = lic[:fim_ex] + ',\n' + ',\n'.join(blocos_e) + lic[fim_ex:]
open(D + 'licoes.ts', 'w').write(lic)
im = open(D + 'imersao.ts').read()
bl = []
for idx in sorted(L):
    c = L[idx]['conteudo']; m = c['imersao']
    bl.append('  { // %d %s\n    imersao: {\n      exemplos: %s,\n      pergunta: %s,\n      opcoes: %s,\n      c: %d, e: %s\n    },\n    pares: %s,\n    caderno: { regras: %s, dica: %s }\n  }' % (
        idx, L[idx]['licao']['titulo'], js(m['exemplos']), js(m['pergunta']), js(m['opcoes']), m['c'], js(m['e']), js(c['pares']), js(c['caderno']['regras']), js(c['caderno']['dica'])))
fim = im.rindex('\n];')
im = im[:fim] + ',\n' + ',\n'.join(bl) + im[fim:]
open(D + 'imersao.ts', 'w').write(im)
g = json.load(open(D + 'guias.json'))
for idx in sorted(L): g[str(idx)] = L[idx]['guia']
open(D + 'guias.json', 'w').write(json.dumps(g, ensure_ascii=False, indent=1))
print('ok', sorted(L))
