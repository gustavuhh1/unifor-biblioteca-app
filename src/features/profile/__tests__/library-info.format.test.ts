import type { OpeningHours } from '@/shared/types'
import {
  buildRulesSections,
  contactLines,
  hourText,
  openingHoursLines,
} from '../library-info.format'
import type { LibraryInfo } from '../library-info.types'

const WEEK = { open: '07:00', close: '21:55' }
const SATURDAY = { open: '08:00', close: '14:10' }

const HOURS: OpeningHours = {
  mon: WEEK,
  tue: WEEK,
  wed: WEEK,
  thu: WEEK,
  fri: WEEK,
  sat: SATURDAY,
  sun: null,
}

function makeInfo(overrides: Partial<LibraryInfo> = {}): LibraryInfo {
  return {
    openingHours: HOURS,
    contact: {
      place: 'Biblioteca (Praça Central)',
      biblioZap: '(85) 0000-0000',
      loanPhone: '(85) 1111-1111',
      loanEmail: 'biblioteca@exemplo.test',
    },
    officialRulesUrl: 'https://exemplo.test/regras',
    maxActiveLoans: 10,
    loanDays: 14,
    renewalDays: 14,
    maxRenewals: 1,
    fineCentsPerBusinessDay: 200,
    maxActiveQueues: 7,
    queueConfirmHours: 24,
    pickupBusinessDays: 2,
    ...overrides,
  }
}

describe('hourText (hora curta)', () => {
  it('tira o zero à esquerda e some com os minutos zerados', () => {
    expect(hourText('07:00')).toBe('7h')
    expect(hourText('21:55')).toBe('21h55')
    expect(hourText('14:10')).toBe('14h10')
  })
})

describe('openingHoursLines (horário por extenso)', () => {
  it('junta os dias seguidos com o mesmo horário e deixa o fechado de fora', () => {
    expect(openingHoursLines(HOURS)).toEqual([
      'Seg a sex, 7h às 21h55',
      'Sáb, 8h às 14h10',
    ])
  })

  it('escreve um dia só sem intervalo', () => {
    expect(
      openingHoursLines({
        ...HOURS,
        mon: null,
        tue: null,
        wed: null,
        thu: null,
      }),
    ).toEqual(['Sex, 7h às 21h55', 'Sáb, 8h às 14h10'])
  })
})

describe('buildRulesSections (RF-PER-02)', () => {
  it('usa os números que a API manda', () => {
    const sections = buildRulesSections(
      makeInfo({
        maxActiveLoans: 12,
        loanDays: 21,
        fineCentsPerBusinessDay: 350,
      }),
    )
    const text = JSON.stringify(sections)
    expect(text).toContain('Até 12 livros')
    expect(text).toContain('21 dias para devolver')
    expect(text).toContain('R$ 3,50 por dia útil')
  })

  it('escreve a renovação única e o dia útil no singular', () => {
    const renewal = buildRulesSections(
      makeInfo({ pickupBusinessDays: 1 }),
    ).find((section) => section.title === 'Renovação')
    expect(renewal?.lines[0]).toContain('Uma única vez')
    const pickup = buildRulesSections(makeInfo({ pickupBusinessDays: 1 })).find(
      (section) => section.title === 'Retirada',
    )
    expect(pickup?.lines[0]).toContain('1 dia útil')
  })

  it('mantém o aviso de perda ou dano só como informação', () => {
    const loss = buildRulesSections(makeInfo()).find(
      (section) => section.title === 'Perda ou dano',
    )
    expect(loss?.lines[0]).toContain('O app só informa esta regra')
  })
})

describe('contactLines (Atendimento)', () => {
  it('traz o lugar, os horários e os contatos da API', () => {
    expect(contactLines(makeInfo())).toEqual([
      'Biblioteca (Praça Central)',
      'Seg a sex, 7h às 21h55',
      'Sáb, 8h às 14h10',
      'BiblioZap (85) 0000-0000 · Empréstimo (85) 1111-1111',
      'biblioteca@exemplo.test',
    ])
  })
})
