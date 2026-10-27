import type { NotificationPrefs } from '@/shared/types'
import {
  CHANNEL_PREFERENCES,
  NOTICE_PREFERENCES,
  isAlwaysOn,
  preferenceChange,
  withPreference,
} from '../notifications.prefs'

function makePrefs(
  overrides: Partial<NotificationPrefs> = {},
): NotificationPrefs {
  return {
    queueTurn: true,
    overdueAndFines: true,
    dueReminders: true,
    pickupReady: true,
    queueUpdates: true,
    returnConfirmed: true,
    channelPush: true,
    channelEmail: false,
    ...overrides,
  }
}

describe('isAlwaysOn (RF-AVI-03)', () => {
  it('"Sua vez na fila" e "Atraso e multa" ficam sempre ligados', () => {
    expect(isAlwaysOn('queueTurn')).toBe(true)
    expect(isAlwaysOn('overdueAndFines')).toBe(true)
  })

  it('os demais avisos e os canais o aluno liga e desliga', () => {
    expect(isAlwaysOn('dueReminders')).toBe(false)
    expect(isAlwaysOn('pickupReady')).toBe(false)
    expect(isAlwaysOn('channelPush')).toBe(false)
    expect(isAlwaysOn('channelEmail')).toBe(false)
  })
})

describe('preferenceChange (corpo do PATCH)', () => {
  it('manda só a preferência que mudou', () => {
    expect(preferenceChange('dueReminders', false)).toEqual({
      dueReminders: false,
    })
    expect(preferenceChange('channelPush', true)).toEqual({ channelPush: true })
  })

  it('nunca manda uma preferência sempre ligada (a API só aceita true)', () => {
    expect(preferenceChange('queueTurn', false)).toEqual({})
    expect(preferenceChange('overdueAndFines', false)).toEqual({})
  })
})

describe('withPreference', () => {
  it('troca só a preferência pedida', () => {
    const next = withPreference(makePrefs(), 'queueUpdates', false)
    expect(next.queueUpdates).toBe(false)
    expect(next.pickupReady).toBe(true)
  })

  it('ignora a tentativa de desligar um aviso sempre ligado', () => {
    const prefs = makePrefs()
    expect(withPreference(prefs, 'queueTurn', false)).toBe(prefs)
  })
})

describe('linhas da tela', () => {
  it('as duas primeiras são as sempre ligadas, na ordem do design (A51)', () => {
    expect(NOTICE_PREFERENCES.slice(0, 2).map((item) => item.key)).toEqual([
      'queueTurn',
      'overdueAndFines',
    ])
  })

  it('cada preferência da API aparece uma vez só', () => {
    const keys = [...NOTICE_PREFERENCES, ...CHANNEL_PREFERENCES].map(
      (item) => item.key,
    )
    expect(new Set(keys).size).toBe(keys.length)
    expect(keys).toHaveLength(8)
  })
})
