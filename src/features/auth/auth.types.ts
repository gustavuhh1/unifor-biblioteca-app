import type { PasskeyCreateRequest } from 'react-native-passkey'
import type { NotificationPrefs, UserRole, UserStatus } from '@/shared/types'

// Resposta de GET /me (schema `Me` do Swagger): o perfil de quem está logado.
// Campos ausentes vêm como null, e as datas como texto ISO 8601.
export interface Me {
  uid: string
  role: UserRole
  status: UserStatus
  matricula: string
  email: string
  fullName: string | null
  initials: string | null
  course: string | null
  entryYear: number | null
  deskLabel: string | null
  activeLoanCount: number
  activeQueueCount: number
  openFineTotalCents: number
  booksReadByYear: Record<string, number>
  notificationPrefs: NotificationPrefs
  onboardingSeenAt: string | null
}

// Passkey de um aparelho na lista de Meus passkeys.
export interface PasskeySummary {
  id: string
  deviceName: string
  createdAt: string
  lastUsedAt: string | null
}

// Resposta de POST /auth/passkey/login/verify.
export interface CustomTokenResponse {
  customToken: string
}

// Grupo de rotas que a pessoa pode ver: define para onde o app a leva.
export type AccessGroup = '(auth)' | '(student)' | '(librarian)'

// Situação da sessão no app.
export type SessionStatus = 'loading' | 'signedOut' | 'signedIn' | 'error'

// Corpo de POST /auth/signup/start (o formulário do cadastro, RF-AUT-01).
export interface SignupStartBody {
  email: string
  matricula: string
  password: string
  passwordConfirmation: string
}

// Resposta de POST /auth/signup/start e /auth/signup/resend: o token foi enviado.
export interface SignupPendingResponse {
  status: Extract<UserStatus, 'pending_email'>
  resendAvailableInSeconds: number
}

// Resposta de POST /auth/signup/confirm: opções para o celular criar o passkey.
export interface SignupConfirmResponse {
  passkeyOptions: PasskeyCreateRequest
}

// Corpo de POST /auth/password/reset (RF-AUT-08).
export interface PasswordResetBody {
  matricula: string
  token: string
  password: string
  passwordConfirmation: string
}

// Resposta de POST /auth/password/recover: mensagem igual exista a conta ou não.
export interface MessageResponse {
  message: string
}
