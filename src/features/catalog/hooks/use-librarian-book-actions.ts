import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'
import {
  createBook,
  deleteBook,
  lookupIsbn,
  syncBook,
  updateBook,
} from '../api/librarian-catalog.api'
import { BOOK_QUERY_KEY, BOOK_SEARCH_QUERY_KEY } from '../catalog.constants'
import { LIBRARIAN_BOOKS_QUERY_KEY } from '../librarian-catalog.constants'
import type { CreateBookBody, UpdateBookBody } from '../librarian-catalog.types'

// Depois de mexer no acervo, a lista do bibliotecário e a busca e a página do
// livro dos alunos precisam ler de novo.
function refreshBooks(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: [LIBRARIAN_BOOKS_QUERY_KEY] }),
    queryClient.invalidateQueries({ queryKey: [BOOK_SEARCH_QUERY_KEY] }),
    queryClient.invalidateQueries({ queryKey: [BOOK_QUERY_KEY] }),
  ])
}

// Consulta um ISBN na Open Library e na BrasilAPI (RF-GAC-02). Só o bibliotecário
// chama as fontes, e só aqui: a busca e a página do livro nunca (RNF-CON-03).
export function useIsbnLookup() {
  return useMutation({ mutationFn: (isbn: string) => lookupIsbn(isbn) })
}

// Cadastra um livro e os exemplares (RF-GAC-02).
export function useCreateBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateBookBody) => createBook(body),
    onSuccess: () => refreshBooks(queryClient),
  })
}

// Edita um livro, inclusive a marca "Indisponível para novos pedidos" (RF-GAC-03
// e RF-GAC-06).
export function useUpdateBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateBookBody }) =>
      updateBook(id, body),
    onSuccess: () => refreshBooks(queryClient),
  })
}

// Atualiza um livro pelas fontes externas: só preenche campo vazio (RF-GAC-04).
export function useSyncBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => syncBook(id),
    onSuccess: () => refreshBooks(queryClient),
  })
}

// Remove um livro do acervo; a API recusa se há exemplar emprestado ou fila
// (RF-GAC-05).
export function useRemoveBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBook(id),
    onSuccess: () => refreshBooks(queryClient),
  })
}
