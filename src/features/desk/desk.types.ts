import type { LoanState } from '@/features/loans/loans.constants'
import type { FineStatus, LoanStatus } from '@/shared/types'

// Tipos exclusivos do balcão: o que as rotas /librarian/desk e /librarian/loans
// devolvem (schemas do Swagger). As datas chegam como texto ISO 8601 (UTC).

// Resposta de GET /librarian/desk/summary: os quatro números do Painel (RF-BAL-01).
export interface DeskSummary {
  pendingPickups: number
  returnsToday: number
  queueAwaitingConfirm: number
  openFines: number
}

// Um pedido aguardando retirada na lista Retiradas (RF-BAL-05).
export interface PickupItem {
  loanId: string
  pickupCode: string
  matricula: string
  studentName: string
  bookTitle: string
  bookShelf: string
  pickupDeadline: string
}

// Resposta de GET /librarian/pickups.
export interface PickupsResponse {
  items: PickupItem[]
}

// O pedido ou empréstimo como o balcão o vê (campos comuns das respostas).
export interface DeskLoan {
  id: string
  bookId: string
  bookTitle: string
  bookShelf: string
  status: LoanStatus
  state: LoanState
  pickupCode: string | null
  pickupDeadline: string
  pickedUpAt: string | null
  dueAt: string | null
  returnedAt: string | null
  progress: number | null
}

// Pedido aguardando retirada na ficha do aluno; `scanned` marca o que o QR ou
// o código apontou.
export interface DeskPickup extends DeskLoan {
  scanned: boolean
}

// Livro com o aluno na ficha; `fine` só traz valor nos atrasados (multa já
// acumulada) e vem nulo nos demais.
export interface DeskWithStudent extends DeskLoan {
  fine?: { businessDaysLate: number; amountCents: number } | null
}

// O aluno na ficha ("3 de 10 livros").
export interface DeskStudent {
  uid: string
  matricula: string
  name: string
  initials?: string | null
  activeLoanCount: number
  maxActiveLoans: number
  openFineTotalCents: number
}

// Corpo de POST /librarian/desk/lookup: exatamente um dos três campos.
export type DeskLookupBody =
  { qrToken: string } | { pickupCode: string } | { matricula: string }

// Resposta de POST /librarian/desk/lookup: a ficha do aluno (B04 e B05).
export interface DeskLookupResponse {
  student: DeskStudent
  pickups: DeskPickup[]
  withStudent: DeskWithStudent[]
  // "overdue" quando um livro atrasado impede a retirada (RF-EMP-04).
  blockedReason?: 'overdue'
}

// Resposta de POST /librarian/loans/{loanId}/pickup.
export interface PickupResponse {
  loan: DeskLoan
}

// Multa gerada pela devolução; null quando o livro volta no prazo.
export interface ReturnFine {
  id: string
  status: FineStatus
  businessDaysLate: number
  amountCents: number
}

// Resposta de POST /librarian/loans/{loanId}/return.
export interface ReturnResponse {
  loan: DeskLoan
  fine: ReturnFine | null
  // O 1º da fila foi avisado na hora (RF-BAL-04).
  queueNotified: boolean
}
