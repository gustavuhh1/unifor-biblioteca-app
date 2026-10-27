import { format } from 'date-fns'
import { LOAN_STATUS } from '@/shared/types'
import { toAppDate } from '@/shared/utils/dates'
import type { MyLoan } from './loans.types'

// Dias da semana abreviados, de domingo a sábado (a abreviação do date-fns em
// pt-BR sai por extenso).
const WEEKDAY_ABBREVIATIONS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']

// Dia da semana, dia e mês no fuso do app, ex.: "seg, 19/10" (prazos concretos,
// RNF-USA-01).
export function formatWeekdayDate(iso: string): string {
  const date = toAppDate(iso)
  return `${WEEKDAY_ABBREVIATIONS[date.getDay()]}, ${format(date, 'dd/MM')}`
}

// "Retire até seg, 19/10": o prazo do pedido ainda não retirado (A24 e A39).
export function pickupDeadlineText(
  loan: Pick<MyLoan, 'pickupDeadline'>,
): string {
  return `Retire até ${formatWeekdayDate(loan.pickupDeadline)}`
}

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
