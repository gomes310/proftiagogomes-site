// Função de evento do Netlify: roda sozinha depois de cada deploy publicado com sucesso.
// Avisa os buscadores que usam IndexNow (Bing, Yandex, Seznam, Naver) que as URLs do sitemap mudaram.
// Só envia quando INDEXNOW_ATIVO=1 estiver definido no Netlify — ligue depois que o domínio
// proftiagogomes.com.br estiver no ar com HTTPS, porque a chave precisa estar acessível nele.
const SITE = 'https://proftiagogomes.com.br';
const CHAVE = 'ce41f06d84d18b931a56b37efb8e0c5c';

export default async () => {
  if (process.env.INDEXNOW_ATIVO !== '1') return new Response('IndexNow desligado');
  try {
    const lista = await (await fetch(`${SITE}/urls.txt`)).text();
    const urlList = lista.split('\n').map((s) => s.trim()).filter(Boolean).slice(0, 10000);
    const r = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: 'proftiagogomes.com.br', key: CHAVE, keyLocation: `${SITE}/${CHAVE}.txt`, urlList }),
    });
    console.log('IndexNow', r.status, urlList.length, 'URLs');
    return new Response('ok');
  } catch (e) {
    console.error('IndexNow falhou', e.message);
    return new Response('erro', { status: 500 });
  }
};
