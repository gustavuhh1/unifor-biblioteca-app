import { apiRequest } from '@/shared/api/client'
import { buildQueryString } from '@/shared/api/query-string'
import type { FineStatus } from '@/shared/types'
import type { LibrarianFine, LibrarianFinesResponse } from '../fines.types'

// Multas de uma aba, com busca por nome ou matrícula (GET /librarian/fines).
export function listLibrarianFines(status: FineStatus, q: string) {
  return apiRequest<LibrarianFinesResponse>(
    `/librarian/fines${buildQueryString({ status, q: q.trim() })}`,
  )
}

// Registra o pagamento de uma multa em aberto, recebido no balcão
// (POST /librarian/fines/{fineId}/pay).
export function payFine(fineId: string) {
  return apiRequest<LibrarianFine>(
    `/librarian/fines/${encodeURIComponent(fineId)}/pay`,
    { method: 'POST' },
  )
}
