import {
  coverToneOfBook,
  dueLabel,
  firstName,
  isLastPickupDay,
  isPickupBlocked,
  lookupBodyFromInput,
  overdueCount,
  overdueText,
  pickupDeadlineLabel,
  studentLoansText,
} from '../desk.format'
import type { DeskLookupResponse, DeskStudent } from '../desk.types'

// 19/10/2026, 12h no fuso de Fortaleza (UTC-3).
const NOW = new Date('2026-10-19T15:00:00.000Z')

function makeStudent(overrides: Partial<DeskStudent> = {}): DeskStudent {
  return {
    uid: 'uid_lucas',
    matricula: '2412858',
    name: 'Lucas Almeida',
    initials: 'LA',
    activeLoanCount: 3,
    maxActiveLoans: 10,
    openFineTotalCents: 0,
    ...overrides,
  }
}

function makeRecord(
  overrides: Partial<DeskLookupResponse> = {},
): DeskLookupResponse {
  return {
    student: makeStudent(),
    pickups: [],
    withStudent: [],
    ...overrides,
  }
}

describe('lookupBodyFromInput (matrícula x código do pedido, RF-BAL-03)', () => {
  it('reconhece a matrícula de 7 dígitos', () => {
    expect(lookupBodyFromInput('2412858')).toEqual({ matricula: '2412858' })
    expect(lookupBodyFromInput('  2412858  ')).toEqual({
      matricula: '2412858',
    })
  })

  it('reconhece o código do pedido e o escreve em maiúsculas', () => {
    expect(lookupBodyFromInput('RET-4821')).toEqual({ pickupCode: 'RET-4821' })
    expect(lookupBodyFromInput('ret-4821')).toEqual({ pickupCode: 'RET-4821' })
  })

  it('recusa o que não é nem matrícula nem código', () => {
    expect(lookupBodyFromInput('')).toBeNull()
    expect(lookupBodyFromInput('241285')).toBeNull()
    expect(lookupBodyFromInput('24128581')).toBeNull()
    expect(lookupBodyFromInput('RET-482')).toBeNull()
    expect(lookupBodyFromInput('RET4821')).toBeNull()
    expect(lookupBodyFromInput('abc')).toBeNull()
  })
})

describe('pickupDeadlineLabel (prazo da retirada, B07)', () => {
  it('chama o dia de hoje de último dia', () => {
    // 21h55 de hoje no fuso de Fortaleza.
    const deadline = '2026-10-20T00:55:00.000Z'
    expect(pickupDeadlineLabel(deadline, NOW)).toBe('Último dia: hoje')
    expect(isLastPickupDay(deadline, NOW)).toBe(true)
  })

  it('escreve amanhã por extenso', () => {
    expect(pickupDeadlineLabel('2026-10-21T00:55:00.000Z', NOW)).toBe(
      'Retirar até amanhã',
    )
  })

  it('mostra o dia da semana e a data nos demais dias', () => {
    const deadline = '2026-10-23T00:55:00.000Z'
    expect(pickupDeadlineLabel(deadline, NOW)).toBe('Retirar até qui, 22/10')
    expect(isLastPickupDay(deadline, NOW)).toBe(false)
  })
})

describe('textos da ficha do aluno', () => {
  it('escreve os livros com o aluno', () => {
    expect(studentLoansText(makeStudent())).toBe('3 de 10 livros')
  })

  it('escreve o vencimento concreto ou nada sem data', () => {
    expect(dueLabel('2026-10-29T00:55:00.000Z')).toBe('Devolver até 28/10')
    expect(dueLabel(null)).toBeNull()
  })

  it('pega o primeiro nome', () => {
    expect(firstName('Marina Castro')).toBe('Marina')
    expect(firstName('Marina')).toBe('Marina')
  })

  it('conta os atrasados pela multa acumulada e escreve no plural certo', () => {
    const loan = {
      id: 'l1',
      bookId: 'b1',
      bookTitle: 'Cálculo, Vol. 1',
      bookShelf: '515',
      status: 'active' as const,
      state: 'overdue' as const,
      pickupCode: null,
      pickupDeadline: '2026-09-28T00:55:00.000Z',
      pickedUpAt: null,
      dueAt: null,
      returnedAt: null,
      progress: 1,
    }
    const record = makeRecord({
      blockedReason: 'overdue',
      withStudent: [
        { ...loan, fine: { businessDaysLate: 3, amountCents: 600 } },
        { ...loan, id: 'l2', state: 'in_progress' as const },
      ],
    })
    expect(isPickupBlocked(record)).toBe(true)
    expect(overdueCount(record)).toBe(1)
    expect(overdueText(1)).toBe('1 livro em atraso')
    expect(overdueText(2)).toBe('2 livros em atraso')
    expect(isPickupBlocked(makeRecord())).toBe(false)
  })
})

describe('coverToneOfBook (capa sem cor na lista do balcão)', () => {
  it('sempre devolve um tom de 1 a 6 e o mesmo para o mesmo livro', () => {
    for (const id of ['a', 'book_1', 'zzzzzzzz', '']) {
      const tone = coverToneOfBook(id)
      expect(tone).toBeGreaterThanOrEqual(1)
      expect(tone).toBeLessThanOrEqual(6)
      expect(coverToneOfBook(id)).toBe(tone)
    }
  })
})
