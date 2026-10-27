import { yourTurnEntry } from '../queues.format'
import type { MyQueueEntry } from '../queues.types'

function makeEntry(overrides: Partial<MyQueueEntry> = {}): MyQueueEntry {
  return {
    id: 'q1',
    bookId: 'b1',
    bookTitle: 'Código Limpo',
    status: 'waiting',
    position: 2,
    peopleAhead: 1,
    joinedAt: '2026-10-10T12:00:00.000Z',
    confirmDeadline: null,
    editionGroupId: null,
    ...overrides,
  }
}

describe('yourTurnEntry (A07, É a sua vez)', () => {
  it('devolve null quando o aluno só está esperando', () => {
    expect(yourTurnEntry([makeEntry()])).toBeNull()
  })

  it('devolve o lugar em que já é a vez', () => {
    const turn = makeEntry({
      id: 'vez',
      status: 'your_turn',
      confirmDeadline: '2026-10-16T12:12:00.000Z',
    })
    expect(yourTurnEntry([makeEntry(), turn])?.id).toBe('vez')
  })

  it('com várias vezes, mostra a de prazo mais curto', () => {
    const later = makeEntry({
      id: 'depois',
      status: 'your_turn',
      confirmDeadline: '2026-10-17T12:00:00.000Z',
    })
    const first = makeEntry({
      id: 'antes',
      status: 'your_turn',
      confirmDeadline: '2026-10-16T12:00:00.000Z',
    })
    expect(yourTurnEntry([later, first])?.id).toBe('antes')
  })
})
