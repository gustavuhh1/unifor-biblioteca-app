import { parseThemePreference } from './theme-preference'

describe('parseThemePreference', () => {
  it('lê as três escolhas da tela Aparência', () => {
    expect(parseThemePreference('light')).toBe('light')
    expect(parseThemePreference('dark')).toBe('dark')
    expect(parseThemePreference('system')).toBe('system')
  })

  it('volta para "Igual ao celular" quando não há valor guardado ou ele é inválido', () => {
    expect(parseThemePreference(null)).toBe('system')
    expect(parseThemePreference('roxo')).toBe('system')
  })
})
