import type { BookSummary } from './catalog.types'

// Um livro recomendado com o motivo ("Pelo que você leu"), em
// GET /me/recommendations (schema `RecommendationItem` do Swagger).
export interface RecommendedBook {
  book: BookSummary
  reasonText: string
}

// Resposta de GET /me/recommendations (RF-ASS-03).
export interface RecommendationsResponse {
  reasonText: string | null
  items: RecommendedBook[]
  generatedAt: string
  validUntil: string
}
