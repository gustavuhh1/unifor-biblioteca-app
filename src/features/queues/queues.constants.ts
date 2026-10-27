import { constantsOf } from '@/shared/utils/constants-of'

// Chaves do TanStack Query das filas do aluno.
export const MY_QUEUES_QUERY_KEY = 'my-queues'
export const QUEUE_PREVIEW_QUERY_KEY = 'queue-preview'

// Códigos de erro das rotas de fila que não são motivos de bloqueio
// (docs/api-openapi.json): já estar na fila, edições de livros diferentes, lugar
// que não existe ou já saiu da fila, e as recusas ao confirmar a vez.
export const QUEUE_ERROR_CODES = [
  'already_in_queue',
  'editions_mismatch',
  'queue_entry_not_found',
  'queue_entry_not_active',
  'not_your_turn',
  'turn_expired',
] as const
export const QUEUE_ERROR_CODE = constantsOf(QUEUE_ERROR_CODES)

// De quanto em quanto tempo a contagem "Confirme em 18h 40min" se atualiza.
export const CONFIRM_COUNTDOWN_REFRESH_MS = 30_000
