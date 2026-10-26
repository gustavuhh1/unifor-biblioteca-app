import {
  calendarDaysFromNow,
  formatDate,
  formatDayMonth,
  formatRelativeDateTime,
  formatRelativeDay,
  toAppDate,
} from './dates'

describe('datas no fuso de Fortaleza', () => {
  it('mostra o dia do fuso do app, e não o de UTC', () => {
    // 02:30 UTC ainda é 23/10 em Fortaleza (UTC-3).
    expect(formatDayMonth('2026-10-24T02:30:00.000Z')).toBe('23/10')
  })

  it('mantém o mesmo dia quando UTC e Fortaleza concordam', () => {
    expect(formatDayMonth('2026-10-24T15:00:00.000Z')).toBe('24/10')
  })

  it('formata dia, mês e ano', () => {
    expect(formatDate('2026-01-05T12:00:00.000Z')).toBe('05/01/2026')
  })

  it('devolve uma data no fuso do app', () => {
    expect(toAppDate('2026-10-24T12:00:00.000Z').timeZone).toBe(
      'America/Fortaleza',
    )
  })
})

describe('prazos com o dia por extenso', () => {
  // 15/10/2026, 10:00 em Fortaleza.
  const now = new Date('2026-10-15T13:00:00.000Z')

  it('conta os dias de calendário no fuso do app', () => {
    expect(calendarDaysFromNow('2026-10-15T20:00:00.000Z', now)).toBe(0)
    expect(calendarDaysFromNow('2026-10-16T12:00:00.000Z', now)).toBe(1)
    expect(calendarDaysFromNow('2026-10-14T12:00:00.000Z', now)).toBe(-1)
    // 02:30 UTC do dia 16 ainda é dia 15 em Fortaleza.
    expect(calendarDaysFromNow('2026-10-16T02:30:00.000Z', now)).toBe(0)
  })

  it('escreve Hoje, Amanhã ou só a data', () => {
    expect(formatRelativeDay('2026-10-15T20:00:00.000Z', now)).toBe(
      'Hoje, 15/10',
    )
    expect(formatRelativeDay('2026-10-16T12:00:00.000Z', now)).toBe(
      'Amanhã, 16/10',
    )
    expect(formatRelativeDay('2026-10-20T12:00:00.000Z', now)).toBe('20/10')
  })

  it('escreve o prazo com a hora do fuso do app', () => {
    expect(formatRelativeDateTime('2026-10-16T12:12:00.000Z', now)).toBe(
      'amanhã, 09:12',
    )
    expect(formatRelativeDateTime('2026-10-15T20:30:00.000Z', now)).toBe(
      'hoje, 17:30',
    )
    expect(formatRelativeDateTime('2026-10-20T12:12:00.000Z', now)).toBe(
      '20/10, 09:12',
    )
  })
})
