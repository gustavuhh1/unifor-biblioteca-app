import type { LibrarianFine } from '../fines.types'
import {
  finesSubtitle,
  fineBookLine,
  fineRowDetail,
  firstName,
  paymentSuccessMessage,
  studentCount,
  tabLabel,
  totalCents,
} from '../fines.format'

function makeFine(overrides: Partial<LibrarianFine> = {}): LibrarianFine {
  return {
    id: 'f1',
    loanId: 'l1',
    bookId: 'b1',
    bookTitle: 'Cálculo, Vol. 1',
    status: 'open',
    dueAt: '2026-10-10T12:00:00.000Z',
    businessDaysLate: 3,
    ratePerBusinessDayCents: 200,
    amountCents: 600,
    frozenAt: '2026-10-15T13:42:00.000Z',
    paidAt: null,
    receivedByName: null,
    studentName: 'Marina Castro',
    matricula: '2513320',
    paidAtReturn: false,
    ...overrides,
  }
}

describe('totalCents e studentCount (B13)', () => {
  it('soma os centavos e conta os alunos sem repetir a matrícula', () => {
    const fines = [
      makeFine(),
      makeFine({ id: 'f2', amountCents: 1000 }),
      makeFine({ id: 'f3', matricula: '2410221', amountCents: 400 }),
    ]
    expect(totalCents(fines)).toBe(2000)
    expect(studentCount(fines)).toBe(2)
  })

  it('lista vazia soma zero e não tem alunos', () => {
    expect(totalCents([])).toBe(0)
    expect(studentCount([])).toBe(0)
  })
})

describe('finesSubtitle (subtítulo da tela Multas)', () => {
  it('escreve o total em aberto e o número de alunos no singular e no plural', () => {
    expect(finesSubtitle([makeFine()])).toBe('R$ 6,00 em aberto · 1 aluno')
    expect(
      finesSubtitle([makeFine(), makeFine({ id: 'f2', matricula: '2410221' })]),
    ).toBe('R$ 12,00 em aberto · 2 alunos')
  })
})

describe('fineRowDetail (frase de cada multa na lista)', () => {
  it('em aberto: quando o livro foi devolvido', () => {
    expect(fineRowDetail(makeFine())).toMatch(/^devolvido \d{2}\/\d{2}$/)
  })

  it('contando: dias úteis no singular e no plural, com "sobe"', () => {
    const accruing = makeFine({ status: 'accruing', frozenAt: null })
    expect(fineRowDetail({ ...accruing, businessDaysLate: 1 })).toBe(
      '1 dia útil · sobe',
    )
    expect(fineRowDetail({ ...accruing, businessDaysLate: 2 })).toBe(
      '2 dias úteis · sobe',
    )
  })

  it('paga: data e quem recebeu, ou "na devolução" quando foi paga ao devolver', () => {
    const paid = makeFine({
      status: 'paid',
      paidAt: '2026-10-14T15:00:00.000Z',
      receivedByName: 'Ana Souza',
    })
    expect(fineRowDetail(paid)).toBe('14/10 · Ana Souza')
    expect(fineRowDetail({ ...paid, paidAtReturn: true })).toBe(
      '14/10 · na devolução',
    )
  })
})

describe('fineBookLine e paymentSuccessMessage (B16 e B18)', () => {
  it('junta o livro e a data da devolução', () => {
    expect(fineBookLine(makeFine())).toBe(
      'Cálculo, Vol. 1 · devolvido em 15/10',
    )
    expect(fineBookLine(makeFine({ frozenAt: null }))).toBe('Cálculo, Vol. 1')
  })

  it('o aviso de pagamento usa o primeiro nome e o valor', () => {
    expect(paymentSuccessMessage(makeFine())).toBe(
      'Pagamento de Marina registrado: R$ 6,00.',
    )
    expect(firstName('  Ana   Beatriz Lima ')).toBe('Ana')
  })
})

describe('tabLabel', () => {
  it('mostra o contador só quando a lista já chegou', () => {
    expect(tabLabel('Em aberto', undefined)).toBe('Em aberto')
    expect(tabLabel('Em aberto', 4)).toBe('Em aberto (4)')
  })
})
