import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import { ApiError } from '@/shared/api/errors'
import { TOKEN_ERROR_CODES, hasApiErrorCode } from '../auth.errors'
import {
  usePasswordRecover,
  usePasswordReset,
} from '../hooks/use-password-recovery'
import {
  useSignupConfirm,
  useSignupResend,
  useSignupStart,
} from '../hooks/use-signup'

// O cliente HTTP de verdade do app, com um fetch falso no lugar da rede.
const mockFetch = jest.fn()
jest.mock('@/shared/api/client', () => {
  const { createApiClient } = jest.requireActual(
    '@/shared/api/create-api-client',
  )
  const client = createApiClient({
    baseUrl: 'https://api.exemplo.test',
    getIdToken: async () => null,
    fetchImpl: (...args: unknown[]) => mockFetch(...args),
  })
  return { apiClient: client, apiRequest: client.request }
})

function respond(status: number, body?: unknown) {
  mockFetch.mockResolvedValueOnce(
    new Response(body === undefined ? null : JSON.stringify(body), { status }),
  )
}

// Rota, método e corpo da última chamada ao fetch falso.
function lastCall() {
  const [url, init] = mockFetch.mock.calls.at(-1) as [string, RequestInit]
  return {
    url,
    method: init.method,
    body: init.body ? JSON.parse(String(init.body)) : undefined,
    headers: init.headers as Record<string, string>,
  }
}

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false, gcTime: Infinity },
    },
  })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

const signup = {
  email: 'aluno@edu.unifor.br',
  matricula: '2412858',
  password: '12345678',
  passwordConfirmation: '12345678',
}

beforeEach(() => mockFetch.mockReset())

describe('cadastro (RF-AUT-01 a RF-AUT-03)', () => {
  it('envia o formulário a POST /auth/signup/start sem sessão e devolve a espera do reenvio', async () => {
    respond(202, { status: 'pending_email', resendAvailableInSeconds: 60 })
    const { result } = await renderHook(() => useSignupStart(), { wrapper })

    let response: unknown
    await act(async () => {
      response = await result.current.mutateAsync(signup)
    })

    expect(response).toEqual({
      status: 'pending_email',
      resendAvailableInSeconds: 60,
    })
    const call = lastCall()
    expect(call.url).toBe('https://api.exemplo.test/auth/signup/start')
    expect(call.method).toBe('POST')
    expect(call.body).toEqual(signup)
    expect(call.headers.Authorization).toBeUndefined()
  })

  it('devolve o 409 signup_conflict com os campos repetidos', async () => {
    respond(409, {
      code: 'signup_conflict',
      message: 'Matrícula ou e-mail já cadastrados.',
      fields: [{ field: 'matricula', message: 'Esta matrícula já tem conta.' }],
    })
    const { result } = await renderHook(() => useSignupStart(), { wrapper })

    let error: unknown
    await act(async () => {
      error = await result.current.mutateAsync(signup).catch((e) => e)
    })

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({
      status: 409,
      code: 'signup_conflict',
      fields: [{ field: 'matricula', message: 'Esta matrícula já tem conta.' }],
    })
  })

  it('confirma o e-mail e recebe as opções do passkey', async () => {
    const passkeyOptions = {
      challenge: 'desafio',
      rp: { id: 'uni-books.app', name: 'Unifor Biblioteca' },
      user: { id: 'u1', name: '2412858', displayName: '2412858' },
      pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
    }
    respond(200, { passkeyOptions })
    const { result } = await renderHook(() => useSignupConfirm(), { wrapper })

    let response: unknown
    await act(async () => {
      response = await result.current.mutateAsync({
        matricula: '2412858',
        token: '482913',
      })
    })

    expect(response).toEqual({ passkeyOptions })
    expect(lastCall()).toMatchObject({
      url: 'https://api.exemplo.test/auth/signup/confirm',
      body: { matricula: '2412858', token: '482913' },
    })
  })

  it('no reenvio antes da hora devolve o 429 com retryAfterSeconds', async () => {
    respond(429, {
      code: 'token_resend_too_soon',
      message: 'Aguarde para pedir outro token.',
      retryAfterSeconds: 42,
    })
    const { result } = await renderHook(() => useSignupResend(), { wrapper })

    let error: unknown
    await act(async () => {
      error = await result.current.mutateAsync('2412858').catch((e) => e)
    })

    expect(error).toMatchObject({
      code: 'token_resend_too_soon',
      retryAfterSeconds: 42,
    })
    expect(lastCall()).toMatchObject({
      url: 'https://api.exemplo.test/auth/signup/resend',
      body: { matricula: '2412858' },
    })
  })
})

describe('recuperação de senha (RF-AUT-08)', () => {
  it('pede o token pela matrícula e devolve a mensagem da API', async () => {
    respond(200, { message: 'Se a matrícula tiver conta, enviamos um token.' })
    const { result } = await renderHook(() => usePasswordRecover(), {
      wrapper,
    })

    let response: unknown
    await act(async () => {
      response = await result.current.mutateAsync('2412858')
    })

    expect(response).toEqual({
      message: 'Se a matrícula tiver conta, enviamos um token.',
    })
    expect(lastCall()).toMatchObject({
      url: 'https://api.exemplo.test/auth/password/recover',
      method: 'POST',
      body: { matricula: '2412858' },
    })
  })

  it('grava a nova senha com o token (204 sem corpo)', async () => {
    respond(204)
    const { result } = await renderHook(() => usePasswordReset(), { wrapper })
    const body = {
      matricula: '2412858',
      token: '482913',
      password: '12345678',
      passwordConfirmation: '12345678',
    }

    await act(async () => {
      await expect(result.current.mutateAsync(body)).resolves.toBeUndefined()
    })

    expect(lastCall()).toMatchObject({
      url: 'https://api.exemplo.test/auth/password/reset',
      body,
    })
  })

  it('reconhece o token vencido como erro de token, para voltar ao passo do token', async () => {
    respond(400, {
      code: 'token_expired_or_used',
      message: 'Este token venceu ou já foi usado.',
    })
    const { result } = await renderHook(() => usePasswordReset(), { wrapper })

    let error: unknown
    await act(async () => {
      error = await result.current
        .mutateAsync({
          matricula: '2412858',
          token: '482913',
          password: '12345678',
          passwordConfirmation: '12345678',
        })
        .catch((e) => e)
    })

    expect(hasApiErrorCode(error, TOKEN_ERROR_CODES)).toBe(true)
  })
})
