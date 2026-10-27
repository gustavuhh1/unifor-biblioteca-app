import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query'
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value'
import { listLibrarianBooks } from '../api/librarian-catalog.api'
import {
  LIBRARIAN_BOOKS_DEBOUNCE_MS,
  LIBRARIAN_BOOKS_QUERY_KEY,
} from '../librarian-catalog.constants'
import type {
  BookListFilter,
  LibrarianBook,
  LibrarianBookPage,
} from '../librarian-catalog.types'

// Lista do acervo do bibliotecário (RF-GAC-01): espera parar de digitar, consulta
// GET /librarian/books com o filtro escolhido e carrega as páginas seguintes sob
// demanda. Com a busca vazia lista o acervo inteiro.
export function useLibrarianBooks(text: string, filter: BookListFilter) {
  const q = useDebouncedValue(text.trim(), LIBRARIAN_BOOKS_DEBOUNCE_MS)

  const query = useInfiniteQuery({
    queryKey: [LIBRARIAN_BOOKS_QUERY_KEY, q, filter],
    queryFn: ({ pageParam }) => listLibrarianBooks(q, filter, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.page < last.totalPages ? last.page + 1 : undefined,
  })

  const books = query.data?.pages.flatMap((page) => page.items) ?? []
  const total = query.data?.pages[0]?.total ?? 0

  return {
    ...query,
    books,
    total,
    // Texto que a API de fato buscou (depois da espera).
    searchedText: q,
  }
}

// Acha um livro já carregado em qualquer lista do cache: o formulário de edição
// abre pela lista, e a API não tem uma rota que devolva um livro só ao bibliotecário.
export function useCachedLibrarianBook(id: string | undefined) {
  const queryClient = useQueryClient()
  if (!id) return undefined
  const lists = queryClient.getQueriesData<InfiniteData<LibrarianBookPage>>({
    queryKey: [LIBRARIAN_BOOKS_QUERY_KEY],
  })
  for (const [, data] of lists) {
    for (const page of data?.pages ?? []) {
      const found = page.items.find((book: LibrarianBook) => book.id === id)
      if (found) return found
    }
  }
  return undefined
}
