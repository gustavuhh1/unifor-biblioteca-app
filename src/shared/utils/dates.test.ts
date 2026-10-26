import { formatDate, formatDayMonth, toAppDate } from './dates'

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
