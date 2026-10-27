import { nextDueLoan } from '../loans.format'
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
