import type { QueueEntryStatus } from '@/shared/types'

// Tipos exclusivos de filas: o que GET /me/queues devolve (schema `MyQueueEntry`
// do Swagger). As datas chegam como texto ISO 8601 (UTC).

// Lugar ativo do aluno numa fila: esperando ou na vez dele.
export interface MyQueueEntry {
  id: string
  bookId: string
  bookTitle: string
  // Só `waiting` ou `your_turn`.
  status: Extract<QueueEntryStatus, 'waiting' | 'your_turn'>
  position: number
  peopleAhead: number
  joinedAt: string
  // Só em `your_turn`: até quando o aluno pode confirmar.
  confirmDeadline: string | null
  editionGroupId: string | null
}

// Resposta de GET /me/queues.
export interface MyQueuesResponse {
  items: MyQueueEntry[]
  activeQueueCount: number
  maxActiveQueues: number
}
