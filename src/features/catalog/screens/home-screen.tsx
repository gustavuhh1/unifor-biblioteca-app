import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSession } from '@/features/auth/hooks/use-session'
import { nextDueLoan } from '@/features/loans/loans.format'
import { useMyLoans } from '@/features/loans/hooks/use-my-loans'
import { useNotifications } from '@/features/notifications/hooks/use-notifications'
import { useMyQueues } from '@/features/queues/hooks/use-my-queues'
import { yourTurnEntry } from '@/features/queues/queues.format'
import { BookCover } from '@/shared/components'
import { Icon } from '@/shared/components/icon'
import { MAX_ACTIVE_LOANS } from '@/shared/config/library-rules'
import { useTheme } from '@/shared/theme/theme-provider'
import { formatRelativeDateTime, formatRelativeDay } from '@/shared/utils/dates'
import { authorsLine, bookCoverTone } from '../catalog.format'
import { useRecommendations } from '../hooks/use-recommendations'
import { HOME_RECOMMENDATIONS_LIMIT } from '../recommendations.constants'

// Maior número que o sino mostra; acima disso aparece "9+".
const BELL_BADGE_MAX = 9

// Início do aluno (A07; RF-AVI-01, RF-EMP-08, RF-FIL-06). Tudo vem da API:
// nome e contador de /me, o sino de /me/notifications, o aviso "É a sua vez" de
// /me/queues, a próxima devolução de /me/loans e "Recomendados para você" de
// /me/recommendations (RF-ASS-03; a seção some se não houver recomendação).
export function HomeScreen() {
  const safe = useSafeAreaInsets()
  const router = useRouter()
  const { colors } = useTheme()
  const { user } = useSession()
  const notifications = useNotifications()
  const queues = useMyQueues()
  const loans = useMyLoans()
  const recommendations = useRecommendations()
  const [busca, setBusca] = useState('')

  const firstName = user?.fullName?.split(' ')[0]
  const unread = notifications.data?.unreadCount ?? 0
  const yourTurn = yourTurnEntry(queues.data?.items ?? [])
  const nextLoan = nextDueLoan(loans.data?.items ?? [])
  const recommended = (recommendations.data?.items ?? []).slice(
    0,
    HOME_RECOMMENDATIONS_LIMIT,
  )

  function buscar() {
    router.push({ pathname: '/catalog', params: { q: busca.trim() } })
    setBusca('')
  }

  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: safe.top + 14, paddingBottom: 26 }}
      >
        <View className="mb-6 flex-row items-center justify-between px-4">
          <View>
            <Text className="text-title-lg text-ink">
              {firstName ? `Olá, ${firstName}` : 'Olá!'}
            </Text>
            <Text className="mt-1 text-body text-ink-muted">
              Matrícula {user?.matricula}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/notifications')}
            accessibilityRole="button"
            accessibilityLabel={
              unread > 0 ? `Notificações, ${unread} não lidas` : 'Notificações'
            }
            className="h-12 w-12 items-center justify-center"
          >
            <Icon name="bell" size={25} color="ink" />
            {unread > 0 ? (
              <View className="absolute right-0 top-0 h-5 w-5 items-center justify-center rounded-pill bg-danger">
                <Text className="text-caption-strong text-on-danger">
                  {unread > BELL_BADGE_MAX ? `${BELL_BADGE_MAX}+` : unread}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>
        <View className="mb-5 flex-row items-center gap-2 px-4">
          <View className="min-h-[52px] flex-1 flex-row items-center gap-3 rounded-pill border border-line bg-surface-raised px-4">
            <Icon name="search" color="inkMuted" size={22} />
            <TextInput
              value={busca}
              onChangeText={setBusca}
              onSubmitEditing={buscar}
              placeholder="Buscar título, autor ou assunto"
              placeholderTextColor={colors.inkMuted}
              returnKeyType="search"
              className="min-w-0 flex-1 text-body text-ink"
            />
          </View>
          <Pressable
            onPress={buscar}
            accessibilityRole="button"
            accessibilityLabel="Buscar no acervo"
            className="h-[52px] w-[52px] items-center justify-center rounded-pill border border-line bg-surface-raised"
          >
            <Icon name="search" color="ink" size={22} />
          </Pressable>
        </View>
        {yourTurn?.confirmDeadline ? (
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/your-turn',
                params: { entryId: yourTurn.id },
              })
            }
            accessibilityRole="button"
            className="mx-4 mb-5 flex-row gap-3 rounded-md bg-warning-soft p-4"
          >
            <Icon name="bell" color="ink" size={22} />
            <View className="flex-1 gap-1">
              <Text className="text-label text-ink">
                É a sua vez: {yourTurn.bookTitle}
              </Text>
              <Text className="text-body text-ink">
                Confirme até {formatRelativeDateTime(yourTurn.confirmDeadline)},
                ou o livro passa para o próximo da fila.
              </Text>
            </View>
          </Pressable>
        ) : null}
        <View className="mb-6 flex-row gap-3 px-4">
          <Pressable
            onPress={() => router.push('/loans')}
            accessibilityRole="button"
            className="min-h-[110px] flex-1 rounded-md border border-line bg-surface-raised p-4"
          >
            <Text className="text-caption-strong text-ink-muted">COM VOCÊ</Text>
            <Text className="mt-1 text-title-lg text-ink">
              {user?.activeLoanCount ?? 0} de {MAX_ACTIVE_LOANS}
            </Text>
            <Text className="text-body text-ink-muted">livros</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/loans')}
            accessibilityRole="button"
            className="min-h-[110px] flex-1 rounded-md border border-line bg-surface-raised p-4"
          >
            <Text className="text-caption-strong text-ink-muted">
              PRÓXIMA DEVOLUÇÃO
            </Text>
            <Text className="mt-1 text-title text-ink">
              {nextLoan?.dueAt ? formatRelativeDay(nextLoan.dueAt) : 'Nenhuma'}
            </Text>
            <Text className="text-body text-ink-muted" numberOfLines={2}>
              {nextLoan?.bookTitle ?? 'Sem empréstimos ativos'}
            </Text>
          </Pressable>
        </View>
        {recommended.length > 0 ? (
          <View className="gap-3">
            <View className="gap-1 px-4">
              <Text className="text-title text-ink">
                Recomendados para você
              </Text>
              {recommendations.data?.reasonText ? (
                <Text className="text-caption text-ink-muted">
                  {recommendations.data.reasonText}
                </Text>
              ) : null}
            </View>
            {/* Carrossel de capas, como no Figma (A07). */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerClassName="gap-3 px-4"
            >
              {recommended.map(({ book, reasonText }) => (
                <Pressable
                  key={book.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${book.title}, de ${authorsLine(book.authors)}. ${reasonText}`}
                  onPress={() =>
                    router.push({
                      pathname: '/book-details',
                      params: { id: book.id },
                    })
                  }
                  className="w-40 gap-2"
                >
                  <BookCover
                    title={book.title}
                    author={authorsLine(book.authors)}
                    tone={bookCoverTone(book)}
                    size="lg"
                  />
                  <Text className="text-label text-ink" numberOfLines={1}>
                    {book.title}
                  </Text>
                  <Text
                    className="text-caption text-ink-muted"
                    numberOfLines={2}
                  >
                    {authorsLine(book.authors)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
    </View>
  )
}
