import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postDeskLookup } from '../api/desk.api'
import { deskStudentQueryKey } from '../desk.constants'

// Abre a ficha do aluno por QR, código do pedido ou matrícula (RF-BAL-02 e
// RF-BAL-03, POST /librarian/desk/lookup). A resposta vai para o cache da ficha
// (chave por matrícula), e as telas seguintes releem de lá.
export function useDeskLookup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: postDeskLookup,
    onSuccess: (record) => {
      queryClient.setQueryData(
        deskStudentQueryKey(record.student.matricula),
        record,
      )
    },
  })
}
