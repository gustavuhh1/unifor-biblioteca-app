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
