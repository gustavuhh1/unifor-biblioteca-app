import { apiRequest } from '@/shared/api/client'
import { buildQueryString } from '@/shared/api/query-string'
import { LIBRARIAN_BOOKS_PAGE_SIZE } from '../librarian-catalog.constants'
import type {
  BookListFilter,
  CreateBookBody,
  IsbnLookup,
  LibrarianBook,
  LibrarianBookPage,
  SyncBookResult,
  UpdateBookBody,
} from '../librarian-catalog.types'

// Lista e busca o acervo por título, autor ou ISBN (GET /librarian/books, RF-GAC-01).
export function listLibrarianBooks(
  q: string,
  filter: BookListFilter,
  page = 1,
) {
  return apiRequest<LibrarianBookPage>(
    `/librarian/books${buildQueryString({ q: q.trim(), filter, page, pageSize: LIBRARIAN_BOOKS_PAGE_SIZE })}`,
  )
}

// Consulta um ISBN na Open Library e na BrasilAPI (GET /librarian/books/isbn/{isbn}, RF-GAC-02).
export function lookupIsbn(isbn: string) {
  return apiRequest<IsbnLookup>(
    `/librarian/books/isbn/${encodeURIComponent(isbn)}`,
  )
}

// Cadastra um livro e os exemplares (POST /librarian/books, RF-GAC-02).
export function createBook(body: CreateBookBody) {
  return apiRequest<LibrarianBook>('/librarian/books', {
    method: 'POST',
    body,
  })
}

// Edita um livro (PATCH /librarian/books/{id}, RF-GAC-03 e RF-GAC-06).
export function updateBook(id: string, body: UpdateBookBody) {
  return apiRequest<LibrarianBook>(
    `/librarian/books/${encodeURIComponent(id)}`,
    { method: 'PATCH', body },
  )
}

// Atualiza um livro pelas fontes externas, só preenchendo o que está vazio
// (POST /librarian/books/{id}/sync, RF-GAC-04).
export function syncBook(id: string) {
  return apiRequest<SyncBookResult>(
    `/librarian/books/${encodeURIComponent(id)}/sync`,
    { method: 'POST' },
  )
}

// Remove um livro do acervo (DELETE /librarian/books/{id}, RF-GAC-05).
export function deleteBook(id: string) {
  return apiRequest<void>(`/librarian/books/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}
