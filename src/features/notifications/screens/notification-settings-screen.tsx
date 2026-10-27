import { ScrollView, Text, View } from 'react-native'
import { useSession } from '@/features/auth/hooks/use-session'
import { ApiError } from '@/shared/api/errors'
import { Alert, AppBar, Icon, Toggle } from '@/shared/components'
import { useUpdateNotificationPrefs } from '../hooks/use-update-notification-prefs'
import {
  CHANNEL_PREFERENCES,
  NOTICE_PREFERENCES,
  isAlwaysOn,
  type PreferenceItem,
} from '../notifications.prefs'

const SECTIONS = [
  { title: 'Prazos e fila', items: NOTICE_PREFERENCES },
  { title: 'Onde receber', items: CHANNEL_PREFERENCES },
] as const

// Avisos e lembretes (A51, RF-AVI-03): liga e desliga cada aviso e cada canal
// (GET /me e PATCH /me/notification-prefs). "Sua vez na fila" e "Atraso e multa"
// ficam sempre ligados. Os avisos aparecem dentro do app em qualquer caso
// (RNF-CON-02): as chaves só controlam push e e-mail.
export function NotificationSettingsScreen() {
  const { user } = useSession()
  const update = useUpdateNotificationPrefs()
  if (!user) return null

  const prefs = user.notificationPrefs

  function detailOf(item: PreferenceItem): string {
    return item.key === 'channelEmail'
      ? `${item.detail}: ${user?.email ?? ''}`
      : item.detail
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Avisos e lembretes" back />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 20 }}
      >
        {update.isError ? (
          <Alert tone="danger" title="Não foi possível salvar">
            {update.error instanceof ApiError
              ? update.error.message
              : 'Tente de novo em instantes.'}
          </Alert>
        ) : null}
        {SECTIONS.map((section) => (
          <View key={section.title} className="gap-2">
            <Text className="text-overline text-ink-muted">
              {section.title}
            </Text>
            <View className="overflow-hidden rounded-lg border border-line bg-surface-raised">
              {section.items.map((item, index) => (
                <View
                  key={item.key}
                  className={`px-4 py-2 ${index < section.items.length - 1 ? 'border-b border-line' : ''}`}
                >
                  {isAlwaysOn(item.key) ? (
                    <View className="min-h-[44px] flex-row items-center justify-between gap-3">
                      <Text className="text-label flex-1 text-ink">
                        {item.title}
                      </Text>
                      <View className="flex-row items-center gap-1">
                        <Icon name="lock" size={14} color="inkMuted" />
                        <Text className="text-caption text-ink-muted">
                          Sempre
                        </Text>
                      </View>
                    </View>
                  ) : (
                    <Toggle
                      label={item.title}
                      checked={prefs[item.key]}
                      disabled={update.isPending}
                      onChange={(value) =>
                        update.mutate({ key: item.key, value })
                      }
                    />
                  )}
                  <Text className="pb-2 text-caption text-ink-muted">
                    {detailOf(item)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
        <Text className="text-caption text-ink-muted">
          Os avisos sempre aparecem aqui dentro do app. As chaves acima mudam só
          o que chega por notificação no celular e por e-mail.
        </Text>
      </ScrollView>
    </View>
  )
}
