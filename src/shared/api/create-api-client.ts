import {
  API_ERROR_CODE,
  API_ERROR_MESSAGE,
  ApiError,
  parseApiError,
} from './errors'

export const REQUEST_TIMEOUT_MS = 15_000

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

export interface RequestOptions {
  method?: HttpMethod
  body?: unknown
  // false nas rotas públicas (login, cadastro): não manda o ID token.
  authenticated?: boolean
  // Prazo desta chamada, no lugar do padrão do cliente (ex.: o Assistente, que
  // leva mais de 15 s quando prepara uma ação).
  timeoutMs?: number
}

export interface ApiClientOptions {
  baseUrl: string
  // ID token do Firebase (o SDK renova sozinho); null sem sessão.
  getIdToken: () => Promise<string | null>
  fetchImpl?: typeof fetch
  timeoutMs?: number
}

// Monta os cabeçalhos: JSON só quando há corpo; Bearer só quando há token.
export function buildHeaders({
  token,
  hasBody,
}: {
  token: string | null
  hasBody: boolean
}): Record<string, string> {
  return {
    Accept: 'application/json',
    ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return undefined
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

// Cria o cliente HTTP da API. Erros saem como ApiError ({ code, message,
// fields?, retryAfterSeconds? }); um 401 de rota autenticada chama o handler
// de sessão expirada (RF-AUT, tela A79) antes de lançar o erro.
export function createApiClient({
  baseUrl,
  getIdToken,
  fetchImpl = fetch,
  timeoutMs = REQUEST_TIMEOUT_MS,
}: ApiClientOptions) {
  let unauthorizedHandler: (() => void) | undefined

  async function request<T>(
    path: string,
    {
      method = 'GET',
      body,
      authenticated = true,
      timeoutMs: callTimeoutMs = timeoutMs,
    }: RequestOptions = {},
  ): Promise<T> {
    const token = authenticated ? await getIdToken() : null
    const hasBody = body !== undefined

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), callTimeoutMs)

    let response: Response
    try {
      response = await fetchImpl(`${baseUrl}${path}`, {
        method,
        headers: buildHeaders({ token, hasBody }),
        ...(hasBody ? { body: JSON.stringify(body) } : {}),
        signal: controller.signal,
      })
    } catch (error) {
      const timedOut = error instanceof Error && error.name === 'AbortError'
      throw new ApiError(0, {
        code: timedOut ? API_ERROR_CODE.timeout : API_ERROR_CODE.networkError,
        message: timedOut
          ? API_ERROR_MESSAGE.timeout
          : API_ERROR_MESSAGE.networkError,
      })
    } finally {
      clearTimeout(timer)
    }

    const data = await readBody(response)
    if (!response.ok) {
      if (response.status === 401 && authenticated) unauthorizedHandler?.()
      throw parseApiError(response.status, data)
    }
    return data as T
  }

  return {
    request,
    // Quem cuida da sessão registra aqui o que fazer num 401.
    setUnauthorizedHandler(handler: (() => void) | undefined) {
      unauthorizedHandler = handler
    },
  }
}

export type ApiClient = ReturnType<typeof createApiClient>
