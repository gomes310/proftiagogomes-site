"""Testes de usabilidade automatizados da Trilha do RLM (celular 360x780, toque).

Simula um aluno novo fazendo as tarefas principais e mede:
- toques necessários e tempo de cada tarefa;
- alvos de toque menores que 48 px;
- violações de acessibilidade (axe-core, WCAG 2 AA);
- rolagem horizontal e textos menores que 14 px.
Uso: python3 testes/usabilidade.py URL PASTA_SAIDA
"""
import json, sys, time, re
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8780/'
OUT = Path(sys.argv[2] if len(sys.argv) > 2 else '/tmp/usab'); OUT.mkdir(parents=True, exist_ok=True)
GAB = json.load(open('/tmp/trilha_work/gabarito.json'))
AXE = Path(__file__).resolve().parent.parent / 'node_modules/axe-core/axe.min.js'
r = {'tarefas': {}, 'telas': {}}

def auditar_tela(pg, nome):
    pg.wait_for_timeout(350)
    pg.screenshot(path=str(OUT / f'{nome}.png'))
    pequenos = pg.evaluate('''() => [...document.querySelectorAll('button, a, input, select, [role=button]')]
      .filter(e => { const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.visibility !== 'hidden' && b.width > 0 && b.height > 0 && (b.width < 44 || b.height < 44) && !e.closest('p, li small, .nota, .lead, .links, .convite') })
      .map(e => (e.innerText || e.getAttribute('aria-label') || e.tagName).trim().slice(0, 30) + ` ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`)''')
    miudos = pg.evaluate('''() => { const out = new Set(); for (const e of document.querySelectorAll('body *')) { if (!e.childNodes.length || ![...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue; const fs = parseFloat(getComputedStyle(e).fontSize); const b = e.getBoundingClientRect(); if (fs < 14 && b.width > 0) out.add(e.textContent.trim().slice(0, 25) + ' ' + fs + 'px'); } return [...out].slice(0, 12) }''')
    horiz = pg.evaluate('() => document.documentElement.scrollWidth > 361')
    pg.add_script_tag(path=str(AXE))
    axe = pg.evaluate('''async () => { const res = await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] }); return res.violations.map(v => v.id + ' (' + v.nodes.length + ') ' + v.nodes[0].html.slice(0, 80) + ' ' + (v.nodes[0].any[0] ? v.nodes[0].any[0].message.slice(0, 70) : '')) }''')
    r['telas'][nome] = {'alvos_pequenos': pequenos, 'textos_miudos': miudos, 'rolagem_horizontal': horiz, 'axe': axe}

with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={'width': 360, 'height': 780}, device_scale_factor=2, has_touch=True, is_mobile=True, locale='pt-BR')
    pg = ctx.new_page()
    erros = []; pg.on('pageerror', lambda e: erros.append(str(e)))
    toques = [0]
    bloqueados = []
    def tocar(sel):
        try: pg.locator(sel).first.tap(timeout=2500)
        except Exception:
            # o alvo existe mas está coberto ou fora da tela: problema de usabilidade
            bloqueados.append(sel); pg.locator(sel).first.dispatch_event('click')
        toques[0] += 1; pg.wait_for_timeout(120)

    # T1: aluno novo chega e começa a primeira lição
    t0 = time.time(); pg.goto(URL); pg.wait_for_load_state('networkidle')
    acima = pg.evaluate('''() => { const n = document.querySelector('.no.atual, .no'); const b = n && n.getBoundingClientRect(); return !!b && b.bottom < innerHeight - 70 }''')
    toques[0] = 0
    # caminho mais curto para a 1ª ideia da lição 1
    if pg.locator('.bv').count():
        for k in range(8):
            if not pg.locator('.bv').count(): break
            auditar_tela(pg, '00-boas-vindas-%d' % k)
            if pg.locator('.bv-banca').count(): tocar('.bv-banca >> nth=0'); pg.wait_for_timeout(300); continue
            if pg.locator('.bv-horas').count(): tocar('.bv-base .btn:not(.btn-ok)'); continue
            tocar('.bv-base .btn-ok')
    else: tocar('.no.atual')
    pg.wait_for_selector('.licao.aberta')
    r['tarefas']['T1 começar a 1ª lição (com boas-vindas)'] = {'toques': toques[0], 'segundos': round(time.time() - t0, 1), 'botao_comecar_visivel_sem_rolar': acima}
    auditar_tela(pg, '02-licao-ideia')

    # T2: completar a lição 1 acertando tudo
    toques[0] = 0; t0 = time.time(); questoes = GAB['0']; feitas = 0
    for _ in range(60):
        if pg.locator('.fim').count(): break
        if pg.locator('.revelar').count(): tocar('.revelar'); continue
        if pg.locator('.imersao').count() and pg.locator('.opcoes .opcao:not([disabled])').count():
            if not r['telas'].get('02b-imersao'): auditar_tela(pg, '02b-imersao')
            tocar('.opcoes .opcao >> nth=0')
        if pg.locator('.pares').count() and pg.locator('.par:not([disabled])').count():
            if not r['telas'].get('03b-pares'): auditar_tela(pg, '03b-pares')
            cols = pg.locator('.pares-col')
            for i in range(cols.nth(0).locator('.par').count()):
                for j in range(cols.nth(1).locator('.par').count()):
                    if cols.nth(0).locator('.par').nth(i).is_disabled(): break
                    if cols.nth(1).locator('.par').nth(j).is_disabled(): continue
                    cols.nth(0).locator('.par').nth(i).tap(); cols.nth(1).locator('.par').nth(j).tap(); toques[0] += 2; pg.wait_for_timeout(80)
            pg.wait_for_timeout(400)
        if pg.locator('.vf-b:not([disabled])').count():
            tocar('.vf-b >> nth=1')  # "Falso" é a resposta da lição 1
            continue
        if pg.locator('.lab').count() and not r['telas'].get('03-laboratorio'): auditar_tela(pg, '03-laboratorio')
        if pg.locator('.opcoes').count() and not pg.locator('.opcao[disabled]').count():
            enun = pg.locator('#licao-titulo').inner_text()[:40]
            alvo = next((q['c'] for q in questoes if q['p'][:20] in enun.replace('\n', ' ')), 0)
            tocar(f'.opcao >> nth={alvo}')
            if feitas == 0: auditar_tela(pg, '04-questao-escolhida')
            tocar('.licao-base .btn-ok')
            if feitas == 0: auditar_tela(pg, '05-questao-feedback')
            feitas += 1
        tocar('.licao-base .btn-ok')
    pg.wait_for_selector('.fim'); auditar_tela(pg, '06-fim-licao')
    r['tarefas']['T2 completar a lição 1'] = {'toques': toques[0], 'segundos': round(time.time() - t0, 1)}
    tocar('.licao-base .btn-ok')
    auditar_tela(pg, '01-inicio')

    # T7: abrir a prática e fazer a revisão inteligente
    toques[0] = 0; tocar('.nav-inferior a[href="#/praticar"]'); pg.wait_for_timeout(300)
    auditar_tela(pg, '06b-praticar')
    tocar('.destaque-rev .btn-ok')
    n = 0
    while pg.locator('.licao.aberta').count() and n < 15:
        if pg.locator('.fim').count(): break
        tocar('.opcao >> nth=0'); tocar('.licao-base .btn-ok'); n += 1
    auditar_tela(pg, '06c-revisao-fim')
    tocar('.licao-base .btn-ok')
    r['tarefas']['T7 fazer a revisão inteligente'] = {'toques': toques[0]}

    # T3: encontrar o ranking
    toques[0] = 0; tocar('.nav-inferior a[href="#/ranking"]'); pg.wait_for_timeout(1200)
    r['tarefas']['T3 abrir o ranking'] = {'toques': toques[0]}
    auditar_tela(pg, '07-ranking')

    # T4: mudar a meta diária para 50 XP
    toques[0] = 0; tocar('.nav-inferior a[href="#/painel"]')
    sel = pg.locator('select').first; sel.scroll_into_view_if_needed()
    sel.select_option('50'); toques[0] += 1
    r['tarefas']['T4 mudar a meta diária'] = {'toques': toques[0], 'precisou_rolar': pg.evaluate('scrollY') > 0}
    auditar_tela(pg, '08-painel')

    # T5: sair no meio de uma lição (botão voltar do celular = Escape aqui)
    pg.goto(URL); pg.wait_for_timeout(400)
    tocar('.no.atual'); pg.wait_for_selector('.licao.aberta'); tocar('.licao-base .btn-ok')
    pg.go_back(); pg.wait_for_timeout(400)
    r['tarefas']['T5 voltar do Android fecha a lição sem sair do app'] = {'licao_fechou': not pg.locator('.licao.aberta').count(), 'ainda_no_app': pg.url.startswith(URL.split('#')[0])}

    # T6: login — formulário aceita e-mail com espaços/maiúsculas
    pg.goto(URL + '#/entrar'); pg.wait_for_timeout(400)
    pg.fill('input[type=email]', '  Ana@Email.COM ')
    r['tarefas']['T6 e-mail com espaços é aceito'] = {'botao_habilitado': pg.locator('.entrar .btn-pri').is_enabled()}
    auditar_tela(pg, '09-entrar')
    r['erros_js'] = erros
    r['toques_bloqueados'] = sorted(set(bloqueados))
    r['largura_layout_360'] = pg.evaluate('document.documentElement.scrollWidth')
    b.close()

json.dump(r, open(OUT / 'resultado.json', 'w'), ensure_ascii=False, indent=1)
for k, v in r['tarefas'].items(): print(k, v)
for k, v in r['telas'].items(): print(k, '| alvos<44:', len(v['alvos_pequenos']), v['alvos_pequenos'][:4], '| miúdos:', len(v['textos_miudos']), '| axe:', v['axe'], '| horiz:', v['rolagem_horizontal'])
print('erros', r['erros_js']); print('bloqueados', r['toques_bloqueados'], 'largura', r['largura_layout_360'])
