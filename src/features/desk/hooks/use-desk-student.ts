import { useQuery } from '@tanstack/react-query'
import { postDeskLookup } from '../api/desk.api'
import { deskStudentQueryKey } from '../desk.constants'

// A ficha do aluno já aberta (RF-BAL-02 e RF-BAL-03). Lê do cache semeado por
// `useDeskLookup`, sem refazer a consulta (o QR tem `scanned`, a matrícula não);
// depois de uma retirada ou devolução a ficha é invalidada e relida pela
// matrícula. Sem cache (ex.: o app foi reaberto), busca pela matrícula.
export function useDeskStudent(matricula: string | undefined) {
  return useQuery({
    queryKey: deskStudentQueryKey(matricula ?? ''),
    queryFn: () => postDeskLookup({ matricula: matricula! }),
    enabled: Boolean(matricula),
    staleTime: Infinity,
  })
}
