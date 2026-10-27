import { QUEUE_ENTRY_STATUS } from '@/shared/types'
import { formatDayMonth } from '@/shared/utils/dates'
import { pluralize } from '@/shared/utils/plural'
import type { MyQueueEntry, QueuePreviewEdition } from './queues.types'

const MS_PER_MINUTE = 60_000
const MINUTES_PER_HOUR = 60

// Lugar em que já é a vez do aluno (A07, "É a sua vez"); null se não há. Entre
// vários, o de prazo mais curto aparece primeiro.
export function yourTurnEntry(entries: MyQueueEntry[]): MyQueueEntry | null {
  const turns = entries.filter(
    (entry) =>
      entry.status === QUEUE_ENTRY_STATUS.yourTurn &&
      entry.confirmDeadline !== null,
  )
  if (turns.length === 0) return null
  return turns.reduce((first, entry) =>
    (entry.confirmDeadline as string) < (first.confirmDeadline as string)
      ? entry
      : first,
  )
}

// "ninguém", "1 pessoa" ou "2 pessoas" na frente do aluno (RF-FIL-01).
export function peopleAheadText(ahead: number): string {
  if (ahead === 0) return 'Ninguém na sua frente'
  return `${pluralize(ahead, 'pessoa', 'pessoas')} na sua frente`
}

// "2º da fila" (A32).
export function positionText(position: number): string {
  return `${position}º da fila`
}

// "Na fila desde 08/10" (A32).
export function joinedSinceText(joinedAt: string): string {
  return `Na fila desde ${formatDayMonth(joinedAt)}`
}

// Tempo que falta para confirmar a vez: "18h 40min" ou "40min". Null quando o
// prazo já passou. `now` entra por parâmetro para o cálculo ser testável.
export function confirmRemainingText(
  deadline: string,
  now: Date,
): string | null {
  const minutes = Math.floor(
    (new Date(deadline).getTime() - now.getTime()) / MS_PER_MINUTE,
  )
  if (minutes < 0) return null
  const hours = Math.floor(minutes / MINUTES_PER_HOUR)
  const rest = minutes % MINUTES_PER_HOUR
  return hours > 0 ? `${hours}h ${rest}min` : `${rest}min`
}

// Rótulo da edição ao escolher em quais filas entrar (A36): "3ª edição · 2012".
export function editionLabel(edition: QueuePreviewEdition): string {
  const parts = [edition.edition, edition.year ? String(edition.year) : null]
  const label = parts.filter(Boolean).join(' · ')
  return label || edition.title
}

// Edições marcadas de início: só a que o aluno abriu, se ele pode entrar nela;
// se ela não serve e só uma outra serve, a própria (RF-FIL-04).
export function defaultEditionSelection(
  editions: QueuePreviewEdition[],
  bookId: string,
): string[] {
  const joinable = editions.filter((edition) => edition.canJoin)
  const opened = joinable.find((edition) => edition.bookId === bookId)
  if (opened) return [opened.bookId]
  return joinable.length === 1 && joinable[0] ? [joinable[0].bookId] : []
}

// Frase de sucesso depois de entrar na fila (A28 e A36).
export function joinedText(entries: MyQueueEntry[]): string {
  const [first] = entries
  if (!first) return 'Você entrou na fila.'
  if (entries.length > 1) {
    return `Você entrou na fila de ${entries.length} edições. A primeira que voltar fica com você e as outras filas saem sozinhas.`
  }
  return `Você é o ${first.position}º da fila de ${first.bookTitle}. Avisamos quando chegar a sua vez.`
}
