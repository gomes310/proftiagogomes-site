// Recebe o formulário do site e grava o contato na lista "Leads YouTube" da Brevo.
// Variáveis de ambiente (Netlify > Project configuration > Environment variables):
//   BREVO_API_KEY      chave de API da Brevo (marcar como secreta)
//   BREVO_LISTA_LEADS  id da lista "Leads YouTube" (opcional: sem ela, a lista é achada pelo nome)

const BREVO = 'https://api.brevo.com/v3';
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const BANCAS = ['IDECAN', 'AOCP', 'FGV', 'CEBRASPE', 'IBFC', 'Fundatec', 'IBGP', 'Legalle', 'MS CONCURSOS', 'Vunesp', 'FCC', 'Outra'];

const resposta = (status, corpo) => new Response(JSON.stringify(corpo), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8' }
});

async function brevo(chave, metodo, caminho, corpo) {
  const r = await fetch(BREVO + caminho, {
    method: metodo,
    headers: { 'api-key': chave, 'Content-Type': 'application/json', accept: 'application/json' },
    body: corpo ? JSON.stringify(corpo) : undefined
  });
  const texto = await r.text();
  return { status: r.status, corpo: texto ? JSON.parse(texto) : null };
}

async function idDaLista(chave) {
  if (process.env.BREVO_LISTA_LEADS) return Number(process.env.BREVO_LISTA_LEADS);
  const r = await brevo(chave, 'GET', '/contacts/lists?limit=50');
  const lista = (r.corpo?.lists || []).find((l) => l.name === 'Leads YouTube');
  return lista ? lista.id : null;
}

export default async (req) => {
  if (req.method !== 'POST') return resposta(405, { erro: 'Use o formulário do site.' });
  const chave = process.env.BREVO_API_KEY;
  if (!chave) return resposta(500, { erro: 'Inscrições ainda não configuradas. Tente de novo mais tarde.' });

  let d;
  try { d = await req.json(); } catch { return resposta(400, { erro: 'Envio inválido.' }); }
  if (d.site) return resposta(200, { ok: true }); // armadilha para robôs

  const email = String(d.email || '').trim().toLowerCase();
  if (!EMAIL_OK.test(email)) return resposta(400, { erro: 'Digite um e-mail válido para receber as questões.' });
  if (d.aceite !== true) return resposta(400, { erro: 'Marque a caixa de autorização para receber os e-mails.' });

  const nome = String(d.nome || '').trim().split(/\s+/)[0].slice(0, 40);
  const banca = BANCAS.includes(d.banca) ? d.banca : '';
  const lista = await idDaLista(chave);
  if (!lista) return resposta(500, { erro: 'Inscrições ainda não configuradas. Tente de novo mais tarde.' });

  const atributos = { ORIGEM: 'youtube', OPT_IN: true };
  if (nome) atributos.NOME = nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase();
  if (banca && banca !== 'Outra') atributos.BANCAS = banca;

  const r = await brevo(chave, 'POST', '/contacts', {
    email, attributes: atributos, listIds: [lista], updateEnabled: true
  });
  if (r.status >= 300) {
    console.error('Brevo', r.status, JSON.stringify(r.corpo));
    return resposta(502, { erro: 'Não foi possível registrar agora. Tente de novo em alguns minutos.' });
  }
  return resposta(200, { ok: true });
};

export const config = { path: '/api/inscrever' };
