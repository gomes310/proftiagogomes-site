// @ts-nocheck -- código DOM portado; tipado na borda (export LABS)
// Laboratórios interativos de cada lição (HTML + init), portados da versão 1.
import { som } from '../som';
  export function el(html) { var d = document.createElement('div'); d.innerHTML = html; return d.firstElementChild; }
  export function bol(v) { return '<span class="bolha' + (v ? ' v' : '') + '">' + (v ? 'V' : 'F') + '</span>'; }
  function grupo(box, sel, fn) {
    box.querySelectorAll(sel).forEach(function (b) {
      b.addEventListener('click', function () {
        box.querySelectorAll(sel).forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true'); fn(b);
      });
    });
  }
  var DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

  export const LABS: { dica: string; html: string; init: (box: HTMLElement) => void }[] = [
    // 0 Conjuntos: diagrama de Venn clicável
    { dica: 'Toque nas operações e veja que parte do diagrama acende.', html:
      '<svg class="venn" viewBox="0 0 320 190" role="img" aria-label="Diagrama de Venn de A e B">' +
      '<defs><clipPath id="cB"><circle cx="190" cy="95" r="80"/></clipPath><clipPath id="cA"><circle cx="130" cy="95" r="80"/></clipPath>' +
      '<mask id="mB"><rect width="320" height="190" fill="#fff"/><circle cx="190" cy="95" r="80" fill="#000"/></mask>' +
      '<mask id="mA"><rect width="320" height="190" fill="#fff"/><circle cx="130" cy="95" r="80" fill="#000"/></mask></defs>' +
      '<circle data-r="a" cx="130" cy="95" r="80" mask="url(#mB)"/><circle data-r="ab" cx="130" cy="95" r="80" clip-path="url(#cB)"/><circle data-r="b" cx="190" cy="95" r="80" mask="url(#mA)"/>' +
      '<circle cx="130" cy="95" r="80" class="borda"/><circle cx="190" cy="95" r="80" class="borda"/>' +
      '<text x="70" y="30" class="nome">A</text><text x="246" y="30" class="nome">B</text>' +
      '<text x="80" y="90">1</text><text x="96" y="126">2</text><text x="160" y="84">3</text><text x="160" y="122">4</text><text x="228" y="104">5</text></svg>' +
      '<div class="chips" role="group" aria-label="Operações"><button type="button" class="chip-b" data-op="u">A ∪ B</button><button type="button" class="chip-b" data-op="i">A ∩ B</button><button type="button" class="chip-b" data-op="ab">A − B</button><button type="button" class="chip-b" data-op="ba">B − A</button></div>' +
      '<p class="lab-saida" aria-live="polite">A = {1, 2, 3, 4} e B = {3, 4, 5}</p>',
      init: function (box) {
        var R = { u: ['a', 'ab', 'b', 'A ∪ B = {1, 2, 3, 4, 5}: junta tudo, sem repetir.'], i: ['ab', 'A ∩ B = {3, 4}: só o que é comum.'], ab: ['a', 'A − B = {1, 2}: está em A e não está em B.'], ba: ['b', 'B − A = {5}: está em B e não está em A.'] };
        grupo(box, '.chip-b', function (b) {
          var r = R[b.dataset.op];
          box.querySelectorAll('[data-r]').forEach(function (c) { c.classList.toggle('aceso', r.indexOf(c.dataset.r) > -1 && r.indexOf(c.dataset.r) < r.length - 1); });
          box.querySelector('.lab-saida').textContent = r[r.length - 1];
        });
      } },
    // 1 Proposições: classificar frases
    { dica: 'Decida: cada frase é proposição ou não?', html:
      '<ul class="classif">' + [['Campo Grande fica em Mato Grosso do Sul.', 1, 'Declarativa: dá para julgar V ou F.'], ['Que horas são?', 0, 'Pergunta não é proposição.'], ['Estude todos os dias!', 0, 'Ordem não é proposição.'], ['x + 2 = 5', 0, 'Sentença aberta: depende do valor de x.']].map(function (f) {
        return '<li data-c="' + f[1] + '" data-e="' + f[2] + '"><span>' + f[0] + '</span><div class="chips"><button type="button" class="chip-b" data-v="1">É proposição</button><button type="button" class="chip-b" data-v="0">Não é</button></div><small aria-live="polite"></small></li>';
      }).join('') + '</ul>',
      init: function (box) {
        box.querySelectorAll('.classif li').forEach(function (li) {
          grupo(li, '.chip-b', function (b) {
            var ok = b.dataset.v === li.dataset.c;
            li.className = ok ? 'ok' : 'nao'; som(ok ? 'certo' : 'erro');
            li.querySelector('small').textContent = (ok ? 'Certo! ' : 'Não. ') + li.dataset.e;
          });
        });
      } },
    // 2 Tabela-verdade: liga/desliga p e q
    { dica: 'Toque em p e q para trocar entre V e F e escolha o conectivo.', html:
      '<div class="tv-lab"><button type="button" class="tog" data-x="p">p = ' + bol(true) + '</button><button type="button" class="tog" data-x="q">q = ' + bol(true) + '</button></div>' +
      '<div class="chips" role="group" aria-label="Conectivo"><button type="button" class="chip-b" data-c="e" aria-pressed="true">∧ e</button><button type="button" class="chip-b" data-c="ou">∨ ou</button><button type="button" class="chip-b" data-c="xou">⊻ ou… ou…</button><button type="button" class="chip-b" data-c="se">→ se… então</button><button type="button" class="chip-b" data-c="sse">↔ se e somente se</button></div>' +
      '<p class="lab-saida grande" aria-live="polite"></p>',
      init: function (box) {
        var s = { p: true, q: true, c: 'e' };
        var C = { e: ['∧', function (p, q) { return p && q; }, 'só é V quando as duas são V'], ou: ['∨', function (p, q) { return p || q; }, 'só é F quando as duas são F'], xou: ['⊻', function (p, q) { return p !== q; }, 'é V quando exatamente uma é V'], se: ['→', function (p, q) { return !p || q; }, 'só é F quando vai de V para F'], sse: ['↔', function (p, q) { return p === q; }, 'é V quando as duas têm o mesmo valor'] };
        function upd() {
          var c = C[s.c], r = c[1](s.p, s.q);
          box.querySelector('[data-x=p]').innerHTML = 'p = ' + bol(s.p); box.querySelector('[data-x=q]').innerHTML = 'q = ' + bol(s.q);
          box.querySelector('.lab-saida').innerHTML = 'p ' + c[0] + ' q = ' + bol(r) + '<small>Regra: ' + c[2] + '.</small>';
        }
        box.querySelectorAll('.tog').forEach(function (b) { b.addEventListener('click', function () { s[b.dataset.x] = !s[b.dataset.x]; upd(); }); });
        grupo(box, '.chip-b', function (b) { s.c = b.dataset.c; upd(); });
        upd();
      } },
    // 3 Equivalências: cartas que viram
    { dica: 'Pense na negação e toque na carta para conferir.', html:
      '<div class="cartas">' + [['João é alto e magro.', 'João não é alto ou não é magro.'], ['Vou à praia ou ao cinema.', 'Não vou à praia e não vou ao cinema.'], ['Se estudo, então passo.', 'Estudo e não passo.']].map(function (c) {
        return '<button type="button" class="carta" aria-expanded="false"><span class="frente"><small>Negue:</small>' + c[0] + '</span><span class="verso"><small>Negação:</small>' + c[1] + '</span></button>';
      }).join('') + '</div>',
      init: function (box) { box.querySelectorAll('.carta').forEach(function (b) { b.addEventListener('click', function () { var v = b.getAttribute('aria-expanded') !== 'true'; b.setAttribute('aria-expanded', v); }); }); } },
    // 4 Tautologia
    { dica: 'Troque o valor de p e observe quais resultados mudam.', html:
      '<div class="tv-lab"><button type="button" class="tog" data-x="p">p = ' + bol(true) + '</button></div>' +
      '<table class="mini"><tbody><tr><td>p ∨ ~p</td><td data-f="0"></td><td>Tautologia</td></tr><tr><td>p ∧ ~p</td><td data-f="1"></td><td>Contradição</td></tr><tr><td>p → ~p</td><td data-f="2"></td><td>Contingência</td></tr></tbody></table>' +
      '<p class="lab-saida" aria-live="polite">A tautologia nunca sai do V. A contradição nunca sai do F. A contingência muda.</p>',
      init: function (box) {
        var p = true, F = [function (p) { return true; }, function (p) { return false; }, function (p) { return !p; }];
        function upd() { box.querySelector('.tog').innerHTML = 'p = ' + bol(p); box.querySelectorAll('[data-f]').forEach(function (td) { td.innerHTML = bol(F[+td.dataset.f](p)); }); }
        box.querySelector('.tog').addEventListener('click', function () { p = !p; upd(); }); upd();
      } },
    // 5 Diagramas lógicos
    { dica: 'Escolha a frase e veja como os círculos ficam.', html:
      '<svg class="venn diag" viewBox="0 0 320 190" role="img" aria-label="Diagrama da frase escolhida"></svg>' +
      '<div class="chips" role="group" aria-label="Frases"><button type="button" class="chip-b" data-d="todo" aria-pressed="true">Todo A é B</button><button type="button" class="chip-b" data-d="algum">Algum A é B</button><button type="button" class="chip-b" data-d="nenhum">Nenhum A é B</button><button type="button" class="chip-b" data-d="algumnao">Algum A não é B</button></div>' +
      '<p class="lab-saida" aria-live="polite"></p>',
      init: function (box) {
        var D = {
          todo: ['<circle cx="160" cy="95" r="85" class="borda"/><circle cx="160" cy="105" r="45" class="cheio"/><text x="160" y="110" class="nome" text-anchor="middle">A</text><text x="160" y="35" class="nome" text-anchor="middle">B</text>', 'O círculo A fica inteiro dentro de B. Negação: "Algum A não é B".'],
          algum: ['<circle cx="125" cy="95" r="70" class="borda"/><circle cx="195" cy="95" r="70" class="borda"/><text x="160" y="102" text-anchor="middle" class="marca-x">✕</text><text x="80" y="40" class="nome">A</text><text x="232" y="40" class="nome">B</text>', 'Existe pelo menos um elemento na parte comum (✕). Negação: "Nenhum A é B".'],
          nenhum: ['<circle cx="85" cy="95" r="62" class="borda"/><circle cx="235" cy="95" r="62" class="borda"/><text x="85" y="102" class="nome" text-anchor="middle">A</text><text x="235" y="102" class="nome" text-anchor="middle">B</text>', 'Os círculos não se tocam. Negação: "Algum A é B".'],
          algumnao: ['<circle cx="125" cy="95" r="70" class="borda"/><circle cx="195" cy="95" r="70" class="borda"/><text x="95" y="102" text-anchor="middle" class="marca-x">✕</text><text x="80" y="40" class="nome">A</text><text x="232" y="40" class="nome">B</text>', 'Existe pelo menos um A fora de B (✕). Negação: "Todo A é B".']
        };
        function upd(k) { box.querySelector('.diag').innerHTML = D[k][0]; box.querySelector('.lab-saida').textContent = D[k][1]; }
        grupo(box, '.chip-b', function (b) { upd(b.dataset.d); }); upd('todo');
      } },
    // 6 Implicações
    { dica: 'Regra: "Se chove, então a rua molha." Escolha o que aconteceu.', html:
      '<div class="chips" role="group" aria-label="O que aconteceu"><button type="button" class="chip-b" data-k="0">Choveu</button><button type="button" class="chip-b" data-k="1">A rua não molhou</button><button type="button" class="chip-b" data-k="2">A rua molhou</button><button type="button" class="chip-b" data-k="3">Não choveu</button></div>' +
      '<p class="lab-saida grande" aria-live="polite">Toque numa opção.</p>',
      init: function (box) {
        var R = [['✓ Logo, a rua molhou.', 'Modus ponens: afirmou a causa, vale a consequência.', 'ok'], ['✓ Logo, não choveu.', 'Modus tollens: negou a consequência, nega a causa.', 'ok'], ['✗ Nada se conclui.', 'A rua pode ter molhado por outro motivo (uma mangueira, por exemplo).', 'nao'], ['✗ Nada se conclui.', 'Sem chuva, a rua ainda pode estar molhada ou seca.', 'nao']];
        grupo(box, '.chip-b', function (b) { var r = R[+b.dataset.k], s = box.querySelector('.lab-saida'); s.className = 'lab-saida grande ' + r[2]; s.innerHTML = r[0] + '<small>' + r[1] + '</small>'; });
      } },
    // 7 Associação: grade
    { dica: 'Toque nas casas: 1 toque marca ✗, 2 toques marcam ✓. Depois confira.', html:
      '<ul class="pistas"><li>Ana não tem carro nem moto.</li><li>Caio não tem carro.</li></ul>' +
      '<table class="grade"><thead><tr><th></th><th>Carro</th><th>Moto</th><th>Bicicleta</th></tr></thead><tbody>' +
      ['Ana', 'Bia', 'Caio'].map(function (n, r) { return '<tr><th>' + n + '</th>' + [0, 1, 2].map(function (c) { return '<td><button type="button" class="casa" data-r="' + r + '" data-c="' + c + '" aria-label="' + n + ', ' + ['carro', 'moto', 'bicicleta'][c] + ': vazio"></button></td>'; }).join('') + '</tr>'; }).join('') +
      '</tbody></table><div class="chips"><button type="button" class="chip-b conferir">Conferir</button></div><p class="lab-saida" aria-live="polite"></p>',
      init: function (box) {
        var SOL = [2, 0, 1], NOM = ['vazio', '✗', '✓'];
        box.querySelectorAll('.casa').forEach(function (b) { b.dataset.s = 0; b.addEventListener('click', function () { var s = (+b.dataset.s + 1) % 3; b.dataset.s = s; b.textContent = s ? NOM[s] : ''; b.setAttribute('aria-label', b.getAttribute('aria-label').replace(/: .*/, ': ' + NOM[s])); }); });
        box.querySelector('.conferir').addEventListener('click', function () {
          var ok = SOL.every(function (c, r) { return box.querySelector('.casa[data-r="' + r + '"][data-c="' + c + '"]').dataset.s === '2'; });
          var s = box.querySelector('.lab-saida'); s.className = 'lab-saida ' + (ok ? 'ok' : 'nao');
          som(ok ? 'certo' : 'erro'); s.textContent = ok ? 'Perfeito! Ana: bicicleta. Bia: carro. Caio: moto.' : 'Ainda não. Dica: comece pela Ana, que só pode ter uma coisa. Marque ✓ nas três respostas.';
        });
      } },
    // 8 Sequências: revelar diferenças
    { dica: 'Toque nos círculos entre os números para revelar a diferença.', html:
      '<div class="seq">' + [2, 5, 10, 17, 26].map(function (n, i, a) { return '<b>' + n + '</b>' + (i < a.length - 1 ? '<button type="button" class="dif" data-d="+' + (a[i + 1] - n) + '" aria-label="Revelar diferença">?</button>' : ''); }).join('') + '<button type="button" class="dif ultimo" data-d="+11" aria-label="Revelar a próxima diferença" disabled>?</button><b class="prox">?</b></div>' +
      '<p class="lab-saida" aria-live="polite">Revele as 4 diferenças.</p>',
      init: function (box) {
        var abertas = 0, s = box.querySelector('.lab-saida'), ult = box.querySelector('.ultimo');
        box.querySelectorAll('.dif').forEach(function (b) { b.addEventListener('click', function () {
          if (b.classList.contains('aberta')) return;
          b.classList.add('aberta'); b.textContent = b.dataset.d;
          if (b === ult) { box.querySelector('.prox').textContent = '37'; box.querySelector('.prox').classList.add('achou'); som('certo'); s.textContent = 'As diferenças sobem de 2 em 2: a próxima é 11, e 26 + 11 = 37.'; return; }
          if (++abertas === 4) { ult.disabled = false; s.textContent = '3, 5, 7, 9… Qual vem agora? Toque no último círculo.'; }
        }); });
      } },
    // 9 Casa dos pombos
    { dica: 'Coloque pessoas uma a uma, sempre no pior caso (mês ainda vazio).', html:
      '<div class="meses">' + ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'].map(function (m) { return '<div class="mes"><small>' + m + '</small><span></span></div>'; }).join('') + '</div>' +
      '<div class="chips"><button type="button" class="chip-b mais">+ 1 pessoa</button><button type="button" class="chip-b zerar">Recomeçar</button></div><p class="lab-saida" aria-live="polite">0 pessoas.</p>',
      init: function (box) {
        var n = 0, meses = box.querySelectorAll('.mes'), s = box.querySelector('.lab-saida');
        box.querySelector('.mais').addEventListener('click', function () {
          if (n >= 13) return;
          var m = meses[n % 12]; n++; m.querySelector('span').textContent += '●'; m.classList.add('cheio');
          if (n === 13) { som('certo'); m.classList.add('repete'); s.className = 'lab-saida ok'; s.textContent = '13 pessoas: agora um mês tem duas, com certeza. Pombos > casas.'; }
          else s.textContent = n + (n === 1 ? ' pessoa' : ' pessoas') + (n === 12 ? ': todos os meses ocupados, ainda sem repetir. E a próxima?' : ', nenhum mês repetido ainda.');
        });
        box.querySelector('.zerar').addEventListener('click', function () { n = 0; meses.forEach(function (m) { m.className = 'mes'; m.querySelector('span').textContent = ''; }); s.className = 'lab-saida'; s.textContent = '0 pessoas.'; });
      } },
    // 10 Datas: calculadora
    { dica: 'Escolha o dia de hoje e quantos dias vão passar.', html:
      '<div class="chips dias" role="group" aria-label="Hoje é">' + DIAS.map(function (d, i) { return '<button type="button" class="chip-b" data-d="' + i + '"' + (i === 6 ? ' aria-pressed="true"' : '') + '>' + d.slice(0, 3) + '</button>'; }).join('') + '</div>' +
      '<label class="campo">Daqui a quantos dias? <input type="text" inputmode="numeric" value="829" autocomplete="off"></label>' +
      '<p class="lab-saida grande" aria-live="polite"></p>',
      init: function (box) {
        var d = 6, inp = box.querySelector('input');
        function upd() {
          var n = parseInt(String(inp.value).replace(/\D/g, ''), 10), s = box.querySelector('.lab-saida');
          if (isNaN(n)) { s.innerHTML = 'Digite um número de dias.'; return; }
          var r = n % 7, q = Math.floor(n / 7);
          s.innerHTML = n + ' = 7 × ' + q + ' + <mark>' + r + '</mark><small>Hoje é ' + DIAS[d] + '. Andando ' + r + (r === 1 ? ' dia' : ' dias') + ': <strong>' + DIAS[(d + r) % 7] + '</strong>.</small>';
        }
        grupo(box, '.chip-b', function (b) { d = +b.dataset.d; upd(); });
        inp.addEventListener('input', upd); upd();
      } }
  ];

