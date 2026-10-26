import { useQuery } from '@tanstack/react-query'
import { getMyLoans } from '../api/loans.api'
import {
  LOAN_VIEW,
  MY_LOANS_QUERY_KEY,
  type LoanView,
} from '../loans.constants'

// Pedidos e empréstimos do aluno (RF-EMP-08): GET /me/loans.
export function useMyLoans(view: LoanView = LOAN_VIEW.active) {
  return useQuery({
    queryKey: [MY_LOANS_QUERY_KEY, view],
    queryFn: () => getMyLoans(view),
  })
}
