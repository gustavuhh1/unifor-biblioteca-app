import { useQuery } from '@tanstack/react-query'
import { getMyLoans } from '../api/loans.api'
import {
  LOAN_VIEW,
  MY_LOANS_GC_TIME_MS,
  MY_LOANS_QUERY_KEY,
  type LoanView,
} from '../loans.constants'

// Pedidos e empréstimos do aluno (RF-EMP-08): GET /me/loans. O cache dura 24 h
// para o QR de retirada abrir sem internet (RNF-CON-01). `enabled` deixa a aba
// do histórico só buscar quando é aberta.
export function useMyLoans(
  view: LoanView = LOAN_VIEW.active,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: [MY_LOANS_QUERY_KEY, view],
    queryFn: () => getMyLoans(view),
    gcTime: MY_LOANS_GC_TIME_MS,
    enabled,
  })
}
