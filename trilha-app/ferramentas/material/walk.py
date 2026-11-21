import json, sys
exec(open('/tmp/q3/novas_licoes.py').read())
CERTA = {}
for idx, d in L.items():
    for q in d['licao']['questoes']: CERTA[q['p'][:30]] = q['o'][q['c']]
from playwright.sync_api import sync_playwright
erros = []
tent = {}
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 390, 'height': 844})
    pg.on('pageerror', lambda e: erros.append(str(e)))
    for tema, lics in [(4, [6, 30, 31, 18]), (8, [27, 5, 28, 29]), (9, [32, 33, 34])]:
        est = {'tema': tema, 'estrelas': {str(i): 3 for i in range(35) if i not in lics}}
        pg.goto('http://localhost:8780/#/'); pg.evaluate(f"localStorage.setItem('trilha-boas-vindas','1'); localStorage.setItem('trilha-rlm-v1', JSON.stringify({json.dumps(est)}))"); pg.reload(); pg.wait_for_timeout(600)
        for k, idx in enumerate(lics):
            nos = pg.locator('button.no:not(.no-prova)')
            nos.nth(k).click(); pg.wait_for_selector('.licao.aberta', timeout=4000)
            for _ in range(120):
                if pg.locator('.fim').count(): break
                if pg.locator('.revelar').count(): pg.click('.revelar'); continue
                if pg.locator('.sua-vez').count() and not pg.locator('.licao-base.acerto').count():
                    pg.locator('.opcoes .opcao:not([disabled])').first.click(); continue
                if pg.locator('.pares').count() and pg.locator('.par:not([disabled])').count():
                    cols = pg.locator('.pares-col')
                    for i in range(cols.nth(0).locator('.par').count()):
                        for j in range(cols.nth(1).locator('.par').count()):
                            if cols.nth(0).locator('.par').nth(i).is_disabled(): break
                            if cols.nth(1).locator('.par').nth(j).is_disabled(): continue
                            cols.nth(0).locator('.par').nth(i).click(); cols.nth(1).locator('.par').nth(j).click(); pg.wait_for_timeout(60)
                    pg.wait_for_timeout(400); 
                if pg.locator('.vf-b:not([disabled])').count(): pg.locator('.vf-b').first.click(); 
                if pg.locator('.opcoes').count() and not pg.locator('.opcao[disabled]').count() and not pg.locator('.sua-vez').count() and pg.locator('.rotulo').count():
                    tit = pg.locator('#licao-titulo').inner_text().replace('\n', ' ')
                    alvo = next((v for kk, v in CERTA.items() if kk in tit), None)
                    if alvo: pg.locator('.opcao', has_text=alvo).first.click()
                    else:
                        n = tent.get(tit, 0); tent[tit] = n + 1
                        pg.locator('.opcao').nth(n % pg.locator('.opcao').count()).click()
                    pg.click('.licao-base .btn-ok')
                btn = pg.locator('.licao-base .btn-ok')
                if btn.is_enabled(): btn.click()
                pg.wait_for_timeout(60)
            ok = pg.locator('.fim').count() > 0
            print('lição', idx, 'terminou' if ok else 'NÃO TERMINOU', pg.locator('.fim .placar, .fim h2').first.inner_text()[:60] if ok else pg.locator('#licao-titulo').inner_text()[:80])
            if idx in (27, 32): pg.screenshot(path=f'/tmp/fim{idx}.png')
            if ok: pg.locator('.licao-base .btn-ok').click()
            else: pg.locator('.licao-topo .fechar').first.click()
            pg.wait_for_timeout(500)
    pg.goto('http://localhost:8780/#/'); pg.evaluate("localStorage.setItem('trilha-rlm-v1', JSON.stringify({tema:-1}))"); pg.reload(); pg.wait_for_timeout(700)
    pg.screenshot(path='/tmp/temas.png', full_page=True)
    pg.goto('http://localhost:8780/#/provas'); pg.wait_for_timeout(700); pg.screenshot(path='/tmp/provas.png', full_page=False)
    print('erros', erros)
