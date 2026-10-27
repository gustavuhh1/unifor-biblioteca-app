import { useRouter } from 'expo-router'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { ApiError } from '@/shared/api/errors'
import {
  Alert,
  AppBar,
  Button,
  EmptyState,
  NotificationItem as NotificationRow,
} from '@/shared/components'
import { useTheme } from '@/shared/theme/theme-provider'
import { useMarkNotificationsRead } from '../hooks/use-mark-notifications-read'
import { useNotifications } from '../hooks/use-notifications'
import {
  NOTICE_STYLE,
  groupNotifications,
  hasTurnButtons,
  noticeTarget,
  noticeTime,
} from '../notifications.format'
import type { NotificationItem } from '../notifications.types'

// Notificações do aluno (A08, RF-AVI-01): a lista de GET /me/notifications em Hoje,
// Esta semana e Antes, com o ponto de "não lida", o botão do aviso (sua vez, QR,
// empréstimo, multa) e "Marcar todas como lidas" (POST /me/notifications/read-all).
export function NotificationsScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const query = useNotifications()
  const markRead = useMarkNotificationsRead()

  const items = query.data?.items ?? []
  const unread = query.data?.unreadCount ?? 0
  const now = new Date()

  function open(item: NotificationItem) {
    const target = noticeTarget(item)
    if (target) router.push(target)
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Notificações"
        back
        actions={
          unread > 0
            ? [
                {
                  icon: 'check',
                  label: 'Marcar todas como lidas',
                  onPress: () => markRead.mutate(),
                },
              ]
            : undefined
        }
      />
      {query.isPending ? (
        <View
          accessibilityLabel="Carregando notificações"
          className="flex-1 items-center justify-center"
        >
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : query.isError ? (
        <EmptyState
          icon="alert"
          title="Não foi possível carregar as notificações"
          text={
            query.error instanceof ApiError ? query.error.message : undefined
          }
          action={
            <Button icon="refresh" onPress={() => void query.refetch()}>
              Tentar de novo
            </Button>
          }
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon="bell"
          title="Nenhuma notificação"
          text="Quando algo acontecer com seus livros ou filas, avisamos aqui."
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 32, gap: 16 }}
        >
          {markRead.isSuccess ? (
            <Alert tone="success">
              Todas as notificações foram marcadas como lidas.
            </Alert>
          ) : null}
          {markRead.isError ? (
            <Alert tone="danger" title="Não foi possível marcar como lidas">
              {markRead.error instanceof ApiError
                ? markRead.error.message
                : 'Tente de novo em instantes.'}
            </Alert>
          ) : null}
          {groupNotifications(items, now).map((group) => (
            <View key={group.key} className="gap-2">
              <Text className="text-overline text-ink-muted">
                {group.label}
              </Text>
              <View className="overflow-hidden rounded-lg border border-line bg-surface-raised">
                {group.items.map((item, index) => {
                  const style = NOTICE_STYLE[item.type]
                  const target = noticeTarget(item)
                  return (
                    <View
                      key={item.id}
                      className={
                        index < group.items.length - 1
                          ? 'border-b border-line'
                          : ''
                      }
                    >
                      <NotificationRow
                        title={item.title}
                        text={item.body}
                        time={noticeTime(item.createdAt, now)}
                        icon={style.icon}
                        tone={style.tone}
                        unread={item.readAt === null}
                        onPress={target ? () => open(item) : undefined}
                        actions={
                          hasTurnButtons(item) ? (
                            <>
                              <Button size="sm" onPress={() => open(item)}>
                                Vou retirar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onPress={() => open(item)}
                              >
                                Desistir
                              </Button>
                            </>
                          ) : undefined
                        }
                      />
                    </View>
                  )
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}
