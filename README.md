# proftiagogomes.com.br

Site do Prof. Tiago Gomes. Publicado pela Netlify a cada push na branch `main`.

- `index.html` — página principal (tabela-verdade interativa, inscrição, materiais por banca)
- `privacidade.html` — como os dados são usados
- `netlify/functions/inscrever.mjs` — grava a inscrição na lista "Leads YouTube" da Brevo

Variáveis de ambiente na Netlify: `BREVO_API_KEY` (secreta) e, opcional, `BREVO_LISTA_LEADS`.
