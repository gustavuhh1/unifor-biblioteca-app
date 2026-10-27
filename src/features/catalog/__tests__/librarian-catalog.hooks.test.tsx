import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import { useLibrarianBooks } from '../hooks/use-librarian-books'
import { BOOK_LIST_FILTER } from '../librarian-catalog.constants'

// O cliente HTTP de verdade do app, com um fetch falso no lugar da rede.
const mockFetch = jest.fn()
jest.mock('@/shared/api/client', () => {
  const { createApiClient } = jest.requireActual(
    '@/shared/api/create-api-client',
  )
  const client = createApiClient({
    baseUrl: 'https://api.exemplo.test',
    getIdToken: async () => 'token-1',
    fetchImpl: (...args: unknown[]) => mockFetch(...args),
  })
  return { apiClient: client, apiRequest: client.request }
})

function respond(status: number, body: unknown) {
  mockFetch.mockResolvedValueOnce(
    new Response(JSON.stringify(body), { status }),
  )
}

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  })
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

const book = { id: 'b1', title: 'Código Limpo', authors: ['Martin, Robert C.'] }

beforeEach(() => mockFetch.mockReset())

describe('useLibrarianBooks (RF-GAC-01)', () => {
  it('lista o acervo sem busca, com o filtro padrão do contrato', async () => {
    respond(200, {
      items: [book],
      page: 1,
      pageSize: 20,
      total: 25,
      totalPages: 2,
    })
    const { result } = await renderHook(
      () => useLibrarianBooks('', BOOK_LIST_FILTER.all),
      { wrapper },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.books).toEqual([book])
    expect(result.current.total).toBe(25)
    expect(result.current.hasNextPage).toBe(true)
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect(url).toBe(
      'https://api.exemplo.test/librarian/books?filter=all&page=1&pageSize=20',
    )
    expect((init.headers as Record<string, string>).Authorization).toBe(
      'Bearer token-1',
    )
  })

  it('manda o filtro escolhido na consulta', async () => {
    respond(200, { items: [], page: 1, pageSize: 20, total: 0, totalPages: 0 })
    const { result } = await renderHook(
      () => useLibrarianBooks('', BOOK_LIST_FILTER.noIsbn),
      { wrapper },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    const [url] = mockFetch.mock.calls[0] as [string]
    expect(url).toContain('filter=no_isbn')
    expect(result.current.hasNextPage).toBe(false)
  })

  it('devolve o erro da API para a tela mostrar a mensagem', async () => {
    respond(403, { code: 'forbidden', message: 'Só o bibliotecário acessa.' })
    const { result } = await renderHook(
      () => useLibrarianBooks('', BOOK_LIST_FILTER.all),
      { wrapper },
    )

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error?.message).toBe('Só o bibliotecário acessa.')
  })
})
