import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postLoanPickup } from '../api/desk.api'
import { DESK_QUERY_KEY } from '../desk.constants'

// Registra a retirada de um pedido (RF-BAL-02, POST /librarian/loans/{loanId}/pickup):
// o empréstimo de 14 dias começa a contar. Depois, os números do Painel, a lista
// Retiradas e a ficha do aluno são relidos.
export function useRegisterPickup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (loanId: string) => postLoanPickup(loanId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: DESK_QUERY_KEY }),
  })
}
