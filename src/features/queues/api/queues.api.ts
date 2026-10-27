import { apiRequest } from '@/shared/api/client'
import type { MyQueuesResponse } from '../queues.types'

// Filas ativas do aluno, com posição e prazo da vez (GET /me/queues).
export function getMyQueues() {
  return apiRequest<MyQueuesResponse>('/me/queues')
}
