import AsyncStorage from '@react-native-async-storage/async-storage'
import { getApp, getApps, initializeApp } from 'firebase/app'
import {
  connectAuthEmulator,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from 'firebase/auth'
import { AUTH_EMULATOR_URL, firebaseConfig } from './config'

// Creates the Firebase app and the Auth instance once. A second call (e.g. after
// a fast refresh) reuses them, because initializeAuth can only run once.
function createAuth(): Auth {
  if (getApps().length > 0) return getAuth(getApp())

  const app = initializeApp(firebaseConfig)
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  })
  connectAuthEmulator(auth, AUTH_EMULATOR_URL, { disableWarnings: true })
  return auth
}

export const auth = createAuth()
