import { format } from 'date-fns'
import type { Status } from '@/shared/components'
import { LOAN_STATUS } from '@/shared/types'
import {
  calendarDaysFromNow,
  formatDayMonth,
  toAppDate,
} from '@/shared/utils/dates'
import { LOAN_STATE } from './loans.constants'
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

// Pedido que o QR de retirada mostra (A25): o do `loanId`, se ainda espera a
// retirada; sem id, o mais novo. A API manda os mais novos primeiro. Só pedido
// aguardando retirada tem `qrToken`.
export function findPickupLoan(
  loans: MyLoan[],
  loanId?: string,
): MyLoan | undefined {
  const waiting = loans.filter(
    (loan) => loan.status === LOAN_STATUS.awaitingPickup && loan.qrToken,
  )
  return waiting.find((loan) => loan.id === loanId) ?? waiting[0]
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

// Selo do cartão de Meus empréstimos: a palavra e o tom vêm do `state` que a API
// calcula na hora (RF-EMP-08, RNF-USA-04).
export interface LoanBadge {
  status: Status
  // Troca a palavra do selo (ex.: "5 dias restantes").
  label?: string
}

// "5 dias restantes", "Vence amanhã", "Vence hoje" ou "Atrasado". `now` entra por
// parâmetro para o cálculo ser testável.
export function daysLeftText(
  dueAt: string | null,
  now: Date = new Date(),
): string | undefined {
  if (!dueAt) return undefined
  const days = calendarDaysFromNow(dueAt, now)
  if (days < 0) return 'Atrasado'
  if (days === 0) return 'Vence hoje'
  if (days === 1) return 'Vence amanhã'
  return `${days} dias restantes`
}

// Selo de um pedido ou empréstimo (A39 e A42).
export function loanBadge(loan: MyLoan, now: Date = new Date()): LoanBadge {
  switch (loan.state) {
    case LOAN_STATE.readyForPickup:
      return { status: 'retirar' }
    case LOAN_STATE.inProgress:
      return { status: 'ativo', label: daysLeftText(loan.dueAt, now) }
    case LOAN_STATE.dueSoon:
      return { status: 'vence', label: daysLeftText(loan.dueAt, now) }
    case LOAN_STATE.overdue:
      return { status: 'atrasado' }
    case LOAN_STATE.returned:
      return { status: 'devolvido' }
    case LOAN_STATE.expired:
      return { status: 'expirado' }
    case LOAN_STATE.cancelled:
      return { status: 'cancelado' }
  }
}

// "Retirado 06/10" (e "· renovado" depois da renovação) no início do cartão.
export function loanStartText(loan: MyLoan): string | undefined {
  if (!loan.pickedUpAt) return undefined
  const text = `Retirado ${formatDayMonth(loan.pickedUpAt)}`
  return loan.renewalCount > 0 ? `${text} · renovado` : text
}

// "Devolver até 20/10" ou "Venceu 10/10", o prazo sempre concreto (RNF-USA-01).
export function loanDueText(loan: MyLoan): string | undefined {
  if (!loan.dueAt) return undefined
  const day = formatDayMonth(loan.dueAt)
  return loan.state === LOAN_STATE.overdue
    ? `Venceu ${day}`
    : `Devolver até ${day}`
}

// "Renovado até sex, 06/11.": o aviso depois de renovar (A41).
export function renewedNotice(loan: Pick<MyLoan, 'dueAt'>): string {
  return loan.dueAt
    ? `Renovado até ${formatWeekdayDate(loan.dueAt)}.`
    : 'Empréstimo renovado.'
}

// Linha de apoio de um item do histórico (A42): o que aconteceu e quando.
export function historyDetailText(loan: MyLoan): string {
  switch (loan.state) {
    case LOAN_STATE.returned: {
      const returned = loan.returnedAt
        ? `devolvido ${formatDayMonth(loan.returnedAt)}`
        : 'devolvido'
      return loan.pickedUpAt
        ? `Retirado ${formatDayMonth(loan.pickedUpAt)} · ${returned}`
        : `${returned.charAt(0).toUpperCase()}${returned.slice(1)}`
    }
    case LOAN_STATE.expired:
      return `Pedido de ${formatDayMonth(loan.requestedAt)} não retirado no prazo`
    case LOAN_STATE.cancelled:
      return loan.cancelledAt
        ? `Pedido cancelado em ${formatDayMonth(loan.cancelledAt)}`
        : 'Pedido cancelado'
    default:
      return `Pedido de ${formatDayMonth(loan.requestedAt)}`
  }
}
