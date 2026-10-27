import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'
import { ME_QUERY_KEY } from '@/features/auth/auth.constants'
import { BOOK_QUERY_KEY } from '@/features/catalog/catalog.constants'
import { addLoanToActiveCache } from '@/features/loans/hooks/use-loan-actions'
import { MY_LOANS_QUERY_KEY } from '@/features/loans/loans.constants'
import {
  postConfirmQueueTurn,
  postJoinQueue,
  postLeaveQueue,
} from '../api/queues.api'
import {
  MY_QUEUES_QUERY_KEY,
  QUEUE_PREVIEW_QUERY_KEY,
} from '../queues.constants'
import type {
  ConfirmQueueTurnResponse,
  JoinQueueResponse,
  LeftQueueEntry,
} from '../queues.types'

// Depois de entrar, sair ou confirmar a vez, o que o app mostra muda em vários
// lugares: Minhas filas e a prévia, os contadores de GET /me (Início e Perfil), a
// página do livro (o que o botão faz) e, ao confirmar, Meus empréstimos.
function refreshAfterQueueChange(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: [MY_QUEUES_QUERY_KEY] })
  void queryClient.invalidateQueries({ queryKey: [QUEUE_PREVIEW_QUERY_KEY] })
  void queryClient.invalidateQueries({ queryKey: [MY_LOANS_QUERY_KEY] })
  void queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
  void queryClient.invalidateQueries({ queryKey: [BOOK_QUERY_KEY] })
}

// Entra na fila de uma ou mais edições do mesmo livro (RF-FIL-01, RF-FIL-04):
// POST /queues, com os ids das edições marcadas. Numa recusa (409), as regras
// podem ter mudado: a prévia e a página do livro são lidas de novo.
export function useJoinQueue() {
  const queryClient = useQueryClient()
  return useMutation<JoinQueueResponse, Error, string[]>({
    mutationFn: (bookIds) => postJoinQueue(bookIds),
    onSettled: () => refreshAfterQueueChange(queryClient),
  })
}

// Sai da fila, ou recusa a vez (RF-FIL-05): POST /queues/{entryId}/leave.
export function useLeaveQueue() {
  const queryClient = useQueryClient()
  return useMutation<LeftQueueEntry, Error, string>({
    mutationFn: (entryId) => postLeaveQueue(entryId),
    onSettled: () => refreshAfterQueueChange(queryClient),
  })
}

// Confirma a vez (RF-FIL-06): POST /queues/{entryId}/confirm. O pedido novo entra
// no cache dos ativos na hora, para a tela "Pedido feito" já o encontrar.
export function useConfirmQueueTurn() {
  const queryClient = useQueryClient()
  return useMutation<ConfirmQueueTurnResponse, Error, string>({
    mutationFn: (entryId) => postConfirmQueueTurn(entryId),
    onSuccess: ({ loan }) => addLoanToActiveCache(queryClient, loan),
    onSettled: () => refreshAfterQueueChange(queryClient),
  })
}
