import type { FineStatus } from '@/shared/types'

// Multa na aba Multas do bibliotecário (schema `LibrarianFine` do Swagger). O
// dinheiro vem em centavos e as datas em ISO 8601 (UTC).
export interface LibrarianFine {
  id: string
  loanId: string
  bookId: string
  bookTitle: string
  status: FineStatus
  // Vencimento do empréstimo.
  dueAt: string
  businessDaysLate: number
  ratePerBusinessDayCents: number
  amountCents: number
  // Quando a devolução congelou a multa (null enquanto ela ainda conta).
  frozenAt: string | null
  paidAt: string | null
  receivedByName: string | null
  studentName: string
  matricula: string
  // O pagamento foi registrado já na devolução ("Multa paga agora").
  paidAtReturn: boolean
}

// Resposta de GET /librarian/fines.
export interface LibrarianFinesResponse {
  status: FineStatus
  items: LibrarianFine[]
}
