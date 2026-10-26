import { act, renderHook } from '@testing-library/react-native'
import { formatCountdown, useResendCooldown } from './use-resend-cooldown'

describe('formatCountdown', () => {
  it('mostra minutos e segundos com dois dígitos, como "Reenviar em 00:42" (A58)', () => {
    expect(formatCountdown(42)).toBe('00:42')
    expect(formatCountdown(60)).toBe('01:00')
    expect(formatCountdown(0)).toBe('00:00')
    expect(formatCountdown(-3)).toBe('00:00')
    expect(formatCountdown(41.2)).toBe('00:42')
  })
})

describe('useResendCooldown (RF-AUT-03)', () => {
  beforeEach(() => jest.useFakeTimers())
  afterEach(() => jest.useRealTimers())

  it('começa com a espera que a API mandou e libera o reenvio no fim', async () => {
    const { result } = await renderHook(() => useResendCooldown(2))
    expect(result.current.waiting).toBe(true)
    expect(result.current.label).toBe('00:02')

    await act(async () => {
      jest.advanceTimersByTime(2_500)
    })

    expect(result.current.waiting).toBe(false)
    expect(result.current.label).toBe('00:00')
  })

  it('sem espera, o reenvio já começa liberado', async () => {
    const { result } = await renderHook(() => useResendCooldown(0))
    expect(result.current.waiting).toBe(false)
  })

  it('recomeça com a nova espera (ex.: retryAfterSeconds do 429)', async () => {
    const { result } = await renderHook(() => useResendCooldown(0))

    await act(async () => {
      result.current.restart(42)
    })

    expect(result.current.waiting).toBe(true)
    expect(result.current.label).toBe('00:42')
  })
})
