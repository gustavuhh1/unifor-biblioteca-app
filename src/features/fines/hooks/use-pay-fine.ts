import { useMutation, useQueryClient } from '@tanstack/react-query'
import { DESK_SUMMARY_QUERY_KEY } from '@/features/desk/desk.constants'
import { payFine } from '../api/fines.api'
import { LIBRARIAN_FINES_QUERY_KEY } from '../fines.constants'

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
