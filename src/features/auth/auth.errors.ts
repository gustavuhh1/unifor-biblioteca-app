import { API_ERROR_MESSAGE, ApiError } from '@/shared/api/errors'
import { constantsOf } from '@/shared/utils/constants-of'

// Códigos dos erros de login do Firebase Authentication usados pelo app.
export const FIREBASE_AUTH_ERROR = {
  invalidCredential: 'auth/invalid-credential',
  userNotFound: 'auth/user-not-found',
  wrongPassword: 'auth/wrong-password',
  invalidEmail: 'auth/invalid-email',
  tooManyRequests: 'auth/too-many-requests',
  userDisabled: 'auth/user-disabled',
  networkRequestFailed: 'auth/network-request-failed',
} as const

// Erros do passkey no celular (campo `error` do react-native-passkey).
export const PASSKEY_ERROR = {
  userCancelled: 'UserCancelled',
  notSupported: 'NotSupported',
  credentialAlreadyExists: 'CredentialAlreadyExists',
  noCredentials: 'NoCredentials',
  timedOut: 'TimedOut',
} as const

// Erros que os próprios fluxos de acesso criam.
export const AUTH_FLOW_ERROR_CODES = ['no_passkey', 'not_signed_in'] as const
export const AUTH_FLOW_ERROR_CODE = constantsOf(AUTH_FLOW_ERROR_CODES)

// Códigos de erro da API usados nos fluxos de cadastro e recuperação de senha
// (docs/api-openapi.json).
export const AUTH_API_ERROR_CODES = [
  'signup_conflict',
  'token_invalid',
  'token_expired_or_used',
  'token_attempts_exceeded',
  'token_resend_too_soon',
] as const
export const AUTH_API_ERROR_CODE = constantsOf(AUTH_API_ERROR_CODES)

// Diz se o erro da API é de um código desta lista.
export function hasApiErrorCode(
  error: unknown,
  codes: readonly string[],
): error is ApiError {
  return error instanceof ApiError && codes.includes(error.code)
}

// Token errado, vencido, já usado ou com tentativas demais: o aluno volta a
// digitar (ou pede outro).
export const TOKEN_ERROR_CODES = [
  AUTH_API_ERROR_CODE.tokenInvalid,
  AUTH_API_ERROR_CODE.tokenExpiredOrUsed,
  AUTH_API_ERROR_CODE.tokenAttemptsExceeded,
]

// Token que não vale mais: só um novo resolve (tela A77).
export const TOKEN_GONE_ERROR_CODES = [
  AUTH_API_ERROR_CODE.tokenExpiredOrUsed,
  AUTH_API_ERROR_CODE.tokenAttemptsExceeded,
]

// Mensagens de acesso mostradas ao usuário (pt-BR).
export const AUTH_MESSAGE = {
  wrongCredentials: 'Matrícula ou senha incorretos.',
  tooManyRequests: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.',
  accountDisabled: 'Esta conta está desativada. Procure a biblioteca.',
  passkeyCancelled: 'Você cancelou. Tente de novo quando quiser.',
  passkeyNotSupported:
    'Este aparelho não aceita passkey. Entre com matrícula e senha.',
  passkeyAlreadyExists: 'Este aparelho já tem um passkey da sua conta.',
  passkeyTimedOut: 'O tempo acabou. Tente de novo.',
  noPasskey:
    'Não encontramos um passkey para esta matrícula. Entre com matrícula e senha.',
  notSignedIn: 'Entre na sua conta para continuar.',
  sessionExpired: 'Sua sessão expirou. Entre novamente.',
  genericFailure: 'Algo deu errado. Tente de novo.',
} as const

// Erro dos fluxos de acesso (ex.: matrícula sem passkey), com mensagem em português.
export class AuthFlowError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'AuthFlowError'
  }
}

function readString(value: unknown, key: string): string | undefined {
  if (typeof value !== 'object' || value === null) return undefined
  const field = (value as Record<string, unknown>)[key]
  return typeof field === 'string' ? field : undefined
}

// Diz se a pessoa desistiu na folha do sistema (digital, PIN): não é uma falha.
export function isPasskeyCancelled(error: unknown): boolean {
  return readString(error, 'error') === PASSKEY_ERROR.userCancelled
}

// Traduz qualquer erro de acesso (API, Firebase, passkey) numa mensagem em
// português para o usuário (RF-AUT, erros de acesso).
export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiError || error instanceof AuthFlowError) {
    return error.message
  }

  const firebaseCode = readString(error, 'code')
  if (firebaseCode?.startsWith('auth/')) {
    switch (firebaseCode) {
      case FIREBASE_AUTH_ERROR.invalidCredential:
      case FIREBASE_AUTH_ERROR.userNotFound:
      case FIREBASE_AUTH_ERROR.wrongPassword:
      case FIREBASE_AUTH_ERROR.invalidEmail:
        return AUTH_MESSAGE.wrongCredentials
      case FIREBASE_AUTH_ERROR.tooManyRequests:
        return AUTH_MESSAGE.tooManyRequests
      case FIREBASE_AUTH_ERROR.userDisabled:
        return AUTH_MESSAGE.accountDisabled
      case FIREBASE_AUTH_ERROR.networkRequestFailed:
        return API_ERROR_MESSAGE.networkError
      default:
        return AUTH_MESSAGE.genericFailure
    }
  }

  switch (readString(error, 'error')) {
    case PASSKEY_ERROR.userCancelled:
      return AUTH_MESSAGE.passkeyCancelled
    case PASSKEY_ERROR.notSupported:
      return AUTH_MESSAGE.passkeyNotSupported
    case PASSKEY_ERROR.credentialAlreadyExists:
      return AUTH_MESSAGE.passkeyAlreadyExists
    case PASSKEY_ERROR.noCredentials:
      return AUTH_MESSAGE.noPasskey
    case PASSKEY_ERROR.timedOut:
      return AUTH_MESSAGE.passkeyTimedOut
    default:
      return AUTH_MESSAGE.genericFailure
  }
}
