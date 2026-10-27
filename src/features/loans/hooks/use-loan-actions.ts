import {
  useMutation,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'
import { ME_QUERY_KEY } from '@/features/auth/auth.constants'
import { BOOK_QUERY_KEY } from '@/features/catalog/catalog.constants'
import { postCancelLoan, postLoan, postRenewLoan } from '../api/loans.api'
import { LOAN_VIEW, MY_LOANS_QUERY_KEY } from '../loans.constants'
import type { MyLoan, MyLoansResponse } from '../loans.types'

// Depois de pedir, renovar ou cancelar, o que o app mostra muda em vários
// lugares: Meus empréstimos, o Início e o Perfil (contadores de GET /me) e a
// página do livro (exemplares e o que o botão faz).
function refreshAfterLoanChange(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: [MY_LOANS_QUERY_KEY] })
  void queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
  void queryClient.invalidateQueries({ queryKey: [BOOK_QUERY_KEY] })
}

// Solicita o empréstimo de um livro (RF-EMP-01): POST /loans. O pedido novo entra
// no cache dos ativos na hora, para a tela "Pedido feito" já o encontrar. Numa
// recusa (409), as regras podem ter mudado: a página do livro é buscada de novo.
export function useRequestLoan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bookId: string) => postLoan(bookId),
    onSuccess: (loan) => {
      queryClient.setQueryData<MyLoansResponse>(
        [MY_LOANS_QUERY_KEY, LOAN_VIEW.active],
        (previous) => ({
          view: LOAN_VIEW.active,
          items: [
            loan,
            ...(previous?.items ?? []).filter((item) => item.id !== loan.id),
          ],
        }),
      )
      refreshAfterLoanChange(queryClient)
    },
    onError: () => refreshAfterLoanChange(queryClient),
  })
}

// Renova um empréstimo ativo, uma única vez (RF-EMP-09): POST /loans/{id}/renew.
// Devolve o empréstimo com o novo vencimento.
export function useRenewLoan() {
  const queryClient = useQueryClient()
  return useMutation<MyLoan, Error, string>({
    mutationFn: (loanId) => postRenewLoan(loanId),
    onSettled: () => refreshAfterLoanChange(queryClient),
  })
}

// Cancela um pedido antes da retirada (RF-EMP-05): POST /loans/{id}/cancel.
export function useCancelLoan() {
  const queryClient = useQueryClient()
  return useMutation<MyLoan, Error, string>({
    mutationFn: (loanId) => postCancelLoan(loanId),
    onSettled: () => refreshAfterLoanChange(queryClient),
  })
}
