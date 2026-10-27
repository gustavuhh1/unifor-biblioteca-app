import { useMutation, useQueryClient } from '@tanstack/react-query'
import { payFine } from '../api/fines.api'
import {
  DESK_SUMMARY_QUERY_KEY,
  LIBRARIAN_FINES_QUERY_KEY,
} from '../fines.constants'

// Registra o pagamento de uma multa em aberto (RF-BAL-09, B17). Depois relê as
// listas de multas e o resumo do Painel, que conta as multas em aberto.
export function usePayFine() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (fineId: string) => payFine(fineId),
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: LIBRARIAN_FINES_QUERY_KEY,
      })
      void queryClient.invalidateQueries({ queryKey: DESK_SUMMARY_QUERY_KEY })
    },
  })
}
