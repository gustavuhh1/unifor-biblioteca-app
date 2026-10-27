import { useQuery } from '@tanstack/react-query'
import { getDeskSummary } from '../api/desk.api'
import { DESK_SUMMARY_QUERY_KEY } from '../desk.constants'

// Os números do dia do Painel (RF-BAL-01, GET /librarian/desk/summary).
export function useDeskSummary() {
  return useQuery({
    queryKey: DESK_SUMMARY_QUERY_KEY,
    queryFn: getDeskSummary,
  })
}
