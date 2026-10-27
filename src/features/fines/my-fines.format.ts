import { FINE_STATUS } from '@/shared/types'
import { formatDate } from '@/shared/utils/dates'
import { formatCents } from '@/shared/utils/money'
import { MY_FINES_NOTICE } from './my-fines.constants'
import type { MyFine, MyFinesResponse } from './my-fines.types'

// As multas separadas pelo estado (RF-MUL-03): contando, congeladas e pagas.
export interface GroupedFines {
  accruing: MyFine[]
  open: MyFine[]
  paid: MyFine[]
}

// Separa a lista da API por estado, mantendo a ordem em que ela veio.
export function groupFines(fines: MyFine[]): GroupedFines {
  return {
    accruing: fines.filter((fine) => fine.status === FINE_STATUS.accruing),
    open: fines.filter((fine) => fine.status === FINE_STATUS.open),
    paid: fines.filter((fine) => fine.status === FINE_STATUS.paid),
  }
}

// O aviso do topo: atraso bloqueia; multa congelada sem atraso só avisa
// (RF-MUL-04); sem multa a abrir, nenhum aviso.
export function finesNotice(
  response: Pick<MyFinesResponse, 'items' | 'blocksNewLoans'>,
): { title: string; text: string } | null {
  if (response.blocksNewLoans) return MY_FINES_NOTICE.blocked
  const hasOpen = response.items.some(
    (fine) => fine.status === FINE_STATUS.open,
  )
  return hasOpen ? MY_FINES_NOTICE.openOnly : null
}

// Linha de apoio do cartão da multa: "Cálculo · venceu em 10/10/2026" enquanto o
// livro está com o aluno, ou "Cálculo · devolvido em 15/10/2026" depois.
export function fineBookLine(fine: MyFine): string {
  if (fine.status === FINE_STATUS.accruing) {
    return `${fine.bookTitle} · venceu em ${formatDate(fine.dueAt)}`
  }
  return `${fine.bookTitle} · devolvido em ${formatDate(fine.frozenAt ?? fine.dueAt)}`
}

// Frase do que acontece com o valor: sobe por dia útil, ou parou de contar.
export function fineStateText(fine: MyFine): string {
  const rate = formatCents(fine.ratePerBusinessDayCents)
  if (fine.status === FINE_STATUS.accruing) {
    return `A multa sobe ${rate} por dia útil. A contagem para quando você devolver o livro.`
  }
  return 'A multa parou de contar porque você devolveu o livro. Pague no balcão da biblioteca.'
}

// Linha de uma multa paga: "Cálculo · paga em 16/10/2026 · recebida por Ana".
export function paidFineLine(fine: MyFine): string {
  const paid = fine.paidAt ? ` · paga em ${formatDate(fine.paidAt)}` : ''
  const receiver = fine.receivedByName
    ? ` · recebida por ${fine.receivedByName}`
    : ''
  return `${fine.bookTitle}${paid}${receiver}`
}
