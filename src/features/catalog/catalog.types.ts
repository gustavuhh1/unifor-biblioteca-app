import type { CopyStatus } from '@/shared/types'
import type { BlockedReason } from '@/shared/utils/blocked-reason'
import type { BOOK_SUGGESTED_ACTIONS } from './catalog.constants'

// Tipos exclusivos do acervo: o que a API devolve em GET /books e GET /books/{id}
// (schemas `BookSummary` e `BookPage` do Swagger). As datas chegam como texto
// ISO 8601 (UTC).

// Resumo de um livro no card da busca.
export interface BookSummary {
  id: string
  title: string
  authors: string[]
  coverUrl: string | null
  // De 1 a 6: cor da capa gerada.
  coverTone: number
  copiesTotal: number
  copiesAvailable: number
  queueLength: number
  nextReturnAt: string | null
  unavailableForNewRequests: boolean
}

// Uma página de resultados da busca.
export interface BookSearchPage {
  items: BookSummary[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// Exemplar listado na página do livro.
export interface BookCopySummary {
  registration: string
  format: string
  status: CopyStatus
}

// O que o botão fixo da página do livro faz para este aluno.
export type BookSuggestedAction = (typeof BOOK_SUGGESTED_ACTIONS)[number]

export interface BookAction {
  suggestedAction: BookSuggestedAction
  allowed: boolean
  // Só vem quando `allowed` é false.
  blockedReason?: BlockedReason
}

// Página do livro.
export interface BookPage extends BookSummary {
  workId: string
  isbn: string | null
  subtitle: string | null
  translators: string[]
  publisher: string | null
  publicationPlace: string | null
  edition: string | null
  year: number | null
  language: string
  materialType: string
  series: string | null
  subjects: string[]
  synopsis: string | null
  cdu: string
  cutter: string
  shelf: string
  location: string
  copies: BookCopySummary[]
  // Para o bibliotecário a API devolve null.
  action: BookAction | null
}
