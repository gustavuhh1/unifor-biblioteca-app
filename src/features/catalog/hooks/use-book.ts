import { useQuery } from '@tanstack/react-query'
import { getBook } from '../api/catalog.api'
import { BOOK_QUERY_KEY } from '../catalog.constants'

// Página do livro (RF-ACE-02): GET /books/{id}, com a ação que cabe a este aluno.
export function useBook(bookId: string | undefined) {
  return useQuery({
    queryKey: [BOOK_QUERY_KEY, bookId],
    queryFn: () => getBook(bookId as string),
    enabled: Boolean(bookId),
  })
}
