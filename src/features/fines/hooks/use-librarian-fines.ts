import { useQueries } from '@tanstack/react-query'
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value'
import { FINE_STATUS, type FineStatus } from '@/shared/types'
import { listLibrarianFines } from '../api/fines.api'
import {
  FINES_SEARCH_DEBOUNCE_MS,
  LIBRARIAN_FINES_QUERY_KEY,
} from '../fines.constants'

// As três abas da tela Multas (RF-BAL-09): Em aberto, Contando e Pagas, todas
// com a mesma busca por nome ou matrícula. Busca as três juntas para as abas
// mostrarem o contador e o subtítulo somar o que está em aberto.
export function useLibrarianFines(text: string) {
  const q = useDebouncedValue(text.trim(), FINES_SEARCH_DEBOUNCE_MS)
  const statuses: FineStatus[] = [
    FINE_STATUS.open,
    FINE_STATUS.accruing,
    FINE_STATUS.paid,
  ]

  const [open, accruing, paid] = useQueries({
    queries: statuses.map((status) => ({
      queryKey: [...LIBRARIAN_FINES_QUERY_KEY, status, q],
      queryFn: () => listLibrarianFines(status, q),
    })),
  })

  return { open, accruing, paid, byStatus: { open, accruing, paid } }
}
