import { useState } from 'react'
import { Text, View } from 'react-native'
import {
  Alert,
  BottomSheet,
  Button,
  Chip,
  TextField,
} from '@/shared/components'
import { QUEUE_ADD_VALIDATION } from '../librarian-queues.constants'
import {
  addPositions,
  movePositions,
  positionLabel,
  validateAdd,
} from '../librarian-queues.format'
import type { LibrarianQueueEntry } from '../librarian-queues.types'
import { ReasonField } from './reason-field'

interface QueueChangeSheetProps {
  entries: LibrarianQueueEntry[]
  // Sem `entry` a folha adiciona um aluno novo; com `entry` ela move esse aluno.
  entry?: LibrarianQueueEntry
  bookTitle: string
  onClose: () => void
  onSubmit: (input: {
    matricula: string
    position: number
    reason: string
  }) => void
  loading: boolean
  error?: string
}

// Folha de "Adicionar aluno à fila" (B10, RF-BAL-06) e de "Mudar posição" (B09):
// escolhe a posição entre as que valem. Ao adicionar pede a matrícula e o motivo;
// ao mover o motivo só é pedido depois, se o aluno passar à frente de outros.
export function QueueChangeSheet({
  entries,
  entry,
  bookTitle,
  onClose,
  onSubmit,
  loading,
  error,
}: QueueChangeSheetProps) {
  const adding = !entry
  const positions = entry
    ? movePositions(entries, entry)
    : addPositions(entries)
  const [position, setPosition] = useState(
    positions[positions.length - 1] ?? entries.length + 1,
  )
  const [matricula, setMatricula] = useState('')
  const [reason, setReason] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  function submit() {
    if (adding) {
      const problem = validateAdd(matricula, reason)
      if (problem) {
        setFormError(problem)
        return
      }
    }
    setFormError(null)
    onSubmit({ matricula, position, reason })
  }

  return (
    <BottomSheet
      visible
      onClose={onClose}
      title={adding ? 'Adicionar aluno à fila' : `Mover ${entry.studentName}`}
      text={
        adding
          ? `${bookTitle} · ${entries.length} aguardando`
          : `Hoje em ${entry.position}º. Escolha a nova posição.`
      }
      actions={
        <>
          <Button
            block
            loading={loading}
            disabled={positions.length === 0}
            onPress={submit}
          >
            {adding ? 'Adicionar na fila' : 'Mover'}
          </Button>
          <Button block variant="ghost" onPress={onClose}>
            Cancelar
          </Button>
        </>
      }
    >
      {adding ? (
        <TextField
          label="Matrícula"
          icon="user"
          inputMode="numeric"
          keyboardType="number-pad"
          maxLength={7}
          value={matricula}
          onChangeText={setMatricula}
          error={
            formError === QUEUE_ADD_VALIDATION.matricula ? formError : undefined
          }
        />
      ) : null}
      <Text className="text-caption-strong text-ink">Posição</Text>
      <View className="flex-row flex-wrap gap-2">
        {positions.map((option) => (
          <Chip
            key={option}
            selected={option === position}
            onPress={() => setPosition(option)}
          >
            {positionLabel(option, entries.length)}
          </Chip>
        ))}
      </View>
      {adding ? (
        <ReasonField
          value={reason}
          onChangeText={setReason}
          error={
            formError === QUEUE_ADD_VALIDATION.reason ? formError : undefined
          }
        />
      ) : null}
      {error ? (
        <Alert tone="danger" title="Não foi possível">
          {error}
        </Alert>
      ) : null}
    </BottomSheet>
  )
}
