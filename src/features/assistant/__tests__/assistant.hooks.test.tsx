import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import type { ReactNode } from 'react'
import { ApiError } from '@/shared/api/errors'
import { ASSISTANT_QUERY_KEY } from '../assistant.constants'
import type { AssistantConversation } from '../assistant.types'
import {
  useCancelAssistantAction,
  useConfirmAssistantAction,
} from '../hooks/use-assistant-action'
import { useAssistantConversation } from '../hooks/use-assistant-conversation'
import { useSendAssistantMessage } from '../hooks/use-send-assistant-message'

// O cliente HTTP de verdade do app, com um fetch falso no lugar da rede.
const mockFetch = jest.fn()
jest.mock('@/shared/api/client', () => {
  const { createApiClient } = jest.requireActual(
    '@/shared/api/create-api-client',
  )
  const client = createApiClient({
    baseUrl: 'https://api.exemplo.test',
    getIdToken: async () => 'token-falso',
    fetchImpl: (...args: unknown[]) => mockFetch(...args),
  })
  return { apiClient: client, apiRequest: client.request }
})

function respond(status: number, body?: unknown) {
  mockFetch.mockResolvedValueOnce(
    new Response(body === undefined ? null : JSON.stringify(body), { status }),
  )
}

function lastCall() {
  const [url, init] = mockFetch.mock.calls.at(-1) as [string, RequestInit]
  return {
    url,
    method: init.method,
    body: init.body ? JSON.parse(String(init.body)) : undefined,
  }
}

const book = {
  id: 'b1',
  title: 'Refatoração',
  authors: ['Martin Fowler'],
  coverUrl: null,
  coverTone: 2,
  copiesTotal: 2,
  copiesAvailable: 1,
  queueLength: 0,
  nextReturnAt: null,
  unavailableForNewRequests: false,
}

const action = {
  id: 'a1',
  type: 'request_loan',
  status: 'proposed',
  books: [book],
  blockedReason: null,
  blockedMessage: null,
  preview: {
    pickupDeadline: '2026-10-20T00:55:00.000Z',
    activeLoansAfter: 5,
    queuePosition: null,
  },
  expiresAt: '2026-10-27T15:00:00.000Z',
  resultLoanId: null,
  resultQueueEntryIds: [],
}

function message(id: string, sender: 'student' | 'assistant', extra = {}) {
  return {
    id,
    sender,
    text: `texto ${id}`,
    suggestedBooks: [],
    action: null,
    blockedReason: null,
    error: false,
    createdAt: '2026-10-27T15:00:00.000Z',
    ...extra,
  }
}

function setup() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false, gcTime: Infinity },
    },
  })
  function wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
  return { client, wrapper }
}

beforeEach(() => mockFetch.mockReset())

describe('useAssistantConversation (GET /me/assistant/messages)', () => {
  it('abre a conversa e o aviso de que a IA pode errar', async () => {
    respond(200, {
      disclaimer: 'Pode errar',
      items: [message('m1', 'student')],
    })
    const { wrapper } = setup()
    const { result } = await renderHook(() => useAssistantConversation(), {
      wrapper,
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(lastCall().url).toBe(
      'https://api.exemplo.test/me/assistant/messages',
    )
    expect(lastCall().method).toBe('GET')
    expect(result.current.data?.disclaimer).toBe('Pode errar')
  })
})

describe('useSendAssistantMessage (POST /me/assistant/messages)', () => {
  it('manda o texto e põe pergunta e resposta no fim da conversa', async () => {
    const { client, wrapper } = setup()
    client.setQueryData<AssistantConversation>(ASSISTANT_QUERY_KEY, {
      disclaimer: 'Pode errar',
      items: [message('m0', 'assistant') as never],
    })
    respond(201, {
      disclaimer: 'Pode errar',
      question: message('q1', 'student'),
      reply: message('r1', 'assistant', { suggestedBooks: [book] }),
    })
    const { result } = await renderHook(() => useSendAssistantMessage(), {
      wrapper,
    })
    await act(async () => {
      await result.current.mutateAsync('Me indica um livro')
    })
    expect(lastCall().method).toBe('POST')
    expect(lastCall().body).toEqual({ text: 'Me indica um livro' })
    const cached =
      client.getQueryData<AssistantConversation>(ASSISTANT_QUERY_KEY)
    expect(cached?.items.map((item) => item.id)).toEqual(['m0', 'q1', 'r1'])
  })

  it('devolve o erro da API em português quando a pergunta falha', async () => {
    const { wrapper } = setup()
    respond(400, {
      code: 'validation_error',
      message: 'Escreva uma pergunta.',
    })
    const { result } = await renderHook(() => useSendAssistantMessage(), {
      wrapper,
    })
    await act(async () => {
      await result.current.mutateAsync('x').catch(() => {})
    })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toBeInstanceOf(ApiError)
    expect((result.current.error as ApiError).message).toBe(
      'Escreva uma pergunta.',
    )
  })
})

describe('useConfirmAssistantAction (POST .../confirm)', () => {
  it('confirma, guarda a ação feita e atualiza os dados do aluno', async () => {
    const { client, wrapper } = setup()
    client.setQueryData<AssistantConversation>(ASSISTANT_QUERY_KEY, {
      disclaimer: 'Pode errar',
      items: [message('m1', 'assistant', { action }) as never],
    })
    const invalidate = jest.spyOn(client, 'invalidateQueries')
    respond(200, {
      action: { ...action, status: 'confirmed', resultLoanId: 'l1' },
      loan: { id: 'l1' },
      queueEntries: [],
    })
    const { result } = await renderHook(() => useConfirmAssistantAction(), {
      wrapper,
    })
    await act(async () => {
      await result.current.mutateAsync('a1')
    })
    expect(lastCall().url).toBe(
      'https://api.exemplo.test/me/assistant/actions/a1/confirm',
    )
    expect(lastCall().method).toBe('POST')
    const cached =
      client.getQueryData<AssistantConversation>(ASSISTANT_QUERY_KEY)
    expect(cached?.items[0]?.action?.status).toBe('confirmed')
    const keys = invalidate.mock.calls.map(([filters]) => filters?.queryKey)
    expect(keys).toEqual(
      expect.arrayContaining([
        ['me'],
        ['my-loans'],
        ['my-queues'],
        ['book', 'b1'],
      ]),
    )
  })

  it('relê a conversa quando a API recusa (regra mudou ou venceu)', async () => {
    const { client, wrapper } = setup()
    const invalidate = jest.spyOn(client, 'invalidateQueries')
    respond(409, {
      code: 'overdue',
      message: 'Você tem um livro em atraso.',
    })
    const { result } = await renderHook(() => useConfirmAssistantAction(), {
      wrapper,
    })
    await act(async () => {
      await result.current.mutateAsync('a1').catch(() => {})
    })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect((result.current.error as ApiError).code).toBe('overdue')
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ASSISTANT_QUERY_KEY })
  })
})

describe('useCancelAssistantAction (POST .../cancel)', () => {
  it('cancela e guarda a ação cancelada na conversa', async () => {
    const { client, wrapper } = setup()
    client.setQueryData<AssistantConversation>(ASSISTANT_QUERY_KEY, {
      disclaimer: 'Pode errar',
      items: [message('m1', 'assistant', { action }) as never],
    })
    respond(200, { action: { ...action, status: 'cancelled' } })
    const { result } = await renderHook(() => useCancelAssistantAction(), {
      wrapper,
    })
    await act(async () => {
      await result.current.mutateAsync('a1')
    })
    expect(lastCall().url).toBe(
      'https://api.exemplo.test/me/assistant/actions/a1/cancel',
    )
    const cached =
      client.getQueryData<AssistantConversation>(ASSISTANT_QUERY_KEY)
    expect(cached?.items[0]?.action?.status).toBe('cancelled')
  })
})
