import type { FineStatus } from '@/shared/types'

// Uma multa do aluno em GET /me/fines (schema `MyFine` do Swagger). As datas
// chegam como texto ISO 8601 (UTC) e o dinheiro em centavos.
export interface MyFine {
  id: string
  loanId: string
  bookId: string
  bookTitle: string
  // accruing = livro ainda com o aluno (contando); open = devolvido, congelada,
  // aguardando pagamento no balcão; paid = paga.
  status: FineStatus
  dueAt: string
  businessDaysLate: number
  ratePerBusinessDayCents: number
  amountCents: number
  frozenAt: string | null
  paidAt: string | null
  receivedByName: string | null
}

// Resposta de GET /me/fines (RF-MUL-03).
export interface MyFinesResponse {
  items: MyFine[]
  openTotalCents: number
  // Só multa de livro ainda atrasado bloqueia novos empréstimos (RF-MUL-04).
  blocksNewLoans: boolean
}
