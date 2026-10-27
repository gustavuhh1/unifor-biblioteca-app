import type { NotificationPrefs } from '@/shared/types'

// Uma linha da tela Avisos e lembretes (A51, RF-AVI-03). Os textos de cada tipo
// seguem o que a API faz: a preferência `pickupReady`, por exemplo, também manda
// o aviso de retirada acabando e de pedido vencido.
export interface PreferenceItem {
  key: keyof NotificationPrefs
  title: string
  detail: string
}

// Avisos de prazo e de fila. Os dois primeiros ficam sempre ligados.
export const NOTICE_PREFERENCES: PreferenceItem[] = [
  {
    key: 'queueTurn',
    title: 'Sua vez na fila',
    detail: 'Você tem 24h para confirmar, então este aviso não desliga.',
  },
  {
    key: 'overdueAndFines',
    title: 'Atraso e multa',
    detail: 'Avisamos no 1º dia útil de atraso e quando há multa em aberto.',
  },
  {
    key: 'pickupReady',
    title: 'Pedido pronto para retirar',
    detail: 'Quando o livro está separado, e quando o prazo de retirada acaba.',
  },
  {
    key: 'dueReminders',
    title: 'Lembrete de devolução',
    detail: '2 dias antes e no dia do prazo.',
  },
  {
    key: 'queueUpdates',
    title: 'Mudanças na fila',
    detail: 'Quando você sobe na fila ou o bibliotecário mexe nela.',
  },
  {
    key: 'returnConfirmed',
    title: 'Devolução, renovação e pagamento',
    detail: 'A confirmação de cada um deles.',
  },
]

// Por onde os avisos chegam, além de dentro do app (que é sempre).
export const CHANNEL_PREFERENCES: PreferenceItem[] = [
  {
    key: 'channelPush',
    title: 'Notificação no celular',
    detail: 'Só no Android. Precisa estar permitida nos ajustes do celular.',
  },
  {
    key: 'channelEmail',
    title: 'E-mail institucional',
    detail: 'No e-mail do seu cadastro.',
  },
]

// As preferências que o aluno não consegue desligar (a API só aceita `true`).
const ALWAYS_ON: readonly (keyof NotificationPrefs)[] = [
  'queueTurn',
  'overdueAndFines',
]

// O aviso fica sempre ligado? Então a linha mostra "Sempre" e não tem chave.
export function isAlwaysOn(key: keyof NotificationPrefs): boolean {
  return ALWAYS_ON.includes(key)
}

// As preferências depois de mudar uma. Preferência sempre ligada não muda.
export function withPreference(
  prefs: NotificationPrefs,
  key: keyof NotificationPrefs,
  value: boolean,
): NotificationPrefs {
  if (isAlwaysOn(key)) return prefs
  return { ...prefs, [key]: value }
}

// O corpo de PATCH /me/notification-prefs para mudar uma preferência. Sempre
// ligada não vai (o aluno nem chega a tocar nela).
export function preferenceChange(
  key: keyof NotificationPrefs,
  value: boolean,
): Partial<NotificationPrefs> {
  return isAlwaysOn(key) ? {} : { [key]: value }
}
