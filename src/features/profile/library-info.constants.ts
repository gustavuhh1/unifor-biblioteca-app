// Chave do TanStack Query das regras e contatos da biblioteca (GET /library/info).
export const LIBRARY_INFO_QUERY_KEY = ['library-info'] as const

// As regras mudam raramente: o cache vale 1 hora antes de pedir de novo.
export const LIBRARY_INFO_STALE_TIME_MS = 60 * 60 * 1000
