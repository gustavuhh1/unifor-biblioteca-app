import { useQuery } from '@tanstack/react-query'
import { getMyQueues } from '../api/queues.api'
import { MY_QUEUES_QUERY_KEY } from '../queues.constants'

// Minhas filas (RF-FIL-08): GET /me/queues.
export function useMyQueues() {
  return useQuery({
    queryKey: [MY_QUEUES_QUERY_KEY],
    queryFn: getMyQueues,
  })
}
