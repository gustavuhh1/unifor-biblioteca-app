import { apiRequest } from '@/shared/api/client'
import type { NotificationsResponse } from '../notifications.types'

// Avisos do aluno, os mais novos primeiro (GET /me/notifications).
export function getNotifications() {
  return apiRequest<NotificationsResponse>('/me/notifications')
}
