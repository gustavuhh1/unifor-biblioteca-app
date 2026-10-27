import { API_ERROR_MESSAGE, ApiError } from '@/shared/api/errors'
import { isBlockedReason } from '@/features/loans/loans.errors'
import { BLOCKED_REASON_MESSAGE } from '@/shared/utils/blocked-reason'
import { QUEUE_ERROR_CODE } from './queues.constants'

// Título e texto de um erro de fila, prontos para um Alert ou uma folha.
export interface QueueErrorMessage {
  title: string
  text: string
}

const JOIN_FAILED_TITLE = 'Não foi possível entrar na fila'
const CONFIRM_FAILED_TITLE = 'Não foi possível confirmar'

// Texto de qualquer erro da API (já em português) ou o genérico.
export function queueErrorText(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : API_ERROR_MESSAGE.unknownError
}

// Traduz a recusa de POST /queues: os motivos de bloqueio usam os textos da
// página do livro (A35, A44 e A76; RF-FIL-03, RF-EMP-04 e RF-ACE-08) e o resto fica
// com a mensagem da API.
export function describeJoinQueueError(error: unknown): QueueErrorMessage {
  if (error instanceof ApiError) {
    if (isBlockedReason(error.code)) return BLOCKED_REASON_MESSAGE[error.code]
    if (error.code === QUEUE_ERROR_CODE.alreadyInQueue) {
      return {
        title: 'Você já está nesta fila',
        text: 'Veja a sua posição em Meus empréstimos, na aba Na fila.',
      }
    }
  }
  return { title: JOIN_FAILED_TITLE, text: queueErrorText(error) }
}

// Traduz a recusa de POST /queues/{id}/confirm (RF-FIL-06): prazo de 24h vencido,
// ainda não é a vez, lugar que já saiu da fila, ou uma regra do pedido
// (atraso, limite, mesmo título).
export function describeConfirmTurnError(error: unknown): QueueErrorMessage {
  if (error instanceof ApiError) {
    if (isBlockedReason(error.code)) return BLOCKED_REASON_MESSAGE[error.code]
    if (error.code === QUEUE_ERROR_CODE.turnExpired) {
      return {
        title: CONFIRM_FAILED_TITLE,
        text: 'O prazo de 24 horas para confirmar acabou. Você saiu da fila e o próximo foi avisado.',
      }
    }
    if (error.code === QUEUE_ERROR_CODE.notYourTurn) {
      return {
        title: CONFIRM_FAILED_TITLE,
        text: 'Ainda não é a sua vez. Você será avisado quando o livro voltar.',
      }
    }
    if (error.code === QUEUE_ERROR_CODE.queueEntryNotActive) {
      return {
        title: CONFIRM_FAILED_TITLE,
        text: 'Este lugar na fila não está mais ativo.',
      }
    }
  }
  return { title: CONFIRM_FAILED_TITLE, text: queueErrorText(error) }
}
