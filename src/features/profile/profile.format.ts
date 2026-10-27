import type { Me } from '@/features/auth/auth.types'
import { initialsOf } from '@/shared/components/avatar'
import { MAX_ACTIVE_LOANS } from '@/shared/config/library-rules'
import { formatCents } from '@/shared/utils/money'

// Texto do Perfil do aluno montado a partir de GET /me (RF-PER-01, telas A47 e A50).
export interface StudentProfileView {
  name: string
  initials: string
  // "Matrícula 2412858 · ingresso em 2024".
  matriculaLine: string
  course: string | null
  loans: string
  activeQueues: string
  readThisYear: string
  readYear: number
  // "R$ 6,00" quando há multa em aberto; null em dia.
  fineAmount: string | null
}

// Nome para mostrar: enquanto o aluno não informa o nome completo, vale a matrícula.
export function displayNameOf(me: Pick<Me, 'fullName' | 'matricula'>): string {
  return me.fullName?.trim() || me.matricula
}

// Iniciais do avatar: as da API, as do nome ou os dois últimos dígitos da matrícula.
export function initialsOfMe(
  me: Pick<Me, 'fullName' | 'initials' | 'matricula'>,
): string {
  if (me.initials) return me.initials
  if (me.fullName?.trim()) return initialsOf(me.fullName)
  return me.matricula.slice(-2)
}

// Monta o resumo do Perfil do aluno. `year` entra por parâmetro para o cálculo
// dos "lidos no ano" ser testável.
export function buildStudentProfile(me: Me, year: number): StudentProfileView {
  const entry = me.entryYear ? ` · ingresso em ${me.entryYear}` : ''
  return {
    name: displayNameOf(me),
    initials: initialsOfMe(me),
    matriculaLine: `Matrícula ${me.matricula}${entry}`,
    course: me.course,
    loans: `${me.activeLoanCount}/${MAX_ACTIVE_LOANS}`,
    activeQueues: String(me.activeQueueCount),
    readThisYear: String(me.booksReadByYear[String(year)] ?? 0),
    readYear: year,
    fineAmount:
      me.openFineTotalCents > 0 ? formatCents(me.openFineTotalCents) : null,
  }
}
