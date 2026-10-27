import { apiRequest } from '@/shared/api/client'
import { buildQueryString } from '@/shared/api/query-string'
import { LOAN_VIEW, type LoanView } from '../loans.constants'
import type { MyLoan, MyLoansResponse } from '../loans.types'

// Pedidos e empréstimos do aluno: os ativos ou o histórico (GET /me/loans).
export function getMyLoans(view: LoanView = LOAN_VIEW.active) {
  return apiRequest<MyLoansResponse>(`/me/loans${buildQueryString({ view })}`)
}

// Solicita o empréstimo de um livro disponível (POST /loans): a API separa um
// exemplar e devolve o pedido com o `qrToken` e o `pickupCode`.
export function postLoan(bookId: string) {
  return apiRequest<MyLoan>('/loans', { method: 'POST', body: { bookId } })
}

// Renova um empréstimo ativo, uma única vez (POST /loans/{loanId}/renew).
export function postRenewLoan(loanId: string) {
  return apiRequest<MyLoan>(`/loans/${encodeURIComponent(loanId)}/renew`, {
    method: 'POST',
  })
}

// Cancela um pedido ainda não retirado (POST /loans/{loanId}/cancel).
export function postCancelLoan(loanId: string) {
  return apiRequest<MyLoan>(`/loans/${encodeURIComponent(loanId)}/cancel`, {
    method: 'POST',
  })
}
