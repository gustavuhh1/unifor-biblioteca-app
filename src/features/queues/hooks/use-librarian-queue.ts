import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  addToQueue,
  getBookQueue,
  listBooksWithQueue,
  moveInQueue,
  removeFromQueue,
  resendQueueNotice,
} from '../api/librarian-queues.api'
import { LIBRARIAN_QUEUES_QUERY_KEY } from '../librarian-queues.constants'
import type {
  AddToQueueBody,
  LibrarianQueue,
  MoveInQueueBody,
} from '../librarian-queues.types'

const BOOKS_KEY = [...LIBRARIAN_QUEUES_QUERY_KEY, 'books'] as const

function bookKey(bookId: string) {
  return [...LIBRARIAN_QUEUES_QUERY_KEY, 'book', bookId] as const
}

// Livros que têm gente na fila: a lista da aba Filas (RF-BAL-06).
export function useQueueBooks() {
  return useQuery({ queryKey: BOOKS_KEY, queryFn: listBooksWithQueue })
}

// Fila de um livro, na ordem (RF-BAL-06, B08).
export function useBookQueue(bookId: string | undefined) {
  return useQuery({
    queryKey: bookKey(bookId ?? ''),
    queryFn: () => getBookQueue(bookId as string),
    enabled: Boolean(bookId),
  })
}

// Ações do bibliotecário sobre a fila de um livro: adicionar, mover, remover e
// reenviar o aviso. Cada resposta traz a fila já atualizada, que entra no cache;
// a lista de livros com fila é relida porque o tamanho muda.
export function useQueueActions(bookId: string) {
  const queryClient = useQueryClient()

  // Guarda a fila devolvida pela API e relê a lista da aba Filas.
  function applyQueue(queue: LibrarianQueue | null) {
    if (queue) queryClient.setQueryData(bookKey(bookId), queue)
    void queryClient.invalidateQueries({ queryKey: BOOKS_KEY })
  }

  // Uma ação recusada (ex.: o aluno já saiu da fila) deixa a tela desatualizada:
  // relê a fila para mostrar o que existe de verdade.
  function refreshQueue() {
    void queryClient.invalidateQueries({ queryKey: bookKey(bookId) })
  }

  const add = useMutation({
    mutationFn: (body: AddToQueueBody) => addToQueue(bookId, body),
    onError: refreshQueue,
    onSuccess: (result) => {
      if (result.applied) applyQueue(result.queue)
    },
  })
  const move = useMutation({
    mutationFn: ({
      entryId,
      body,
    }: {
      entryId: string
      body: MoveInQueueBody
    }) => moveInQueue(entryId, body),
    onError: refreshQueue,
    onSuccess: (result) => {
      if (result.applied) applyQueue(result.queue)
    },
  })
  const remove = useMutation({
    mutationFn: ({ entryId, reason }: { entryId: string; reason: string }) =>
      removeFromQueue(entryId, reason),
    onError: refreshQueue,
    onSuccess: applyQueue,
  })
  const resend = useMutation({
    mutationFn: (entryId: string) => resendQueueNotice(entryId),
    onError: refreshQueue,
    onSuccess: applyQueue,
  })

  return { add, move, remove, resend }
}
