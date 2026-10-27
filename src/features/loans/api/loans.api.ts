import { apiRequest } from '@/shared/api/client'
import { buildQueryString } from '@/shared/api/query-string'
import { LOAN_VIEW, type LoanView } from '../loans.constants'
import type { MyLoansResponse } from '../loans.types'

// Pedidos e empréstimos do aluno: os ativos ou o histórico (GET /me/loans).
export function getMyLoans(view: LoanView = LOAN_VIEW.active) {
  return apiRequest<MyLoansResponse>(`/me/loans${buildQueryString({ view })}`)
}
