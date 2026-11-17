// Recursos do celular: botão voltar do Android, vibração, barra de status, tela de abertura e lembrete diário.
// No site (navegador) tudo isso vira "não faz nada" ou usa o equivalente da web.
import { APP } from './plataforma';

type Voltar = () => boolean; // devolve true se tratou o "voltar"
const pilha: Voltar[] = [];
export function aoVoltar(f: Voltar) { pilha.push(f); return () => { const i = pilha.lastIndexOf(f); if (i >= 0) pilha.splice(i, 1); }; }

export async function iniciarNativo() {
  if (!APP) return;
  const [{ App }, { StatusBar, Style }, { SplashScreen }] = await Promise.all([
    import('@capacitor/app'), import('@capacitor/status-bar'), import('@capacitor/splash-screen')
  ]);
  try { await StatusBar.setStyle({ style: Style.Light }); await StatusBar.setBackgroundColor({ color: '#F1F4F8' }); } catch { /* ok */ }
  void SplashScreen.hide({ fadeOutDuration: 250 });
  void App.addListener('backButton', () => {
    for (let i = pilha.length - 1; i >= 0; i--) if (pilha[i]()) return;
    void App.minimizeApp(); // na tela inicial, "voltar" minimiza como os apps do Android
  });
}

// ---------- vibração ----------
let hapt: typeof import('@capacitor/haptics') | null = null;
if (APP) void import('@capacitor/haptics').then((m) => { hapt = m; });
export function vibrar(tipo: 'certo' | 'erro' | 'toque' | 'fim') {
  try {
    if (hapt) {
      const { Haptics, ImpactStyle, NotificationType } = hapt;
      if (tipo === 'certo') void Haptics.notification({ type: NotificationType.Success });
      else if (tipo === 'erro') void Haptics.notification({ type: NotificationType.Error });
      else if (tipo === 'fim') void Haptics.impact({ style: ImpactStyle.Heavy });
      else void Haptics.impact({ style: ImpactStyle.Light });
    } else if (navigator.vibrate) navigator.vibrate(tipo === 'erro' ? [40, 60, 40] : tipo === 'fim' ? 80 : 18);
  } catch { /* sem vibração */ }
}

// ---------- lembrete diário ----------
const CHAVE = 'trilha-lembrete';
export interface Lembrete { ativo: boolean; hora: number }
export function lerLembrete(): Lembrete {
  try { const l = JSON.parse(localStorage.getItem(CHAVE) || 'null'); if (l && typeof l.hora === 'number') return l; } catch { /* ok */ }
  return { ativo: false, hora: 19 };
}
const FRASES = [
  'Sua ofensiva está esperando! 5 minutinhos de Raciocínio Lógico hoje?',
  'Uma lição por dia e a banca não te pega de surpresa. Bora?',
  'Hora da sua dose diária de lógica. Sua meta te espera!',
  'Quem estuda um pouco todo dia passa. Vamos para a próxima lição?'
];
export async function salvarLembrete(l: Lembrete): Promise<{ ok: boolean; motivo?: string }> {
  if (!APP) return { ok: false, motivo: 'O lembrete diário funciona no app Android.' };
  const { LocalNotifications } = await import('@capacitor/local-notifications');
  try {
    await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
    if (l.ativo) {
      let p = await LocalNotifications.checkPermissions();
      if (p.display !== 'granted') p = await LocalNotifications.requestPermissions();
      if (p.display !== 'granted') return { ok: false, motivo: 'Para receber o lembrete, permita as notificações do app nas configurações do Android.' };
      await LocalNotifications.schedule({ notifications: [{
        id: 1, title: 'Trilha do RLM', body: FRASES[new Date().getDate() % FRASES.length],
        schedule: { on: { hour: l.hora, minute: 0 }, allowWhileIdle: false }, smallIcon: 'ic_stat_trilha', iconColor: '#1E7A4C'
      }] });
    }
    localStorage.setItem(CHAVE, JSON.stringify(l));
    return { ok: true };
  } catch { return { ok: false, motivo: 'Não deu para agendar o lembrete. Tente de novo.' }; }
}
