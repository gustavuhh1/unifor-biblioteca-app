import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { MATRICULA_LENGTH } from '@/features/auth/auth.constants'
import type { CoverTone } from '@/shared/components'
import { calendarDaysFromNow, toAppDate } from '@/shared/utils/dates'
import { pluralize } from '@/shared/utils/plural'
import { PICKUP_CODE_PATTERN } from './desk.constants'
import type {
  DeskLookupBody,
  DeskLookupResponse,
  DeskStudent,
} from './desk.types'

const MATRICULA_PATTERN = new RegExp(`^\\d{${MATRICULA_LENGTH}}$`)

// Decide o que o texto digitado é (RF-BAL-03): matrícula de 7 dígitos ou código
// do pedido ("RET-4821", sem diferenciar maiúsculas). Devolve null quando não é
// nenhum dos dois.
export function lookupBodyFromInput(input: string): DeskLookupBody | null {
  const text = input.trim()
  if (MATRICULA_PATTERN.test(text)) return { matricula: text }
  if (PICKUP_CODE_PATTERN.test(text)) return { pickupCode: text.toUpperCase() }
  return null
}

// Tom da capa (1 a 6) a partir do título do livro: a lista do balcão não traz a cor
// da capa, então o mesmo livro sempre cai no mesmo tom.
export function coverToneOfTitle(title: string): CoverTone {
  let sum = 0
  for (const char of title) sum += char.charCodeAt(0)
  return ((sum % 6) + 1) as CoverTone
}

// Quando o prazo de retirada é hoje, destaca como último dia (B07).
export function isLastPickupDay(
  pickupDeadline: string,
  now: Date = new Date(),
): boolean {
  return calendarDaysFromNow(pickupDeadline, now) <= 0
}

// Prazo da retirada por extenso e concreto: "Último dia: hoje", "Retirar até
// amanhã" ou "Retirar até seg, 19/10" (B07, RNF-USA-01).
export function pickupDeadlineLabel(
  pickupDeadline: string,
  now: Date = new Date(),
): string {
  const days = calendarDaysFromNow(pickupDeadline, now)
  if (days <= 0) return 'Último dia: hoje'
  if (days === 1) return 'Retirar até amanhã'
  // Em ptBR, "EEEEEE" é a abreviação de 3 letras ("qui"); "EEE" daria "quinta".
  const day = format(toAppDate(pickupDeadline), 'EEEEEE, dd/MM', {
    locale: ptBR,
  })
  return `Retirar até ${day}`
}

// "Devolver até 29/10": o fim do empréstimo de 14 dias (B05).
export function dueLabel(dueAt: string | null): string | null {
  if (!dueAt) return null
  return `Devolver até ${format(toAppDate(dueAt), 'dd/MM', { locale: ptBR })}`
}

// "3 de 10 livros" na ficha do aluno.
export function studentLoansText(student: DeskStudent): string {
  return `${student.activeLoanCount} de ${student.maxActiveLoans} livros`
}

// Primeiro nome para frases como "Lucas tem 1 livro em atraso".
export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}

// A retirada está bloqueada por livro atrasado (RF-EMP-04).
export function isPickupBlocked(record: DeskLookupResponse): boolean {
  return record.blockedReason === 'overdue'
}

// Quantos livros com o aluno estão em atraso (têm multa acumulada).
export function overdueCount(record: DeskLookupResponse): number {
  return record.withStudent.filter((loan) => loan.fine !== undefined).length
}

// "1 livro em atraso" / "2 livros em atraso".
export function overdueText(count: number): string {
  return `${pluralize(count, 'livro', 'livros')} em atraso`
}
