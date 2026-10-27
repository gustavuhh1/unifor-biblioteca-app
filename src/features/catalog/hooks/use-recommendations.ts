import { useQuery } from '@tanstack/react-query'
import { getRecommendations } from '../api/recommendations.api'
import {
  RECOMMENDATIONS_QUERY_KEY,
  RECOMMENDATIONS_STALE_TIME_MS,
} from '../recommendations.constants'

// "Recomendados para você" do Início (RF-ASS-03): GET /me/recommendations.
export function useRecommendations() {
  return useQuery({
    queryKey: RECOMMENDATIONS_QUERY_KEY,
    queryFn: getRecommendations,
    staleTime: RECOMMENDATIONS_STALE_TIME_MS,
  })
}
