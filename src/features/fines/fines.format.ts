import { pluralize } from '@/shared/utils/plural'
import { formatCents } from '@/shared/utils/money'
import { formatDayMonth } from '@/shared/utils/dates'
import { FINE_STATUS } from '@/shared/types'
import type { LibrarianFine } from './fines.types'

// Soma, em centavos, das multas da lista.
export function totalCents(fines: LibrarianFine[]): number {
  return fines.reduce((sum, fine) => sum + fine.amountCents, 0)
}

// Quantos alunos diferentes têm multa na lista.
export function studentCount(fines: LibrarianFine[]): number {
  return new Set(fines.map((fine) => fine.matricula)).size
}

// Subtítulo da tela: "R$ 6,00 em aberto · 1 aluno" (B13).
export function finesSubtitle(open: LibrarianFine[]): string {
  const count = studentCount(open)
  return `${formatCents(totalCents(open))} em aberto · ${pluralize(count, 'aluno', 'alunos')}`
}

// Primeiro nome para frases como "Pagamento de Marina registrado".
export function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}

// Frase pequena à direita de cada multa da lista: quando devolveu, quantos dias
// ela já tem ou quando e a quem foi paga.
export function fineRowDetail(fine: LibrarianFine): string {
  if (fine.status === FINE_STATUS.accruing) {
    return `${pluralize(fine.businessDaysLate, 'dia útil', 'dias úteis')} · sobe`
  }
  if (fine.status === FINE_STATUS.paid) {
    const when = fine.paidAt ? formatDayMonth(fine.paidAt) : ''
    const who = fine.paidAtReturn
      ? 'na devolução'
      : (fine.receivedByName ?? 'balcão')
    return when ? `${when} · ${who}` : who
  }
  return fine.frozenAt ? `devolvido ${formatDayMonth(fine.frozenAt)}` : ''
}

// Linha do cartão da multa em aberto: "Cálculo, Vol. 1 · devolvido em 15/10".
export function fineBookLine(fine: LibrarianFine): string {
  return fine.frozenAt
    ? `${fine.bookTitle} · devolvido em ${formatDayMonth(fine.frozenAt)}`
    : fine.bookTitle
}

// Aviso depois de registrar o pagamento (B18).
export function paymentSuccessMessage(fine: LibrarianFine): string {
  return `Pagamento de ${firstName(fine.studentName)} registrado: ${formatCents(fine.amountCents)}.`
}

// Rótulo da aba com o contador quando a lista já chegou: "Em aberto (4)".
export function tabLabel(label: string, count: number | undefined): string {
  return count === undefined ? label : `${label} (${count})`
}
