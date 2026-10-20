import AsyncStorage from '@react-native-async-storage/async-storage'
import { getApp, getApps, initializeApp } from 'firebase/app'
import {
  connectAuthEmulator,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from 'firebase/auth'
import { env } from './env'

// Cria o app do Firebase e o Auth uma vez só (initializeAuth não pode rodar
// duas vezes; um fast refresh reaproveita o que já existe). A sessão fica no
// AsyncStorage. Com EXPO_PUBLIC_USE_EMULATORS=true, usa o Auth emulator.
function createAuth(): Auth {
  if (getApps().length > 0) return getAuth(getApp())

  const app = initializeApp(env.firebase)
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  })
  if (env.useEmulators) {
    connectAuthEmulator(auth, env.authEmulatorUrl, { disableWarnings: true })
  }
  return auth
}

export const auth = createAuth()
