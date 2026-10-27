import { useInfiniteQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value'
import { searchBooks } from '../api/catalog.api'
import {
  BOOK_SEARCH_DEBOUNCE_MS,
  BOOK_SEARCH_QUERY_KEY,
} from '../catalog.constants'

// Busca no acervo (RF-ACE-01): espera o aluno parar de digitar, consulta
// GET /books e carrega as páginas seguintes sob demanda. Com a busca vazia lista
// o acervo inteiro.
export function useBookSearch(text: string) {
  const q = useDebouncedValue(text.trim(), BOOK_SEARCH_DEBOUNCE_MS)

  const query = useInfiniteQuery({
    queryKey: [BOOK_SEARCH_QUERY_KEY, q],
    queryFn: ({ pageParam }) => searchBooks(q, pageParam),
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
    // O aluno ainda está digitando: a lista mostrada é a da busca anterior.
    isTyping: q !== text.trim(),
  }
}
