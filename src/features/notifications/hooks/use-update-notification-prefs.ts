import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Me } from '@/features/auth/auth.types'
import { ME_QUERY_KEY } from '@/features/auth/auth.constants'
import type { NotificationPrefs } from '@/shared/types'
import { patchNotificationPrefs } from '../api/notifications.api'
import { preferenceChange } from '../notifications.prefs'

// Liga ou desliga um aviso ou canal (RF-AVI-03, PATCH /me/notification-prefs).
// A API devolve as preferências completas: elas entram direto em GET /me, que é
// de onde a tela lê os valores.
export function useUpdateNotificationPrefs() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      key,
      value,
    }: {
      key: keyof NotificationPrefs
      value: boolean
    }) => patchNotificationPrefs(preferenceChange(key, value)),
    onSuccess: (prefs) => {
      queryClient.setQueryData<Me>(ME_QUERY_KEY, (me) =>
        me ? { ...me, notificationPrefs: prefs } : me,
      )
    },
  })
}
