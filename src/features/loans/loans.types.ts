import type { LoanStatus } from '@/shared/types'
import type {
  LoanState,
  LoanView,
  RenewalDenialReason,
} from './loans.constants'

// Tipos exclusivos de empréstimos: o que GET /me/loans devolve (schema `MyLoan`
// do Swagger). As datas chegam como texto ISO 8601 (UTC).

// Um pedido ou empréstimo do aluno.
export interface MyLoan {
  id: string
  bookId: string
  bookTitle: string
  bookShelf: string
  status: LoanStatus
  state: LoanState
  requestedAt: string
  pickupDeadline: string
  pickupCode: string | null
  qrToken: string | null
  pickedUpAt: string | null
  dueAt: string | null
  originalDueAt: string | null
  renewalCount: number
  canRenew: boolean
  renewalDenialReason: RenewalDenialReason | null
  // De 0 a 1: quanto do prazo já passou.
  progress: number | null
  returnedAt: string | null
  cancelledAt: string | null
  expiredAt: string | null
}

// Resposta de GET /me/loans.
export interface MyLoansResponse {
  view: LoanView
  items: MyLoan[]
}
