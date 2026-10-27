import {
  finesNotice,
  fineBookLine,
  fineStateText,
  groupFines,
  paidFineLine,
} from '../my-fines.format'
import type { MyFine } from '../my-fines.types'

function makeFine(overrides: Partial<MyFine> = {}): MyFine {
  return {
    id: 'f1',
    loanId: 'l1',
    bookId: 'b1',
    bookTitle: 'Cálculo, Vol. 1',
    status: 'accruing',
    dueAt: '2026-10-10T20:55:00.000Z',
    businessDaysLate: 3,
    ratePerBusinessDayCents: 200,
    amountCents: 600,
    frozenAt: null,
    paidAt: null,
    receivedByName: null,
    ...overrides,
  }
}

describe('groupFines (contando, congelada e paga)', () => {
  it('separa por estado mantendo a ordem', () => {
    const grouped = groupFines([
      makeFine({ id: 'a', status: 'paid' }),
      makeFine({ id: 'b', status: 'accruing' }),
      makeFine({ id: 'c', status: 'open' }),
      makeFine({ id: 'd', status: 'paid' }),
    ])
    expect(grouped.accruing.map((fine) => fine.id)).toEqual(['b'])
    expect(grouped.open.map((fine) => fine.id)).toEqual(['c'])
    expect(grouped.paid.map((fine) => fine.id)).toEqual(['a', 'd'])
  })
})

describe('finesNotice (RF-MUL-04)', () => {
  it('bloqueia quando a API diz que há livro atrasado', () => {
    const notice = finesNotice({
      items: [makeFine()],
      blocksNewLoans: true,
    })
    expect(notice?.title).toBe('Empréstimos bloqueados')
  })

  it('só avisa quando a multa está em aberto e sem atraso', () => {
    const notice = finesNotice({
      items: [makeFine({ status: 'open' })],
      blocksNewLoans: false,
    })
    expect(notice?.title).toBe('Multa em aberto')
    expect(notice?.text).toContain('pode continuar pegando livros')
  })

  it('não mostra aviso sem multa a pagar', () => {
    expect(
      finesNotice({
        items: [makeFine({ status: 'paid' })],
        blocksNewLoans: false,
      }),
    ).toBeNull()
  })
})

describe('textos do cartão da multa', () => {
  it('conta o vencimento enquanto o livro está com o aluno', () => {
    expect(fineBookLine(makeFine())).toBe(
      'Cálculo, Vol. 1 · venceu em 10/10/2026',
    )
    expect(fineStateText(makeFine())).toContain('R$ 2,00 por dia útil')
  })

  it('conta a devolução quando a multa está congelada', () => {
    const fine = makeFine({
      status: 'open',
      frozenAt: '2026-10-15T15:00:00.000Z',
    })
    expect(fineBookLine(fine)).toBe('Cálculo, Vol. 1 · devolvido em 15/10/2026')
    expect(fineStateText(fine)).toContain('parou de contar')
  })

  it('escreve a multa paga com a data e quem recebeu', () => {
    const fine = makeFine({
      status: 'paid',
      paidAt: '2026-10-16T14:00:00.000Z',
      receivedByName: 'Ana Souza',
    })
    expect(paidFineLine(fine)).toBe(
      'Cálculo, Vol. 1 · paga em 16/10/2026 · recebida por Ana Souza',
    )
  })

  it('omite a data e o nome que a API não trouxe', () => {
    expect(paidFineLine(makeFine({ status: 'paid' }))).toBe('Cálculo, Vol. 1')
  })
})
