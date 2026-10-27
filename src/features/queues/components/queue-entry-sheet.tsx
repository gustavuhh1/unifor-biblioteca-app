import { Text } from 'react-native'
import { Alert, BottomSheet, Button } from '@/shared/components'
import { canMove, canResend } from '../librarian-queues.format'
import type { LibrarianQueueEntry } from '../librarian-queues.types'

interface QueueEntrySheetProps {
  entry: LibrarianQueueEntry
  onClose: () => void
  onMove: () => void
  onResend: () => void
  onRemove: () => void
  resending: boolean
  error?: string
}

// Ações sobre um aluno da fila (B09, RF-BAL-06): mudar a posição, reenviar o
// aviso da vez e remover. Cada ação desabilitada diz por quê.
export function QueueEntrySheet({
  entry,
  onClose,
  onMove,
  onResend,
  onRemove,
  resending,
  error,
}: QueueEntrySheetProps) {
  return (
    <BottomSheet
      visible
      onClose={onClose}
      title={entry.studentName}
      text={`${entry.position}º na fila · matrícula ${entry.matricula}`}
      actions={
        <>
          <Button
            block
            variant="secondary"
            disabled={!canMove(entry)}
            onPress={onMove}
          >
            Mudar posição
          </Button>
          <Button
            block
            variant="secondary"
            disabled={!canResend(entry)}
            loading={resending}
            onPress={onResend}
          >
            Reenviar aviso
          </Button>
          <Button block variant="danger" onPress={onRemove}>
            Remover da fila
          </Button>
          <Button block variant="ghost" onPress={onClose}>
            Fechar
          </Button>
        </>
      }
    >
      {error ? (
        <Alert tone="danger" title="Não foi possível">
          {error}
        </Alert>
      ) : null}
      {!canMove(entry) ? (
        <Text className="text-caption text-ink-muted">
          Quem está na vez não muda de posição.
        </Text>
      ) : !canResend(entry) ? (
        <Text className="text-caption text-ink-muted">
          O aviso só é reenviado para quem está na vez.
        </Text>
      ) : null}
    </BottomSheet>
  )
}
