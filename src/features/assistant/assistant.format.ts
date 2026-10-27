import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ApiError, API_ERROR_MESSAGE } from '@/shared/api/errors'
import {
  LOAN_PERIOD_DAYS,
  MAX_ACTIVE_LOANS,
  PICKUP_BUSINESS_DAYS,
  QUEUE_CONFIRM_HOURS,
} from '@/shared/config/library-rules'
import { ASSISTANT_ACTION_STATUS, ASSISTANT_ACTION_TYPE } from '@/shared/types'
import { BLOCKED_REASON_MESSAGE } from '@/shared/utils/blocked-reason'
import { toAppDate } from '@/shared/utils/dates'
import { pluralize } from '@/shared/utils/plural'
import {
  ASSISTANT_MESSAGE,
  ASSISTANT_MESSAGE_MAX_LENGTH,
} from './assistant.constants'
import type {
  AssistantAction,
  AssistantConversation,
  AssistantMessage,
  AssistantReply,
} from './assistant.types'

// Regras e textos do Assistente montados do que a API devolve (RF-ASS-01 a
// RF-ASS-05). Tudo aqui é puro: o relógio entra por parâmetro.

// Hora da mensagem no fuso do app, ex.: "19:44".
export function messageTime(iso: string): string {
  return format(toAppDate(iso), 'HH:mm', { locale: ptBR })
}

// Abreviações de 3 letras do dia da semana (o "EEE" do date-fns em pt-BR sai por
// extenso: "segunda"). Índice = `getDay()`.
const WEEKDAY_ABBREVIATIONS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

// Dia com o dia da semana, ex.: "seg, 19/10" (prazo concreto, RNF-USA-01).
export function weekdayDate(iso: string): string {
  const date = toAppDate(iso)
  return `${WEEKDAY_ABBREVIATIONS[date.getDay()]}, ${format(date, 'dd/MM')}`
}

// Só o texto que a pessoa digitou, sem espaços nas pontas e no limite da API.
export function fitMessage(text: string): string {
  return text.trim().slice(0, ASSISTANT_MESSAGE_MAX_LENGTH)
}

// Título curto da ação proposta (A72).
export function actionTitle(action: AssistantAction): string {
  return action.type === ASSISTANT_ACTION_TYPE.joinQueue
    ? 'Entrar na fila'
    : 'Solicitar empréstimo'
}

// Texto do botão que confirma a ação (verbo no começo, RNF-USA-01).
export function actionConfirmLabel(action: AssistantAction): string {
  return action.type === ASSISTANT_ACTION_TYPE.joinQueue
    ? 'Confirmar entrada na fila'
    : 'Confirmar solicitação'
}

// Linha do cartão: o que muda se o aluno confirmar.
export interface ActionPreviewLine {
  label: string
  value: string
}

// Linhas da prévia da ação (A72): prazo e contagem do pedido, ou a posição na fila.
export function actionPreviewLines(
  action: AssistantAction,
): ActionPreviewLine[] {
  const { preview } = action
  const lines: ActionPreviewLine[] = []
  if (action.type === ASSISTANT_ACTION_TYPE.joinQueue) {
    if (preview.queuePosition !== null) {
      lines.push({
        label: 'Sua posição',
        value: `${preview.queuePosition}º da fila`,
      })
      lines.push({
        label: 'Na sua frente',
        value: pluralize(preview.queuePosition - 1, 'pessoa', 'pessoas'),
      })
    }
    return lines
  }
  if (preview.pickupDeadline) {
    lines.push({
      label: 'Retirar até',
      value: `${weekdayDate(preview.pickupDeadline)} (${PICKUP_BUSINESS_DAYS} dias úteis)`,
    })
  }
  if (preview.activeLoansAfter !== null) {
    lines.push({
      label: 'Seus empréstimos',
      value: `passa a ${preview.activeLoansAfter} de ${MAX_ACTIVE_LOANS}`,
    })
  }
  return lines
}

// Frase de apoio do cartão: o que acontece depois de confirmar.
export function actionNote(action: AssistantAction): string {
  return action.type === ASSISTANT_ACTION_TYPE.joinQueue
    ? `Quando chegar sua vez, você terá ${QUEUE_CONFIRM_HOURS}h para confirmar.`
    : `O empréstimo de ${LOAN_PERIOD_DAYS} dias começa na retirada.`
}

// Como o cartão da ação aparece na conversa.
export type ActionView =
  'confirm' | 'blocked' | 'confirmed' | 'cancelled' | 'expired' | 'failed'

// Decide o cartão da ação: esperando confirmação, bloqueada (A81), feita,
// cancelada, vencida ou com falha. A proposta vencida deixa de pedir confirmação.
export function actionView(action: AssistantAction, now: Date): ActionView {
  switch (action.status) {
    case ASSISTANT_ACTION_STATUS.blocked:
      return 'blocked'
    case ASSISTANT_ACTION_STATUS.confirmed:
      return 'confirmed'
    case ASSISTANT_ACTION_STATUS.cancelled:
      return 'cancelled'
    case ASSISTANT_ACTION_STATUS.failed:
      return 'failed'
    case ASSISTANT_ACTION_STATUS.expired:
      return 'expired'
    default:
      return new Date(action.expiresAt).getTime() <= now.getTime()
        ? 'expired'
        : 'confirm'
  }
}

// Título e explicação de uma resposta bloqueada (A81): a frase que a API mandou
// vale mais que a do app; o motivo conhecido dá o título.
export function blockedInfo(message: AssistantMessage): {
  title: string
  text: string
  overdue: boolean
} {
  const reason = message.action?.blockedReason ?? message.blockedReason
  const known = reason ? BLOCKED_REASON_MESSAGE[reason] : undefined
  return {
    title: known?.title ?? ASSISTANT_MESSAGE.blockedFallbackTitle,
    text: message.action?.blockedMessage ?? known?.text ?? message.text,
    overdue: reason === 'overdue',
  }
}

// Texto da confirmação feita: o prazo do pedido ou a entrada na fila.
export function confirmedText(action: AssistantAction): string {
  const book = action.books[0]?.title
  if (action.type === ASSISTANT_ACTION_TYPE.joinQueue) {
    return book ? `Você entrou na fila de ${book}.` : 'Você entrou na fila.'
  }
  const deadline = action.preview.pickupDeadline
  return deadline
    ? `Pedido feito! Retire até ${weekdayDate(deadline)}.`
    : 'Pedido feito!'
}

// Mensagem de erro para o aluno: a da API (já em português) ou a genérica.
export function errorText(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : API_ERROR_MESSAGE.unknownError
}

// A pergunta do aluno que veio antes de `index`: é ela que "Tentar de novo"
// manda outra vez quando a resposta deu erro (A49).
export function previousQuestion(
  items: AssistantMessage[],
  index: number,
): string | null {
  for (let i = index - 1; i >= 0; i--) {
    const item = items[i]
    if (item && item.sender === 'student') return item.text
  }
  return null
}

// Coloca a pergunta e a resposta no fim da conversa que está no cache.
export function appendReply(
  conversation: AssistantConversation | undefined,
  reply: AssistantReply,
): AssistantConversation {
  return {
    disclaimer: reply.disclaimer,
    items: [...(conversation?.items ?? []), reply.question, reply.reply],
  }
}

// Troca no cache a ação que mudou (confirmada ou cancelada) pela nova.
export function replaceAction(
  conversation: AssistantConversation | undefined,
  action: AssistantAction,
): AssistantConversation | undefined {
  if (!conversation) return conversation
  return {
    ...conversation,
    items: conversation.items.map((item) =>
      item.action?.id === action.id ? { ...item, action } : item,
    ),
  }
}
