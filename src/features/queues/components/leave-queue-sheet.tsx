import { Alert, ConfirmationSheet } from '@/shared/components'
import { QUEUE_ENTRY_STATUS } from '@/shared/types'
import { useLeaveQueue } from '../hooks/use-queue-actions'
import { queueErrorText } from '../queues.errors'
import type { MyQueueEntry } from '../queues.types'

export interface LeaveQueueSheetProps {
  // O lugar de que o aluno quer sair; null com a folha fechada.
  entry: Pick<MyQueueEntry, 'id' | 'bookTitle' | 'status' | 'position'> | null
  onClose: () => void
  // Roda depois que a API confirma a saída.
  onLeft?: (entry: Pick<MyQueueEntry, 'bookTitle' | 'status'>) => void
}

// Confirmação de sair da fila, ou de desistir da vez (A30 e A33; RF-FIL-05 e
// RNF-USA-05): POST /queues/{id}/leave. Só a confirmação, sem "desfazer" depois
// (decisão de 18/10).
export function LeaveQueueSheet({
  entry,
  onClose,
  onLeft,
}: LeaveQueueSheetProps) {
  const leave = useLeaveQueue()
  const hisTurn = entry?.status === QUEUE_ENTRY_STATUS.yourTurn

  function close() {
    leave.reset()
    onClose()
  }

  function confirm() {
    if (!entry || leave.isPending) return
    leave.mutate(entry.id, {
      onSuccess: () => {
        const left = entry
        close()
        onLeft?.(left)
      },
    })
  }

  return (
    <ConfirmationSheet
      visible={entry !== null}
      danger
      title={
        hisTurn
          ? `Desistir da vez de ${entry?.bookTitle ?? 'este livro'}?`
          : `Sair da fila de ${entry?.bookTitle ?? 'este livro'}?`
      }
      description={
        hisTurn
          ? 'Você sai da fila e o livro vai na hora para o próximo. Para pegar este livro de novo, entre na fila outra vez.'
          : `Você é o ${entry?.position ?? 1}º da fila. Se sair, perde a posição e, para voltar, entra no fim da fila.`
      }
      confirmText={hisTurn ? 'Desistir da vez' : 'Sair da fila'}
      cancelText="Ficar na fila"
      onCancel={close}
      onConfirm={confirm}
    >
      {leave.isError ? (
        <Alert tone="danger" title="Não foi possível sair da fila">
          {queueErrorText(leave.error)}
        </Alert>
      ) : null}
    </ConfirmationSheet>
  )
}
