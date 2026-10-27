import type {
  PasskeyCreateRequest,
  PasskeyGetRequest,
} from 'react-native-passkey'
import { apiRequest } from '@/shared/api/client'
import type {
  CustomTokenResponse,
  Me,
  MessageResponse,
  PasskeyListResponse,
  PasskeySummary,
  PasswordResetBody,
  SignupConfirmResponse,
  SignupPendingResponse,
  SignupStartBody,
} from '../auth.types'

// Dados de quem está logado (GET /me).
export function getMe() {
  return apiRequest<Me>('/me')
}

// Encerra a sessão na API, que revoga os refresh tokens (POST /auth/logout).
export function postLogout() {
  return apiRequest<void>('/auth/logout', { method: 'POST' })
}

// Lista os passkeys da conta, um por aparelho (GET /auth/passkeys).
export function getPasskeys() {
  return apiRequest<PasskeyListResponse>('/auth/passkeys')
}

// Remove o passkey de um aparelho (DELETE /auth/passkeys/{id}).
export function deletePasskey(id: string) {
  return apiRequest<void>(`/auth/passkeys/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
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

// Começa o cadastro e envia o token ao e-mail (POST /auth/signup/start).
export function postSignupStart(body: SignupStartBody) {
  return apiRequest<SignupPendingResponse>('/auth/signup/start', {
    method: 'POST',
    body,
    authenticated: false,
  })
}

// Confirma o e-mail com o token e recebe as opções do passkey
// (POST /auth/signup/confirm).
export function postSignupConfirm(body: { matricula: string; token: string }) {
  return apiRequest<SignupConfirmResponse>('/auth/signup/confirm', {
    method: 'POST',
    body,
    authenticated: false,
  })
}

// Reenvia o token de confirmação (POST /auth/signup/resend).
export function postSignupResend(matricula: string) {
  return apiRequest<SignupPendingResponse>('/auth/signup/resend', {
    method: 'POST',
    body: { matricula },
    authenticated: false,
  })
}

// Pede o token de recuperação de senha (POST /auth/password/recover).
export function postPasswordRecover(matricula: string) {
  return apiRequest<MessageResponse>('/auth/password/recover', {
    method: 'POST',
    body: { matricula },
    authenticated: false,
  })
}

// Grava a nova senha com o token do e-mail (POST /auth/password/reset).
export function postPasswordReset(body: PasswordResetBody) {
  return apiRequest<void>('/auth/password/reset', {
    method: 'POST',
    body,
    authenticated: false,
  })
}
