import { constantsOf } from '../utils/constants-of'

// Códigos de erro que o próprio app cria (os da API chegam no corpo da resposta).
export const API_ERROR_CODES = [
  'unauthorized',
  'network_error',
  'timeout',
  'unknown_error',
] as const
export const API_ERROR_CODE = constantsOf(API_ERROR_CODES)

// Mensagens (em português) dos erros que o app cria.
export const API_ERROR_MESSAGE = {
  unauthorized: 'Sua sessão expirou. Entre novamente.',
  networkError:
    'Sem conexão com o servidor. Confira sua internet e tente de novo.',
  timeout: 'O servidor demorou para responder. Tente de novo.',
  unknownError: 'Algo deu errado. Tente de novo.',
} as const

// Campo errado de um formulário, como a API devolve em `fields`.
export interface ApiFieldError {
  field: string
  message: string
}

// Corpo de erro da API (ErrorResponse do Swagger).
export interface ApiErrorBody {
  code: string
  message: string
  fields?: ApiFieldError[]
  retryAfterSeconds?: number
}

// Erro de uma chamada à API: `message` já está em português e `code` é estável.
export class ApiError extends Error {
  readonly code: string
  readonly fields?: ApiFieldError[]
  readonly retryAfterSeconds?: number

  constructor(
    // Status HTTP; 0 quando a resposta nem chegou (sem rede, tempo esgotado).
    readonly status: number,
    body: ApiErrorBody,
  ) {
    super(body.message)
    this.name = 'ApiError'
    this.code = body.code
    this.fields = body.fields
    this.retryAfterSeconds = body.retryAfterSeconds
  }
}

function isErrorBody(body: unknown): body is ApiErrorBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as ApiErrorBody).code === 'string' &&
    typeof (body as ApiErrorBody).message === 'string'
  )
}

// Monta o ApiError de uma resposta não-2xx. Corpo fora do formato da API vira
// um erro genérico (ou o de sessão, no 401).
export function parseApiError(status: number, body: unknown): ApiError {
  if (isErrorBody(body)) {
    return new ApiError(status, {
      code: body.code,
      message: body.message,
      fields: Array.isArray(body.fields) ? body.fields : undefined,
      retryAfterSeconds:
        typeof body.retryAfterSeconds === 'number'
          ? body.retryAfterSeconds
          : undefined,
    })
  }
  if (status === 401) {
    return new ApiError(status, {
      code: API_ERROR_CODE.unauthorized,
      message: API_ERROR_MESSAGE.unauthorized,
    })
  }
  return new ApiError(status, {
    code: API_ERROR_CODE.unknownError,
    message: API_ERROR_MESSAGE.unknownError,
  })
}
