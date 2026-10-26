import type { CoverTone, Status } from '@/shared/components'

import { formatDayMonth } from '@/shared/utils/dates'
import { pluralize } from '@/shared/utils/plural'
import type { BookPage, BookSummary } from './catalog.types'

// Textos do acervo montados a partir do que a API devolve (RF-ACE-01 a RF-ACE-03).

// Selo do livro: com exemplar na estante é Disponível; sem nenhum, Emprestado.
export function bookStatus(
  book: BookSummary,
): Extract<Status, 'disponivel' | 'emprestado'> {
  return book.copiesAvailable > 0 ? 'disponivel' : 'emprestado'
}

// Cor da capa gerada: a API manda de 1 a 6; fora disso volta ao tom 1.
export function bookCoverTone(book: Pick<BookSummary, 'coverTone'>): CoverTone {
  const tone = book.coverTone
  return tone >= 1 && tone <= 6 ? (tone as CoverTone) : 1
}

// "Martin, Robert C. e Fowler, Martin" para o byline do card.
export function authorsLine(authors: string[]): string {
  if (authors.length === 0) return 'Autoria não informada'
  return authors.join('; ')
}

// "2 de 3 exemplares na estante" ou "Nenhum exemplar na estante".
export function copiesText(book: BookSummary): string {
  if (book.copiesTotal === 0) return 'Nenhum exemplar cadastrado'
  if (book.copiesAvailable === 0) {
    return `0 de ${pluralize(book.copiesTotal, 'exemplar', 'exemplares')} na estante`
  }
  return `${book.copiesAvailable} de ${pluralize(book.copiesTotal, 'exemplar', 'exemplares')} na estante`
}

// "Ninguém na fila" ou "2 pessoas na fila".
export function queueText(queueLength: number): string {
  return queueLength === 0
    ? 'Ninguém na fila'
    : `${pluralize(queueLength, 'pessoa', 'pessoas')} na fila`
}

// "Devolução prevista: 24/10" quando há exemplar emprestado; senão null.
export function nextReturnText(book: BookSummary): string | null {
  return book.copiesAvailable === 0 && book.nextReturnAt
    ? `Devolução prevista: ${formatDayMonth(book.nextReturnAt)}`
    : null
}

// Linhas de apoio do card: exemplares, devolução e fila (só se não há na estante).
export function bookCardMeta(book: BookSummary): string {
  const lines = [copiesText(book)]
  if (book.copiesAvailable === 0) {
    const nextReturn = nextReturnText(book)
    if (nextReturn) lines.push(nextReturn)
    lines.push(queueText(book.queueLength))
  }
  if (book.unavailableForNewRequests) {
    lines.push('Indisponível para novos pedidos')
  }
  return lines.join('\n')
}

// Linha de descrição do livro, ex.: "Livro · 2. ed. · Novatec, 2020".
export function bookDescription(book: BookPage): string {
  const published = [book.publisher, book.year].filter(Boolean).join(', ')
  return [book.materialType, book.edition, published]
    .filter(Boolean)
    .join(' · ')
}

// "São Paulo : Novatec, 2020" para o registro completo; null quando não há dado.
export function publicationText(book: BookPage): string | null {
  const publisher = [book.publicationPlace, book.publisher]
    .filter(Boolean)
    .join(' : ')
  const text = [publisher, book.year].filter(Boolean).join(', ')
  return text || null
}

// Local do livro na biblioteca, ex.: "Biblioteca (Praça Central) · Estante 005.1".
export function bookLocationText(book: BookPage): string {
  return [book.location, book.shelf && `Estante ${book.shelf}`]
    .filter(Boolean)
    .join(' · ')
}
