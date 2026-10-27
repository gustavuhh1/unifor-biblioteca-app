import { NOTIFICATION_ACTION, type NotificationType } from '@/shared/types'
import type { IconName } from '@/shared/components/icon'
import type { Tone } from '@/shared/components/stat-tile'
import {
  calendarDaysFromNow,
  formatDayMonth,
  toAppDate,
} from '@/shared/utils/dates'
import type { NotificationItem } from './notifications.types'

// Ícone e tom de cada tipo de aviso (RF-AVI-01, tela A08). O status nunca vai só
// em cor: o ícone muda junto (RNF-USA-04).
export const NOTICE_STYLE: Record<
  NotificationType,
  { icon: IconName; tone: Tone }
> = {
  queue_turn: { icon: 'bell', tone: 'warning' },
  queue_turn_missed: { icon: 'x', tone: 'neutral' },
  queue_moved_up: { icon: 'users', tone: 'info' },
  queue_position_changed: { icon: 'arrowUpDown', tone: 'info' },
  queue_added_by_librarian: { icon: 'userPlus', tone: 'info' },
  queue_removed_by_librarian: { icon: 'x', tone: 'neutral' },
  queue_cancelled_other_edition: { icon: 'x', tone: 'neutral' },
  pickup_ready: { icon: 'hand', tone: 'success' },
  pickup_expiring: { icon: 'clock', tone: 'warning' },
  pickup_expired: { icon: 'x', tone: 'neutral' },
  loan_picked_up: { icon: 'check', tone: 'success' },
  due_reminder: { icon: 'clock', tone: 'warning' },
  overdue: { icon: 'alert', tone: 'danger' },
  return_confirmed: { icon: 'checkCircle', tone: 'success' },
  fine_open: { icon: 'coin', tone: 'danger' },
  fine_paid: { icon: 'checkCircle', tone: 'success' },
  renewal_done: { icon: 'refresh', tone: 'success' },
}

// Os três grupos da lista, do mais novo para o mais antigo.
export const NOTICE_GROUP_LABEL = {
  today: 'Hoje',
  week: 'Esta semana',
  older: 'Antes',
} as const
export type NoticeGroupKey = keyof typeof NOTICE_GROUP_LABEL

export interface NoticeGroup {
  key: NoticeGroupKey
  label: string
  items: NotificationItem[]
}

// Quantos dias de calendário (no fuso do app) o aviso tem em relação a `now`.
function ageInDays(iso: string, now: Date): number {
  return Math.max(0, -calendarDaysFromNow(iso, now))
}

// Agrupa os avisos em Hoje, Esta semana (de 1 a 6 dias) e Antes, sem grupos
// vazios. Mantém a ordem da API (mais novos primeiro). `now` entra por parâmetro
// para o cálculo ser testável.
export function groupNotifications(
  items: NotificationItem[],
  now: Date = new Date(),
): NoticeGroup[] {
  const buckets: Record<NoticeGroupKey, NotificationItem[]> = {
    today: [],
    week: [],
    older: [],
  }
  for (const item of items) {
    const age = ageInDays(item.createdAt, now)
    buckets[age === 0 ? 'today' : age < 7 ? 'week' : 'older'].push(item)
  }
  return (Object.keys(NOTICE_GROUP_LABEL) as NoticeGroupKey[])
    .filter((key) => buckets[key].length > 0)
    .map((key) => ({
      key,
      label: NOTICE_GROUP_LABEL[key],
      items: buckets[key],
    }))
}

const WEEKDAY = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] as const

// Horário curto do aviso: "09:12" hoje, "ontem", o dia da semana ("sex") até 6
// dias atrás e "15/10" depois.
export function noticeTime(iso: string, now: Date = new Date()): string {
  const age = ageInDays(iso, now)
  if (age === 0) {
    const date = toAppDate(iso)
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${hours}:${minutes}`
  }
  if (age === 1) return 'ontem'
  if (age < 7) return WEEKDAY[toAppDate(iso).getDay()]!
  return formatDayMonth(iso)
}

// Para onde o aviso leva ao tocar (o botão do aviso, `action`).
export interface NoticeTarget {
  pathname: string
  params?: Record<string, string>
}

export function noticeTarget(item: NotificationItem): NoticeTarget | null {
  switch (item.action) {
    case NOTIFICATION_ACTION.confirmTurn:
      return item.queueEntryId
        ? { pathname: '/your-turn', params: { entryId: item.queueEntryId } }
        : null
    case NOTIFICATION_ACTION.showQr:
      return item.loanId
        ? { pathname: '/withdrawal', params: { loanId: item.loanId } }
        : { pathname: '/withdrawal' }
    case NOTIFICATION_ACTION.openLoan:
      return { pathname: '/loans' }
    case NOTIFICATION_ACTION.openFine:
      return { pathname: '/fine' }
    default:
      return null
  }
}

// O aviso de "sua vez" mostra os botões Vou retirar e Desistir (RF-FIL-06).
export function hasTurnButtons(item: NotificationItem): boolean {
  return (
    item.action === NOTIFICATION_ACTION.confirmTurn &&
    noticeTarget(item) !== null
  )
}
