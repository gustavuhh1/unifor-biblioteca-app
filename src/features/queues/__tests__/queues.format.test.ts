import {
  confirmRemainingText,
  defaultEditionSelection,
  editionLabel,
  joinedSinceText,
  joinedText,
  peopleAheadText,
  positionText,
  yourTurnEntry,
} from '../queues.format'
import type { MyQueueEntry, QueuePreviewEdition } from '../queues.types'

function makeEdition(
  overrides: Partial<QueuePreviewEdition> = {},
): QueuePreviewEdition {
  return {
    bookId: 'b1',
    title: 'Algoritmos',
    edition: '3ª edição',
    year: 2012,
    copiesAvailable: 0,
    peopleAhead: 2,
    alreadyInQueue: false,
    canJoin: true,
    blockedReason: null,
    ...overrides,
  }
}

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

describe('peopleAheadText e positionText (RF-FIL-01, A28 e A32)', () => {
  it('escreve quantas pessoas estão na frente', () => {
    expect(peopleAheadText(0)).toBe('Ninguém na sua frente')
    expect(peopleAheadText(1)).toBe('1 pessoa na sua frente')
    expect(peopleAheadText(3)).toBe('3 pessoas na sua frente')
  })

  it('escreve a posição e desde quando o aluno está na fila', () => {
    expect(positionText(2)).toBe('2º da fila')
    expect(joinedSinceText('2026-10-08T15:00:00.000Z')).toBe(
      'Na fila desde 08/10',
    )
  })
})

describe('confirmRemainingText (RF-FIL-06, A29)', () => {
  const now = new Date('2026-10-15T12:00:00.000Z')

  it('mostra horas e minutos que faltam para confirmar', () => {
    expect(confirmRemainingText('2026-10-16T06:40:00.000Z', now)).toBe(
      '18h 40min',
    )
  })

  it('mostra só os minutos na última hora', () => {
    expect(confirmRemainingText('2026-10-15T12:40:00.000Z', now)).toBe('40min')
  })

  it('devolve null quando o prazo já passou', () => {
    expect(confirmRemainingText('2026-10-15T11:59:00.000Z', now)).toBeNull()
  })
})

describe('edições e entrada na fila (RF-FIL-04, A36)', () => {
  it('escreve a edição com o ano, ou o título se não houver nenhum dos dois', () => {
    expect(editionLabel(makeEdition())).toBe('3ª edição · 2012')
    expect(editionLabel(makeEdition({ edition: null, year: null }))).toBe(
      'Algoritmos',
    )
  })

  it('marca de início só a edição aberta, se o aluno pode entrar nela', () => {
    const editions = [
      makeEdition({ bookId: 'b1' }),
      makeEdition({ bookId: 'b2' }),
    ]
    expect(defaultEditionSelection(editions, 'b2')).toEqual(['b2'])
  })

  it('marca a única edição possível quando a aberta não serve', () => {
    const editions = [
      makeEdition({ bookId: 'b1', canJoin: false }),
      makeEdition({ bookId: 'b2' }),
    ]
    expect(defaultEditionSelection(editions, 'b1')).toEqual(['b2'])
  })

  it('não marca nada quando há várias possíveis e nenhuma é a aberta', () => {
    const editions = [
      makeEdition({ bookId: 'b1' }),
      makeEdition({ bookId: 'b2' }),
      makeEdition({ bookId: 'b3', canJoin: false }),
    ]
    expect(defaultEditionSelection(editions, 'b3')).toEqual([])
  })

  it('diz a posição ao entrar numa fila e quantas edições em várias', () => {
    const entry = (overrides: Partial<MyQueueEntry>): MyQueueEntry => ({
      id: 'q',
      bookId: 'b1',
      bookTitle: 'Código Limpo',
      status: 'waiting',
      position: 2,
      peopleAhead: 1,
      joinedAt: '2026-10-10T12:00:00.000Z',
      confirmDeadline: null,
      editionGroupId: null,
      ...overrides,
    })
    expect(joinedText([entry({})])).toContain('2º da fila de Código Limpo')
    expect(joinedText([entry({}), entry({ id: 'q2' })])).toContain('2 edições')
  })
})
