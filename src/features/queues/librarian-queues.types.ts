import type { QueueEntryStatus, QueueOrigin } from '@/shared/types'

// Livro na lista de quem tem fila (parte do schema `LibrarianBook`, GET
// /librarian/books). Só os campos que a aba Filas usa.
export interface LibrarianQueueBook {
  id: string
  title: string
  authors: string[]
  edition: string | null
  year: number | null
  coverTone: number
  copiesTotal: number
  copiesAvailable: number
  queueLength: number
  // Quando o próximo exemplar emprestado deve voltar (ISO 8601).
  nextReturnAt: string | null
}

// Uma página de GET /librarian/books.
export interface LibrarianBooksPage {
  items: LibrarianQueueBook[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// Aluno na fila de um livro (schema `LibrarianQueueEntry`).
export interface LibrarianQueueEntry {
  id: string
  position: number
  status: QueueEntryStatus
  studentUid: string
  studentName: string
  matricula: string
  joinedAt: string
  origin: QueueOrigin
  addReason: string | null
  // Prazo para o aluno confirmar a vez (só quando `status` é `your_turn`).
  confirmDeadline: string | null
  lastNotifiedAt: string | null
  notifyCount: number
  editionGroupId: string | null
}

// Fila de um livro (schema `LibrarianQueue`, GET /librarian/books/{id}/queue).
export interface LibrarianQueue {
  book: {
    id: string
    title: string
    edition: string | null
    year: number | null
    copiesTotal: number
    copiesAvailable: number
  }
  items: LibrarianQueueEntry[]
}

// Aluno que desce uma posição quando outro passa à frente dele.
export interface QueueMovedDown {
  entryId: string
  studentName: string
  matricula: string
  fromPosition: number
  toPosition: number
}

// Resposta de adicionar ou mover (schema `QueueChangeResponse`). Com `applied`
// falso nada foi gravado: a mudança passa à frente de alguém e falta confirmar.
export interface QueueChangeResponse {
  applied: boolean
  movedDown: QueueMovedDown[]
  queue: LibrarianQueue | null
}

// Corpo de POST /librarian/books/{id}/queue.
export interface AddToQueueBody {
  matricula: string
  // Sem posição o aluno vai para o fim, sem pedir confirmação.
  position?: number
  reason?: string
  confirmed?: boolean
}

// Corpo de PATCH /librarian/queues/{id}/position.
export interface MoveInQueueBody {
  position: number
  reason?: string
  confirmed?: boolean
}
