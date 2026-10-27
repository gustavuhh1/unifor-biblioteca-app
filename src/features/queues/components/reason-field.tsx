import { TextField } from '@/shared/components'
import { QUEUE_REASON_MAX_LENGTH } from '../librarian-queues.constants'

interface ReasonFieldProps {
  value: string
  onChangeText: (text: string) => void
  error?: string
  label?: string
}

// Campo do motivo de uma mudança na fila (RF-BAL-06 e RF-BAL-07): obrigatório
// ao adicionar, passar à frente e remover; fica no registro da API.
export function ReasonField({
  value,
  onChangeText,
  error,
  label = 'Motivo (obrigatório)',
}: ReasonFieldProps) {
  return (
    <TextField
      label={label}
      value={value}
      onChangeText={onChangeText}
      error={error}
      multiline
      maxLength={QUEUE_REASON_MAX_LENGTH}
      placeholder="Ex.: pedido no balcão, sem acesso ao app"
    />
  )
}
