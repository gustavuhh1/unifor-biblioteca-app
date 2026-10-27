import { Text, View } from 'react-native'
import { authorsLine } from '@/features/catalog/catalog.format'
import { Alert, Button } from '@/shared/components'
import {
  actionConfirmLabel,
  actionNote,
  actionPreviewLines,
  actionTitle,
  actionView,
  blockedInfo,
  confirmedText,
} from '../assistant.format'
import { ASSISTANT_MESSAGE } from '../assistant.constants'
import type { AssistantAction, AssistantMessage } from '../assistant.types'

export interface AssistantActionCardProps {
  message: AssistantMessage
  action: AssistantAction
  now: Date
  // Qual botão está esperando a API (os dois ficam desativados).
  busy: 'confirm' | 'cancel' | null
  // Mensagem da API quando a confirmação ou o cancelamento foi recusado.
  error: string | null
  onConfirm: () => void
  onCancel: () => void
  onSeeLoans: () => void
}

// Cartão da ação que o Assistente propõe (A72, A81; RF-ASS-04): mostra o que vai
// ser feito e só age depois do Confirmar. Com uma regra bloqueando (atraso,
// limite), explica o motivo e não oferece o botão. Depois, vira o resultado.
export function AssistantActionCard({
  message,
  action,
  now,
  busy,
  error,
  onConfirm,
  onCancel,
  onSeeLoans,
}: AssistantActionCardProps) {
  const view = actionView(action, now)

  if (view === 'blocked') {
    const info = blockedInfo(message)
    return (
      <Alert tone={info.overdue ? 'danger' : 'warning'} title={info.title}>
        {info.text}
      </Alert>
    )
  }
  if (view === 'confirmed') {
    return (
      <Alert
        tone="success"
        icon="checkCircle"
        action="Ver meus empréstimos"
        onAction={onSeeLoans}
      >
        {confirmedText(action)}
      </Alert>
    )
  }
  if (view === 'cancelled') {
    return <Alert tone="info">{ASSISTANT_MESSAGE.actionCancelled}</Alert>
  }
  if (view === 'expired') {
    return <Alert tone="warning">{ASSISTANT_MESSAGE.actionExpired}</Alert>
  }
  if (view === 'failed') {
    return <Alert tone="danger">{ASSISTANT_MESSAGE.actionFailed}</Alert>
  }

  const lines = actionPreviewLines(action)
  return (
    <View className="gap-3 rounded-lg border border-brand bg-surface-raised p-4">
      <Text className="text-label text-brand">{actionTitle(action)}</Text>
      {action.books.map((book) => (
        <View key={book.id} className="gap-0.5">
          <Text className="text-book-title text-ink">{book.title}</Text>
          <Text className="text-caption text-ink-muted">
            {authorsLine(book.authors)}
          </Text>
        </View>
      ))}
      {lines.length > 0 ? (
        <View className="rounded-md border border-line bg-surface px-3">
          {lines.map((line, index) => (
            <View
              key={line.label}
              className={`flex-row justify-between gap-3 py-2 ${
                index < lines.length - 1 ? 'border-b border-line' : ''
              }`}
            >
              <Text className="text-caption text-ink-muted">{line.label}</Text>
              <Text className="flex-1 text-right text-caption-strong text-ink">
                {line.value}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
      <Text className="text-caption text-ink-muted">{actionNote(action)}</Text>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <Button
        block
        icon="check"
        loading={busy === 'confirm'}
        disabled={busy !== null}
        onPress={onConfirm}
      >
        {actionConfirmLabel(action)}
      </Button>
      <Button
        block
        variant="ghost"
        loading={busy === 'cancel'}
        disabled={busy !== null}
        onPress={onCancel}
      >
        Cancelar
      </Button>
    </View>
  )
}
