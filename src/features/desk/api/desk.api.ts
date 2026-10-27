import { apiRequest } from '@/shared/api/client'
import { buildQueryString } from '@/shared/api/query-string'
import type {
  DeskLookupBody,
  DeskLookupResponse,
  DeskSummary,
  PickupResponse,
  PickupsResponse,
  ReturnResponse,
} from '../desk.types'

// Os quatro números do Painel (GET /librarian/desk/summary).
export function getDeskSummary() {
  return apiRequest<DeskSummary>('/librarian/desk/summary')
}

// Pedidos aguardando retirada, do prazo mais curto ao mais longo; `matricula`
// filtra pelos primeiros dígitos (GET /librarian/pickups).
export function getPickups(matricula?: string) {
  return apiRequest<PickupsResponse>(
    `/librarian/pickups${buildQueryString({ matricula })}`,
  )
}

// Abre a ficha do aluno por QR, código do pedido ou matrícula (POST, para o
// qrToken não aparecer na URL: POST /librarian/desk/lookup).
export function postDeskLookup(body: DeskLookupBody) {
  return apiRequest<DeskLookupResponse>('/librarian/desk/lookup', {
    method: 'POST',
    body,
  })
}

// Registra a retirada de um pedido (POST /librarian/loans/{loanId}/pickup).
export function postLoanPickup(loanId: string) {
  return apiRequest<PickupResponse>(
    `/librarian/loans/${encodeURIComponent(loanId)}/pickup`,
    { method: 'POST' },
  )
}

// Registra a devolução; `finePaidNow` fecha a multa como paga (POST
// /librarian/loans/{loanId}/return).
export function postLoanReturn(loanId: string, finePaidNow: boolean) {
  return apiRequest<ReturnResponse>(
    `/librarian/loans/${encodeURIComponent(loanId)}/return`,
    { method: 'POST', body: { finePaidNow } },
  )
}
