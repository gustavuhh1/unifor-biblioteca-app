import { constantsOf } from '../utils/constants-of'

// Escolha da tela Aparência: Claro, Escuro ou Igual ao celular.
export const THEME_PREFERENCES = ['light', 'dark', 'system'] as const
export type ThemePreference = (typeof THEME_PREFERENCES)[number]
export const THEME_PREFERENCE = constantsOf(THEME_PREFERENCES)

// Onde a escolha fica guardada no aparelho (AsyncStorage).
export const THEME_PREFERENCE_STORAGE_KEY = 'unibooks.theme-preference'

// Lê a escolha guardada. Valor ausente ou desconhecido vira "Igual ao celular".
export function parseThemePreference(raw: string | null): ThemePreference {
  return THEME_PREFERENCES.find((preference) => preference === raw) ?? 'system'
}
