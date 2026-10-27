import { QUEUE_ENTRY_STATUS } from '@/shared/types'
import type { MyQueueEntry } from './queues.types'

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
