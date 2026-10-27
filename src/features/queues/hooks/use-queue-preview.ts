import { useQuery } from '@tanstack/react-query'
import { getQueuePreview } from '../api/queues.api'
import { QUEUE_PREVIEW_QUERY_KEY } from '../queues.constants'

// Prévia da fila de um livro (RF-FIL-01): quantas pessoas estão na frente de cada
// edição antes de entrar. `enabled` deixa a busca só com a folha aberta, e a
// prévia é sempre lida de novo: a fila muda a toda hora.
export function useQueuePreview(bookId: string, enabled: boolean) {
  return useQuery({
    queryKey: [QUEUE_PREVIEW_QUERY_KEY, bookId],
    queryFn: () => getQueuePreview(bookId),
    enabled,
    staleTime: 0,
  })
}
