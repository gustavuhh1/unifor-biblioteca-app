import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postReadAllNotifications } from '../api/notifications.api'
import { NOTIFICATIONS_QUERY_KEY } from '../notifications.constants'

// Marca todos os avisos como lidos (RF-AVI-01, POST /me/notifications/read-all)
// e relê a lista, que também alimenta o número do sino do Início.
export function useMarkNotificationsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postReadAllNotifications,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] }),
  })
}
