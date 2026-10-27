import { useQuery } from '@tanstack/react-query'
import { getMyFines } from '../api/my-fines.api'
import { MY_FINES_QUERY_KEY } from '../my-fines.constants'

// Multas do aluno (RF-MUL-03 e RF-MUL-04): GET /me/fines.
export function useMyFines() {
  return useQuery({
    queryKey: MY_FINES_QUERY_KEY,
    queryFn: getMyFines,
  })
}
