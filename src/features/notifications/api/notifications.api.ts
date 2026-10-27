import { apiRequest } from '@/shared/api/client'
import type { NotificationPrefs } from '@/shared/types'
import type { NotificationsResponse } from '../notifications.types'

// Avisos do aluno, os mais novos primeiro (GET /me/notifications).
export function getNotifications() {
  return apiRequest<NotificationsResponse>('/me/notifications')
}

// Marca todos os avisos como lidos (POST /me/notifications/read-all).
export function postReadAllNotifications() {
  return apiRequest<void>('/me/notifications/read-all', { method: 'POST' })
}

// Liga ou desliga avisos e canais (PATCH /me/notification-prefs): manda só o que
// mudou e devolve as preferências completas.
export function patchNotificationPrefs(changes: Partial<NotificationPrefs>) {
  return apiRequest<NotificationPrefs>('/me/notification-prefs', {
    method: 'PATCH',
    body: changes,
  })
}
