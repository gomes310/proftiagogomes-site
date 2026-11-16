// 1) www.proftiagogomes.com.br → proftiagogomes.com.br (301)
// 2) CORS da API para o app Android (Capacitor) e testes locais
import { cors } from '../lib/trilha-api.js';

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname.startsWith('www.')) {
    url.hostname = url.hostname.slice(4);
    return Response.redirect(url.toString(), 301);
  }
  if (url.pathname.startsWith('/api/') && request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors(request) });
  }
  return next();
}
