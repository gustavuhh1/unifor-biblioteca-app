// Chave do TanStack Query dos recomendados do Início (GET /me/recommendations).
export const RECOMMENDATIONS_QUERY_KEY = ['recommendations'] as const

// Quantos livros "Recomendados para você" o Início mostra de uma vez.
export const HOME_RECOMMENDATIONS_LIMIT = 5

// As sugestões só mudam quando o aluno lê mais: o cache vale 10 minutos.
export const RECOMMENDATIONS_STALE_TIME_MS = 10 * 60 * 1000
