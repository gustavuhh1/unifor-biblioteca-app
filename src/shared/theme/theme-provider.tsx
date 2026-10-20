import AsyncStorage from '@react-native-async-storage/async-storage'
import { useColorScheme } from 'nativewind'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  THEME_PREFERENCE,
  THEME_PREFERENCE_STORAGE_KEY,
  parseThemePreference,
  type ThemePreference,
} from './theme-preference'
import { themeColors, themeShadows, type ThemeId } from './tokens.generated'

interface ThemeValue {
  // O que a pessoa escolheu na tela Aparência.
  preference: ThemePreference
  setPreference: (preference: ThemePreference) => void
  // O tema que está valendo agora (Igual ao celular já resolvido).
  scheme: ThemeId
  // Tokens para o que não é classe (cor de ícone, StatusBar, sombras).
  colors: (typeof themeColors)[ThemeId]
  shadows: (typeof themeShadows)[ThemeId]
  // false até a escolha guardada ser lida do aparelho.
  ready: boolean
}

const ThemeContext = createContext<ThemeValue | null>(null)

// Provedor do tema: segue o celular por padrão e guarda a escolha da tela
// Aparência no AsyncStorage. As classes do NativeWind trocam pelo
// colorScheme; este contexto serve ao que não é classe.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme()
  const [preference, setPreferenceState] = useState<ThemePreference>(
    THEME_PREFERENCE.system,
  )
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    AsyncStorage.getItem(THEME_PREFERENCE_STORAGE_KEY)
      .catch(() => null)
      .then((raw) => {
        if (!active) return
        const stored = parseThemePreference(raw)
        setPreferenceState(stored)
        setColorScheme(stored)
        setReady(true)
      })
    return () => {
      active = false
    }
  }, [setColorScheme])

  const setPreference = useCallback(
    (next: ThemePreference) => {
      setPreferenceState(next)
      setColorScheme(next)
      AsyncStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, next).catch(() => {})
    },
    [setColorScheme],
  )

  const scheme: ThemeId = colorScheme === 'dark' ? 'dark' : 'light'
  const value = useMemo<ThemeValue>(
    () => ({
      preference,
      setPreference,
      scheme,
      colors: themeColors[scheme],
      shadows: themeShadows[scheme],
      ready,
    }),
    [preference, setPreference, scheme, ready],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// Tema atual e tokens em TS. Só funciona dentro do ThemeProvider.
export function useTheme(): ThemeValue {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme precisa estar dentro do ThemeProvider.')
  return value
}
