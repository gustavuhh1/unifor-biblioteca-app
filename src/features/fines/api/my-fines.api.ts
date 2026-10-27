import { apiRequest } from '@/shared/api/client'
import type { MyFinesResponse } from '../my-fines.types'

// Multas do aluno: contando, em aberto e pagas (GET /me/fines). O app só
// consulta; o pagamento é feito no balcão (RF-MUL-03).
export function getMyFines() {
  return apiRequest<MyFinesResponse>('/me/fines')
}
