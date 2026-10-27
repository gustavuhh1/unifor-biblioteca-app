import { View } from 'react-native'
import {
  authorsLine,
  bookCardMeta,
  bookCoverTone,
  bookStatus,
} from '@/features/catalog/catalog.format'
import { Alert, BookCard, Button, ChatBubble } from '@/shared/components'
import { ASSISTANT_SENDER } from '@/shared/types'
import { blockedInfo, messageTime } from '../assistant.format'
import type { AssistantMessage } from '../assistant.types'
import {
  AssistantActionCard,
  type AssistantActionCardProps,
} from './assistant-action-card'

export interface AssistantMessageItemProps {
  message: AssistantMessage
  now: Date
  // A pergunta que "Tentar de novo" manda outra vez, quando a resposta deu erro.
  retryText: string | null
  busy: AssistantActionCardProps['busy']
  actionError: string | null
  onRetry: (text: string) => void
  onOpenBook: (bookId: string) => void
  onConfirm: (actionId: string) => void
  onCancel: (actionId: string) => void
  onSeeLoans: () => void
}

// Uma mensagem da conversa (A48): a bolha do aluno, ou a do Assistente com os
// livros sugeridos como cartões, a ação para confirmar ou o motivo do bloqueio,
// e "Tentar de novo" quando a resposta deu erro (A49).
export function AssistantMessageItem({
  message,
  now,
  retryText,
  busy,
  actionError,
  onRetry,
  onOpenBook,
  onConfirm,
  onCancel,
  onSeeLoans,
}: AssistantMessageItemProps) {
  const time = messageTime(message.createdAt)
  if (message.sender === ASSISTANT_SENDER.student) {
    return (
      <ChatBubble from="user" time={time}>
        {message.text}
      </ChatBubble>
    )
  }

  const { action } = message
  const blockedWithoutAction = !action && message.blockedReason
  const retry = message.error ? retryText : null
  const hasExtra =
    message.suggestedBooks.length > 0 ||
    Boolean(action) ||
    Boolean(blockedWithoutAction) ||
    retry !== null

  const extra = hasExtra ? (
    <View className="gap-3 self-stretch">
      {message.suggestedBooks.map((book) => (
        <BookCard
          key={book.id}
          title={book.title}
          author={authorsLine(book.authors)}
          tone={bookCoverTone(book)}
          status={bookStatus(book)}
          meta={bookCardMeta(book)}
          onPress={() => onOpenBook(book.id)}
        />
      ))}
      {action ? (
        <AssistantActionCard
          message={message}
          action={action}
          now={now}
          busy={busy}
          error={actionError}
          onConfirm={() => onConfirm(action.id)}
          onCancel={() => onCancel(action.id)}
          onSeeLoans={onSeeLoans}
        />
      ) : null}
      {blockedWithoutAction ? (
        <Alert
          tone={blockedInfo(message).overdue ? 'danger' : 'warning'}
          title={blockedInfo(message).title}
        >
          {blockedInfo(message).text}
        </Alert>
      ) : null}
      {retry !== null ? (
        <Button
          variant="secondary"
          icon="refresh"
          onPress={() => onRetry(retry)}
        >
          Tentar de novo
        </Button>
      ) : null}
    </View>
  ) : undefined

  return (
    <ChatBubble time={time} extra={extra}>
      {message.text}
    </ChatBubble>
  )
}
