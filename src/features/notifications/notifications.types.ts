import type { NotificationAction, NotificationType } from '@/shared/types'

// Tipos exclusivos de avisos: o que GET /me/notifications devolve (schema
// `Notification` do Swagger). As datas chegam como texto ISO 8601 (UTC).

// Um aviso de dentro do app.
export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  body: string
  action: NotificationAction
  bookId: string | null
  loanId: string | null
  queueEntryId: string | null
  fineId: string | null
  readAt: string | null
  createdAt: string
}

// Resposta de GET /me/notifications.
export interface NotificationsResponse {
  items: NotificationItem[]
  // Não lidos da lista: o número do sino.
  unreadCount: number
}
