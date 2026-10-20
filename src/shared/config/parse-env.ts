import { z } from 'zod'

// Endereço padrão do Auth emulator visto de dentro do emulador Android.
export const DEFAULT_AUTH_EMULATOR_URL = 'http://10.0.2.2:9099'

// Valores falsos que só funcionam contra o Auth emulator (que não confere a chave).
const EMULATOR_FIREBASE_CONFIG = {
  apiKey: 'emulator-api-key',
  authDomain: 'estoque-pay.firebaseapp.com',
  projectId: 'estoque-pay',
  appId: 'emulator-app-id',
}

// Variável vazia no .env conta como ausente.
const optionalText = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().min(1).optional(),
)

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.url({
    error:
      'EXPO_PUBLIC_API_URL ausente ou inválida (ex.: http://10.0.2.2:8080).',
  }),
  EXPO_PUBLIC_USE_EMULATORS: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.enum(['true', 'false']).default('false'),
  ),
  EXPO_PUBLIC_AUTH_EMULATOR_URL: z.preprocess(
    (value) => (value === '' ? undefined : value),
    z.url().default(DEFAULT_AUTH_EMULATOR_URL),
  ),
  EXPO_PUBLIC_FIREBASE_API_KEY: optionalText,
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: optionalText,
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: optionalText,
  EXPO_PUBLIC_FIREBASE_APP_ID: optionalText,
})

export interface Env {
  // Base da API, sem barra no final.
  apiUrl: string
  useEmulators: boolean
  authEmulatorUrl: string
  firebase: {
    apiKey: string
    authDomain: string
    projectId: string
    appId: string
  }
}

// Valida as variáveis EXPO_PUBLIC_* e devolve a configuração do app.
// Fora do emulador, a configuração web do Firebase é obrigatória.
export function parseEnv(source: Record<string, string | undefined>): Env {
  const raw = envSchema.parse(source)
  const useEmulators = raw.EXPO_PUBLIC_USE_EMULATORS === 'true'

  const firebase = {
    apiKey: raw.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: raw.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: raw.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    appId: raw.EXPO_PUBLIC_FIREBASE_APP_ID,
  }
  const missing = Object.entries(firebase)
    .filter(([, value]) => value === undefined)
    .map(([key]) => key)
  if (!useEmulators && missing.length > 0) {
    throw new Error(
      `Configuração do Firebase incompleta (${missing.join(', ')}). Preencha EXPO_PUBLIC_FIREBASE_* ou ligue EXPO_PUBLIC_USE_EMULATORS.`,
    )
  }

  return {
    apiUrl: raw.EXPO_PUBLIC_API_URL.replace(/\/+$/, ''),
    useEmulators,
    authEmulatorUrl: raw.EXPO_PUBLIC_AUTH_EMULATOR_URL,
    firebase: {
      apiKey: firebase.apiKey ?? EMULATOR_FIREBASE_CONFIG.apiKey,
      authDomain: firebase.authDomain ?? EMULATOR_FIREBASE_CONFIG.authDomain,
      projectId: firebase.projectId ?? EMULATOR_FIREBASE_CONFIG.projectId,
      appId: firebase.appId ?? EMULATOR_FIREBASE_CONFIG.appId,
    },
  }
}
