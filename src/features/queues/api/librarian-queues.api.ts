import { apiRequest } from '@/shared/api/client'
import { buildQueryString } from '@/shared/api/query-string'
import {
  QUEUE_BOOKS_MAX_PAGES,
  QUEUE_BOOKS_PAGE_SIZE,
} from '../librarian-queues.constants'
import type {
  AddToQueueBody,
  LibrarianBooksPage,
  LibrarianQueue,
  LibrarianQueueBook,
  MoveInQueueBody,
  QueueChangeResponse,
} from '../librarian-queues.types'

// Livros do acervo que têm gente na fila (RF-BAL-06): lê as páginas de GET
// /librarian/books e guarda os de `queueLength` maior que zero, os de fila mais
// longa primeiro.
export async function listBooksWithQueue(): Promise<LibrarianQueueBook[]> {
  const books: LibrarianQueueBook[] = []
  for (let page = 1; page <= QUEUE_BOOKS_MAX_PAGES; page++) {
    const result = await apiRequest<LibrarianBooksPage>(
      `/librarian/books${buildQueryString({ page, pageSize: QUEUE_BOOKS_PAGE_SIZE })}`,
    )
    books.push(...result.items.filter((book) => book.queueLength > 0))
    if (page >= result.totalPages) break
  }
  return books.sort(
    (a, b) => b.queueLength - a.queueLength || a.title.localeCompare(b.title),
  )
}

// Fila de um livro, na ordem (GET /librarian/books/{bookId}/queue).
export function getBookQueue(bookId: string) {
  return apiRequest<LibrarianQueue>(
    `/librarian/books/${encodeURIComponent(bookId)}/queue`,
  )
}

// Põe um aluno na fila pela matrícula (POST /librarian/books/{bookId}/queue).
export function addToQueue(bookId: string, body: AddToQueueBody) {
  return apiRequest<QueueChangeResponse>(
    `/librarian/books/${encodeURIComponent(bookId)}/queue`,
    { method: 'POST', body },
  )
}

// Muda a posição de um aluno (PATCH /librarian/queues/{entryId}/position).
export function moveInQueue(entryId: string, body: MoveInQueueBody) {
  return apiRequest<QueueChangeResponse>(
    `/librarian/queues/${encodeURIComponent(entryId)}/position`,
    { method: 'PATCH', body },
  )
}

// Remove um aluno da fila, com motivo (POST /librarian/queues/{entryId}/remove).
export function removeFromQueue(entryId: string, reason: string) {
  return apiRequest<LibrarianQueue>(
    `/librarian/queues/${encodeURIComponent(entryId)}/remove`,
    { method: 'POST', body: { reason: reason.trim() } },
  )
}

// Reenvia o aviso "É a sua vez" (POST /librarian/queues/{entryId}/resend).
export function resendQueueNotice(entryId: string) {
  return apiRequest<LibrarianQueue>(
    `/librarian/queues/${encodeURIComponent(entryId)}/resend`,
    { method: 'POST' },
  )
}
