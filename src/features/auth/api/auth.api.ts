import type {
  PasskeyCreateRequest,
  PasskeyGetRequest,
} from 'react-native-passkey'
import { apiRequest } from '@/shared/api/client'
import type { CustomTokenResponse, Me, PasskeySummary } from '../auth.types'

// Dados de quem está logado (GET /me).
export function getMe() {
  return apiRequest<Me>('/me')
}

// Encerra a sessão na API, que revoga os refresh tokens (POST /auth/logout).
export function postLogout() {
  return apiRequest<void>('/auth/logout', { method: 'POST' })
}

// Pede as opções para criar um passkey neste aparelho (POST /auth/passkeys).
export function postPasskeyCreationOptions() {
  return apiRequest<PasskeyCreateRequest>('/auth/passkeys', { method: 'POST' })
}

// Registra o passkey criado pelo celular (POST /auth/passkey/register).
export function postPasskeyRegister(body: unknown) {
  return apiRequest<PasskeySummary>('/auth/passkey/register', {
    method: 'POST',
    body,
    authenticated: false,
  })
}

// Pede o desafio do login com passkey (POST /auth/passkey/login/options).
export function postPasskeyLoginOptions(matricula: string) {
  return apiRequest<PasskeyGetRequest & { allowCredentials?: unknown[] }>(
    '/auth/passkey/login/options',
    { method: 'POST', body: { matricula }, authenticated: false },
  )
}

// Confere o passkey e recebe o custom token (POST /auth/passkey/login/verify).
export function postPasskeyLoginVerify(body: unknown) {
  return apiRequest<CustomTokenResponse>('/auth/passkey/login/verify', {
    method: 'POST',
    body,
    authenticated: false,
  })
}
