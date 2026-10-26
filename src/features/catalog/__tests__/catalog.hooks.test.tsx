import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import { useBook } from '../hooks/use-book'
import { useBookSearch } from '../hooks/use-book-search'

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

const book = {
  id: 'b1',
  title: 'Código Limpo',
  authors: ['Martin, Robert C.'],
  coverUrl: null,
  coverTone: 1,
  copiesTotal: 3,
  copiesAvailable: 0,
  queueLength: 1,
  nextReturnAt: null,
  unavailableForNewRequests: false,
}

beforeEach(() => mockFetch.mockReset())

describe('useBookSearch (RF-ACE-01)', () => {
  it('lista o acervo com a busca vazia e junta as páginas', async () => {
    respond(200, {
      items: [book],
      page: 1,
      pageSize: 20,
      total: 2,
      totalPages: 2,
    })
    const { result } = await renderHook(() => useBookSearch(''), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.books).toEqual([book])
    expect(result.current.total).toBe(2)
    expect(result.current.hasNextPage).toBe(true)
    const [url, init] = mockFetch.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://api.exemplo.test/books?page=1&pageSize=20')
    expect((init.headers as Record<string, string>).Authorization).toBe(
      'Bearer token-1',
    )
  })
})

describe('useBook (RF-ACE-02)', () => {
  it('busca a página do livro pelo id', async () => {
    respond(200, {
      ...book,
      action: { suggestedAction: 'join_queue', allowed: true },
    })
    const { result } = await renderHook(() => useBook('b1'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.action?.suggestedAction).toBe('join_queue')
    expect(mockFetch.mock.calls[0][0]).toBe('https://api.exemplo.test/books/b1')
  })

  it('não chama a API sem id na rota', async () => {
    const { result } = await renderHook(() => useBook(undefined), { wrapper })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockFetch).not.toHaveBeenCalled()
  })
})
