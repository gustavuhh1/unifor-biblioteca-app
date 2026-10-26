import { apiRequest } from '@/shared/api/client'
import { buildQueryString } from '@/shared/api/query-string'
import { BOOK_SEARCH_PAGE_SIZE } from '../catalog.constants'
import type { BookPage, BookSearchPage } from '../catalog.types'

// Busca livros por título, autor ou assunto (GET /books).
export function searchBooks(q: string, page = 1) {
  return apiRequest<BookSearchPage>(
    `/books${buildQueryString({ q: q.trim(), page, pageSize: BOOK_SEARCH_PAGE_SIZE })}`,
  )
}

// Página do livro, com o que o botão fixo faz para este aluno (GET /books/{id}).
export function getBook(bookId: string) {
  return apiRequest<BookPage>(`/books/${encodeURIComponent(bookId)}`)
}
