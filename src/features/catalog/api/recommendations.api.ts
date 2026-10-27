import { apiRequest } from '@/shared/api/client'
import type { RecommendationsResponse } from '../recommendations.types'

// Livros recomendados pelo histórico de leitura do aluno (GET /me/recommendations).
export function getRecommendations() {
  return apiRequest<RecommendationsResponse>('/me/recommendations')
}
