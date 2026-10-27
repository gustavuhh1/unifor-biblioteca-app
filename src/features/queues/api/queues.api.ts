import { apiRequest } from '@/shared/api/client'
import type {
  ConfirmQueueTurnResponse,
  JoinQueueResponse,
  LeftQueueEntry,
  MyQueuesResponse,
  QueuePreview,
} from '../queues.types'

// Filas ativas do aluno, com posição e prazo da vez (GET /me/queues).
export function getMyQueues() {
  return apiRequest<MyQueuesResponse>('/me/queues')
}

// Quantas pessoas estão na frente de cada edição do livro, antes de entrar
// (GET /books/{bookId}/queue/preview).
export function getQueuePreview(bookId: string) {
  return apiRequest<QueuePreview>(
    `/books/${encodeURIComponent(bookId)}/queue/preview`,
  )
}

// Entra na fila de uma ou mais edições do mesmo livro (POST /queues).
export function postJoinQueue(bookIds: string[]) {
  return apiRequest<JoinQueueResponse>('/queues', {
    method: 'POST',
    body: { bookIds },
  })
}

// Confirma a vez: o lugar vira um pedido com prazo de retirada (POST
// /queues/{entryId}/confirm).
export function postConfirmQueueTurn(entryId: string) {
  return apiRequest<ConfirmQueueTurnResponse>(
    `/queues/${encodeURIComponent(entryId)}/confirm`,
    { method: 'POST' },
  )
}

// Sai da fila, ou recusa a vez (POST /queues/{entryId}/leave).
export function postLeaveQueue(entryId: string) {
  return apiRequest<LeftQueueEntry>(
    `/queues/${encodeURIComponent(entryId)}/leave`,
    { method: 'POST' },
  )
}
