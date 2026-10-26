import { LOAN_STATUS } from '@/shared/types'
import type { MyLoan } from './loans.types'

// Empréstimo ativo com a devolução mais próxima (A07, "Próxima devolução").
// Pedidos ainda não retirados não têm prazo de devolução, então ficam de fora.
export function nextDueLoan(loans: MyLoan[]): MyLoan | null {
  const due = loans.filter(
    (loan) => loan.status === LOAN_STATUS.active && loan.dueAt !== null,
  )
  if (due.length === 0) return null
  return due.reduce((next, loan) =>
    (loan.dueAt as string) < (next.dueAt as string) ? loan : next,
  )
}
