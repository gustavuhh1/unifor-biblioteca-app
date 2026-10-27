import type { MyLoan } from '@/features/loans/loans.types'
import type { QueueEntryStatus } from '@/shared/types'
import type { BlockedReason } from '@/shared/utils/blocked-reason'

// Tipos exclusivos de filas: o que as rotas de fila do aluno devolvem (schemas
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

// Uma edição na prévia da fila, com quem está na frente e se o aluno pode entrar.
export interface QueuePreviewEdition {
  bookId: string
  title: string
  edition: string | null
  year: number | null
  copiesAvailable: number
  peopleAhead: number
  alreadyInQueue: boolean
  canJoin: boolean
  // Só vem quando `canJoin` é false.
  blockedReason?: BlockedReason | null
}

// Resposta de GET /books/{bookId}/queue/preview (RF-FIL-01).
export interface QueuePreview {
  bookId: string
  activeQueueCount: number
  maxActiveQueues: number
  editions: QueuePreviewEdition[]
}

// Resposta de POST /queues: os lugares criados, um por edição marcada.
export interface JoinQueueResponse {
  items: MyQueueEntry[]
}

// Resposta de POST /queues/{entryId}/confirm: o pedido criado e as filas das
// outras edições que foram canceladas.
export interface ConfirmQueueTurnResponse {
  loan: MyLoan
  cancelledEntryIds: string[]
}

// Resposta de POST /queues/{entryId}/leave: o lugar que saiu da fila.
export interface LeftQueueEntry {
  id: string
  bookId: string
  bookTitle: string
  status: QueueEntryStatus
  endedAt: string
}
