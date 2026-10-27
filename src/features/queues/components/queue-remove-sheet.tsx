import { useState } from 'react'
import { Alert, BottomSheet, Button } from '@/shared/components'
import type { LibrarianQueueEntry } from '../librarian-queues.types'
import { ReasonField } from './reason-field'

interface QueueRemoveSheetProps {
  entry: LibrarianQueueEntry
  onConfirm: (reason: string) => void
  onCancel: () => void
  loading: boolean
  error?: string
}

// Remover um aluno da fila, com motivo (RF-BAL-06). O aluno é avisado pela API e,
// se era a vez dele, o exemplar guardado segue para o próximo.
export function QueueRemoveSheet({
  entry,
  onConfirm,
  onCancel,
  loading,
  error,
}: QueueRemoveSheetProps) {
  const [reason, setReason] = useState('')

  return (
    <BottomSheet
      visible
      onClose={onCancel}
      title={`Remover ${entry.studentName} da fila?`}
      text="O aluno perde a posição e é avisado. Para voltar, precisa entrar na fila de novo."
      actions={
        <>
          <Button
            block
            variant="danger"
            loading={loading}
            disabled={!reason.trim()}
            onPress={() => onConfirm(reason)}
          >
            Confirmar remoção
          </Button>
          <Button block variant="ghost" onPress={onCancel}>
            Cancelar
          </Button>
        </>
      }
    >
      <ReasonField value={reason} onChangeText={setReason} />
      {error ? (
        <Alert tone="danger" title="Não foi possível">
          {error}
        </Alert>
      ) : null}
    </BottomSheet>
  )
}
