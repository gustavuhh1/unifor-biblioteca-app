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

// "2 de 3 na estante" para a linha Exemplares da página do livro.
export function shelfText(book: BookSummary): string {
  return `${book.copiesAvailable} de ${book.copiesTotal} na estante`
}

// "Ninguém na fila" ou "2 pessoas na fila".
export function queueText(queueLength: number): string {
  return queueLength === 0
    ? 'Ninguém na fila'
    : `${pluralize(queueLength, 'pessoa', 'pessoas')} na fila`
}

// "Nenhuma reserva" ou "1 reserva na fila", ao lado da capa na página do livro.
export function reservationsText(queueLength: number): string {
  return queueLength === 0
    ? 'Nenhuma reserva'
    : `${pluralize(queueLength, 'reserva', 'reservas')} na fila`
}

// "Devolução prevista: 24/10" quando há exemplar emprestado; senão null.
export function nextReturnText(book: BookSummary): string | null {
  return book.copiesAvailable === 0 && book.nextReturnAt
    ? `Devolução prevista: ${formatDayMonth(book.nextReturnAt)}`
    : null
}

// Linha de apoio do card, como no Figma (A09): "2 exemplares na estante" ou,
// sem exemplar, "1 pessoa na fila · 3 exemplares" e "Ninguém na fila: você seria
// o 1º". Livro pausado ganha a linha "Indisponível para novos pedidos" (RF-ACE-08).
export function bookCardMeta(book: BookSummary): string {
  let line: string
  if (book.copiesAvailable > 0) {
    line = `${pluralize(book.copiesAvailable, 'exemplar', 'exemplares')} na estante`
  } else if (book.queueLength > 0) {
    line = `${queueText(book.queueLength)} · ${pluralize(book.copiesTotal, 'exemplar', 'exemplares')}`
  } else {
    line = book.unavailableForNewRequests
      ? queueText(0)
      : `${queueText(0)}: você seria o 1º`
  }
  return book.unavailableForNewRequests
    ? `${line}\nIndisponível para novos pedidos`
    : line
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
// A API já manda a estante com a palavra ("Estante 005.1"): não se repete aqui.
export function bookLocationText(book: BookPage): string {
  return [book.location, book.shelf].filter(Boolean).join(' · ')
}

// CDU e Cutter da etiqueta na lombada, ex.: "005.1 F787r".
export function callNumberText(book: BookPage): string {
  return [book.cdu, book.cutter].filter(Boolean).join(' ')
}
