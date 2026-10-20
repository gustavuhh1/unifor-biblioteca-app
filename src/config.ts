// Prototype configuration. Everything here points at the local emulators.
// On the Android emulator, 10.0.2.2 is the host computer (its 127.0.0.1).

export const API_URL = 'http://10.0.2.2:8080'
export const AUTH_EMULATOR_URL = 'http://10.0.2.2:9099'

// Domain of the internal e-mail of each Firebase account (<matricula>@<domain>).
export const AUTH_EMAIL_DOMAIN = 'contas.uni-books.app'

// Public Firebase web config (names in docs/infra.md of the API repository).
// The fallbacks are placeholders that only work against the Auth emulator;
// the project id must match GOOGLE_CLOUD_PROJECT of the API.
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? 'emulator-api-key',
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'estoque-pay.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? 'estoque-pay',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? 'emulator-app-id',
}
