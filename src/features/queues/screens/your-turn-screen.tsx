import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ApiError } from '@/shared/api/errors'
import {
  Alert,
  AppBar,
  BookCover,
  Button,
  ConfirmationSheet,
  EmptyState,
  Icon,
  type IconName,
} from '@/shared/components'
import {
  LOAN_PERIOD_DAYS,
  PICKUP_BUSINESS_DAYS,
  QUEUE_CONFIRM_HOURS,
} from '@/shared/config/library-rules'
import { useTheme } from '@/shared/theme/theme-provider'
import { QUEUE_ENTRY_STATUS } from '@/shared/types'
import { formatRelativeDateTime } from '@/shared/utils/dates'
import { LeaveQueueSheet } from '../components/leave-queue-sheet'
import { useConfirmQueueTurn } from '../hooks/use-queue-actions'
import { useMyQueues } from '../hooks/use-my-queues'
import { useNow } from '../hooks/use-now'
import { describeConfirmTurnError } from '../queues.errors'
import { confirmRemainingText } from '../queues.format'

// Um passo do que acontece depois de confirmar a vez.
function Step({
  icon,
  title,
  text,
}: {
  icon: IconName
  title: string
  text: string
}) {
  return (
    <View className="flex-row items-start gap-3">
      <View className="size-[32px] items-center justify-center rounded-pill bg-brand-soft">
        <Icon name={icon} color="brand" size={18} />
      </View>
      <View className="flex-1 gap-1 border-b border-line pb-4">
        <Text className="text-label text-ink">{title}</Text>
        <Text className="text-caption text-ink-muted">{text}</Text>
      </View>
    </View>
  )
}

// Sua vez chegou (A29 e A30; RF-FIL-06 e RNF-USA-05): o livro voltou e está
// separado para o aluno, que tem 24 horas para confirmar. Confirmar chama POST
// /queues/{id}/confirm e leva à tela "Pedido feito"; desistir chama POST
// /queues/{id}/leave. O lugar vem de GET /me/queues, pelo `entryId` da rota.
export function YourTurnScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()
  const { entryId } = useLocalSearchParams<{ entryId?: string }>()
  const queues = useMyQueues()
  const now = useNow()
  const confirmTurn = useConfirmQueueTurn()
  const [confirming, setConfirming] = useState(false)
  const [giving, setGiving] = useState(false)

  const entry = queues.data?.items.find((item) => item.id === entryId)
  const deadline = entry?.confirmDeadline ?? null
  const remaining = deadline ? confirmRemainingText(deadline, now) : null
  const turnError = confirmTurn.error
    ? describeConfirmTurnError(confirmTurn.error)
    : null

  function showMyQueues() {
    router.replace({ pathname: '/loans', params: { tab: 'queue' } })
  }

  function closeConfirmation() {
    confirmTurn.reset()
    setConfirming(false)
  }

  function confirm() {
    if (!entry || confirmTurn.isPending) return
    confirmTurn.mutate(entry.id, {
      onSuccess: ({ loan }) => {
        setConfirming(false)
        router.replace({
          pathname: '/loan-requested',
          params: { loanId: loan.id },
        })
      },
    })
  }

  if (queues.isPending) {
    return (
      <View className="flex-1 bg-surface">
        <AppBar title="Sua vez chegou" back />
        <View
          accessibilityLabel="Carregando sua vez"
          className="flex-1 items-center justify-center"
        >
          <ActivityIndicator color={colors.brand} />
        </View>
      </View>
    )
  }

  if (queues.isError) {
    return (
      <View className="flex-1 bg-surface">
        <AppBar title="Sua vez chegou" back />
        <EmptyState
          icon="alert"
          title="Não foi possível carregar sua vez"
          text={
            queues.error instanceof ApiError ? queues.error.message : undefined
          }
          action={
            <Button icon="refresh" onPress={() => void queues.refetch()}>
              Tentar de novo
            </Button>
          }
        />
      </View>
    )
  }

  if (!entry || entry.status !== QUEUE_ENTRY_STATUS.yourTurn) {
    return (
      <View className="flex-1 bg-surface">
        <AppBar title="Sua vez chegou" back />
        <EmptyState
          icon="clock"
          title="Esta vez já passou"
          text="Você pode ter confirmado, desistido ou perdido o prazo. Veja suas filas e seus pedidos."
          action={<Button onPress={showMyQueues}>Ver minhas filas</Button>}
        />
      </View>
    )
  }

  const until = deadline ? formatRelativeDateTime(deadline, now) : ''

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Sua vez chegou" back />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-4 pb-8"
      >
        {/* LIVRO */}
        <View className="flex-row gap-3 rounded-md border border-line bg-surface-raised p-3">
          <BookCover title={entry.bookTitle} size="md" />
          <View className="flex-1 justify-center gap-2">
            <Text className="text-book-title text-ink">{entry.bookTitle}</Text>
            <Text className="text-body text-ink-muted">
              Foi devolvido e está separado para você.
            </Text>
          </View>
        </View>

        {/* PRAZO PARA CONFIRMAR */}
        <View className="gap-2 rounded-md bg-warning-soft p-4">
          <Text className="text-caption-strong text-ink">
            Tempo para confirmar
          </Text>
          <Text className="text-title-lg text-warning">
            {remaining ?? 'Prazo encerrado'}
          </Text>
          <Text className="text-caption text-ink">
            {remaining ? `Até ${until}` : 'Passou das 24 horas para confirmar.'}
          </Text>
        </View>

        {/* OUTRAS EDIÇÕES MARCADAS (A38) */}
        {entry.editionGroupId ? (
          <Alert tone="info" title="Outras edições marcadas">
            Ao confirmar, as filas das outras edições que você marcou saem
            sozinhas e quem estava atrás de você sobe uma posição.
          </Alert>
        ) : null}

        {/* O QUE ACONTECE DEPOIS */}
        <View className="gap-4">
          <Step
            icon="check"
            title="Confirme que vai retirar"
            text={`Até ${until} (${QUEUE_CONFIRM_HOURS}h corridas)`}
          />
          <Step
            icon="clock"
            title="Retire no balcão"
            text={`Até ${PICKUP_BUSINESS_DAYS} dias úteis depois de confirmar`}
          />
          <Step
            icon="book"
            title={`Empréstimo de ${LOAN_PERIOD_DAYS} dias`}
            text="Começa na retirada"
          />
        </View>
      </ScrollView>

      {/* AÇÕES */}
      <View
        className="gap-2 border-t border-line bg-surface-raised px-4 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button
          block
          icon="check"
          disabled={remaining === null}
          onPress={() => setConfirming(true)}
        >
          Confirmar retirada
        </Button>
        <Button block variant="ghost" onPress={() => setGiving(true)}>
          Desistir da vez
        </Button>
      </View>

      <ConfirmationSheet
        visible={confirming}
        title="Confirmar que vai retirar?"
        description={`Você terá ${PICKUP_BUSINESS_DAYS} dias úteis para retirar ${entry.bookTitle} no balcão. Fim de semana, feriado e recesso não contam.`}
        confirmText="Confirmar retirada"
        cancelText="Agora não"
        onCancel={closeConfirmation}
        onConfirm={confirm}
      >
        {turnError ? (
          <Alert tone="danger" title={turnError.title}>
            {turnError.text}
          </Alert>
        ) : null}
      </ConfirmationSheet>
      <LeaveQueueSheet
        entry={giving ? entry : null}
        onClose={() => setGiving(false)}
        onLeft={showMyQueues}
      />
    </View>
  )
}
