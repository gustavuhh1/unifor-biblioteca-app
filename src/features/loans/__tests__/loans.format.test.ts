import {
  daysLeftText,
  findPickupLoan,
  formatWeekdayDate,
  historyDetailText,
  loanBadge,
  loanDueText,
  loanStartText,
  loansTabFromParam,
  nextDueLoan,
  pickupDeadlineText,
  renewedNotice,
} from '../loans.format'
import type { MyLoan } from '../loans.types'

function makeLoan(overrides: Partial<MyLoan> = {}): MyLoan {
  return {
    id: 'l1',
    bookId: 'b1',
    bookTitle: 'Código Limpo',
    bookShelf: 'Estante 005.1',
    status: 'active',
    state: 'in_progress',
    requestedAt: '2026-10-01T12:00:00.000Z',
    pickupDeadline: '2026-10-03T12:00:00.000Z',
    pickupCode: null,
    qrToken: null,
    pickedUpAt: '2026-10-02T12:00:00.000Z',
    dueAt: '2026-10-16T12:00:00.000Z',
    originalDueAt: '2026-10-16T12:00:00.000Z',
    renewalCount: 0,
    canRenew: true,
    renewalDenialReason: null,
    progress: 0.5,
    returnedAt: null,
    cancelledAt: null,
    expiredAt: null,
    ...overrides,
  }
}

describe('nextDueLoan (A07, Próxima devolução)', () => {
  it('devolve null quando não há empréstimo ativo', () => {
    expect(nextDueLoan([])).toBeNull()
  })

  it('escolhe o ativo com a devolução mais próxima', () => {
    const late = makeLoan({ id: 'tarde', dueAt: '2026-10-30T12:00:00.000Z' })
    const soon = makeLoan({ id: 'cedo', dueAt: '2026-10-16T12:00:00.000Z' })
    expect(nextDueLoan([late, soon])?.id).toBe('cedo')
  })

  it('ignora pedido ainda não retirado, que não tem prazo de devolução', () => {
    const pending = makeLoan({
      id: 'pedido',
      status: 'awaiting_pickup',
      dueAt: null,
    })
    expect(nextDueLoan([pending])).toBeNull()
  })
})

describe('formatWeekdayDate (prazo concreto)', () => {
  it('escreve o dia da semana, o dia e o mês no fuso de Fortaleza', () => {
    // 19/10/2026 é uma segunda-feira.
    expect(formatWeekdayDate('2026-10-19T21:55:00.000Z')).toBe('seg, 19/10')
  })

  it('vira o dia pelo fuso do app, não pelo UTC', () => {
    // 02h UTC de terça ainda é segunda à noite em Fortaleza (UTC-3).
    expect(formatWeekdayDate('2026-10-20T02:00:00.000Z')).toBe('seg, 19/10')
  })
})

describe('pickupDeadlineText (A24 e A39)', () => {
  it('monta "Retire até" com o dia da semana', () => {
    const loan = makeLoan({ pickupDeadline: '2026-10-19T21:55:00.000Z' })
    expect(pickupDeadlineText(loan)).toBe('Retire até seg, 19/10')
  })
})

describe('findPickupLoan (A25, QR de retirada)', () => {
  const waiting = (id: string) =>
    makeLoan({ id, status: 'awaiting_pickup', qrToken: `token-${id}` })

  it('acha o pedido pelo id', () => {
    expect(findPickupLoan([waiting('a'), waiting('b')], 'b')?.id).toBe('b')
  })

  it('sem id, usa o pedido mais novo (o primeiro da lista)', () => {
    expect(findPickupLoan([waiting('a'), waiting('b')])?.id).toBe('a')
  })

  it('ignora empréstimo já retirado, que não tem QR', () => {
    const active = makeLoan({ id: 'ativo', status: 'active', qrToken: null })
    expect(findPickupLoan([active])).toBeUndefined()
    expect(findPickupLoan([active, waiting('a')], 'ativo')?.id).toBe('a')
  })
})

// Quinta-feira, 15/10/2026, 12h em Fortaleza.
const NOW = new Date('2026-10-15T15:00:00.000Z')

describe('daysLeftText (selo dos empréstimos ativos)', () => {
  it('conta os dias de calendário até o vencimento', () => {
    expect(daysLeftText('2026-10-20T21:55:00.000Z', NOW)).toBe(
      '5 dias restantes',
    )
  })

  it('escreve hoje e amanhã por extenso', () => {
    expect(daysLeftText('2026-10-15T21:55:00.000Z', NOW)).toBe('Vence hoje')
    expect(daysLeftText('2026-10-16T21:55:00.000Z', NOW)).toBe('Vence amanhã')
  })

  it('marca atrasado depois do vencimento e não inventa sem prazo', () => {
    expect(daysLeftText('2026-10-10T21:55:00.000Z', NOW)).toBe('Atrasado')
    expect(daysLeftText(null, NOW)).toBeUndefined()
  })
})

describe('loanBadge (palavra e tom do selo)', () => {
  it('troca o tom pelo state da API', () => {
    expect(loanBadge(makeLoan({ state: 'ready_for_pickup' }), NOW)).toEqual({
      status: 'retirar',
    })
    expect(loanBadge(makeLoan({ state: 'overdue' }), NOW).status).toBe(
      'atrasado',
    )
    expect(loanBadge(makeLoan({ state: 'returned' }), NOW).status).toBe(
      'devolvido',
    )
    expect(loanBadge(makeLoan({ state: 'expired' }), NOW).status).toBe(
      'expirado',
    )
    expect(loanBadge(makeLoan({ state: 'cancelled' }), NOW).status).toBe(
      'cancelado',
    )
  })

  it('mostra os dias restantes em andamento e perto de vencer', () => {
    const dueAt = '2026-10-16T21:55:00.000Z'
    expect(loanBadge(makeLoan({ state: 'due_soon', dueAt }), NOW)).toEqual({
      status: 'vence',
      label: 'Vence amanhã',
    })
    expect(loanBadge(makeLoan({ state: 'in_progress', dueAt }), NOW)).toEqual({
      status: 'ativo',
      label: 'Vence amanhã',
    })
  })
})

describe('loanStartText e loanDueText (prazos concretos)', () => {
  it('escreve a retirada e marca a renovação', () => {
    const loan = makeLoan({ pickedUpAt: '2026-10-06T15:00:00.000Z' })
    expect(loanStartText(loan)).toBe('Retirado 06/10')
    expect(loanStartText({ ...loan, renewalCount: 1 })).toBe(
      'Retirado 06/10 · renovado',
    )
    expect(loanStartText({ ...loan, pickedUpAt: null })).toBeUndefined()
  })

  it('escreve "Devolver até" e, em atraso, "Venceu"', () => {
    const dueAt = '2026-10-20T21:55:00.000Z'
    expect(loanDueText(makeLoan({ dueAt, state: 'in_progress' }))).toBe(
      'Devolver até 20/10',
    )
    expect(loanDueText(makeLoan({ dueAt, state: 'overdue' }))).toBe(
      'Venceu 20/10',
    )
  })
})

describe('renewedNotice (A41)', () => {
  it('mostra o novo vencimento com o dia da semana', () => {
    expect(renewedNotice({ dueAt: '2026-11-06T21:55:00.000Z' })).toBe(
      'Renovado até sex, 06/11.',
    )
    expect(renewedNotice({ dueAt: null })).toBe('Empréstimo renovado.')
  })
})

describe('historyDetailText (A42)', () => {
  it('conta o que aconteceu com cada item', () => {
    expect(
      historyDetailText(
        makeLoan({
          state: 'returned',
          pickedUpAt: '2026-09-08T15:00:00.000Z',
          returnedAt: '2026-09-20T15:00:00.000Z',
        }),
      ),
    ).toBe('Retirado 08/09 · devolvido 20/09')
    expect(
      historyDetailText(
        makeLoan({ state: 'expired', requestedAt: '2026-08-04T15:00:00.000Z' }),
      ),
    ).toBe('Pedido de 04/08 não retirado no prazo')
    expect(
      historyDetailText(
        makeLoan({
          state: 'cancelled',
          cancelledAt: '2026-08-12T15:00:00.000Z',
        }),
      ),
    ).toBe('Pedido cancelado em 12/08')
  })
})

describe('loansTabFromParam (Ver minhas filas abre a aba Na fila)', () => {
  it('abre a aba pedida pelo parâmetro da rota', () => {
    expect(loansTabFromParam('queue')).toBe('queue')
    expect(loansTabFromParam('history')).toBe('history')
  })

  it('cai nos Ativos sem parâmetro ou com um valor desconhecido', () => {
    expect(loansTabFromParam(undefined)).toBe('active')
    expect(loansTabFromParam('outra')).toBe('active')
  })
})
