import { useQuery } from '@tanstack/react-query'
import { getLibraryInfo } from '../api/library-info.api'
import {
  LIBRARY_INFO_QUERY_KEY,
  LIBRARY_INFO_STALE_TIME_MS,
} from '../library-info.constants'

// Regras e contatos da biblioteca (RF-PER-02): usados em Regras da biblioteca e
// no "Atendimento" de Minhas multas.
export function useLibraryInfo() {
  return useQuery({
    queryKey: LIBRARY_INFO_QUERY_KEY,
    queryFn: getLibraryInfo,
    staleTime: LIBRARY_INFO_STALE_TIME_MS,
  })
}
