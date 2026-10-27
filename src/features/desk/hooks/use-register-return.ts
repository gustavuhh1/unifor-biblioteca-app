import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postLoanReturn } from '../api/desk.api'
import { DESK_QUERY_KEY } from '../desk.constants'

interface RegisterReturnInput {
  loanId: string
  // "Multa paga agora": o valor foi recebido no balcão (RF-BAL-08).
  finePaidNow: boolean
}

// Registra a devolução de um livro (RF-BAL-04 e RF-BAL-08, POST
// /librarian/loans/{loanId}/return): a multa para de contar, o 1º da fila é
// avisado na hora e, com `finePaidNow`, a multa fecha como paga. Depois, os
// números do Painel e a ficha do aluno são relidos.
export function useRegisterReturn() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ loanId, finePaidNow }: RegisterReturnInput) =>
      postLoanReturn(loanId, finePaidNow),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: DESK_QUERY_KEY }),
  })
}
