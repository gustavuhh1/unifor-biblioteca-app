import { buildHeaders, createApiClient } from './create-api-client'
import { ApiError } from './errors'

function jsonResponse(status: number, body?: unknown): Response {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
  })
}

function makeClient(fetchImpl: typeof fetch, token: string | null = 'token-1') {
  return createApiClient({
    baseUrl: 'https://api.exemplo.test',
    getIdToken: async () => token,
    fetchImpl,
    timeoutMs: 50,
  })
}

describe('buildHeaders', () => {
  it('manda o ID token do Firebase no Authorization como Bearer', () => {
    expect(buildHeaders({ token: 'abc', hasBody: false })).toEqual({
      Accept: 'application/json',
      Authorization: 'Bearer abc',
    })
  })

  it('não manda Authorization quando não há token', () => {
    expect(buildHeaders({ token: null, hasBody: false })).not.toHaveProperty(
      'Authorization',
    )
  })

  it('só declara JSON quando há corpo', () => {
    expect(buildHeaders({ token: null, hasBody: true })).toHaveProperty(
      'Content-Type',
      'application/json',
    )
    expect(buildHeaders({ token: null, hasBody: false })).not.toHaveProperty(
      'Content-Type',
    )
  })
})

describe('createApiClient', () => {
  it('chama a base URL com o token e devolve o JSON da resposta', async () => {
    const fetchMock = jest.fn(async () => jsonResponse(200, { uid: 'u1' }))
    const client = makeClient(fetchMock as unknown as typeof fetch)

    const data = await client.request<{ uid: string }>('/me')

    expect(data).toEqual({ uid: 'u1' })
    const [url, init] = fetchMock.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ]
    expect(url).toBe('https://api.exemplo.test/me')
    expect(init.method).toBe('GET')
    expect((init.headers as Record<string, string>).Authorization).toBe(
      'Bearer token-1',
    )
  })

  it('serializa o corpo em JSON', async () => {
    const fetchMock = jest.fn(async () => jsonResponse(200, {}))
    const client = makeClient(fetchMock as unknown as typeof fetch)

    await client.request('/auth/passkey/login/options', {
      method: 'POST',
      body: { matricula: '2412858' },
      authenticated: false,
    })

    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(init.body).toBe('{"matricula":"2412858"}')
    expect(
      (init.headers as Record<string, string>).Authorization,
    ).toBeUndefined()
  })

  it('devolve undefined numa resposta 204 sem corpo', async () => {
    const client = makeClient((async () =>
      jsonResponse(204)) as unknown as typeof fetch)
    await expect(
      client.request('/auth/logout', { method: 'POST' }),
    ).resolves.toBeUndefined()
  })

  it('lê code, message, fields e retryAfterSeconds do erro da API', async () => {
    const body = {
      code: 'validation_error',
      message: 'Dados inválidos.',
      fields: [{ field: 'matricula', message: 'Matrícula inválida.' }],
      retryAfterSeconds: 42,
    }
    const client = makeClient((async () =>
      jsonResponse(400, body)) as unknown as typeof fetch)

    const error = await client.request('/x').catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 400, ...body })
  })

  it('chama o handler de sessão expirada no 401 de rota autenticada', async () => {
    const client = makeClient((async () =>
      jsonResponse(401, {
        code: 'unauthorized',
        message: 'Sua sessão expirou.',
      })) as unknown as typeof fetch)
    const handler = jest.fn()
    client.setUnauthorizedHandler(handler)

    await expect(client.request('/me')).rejects.toMatchObject({ status: 401 })
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('não chama o handler no 401 de rota pública (ex.: passkey recusado)', async () => {
    const client = makeClient((async () =>
      jsonResponse(401, {
        code: 'passkey_invalid',
        message: 'Passkey inválido.',
      })) as unknown as typeof fetch)
    const handler = jest.fn()
    client.setUnauthorizedHandler(handler)

    await expect(
      client.request('/auth/passkey/login/verify', {
        method: 'POST',
        body: {},
        authenticated: false,
      }),
    ).rejects.toMatchObject({ code: 'passkey_invalid' })
    expect(handler).not.toHaveBeenCalled()
  })

  it('transforma falha de rede em erro com mensagem em português', async () => {
    const client = makeClient((async () => {
      throw new TypeError('Network request failed')
    }) as unknown as typeof fetch)

    await expect(client.request('/me')).rejects.toMatchObject({
      status: 0,
      code: 'network_error',
    })
  })

  it('transforma tempo esgotado em erro timeout', async () => {
    const client = makeClient(
      ((_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => {
            const abort = new Error('aborted')
            abort.name = 'AbortError'
            reject(abort)
          })
        })) as unknown as typeof fetch,
    )

    await expect(client.request('/me')).rejects.toMatchObject({
      status: 0,
      code: 'timeout',
    })
  })

  it('usa o prazo da chamada no lugar do padrão do cliente', async () => {
    // O padrão do cliente é 50 ms; a chamada pede 300 ms e a resposta leva 120 ms.
    const client = makeClient((async () => {
      await new Promise((resolve) => setTimeout(resolve, 120))
      return jsonResponse(200, { ok: true })
    }) as unknown as typeof fetch)

    await expect(client.request('/lento', { timeoutMs: 300 })).resolves.toEqual(
      { ok: true },
    )
  })
})
