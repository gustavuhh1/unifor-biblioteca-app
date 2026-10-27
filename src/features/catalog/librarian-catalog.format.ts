import { pluralize } from '@/shared/utils/plural'
import type { LibrarianBook } from './librarian-catalog.types'

// Textos da gestão do acervo montados a partir do que a API devolve (RF-GAC-01).

// Linha de apoio do cartão da lista: "3 exemplares · 1 na fila · Estante 005.1".
export function librarianBookMeta(
  book: Pick<
    LibrarianBook,
    'copiesTotal' | 'queueLength' | 'shelf' | 'unavailableForNewRequests'
  >,
): string {
  const parts = [pluralize(book.copiesTotal, 'exemplar', 'exemplares')]
  parts.push(book.queueLength > 0 ? `${book.queueLength} na fila` : book.shelf)
  if (book.unavailableForNewRequests) {
    parts.push('Indisponível para novos pedidos')
  }
  return parts.join(' · ')
}
