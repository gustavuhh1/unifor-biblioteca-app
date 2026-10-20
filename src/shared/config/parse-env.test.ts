import { DEFAULT_AUTH_EMULATOR_URL, parseEnv } from './parse-env'

const firebase = {
  EXPO_PUBLIC_FIREBASE_API_KEY: 'chave-web',
  EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: 'estoque-pay.firebaseapp.com',
  EXPO_PUBLIC_FIREBASE_PROJECT_ID: 'estoque-pay',
  EXPO_PUBLIC_FIREBASE_APP_ID: '1:123:web:abc',
}

describe('parseEnv', () => {
  it('lê a configuração completa de produção', () => {
    const env = parseEnv({
      EXPO_PUBLIC_API_URL: 'https://api.uni-books.app/',
      ...firebase,
    })

    expect(env.apiUrl).toBe('https://api.uni-books.app')
    expect(env.useEmulators).toBe(false)
    expect(env.firebase).toEqual({
      apiKey: 'chave-web',
      authDomain: 'estoque-pay.firebaseapp.com',
      projectId: 'estoque-pay',
      appId: '1:123:web:abc',
    })
  })

  it('no emulador dispensa o Firebase e usa o Auth emulator padrão', () => {
    const env = parseEnv({
      EXPO_PUBLIC_API_URL: 'http://10.0.2.2:8080',
      EXPO_PUBLIC_USE_EMULATORS: 'true',
    })

    expect(env.useEmulators).toBe(true)
    expect(env.authEmulatorUrl).toBe(DEFAULT_AUTH_EMULATOR_URL)
    expect(env.firebase.projectId).toBe('estoque-pay')
  })

  it('trata variável vazia como ausente (usa os padrões do emulador)', () => {
    const env = parseEnv({
      EXPO_PUBLIC_API_URL: 'http://10.0.2.2:8080',
      EXPO_PUBLIC_USE_EMULATORS: 'true',
      EXPO_PUBLIC_AUTH_EMULATOR_URL: '',
      EXPO_PUBLIC_FIREBASE_APP_ID: '',
    })
    expect(env.authEmulatorUrl).toBe(DEFAULT_AUTH_EMULATOR_URL)
    expect(env.firebase.appId).toBe('emulator-app-id')
  })

  it('fora do emulador, variável vazia do Firebase conta como ausente', () => {
    expect(() =>
      parseEnv({
        EXPO_PUBLIC_API_URL: 'http://10.0.2.2:8080',
        ...firebase,
        EXPO_PUBLIC_FIREBASE_APP_ID: '',
      }),
    ).toThrow(/appId/)
  })

  it('recusa a API ausente ou inválida', () => {
    expect(() => parseEnv({})).toThrow(/EXPO_PUBLIC_API_URL/)
    expect(() => parseEnv({ EXPO_PUBLIC_API_URL: 'não é url' })).toThrow(
      /EXPO_PUBLIC_API_URL/,
    )
  })

  it('fora do emulador exige a configuração do Firebase', () => {
    expect(() =>
      parseEnv({
        EXPO_PUBLIC_API_URL: 'https://api.uni-books.app',
        EXPO_PUBLIC_FIREBASE_API_KEY: 'chave-web',
      }),
    ).toThrow(/EXPO_PUBLIC_FIREBASE|authDomain|projectId|appId/)
  })

  it('recusa valor inválido em EXPO_PUBLIC_USE_EMULATORS', () => {
    expect(() =>
      parseEnv({
        EXPO_PUBLIC_API_URL: 'http://10.0.2.2:8080',
        EXPO_PUBLIC_USE_EMULATORS: 'sim',
      }),
    ).toThrow()
  })
})
