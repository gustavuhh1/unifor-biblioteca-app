import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, Text, View } from 'react-native'
import { ApiError } from '@/shared/api/errors'
import {
  Button,
  DeadlineChip,
  EmptyState,
  LoanCard,
  QueueInfo,
} from '@/shared/components'
import { useTheme } from '@/shared/theme/theme-provider'
import { QUEUE_ENTRY_STATUS } from '@/shared/types'
import { formatRelativeDateTime } from '@/shared/utils/dates'
import { useMyQueues } from '../hooks/use-my-queues'
import { useNow } from '../hooks/use-now'
import {
  confirmRemainingText,
  joinedSinceText,
  positionText,
} from '../queues.format'
import type { MyQueueEntry } from '../queues.types'
import { LeaveQueueSheet } from './leave-queue-sheet'

export interface MyQueuesListProps {
  // Mostra um aviso na tela que hospeda a lista (ex.: "Você saiu da fila.").
  onNotice: (text: string) => void
}

// "Confirme em 18h 40min (até amanhã, 09:12)" ou o aviso de prazo vencido.
function confirmDeadlineText(entry: MyQueueEntry, now: Date): string {
  const deadline = entry.confirmDeadline
  if (!deadline) return 'Confirme que vai retirar'
  const remaining = confirmRemainingText(deadline, now)
  if (remaining === null) return 'O prazo para confirmar acabou'
  return `Confirme em ${remaining} (até ${formatRelativeDateTime(deadline, now)})`
}

// Minhas filas (A32, A33 e A37; RF-FIL-05 e RF-FIL-08): os lugares ativos do
// aluno em GET /me/queues, com a posição, quantas pessoas estão na frente e, na
// vez dele, o prazo para confirmar. Sair da fila pede confirmação.
export function MyQueuesList({ onNotice }: MyQueuesListProps) {
  const router = useRouter()
  const { colors } = useTheme()
  const queues = useMyQueues()
  const now = useNow()
  const [leaving, setLeaving] = useState<MyQueueEntry | null>(null)

  function openBook(entry: MyQueueEntry) {
    router.push({ pathname: '/book-details', params: { id: entry.bookId } })
  }

  function confirmTurn(entry: MyQueueEntry) {
    router.push({ pathname: '/your-turn', params: { entryId: entry.id } })
  }

  if (queues.isPending) {
    return (
      <View
        accessibilityLabel="Carregando suas filas"
        className="items-center py-12"
      >
        <ActivityIndicator color={colors.brand} />
      </View>
    )
  }

  if (queues.isError) {
    return (
      <EmptyState
        icon="alert"
        title="Não foi possível carregar suas filas"
        text={
          queues.error instanceof ApiError ? queues.error.message : undefined
        }
        action={
          <Button icon="refresh" onPress={() => void queues.refetch()}>
            Tentar de novo
          </Button>
        }
      />
    )
  }

  const { items, activeQueueCount, maxActiveQueues } = queues.data

  if (items.length === 0) {
    return (
      <EmptyState
        icon="users"
        title="Você não está em nenhuma fila"
        text="Quando todos os exemplares de um livro estão emprestados, entre na fila pela página dele e acompanhe a posição aqui."
        action={
          <Button icon="search" onPress={() => router.push('/catalog')}>
            Explorar acervo
          </Button>
        }
      />
    )
  }

  return (
    <>
      <Text className="text-caption text-ink-muted">
        {`${activeQueueCount} de ${maxActiveQueues} filas`}
      </Text>
      {items.map((entry) => {
        const hisTurn = entry.status === QUEUE_ENTRY_STATUS.yourTurn
        return (
          <LoanCard
            key={entry.id}
            title={entry.bookTitle}
            author={joinedSinceText(entry.joinedAt)}
            status={hisTurn ? 'aguardando' : 'fila'}
            statusLabel={
              hisTurn ? 'Sua vez · confirme' : positionText(entry.position)
            }
            deadline={
              hisTurn ? (
                <DeadlineChip kind="confirmar">
                  {confirmDeadlineText(entry, now)}
                </DeadlineChip>
              ) : undefined
            }
            onPress={() => openBook(entry)}
            actions={
              <View className="gap-2">
                {hisTurn ? null : (
                  <QueueInfo
                    joined
                    ahead={entry.peopleAhead}
                    note={
                      entry.editionGroupId
                        ? 'Você marcou mais de uma edição: a primeira que voltar fica com você e as outras filas saem sozinhas.'
                        : undefined
                    }
                  />
                )}
                {hisTurn ? (
                  <Button
                    block
                    size="sm"
                    icon="check"
                    onPress={() => confirmTurn(entry)}
                  >
                    Confirmar retirada
                  </Button>
                ) : null}
                <Button
                  block
                  size="sm"
                  variant="ghost"
                  onPress={() => setLeaving(entry)}
                >
                  {hisTurn ? 'Desistir da vez' : 'Sair da fila'}
                </Button>
              </View>
            }
          />
        )
      })}
      <LeaveQueueSheet
        entry={leaving}
        onClose={() => setLeaving(null)}
        onLeft={(left) =>
          onNotice(
            left.status === QUEUE_ENTRY_STATUS.yourTurn
              ? 'Você desistiu. O próximo foi avisado.'
              : `Você saiu da fila de ${left.bookTitle}.`,
          )
        }
      />
    </>
  )
}
