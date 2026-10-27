import { useState } from 'react'
import { Text, View } from 'react-native'
import { Alert, BottomSheet, Button, Icon } from '@/shared/components'
import { movedDownLine } from '../librarian-queues.format'
import type { QueueMovedDown } from '../librarian-queues.types'
import { ReasonField } from './reason-field'

interface QueueCutSheetProps {
  title: string
  // Quem desce uma posição, como a API devolveu na primeira chamada.
  movedDown: QueueMovedDown[]
  initialReason?: string
  onConfirm: (reason: string) => void
  onCancel: () => void
  loading: boolean
  error?: string
}

// Confirmação de passar à frente de outros (B11, RF-BAL-07): lista quem desce e
// exige o motivo. O aluno afetado é avisado pela API.
export function QueueCutSheet({
  title,
  movedDown,
  initialReason = '',
  onConfirm,
  onCancel,
  loading,
  error,
}: QueueCutSheetProps) {
  const [reason, setReason] = useState(initialReason)

  return (
    <BottomSheet
      visible
      onClose={onCancel}
      title={title}
      text="Os alunos abaixo descem uma posição e serão avisados."
      actions={
        <>
          <Button
            block
            variant="danger"
            loading={loading}
            disabled={!reason.trim()}
            onPress={() => onConfirm(reason)}
          >
            Colocar à frente mesmo assim
          </Button>
          <Button block variant="ghost" onPress={onCancel}>
            Voltar
          </Button>
        </>
      }
    >
      <View className="gap-2 rounded-lg border border-line bg-surface p-4">
        <Text className="text-label text-ink">Impacto na ordem</Text>
        {movedDown.map((item) => (
          <Text key={item.entryId} className="text-caption text-danger">
            {movedDownLine(item)}
          </Text>
        ))}
      </View>
      <View className="flex-row gap-2 rounded-lg bg-danger-soft p-4">
        <Icon name="alert" color="danger" />
        <Text className="flex-1 text-body text-ink">
          Alterar a ordem da fila afeta os demais alunos. Confirme apenas quando
          houver justificativa.
        </Text>
      </View>
      <ReasonField value={reason} onChangeText={setReason} />
      {error ? (
        <Alert tone="danger" title="Não foi possível">
          {error}
        </Alert>
      ) : null}
    </BottomSheet>
  )
}
