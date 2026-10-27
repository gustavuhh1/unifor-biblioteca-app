import { useQuery } from '@tanstack/react-query'
import { getNotifications } from '../api/notifications.api'
import { NOTIFICATIONS_QUERY_KEY } from '../notifications.constants'

// Avisos do aluno e o número do sino (RF-AVI-01): GET /me/notifications.
export function useNotifications() {
  return useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY],
    queryFn: getNotifications,
  })
}
