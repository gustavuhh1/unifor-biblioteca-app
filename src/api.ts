import { API_URL } from './config'

const REQUEST_TIMEOUT_MS = 15_000

// Error returned by the API: HTTP status plus the body (code and message).
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly body: unknown,
  ) {
    super(`HTTP ${status}`)
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST'
  body?: unknown
  // Firebase ID token, sent as "Authorization: Bearer".
  token?: string
}

// Calls the API and returns the parsed JSON (undefined for an empty body).
// Throws ApiError for non-2xx answers.
export async function apiRequest<T>(
  path: string,
  { method = 'GET', body, token }: RequestOptions = {},
): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: controller.signal,
    })

    const text = await response.text()
    const data: unknown = text ? JSON.parse(text) : undefined
    if (!response.ok) throw new ApiError(response.status, data)
    return data as T
  } finally {
    clearTimeout(timer)
  }
}
