# Questões e lições a partir do material do professor

- `parse3.py`: lê os e-books (PDF) de Proposições Categóricas, Implicação Lógica e PFC/Anagramas da pasta do curso.
- `res_cat.py`, `res_imp.py`, `res_pfc.py`: resoluções escritas para a Trilha. Só entram as questões conferidas uma a uma. Ficaram de fora: anuladas, com figura, com enunciado ambíguo ou com gabarito duvidoso.
  - Categóricas, fora: 12, 14, 17, 20, 23, 26, 31, 46, 49, 55, 56, 62, 64, 80, 81, 82, 83, 85, 87, 88, 93, 97, 99, 100.
  - Implicação, fora: 40 (duas alternativas corretas), 82 (fora do tema), 88 (fórmulas quebradas), 99 (gabarito duvidoso).
  - Contagem, fora: 3 e 4 (não diz se pode repetir), 8, 19 e 30 (gabarito não bate), 10 e 33 (imagem), 16 e 22 (ambíguas), 23 (enunciado confuso), 45 (impossível como escrita).
- `build.py`: gera `src/dados/provas-material.json` e confere se a letra citada na resolução bate com o gabarito.
- `novas_licoes.py` + `aplicar.py`: lições 27 a 34 (categóricas, implicação tipos 1 e 2, contagem). `aplicar.py` só roda uma vez.
- `walk.py`: percorre as lições novas no navegador até o fim (teste).
