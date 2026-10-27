import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { ApiError } from '@/shared/api/errors'
import {
  Alert,
  BottomSheet,
  Button,
  Chip,
  QueueInfo,
} from '@/shared/components'
import {
  PICKUP_BUSINESS_DAYS,
  QUEUE_CONFIRM_HOURS,
} from '@/shared/config/library-rules'
import { useTheme } from '@/shared/theme/theme-provider'
import { ASSISTANT_BLOCKED_REASON } from '@/shared/types'
import { BLOCKED_REASON_MESSAGE } from '@/shared/utils/blocked-reason'
import { useJoinQueue } from '../hooks/use-queue-actions'
import { useQueuePreview } from '../hooks/use-queue-preview'
import { describeJoinQueueError } from '../queues.errors'
import {
  defaultEditionSelection,
  editionLabel,
  joinedText,
  peopleAheadText,
} from '../queues.format'
import type { QueuePreviewEdition } from '../queues.types'

export interface JoinQueueSheetProps {
  visible: boolean
  // O livro aberto na página (uma edição); a prévia traz as outras edições.
  bookId: string
  bookTitle: string
  onClose: () => void
}

// Uma edição na lista de A36: o chip marca ou desmarca, e a linha de baixo diz
// quantas pessoas estão na frente, ou por que não dá para entrar.
function EditionRow({
  edition,
  selected,
  onToggle,
}: {
  edition: QueuePreviewEdition
  selected: boolean
  onToggle: () => void
}) {
  let detail = peopleAheadText(edition.peopleAhead)
  if (edition.alreadyInQueue) detail = 'Você já está nesta fila'
  else if (!edition.canJoin && edition.blockedReason) {
    detail = BLOCKED_REASON_MESSAGE[edition.blockedReason].title
  }
  return (
    <View className="gap-1">
      <Chip
        selected={selected}
        disabled={!edition.canJoin}
        onPress={onToggle}
        accessibilityLabel={`${editionLabel(edition)}. ${detail}`}
      >
        {editionLabel(edition)}
      </Chip>
      <Text className="pl-1 text-caption text-ink-muted">{detail}</Text>
    </View>
  )
}

// Confirmação de entrar na fila (A28 e A36; RF-FIL-01, RF-FIL-04 e RNF-USA-05):
// mostra, pela prévia, quantas pessoas estão na frente antes de entrar; com mais
// de uma edição, o aluno marca uma ou mais (cada uma conta 1 das 7 filas). A
// confirmação chama POST /queues e mostra a posição.
export function JoinQueueSheet({
  visible,
  bookId,
  bookTitle,
  onClose,
}: JoinQueueSheetProps) {
  const router = useRouter()
  const { colors } = useTheme()
  const preview = useQueuePreview(bookId, visible)
  const join = useJoinQueue()
  // null = a escolha de início; vira a lista do aluno quando ele marca algo.
  const [picked, setPicked] = useState<string[] | null>(null)

  const data = preview.data
  const editions = data?.editions ?? []
  const selected = picked ?? defaultEditionSelection(editions, bookId)
  const nothingToJoin = data !== undefined && editions.every((e) => !e.canJoin)
  const blockedReason =
    editions.find((e) => e.bookId === bookId)?.blockedReason ??
    editions.find((e) => e.blockedReason)?.blockedReason
  const queuesAfter = (data?.activeQueueCount ?? 0) + selected.length
  const overLimit = data !== undefined && queuesAfter > data.maxActiveQueues
  const joinError = join.error ? describeJoinQueueError(join.error) : null
  const single = editions.length === 1 ? editions[0] : undefined

  function close() {
    join.reset()
    setPicked(null)
    onClose()
  }

  function toggle(editionId: string) {
    setPicked(
      selected.includes(editionId)
        ? selected.filter((id) => id !== editionId)
        : [...selected, editionId],
    )
  }

  function confirm() {
    if (join.isPending || selected.length === 0 || overLimit) return
    join.mutate(selected)
  }

  function showMyQueues() {
    close()
    router.push({ pathname: '/loans', params: { tab: 'queue' } })
  }

  if (join.isSuccess) {
    return (
      <BottomSheet
        visible={visible}
        onClose={close}
        title="Você entrou na fila"
        text={joinedText(join.data.items)}
        actions={
          <>
            <Button block variant="primary" onPress={showMyQueues}>
              Ver minhas filas
            </Button>
            <Button block variant="ghost" onPress={close}>
              Fechar
            </Button>
          </>
        }
      />
    )
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={close}
      title={`Entrar na fila de ${bookTitle}?`}
      text="Você será avisado quando o livro voltar. Dá para sair da fila quando quiser."
      actions={
        <>
          <Button
            block
            variant="primary"
            loading={join.isPending}
            disabled={selected.length === 0 || overLimit || preview.isPending}
            onPress={confirm}
          >
            Confirmar entrada na fila
          </Button>
          <Button block variant="ghost" onPress={close}>
            Cancelar
          </Button>
        </>
      }
    >
      {preview.isPending ? (
        <View
          accessibilityLabel="Carregando a fila"
          className="items-center py-6"
        >
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : preview.isError ? (
        <Alert
          tone="danger"
          title="Não foi possível ver a fila"
          action="Tentar de novo"
          onAction={() => void preview.refetch()}
        >
          {preview.error instanceof ApiError
            ? preview.error.message
            : 'Confira sua internet e tente de novo.'}
        </Alert>
      ) : (
        <>
          {nothingToJoin && blockedReason ? (
            <Alert
              tone="warning"
              title={BLOCKED_REASON_MESSAGE[blockedReason].title}
            >
              {BLOCKED_REASON_MESSAGE[blockedReason].text}
            </Alert>
          ) : null}
          {single ? (
            <QueueInfo
              ahead={single.peopleAhead}
              note={`Se entrar agora, você será o ${single.peopleAhead + 1}º da fila. Quando o livro voltar, você terá ${QUEUE_CONFIRM_HOURS}h para confirmar e ${PICKUP_BUSINESS_DAYS} dias úteis para retirar.`}
            />
          ) : (
            <View className="gap-3">
              <Text className="text-body text-ink">
                Este livro tem mais de uma edição. Marque em quais filas entrar:
                a primeira que voltar fica com você e as outras saem sozinhas.
              </Text>
              {editions.map((edition) => (
                <EditionRow
                  key={edition.bookId}
                  edition={edition}
                  selected={selected.includes(edition.bookId)}
                  onToggle={() => toggle(edition.bookId)}
                />
              ))}
            </View>
          )}
          {data ? (
            <Text className="text-caption text-ink-muted">
              {`Suas filas: ${queuesAfter} de ${data.maxActiveQueues}`}
            </Text>
          ) : null}
          {overLimit ? (
            <Alert
              tone="warning"
              title={
                BLOCKED_REASON_MESSAGE[ASSISTANT_BLOCKED_REASON.queueLimit]
                  .title
              }
            >
              {BLOCKED_REASON_MESSAGE[ASSISTANT_BLOCKED_REASON.queueLimit].text}
            </Alert>
          ) : null}
        </>
      )}
      {joinError ? (
        <Alert tone="danger" title={joinError.title}>
          {joinError.text}
        </Alert>
      ) : null}
    </BottomSheet>
  )
}
