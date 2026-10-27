import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getPickups } from '../api/desk.api'
import { DESK_PICKUPS_QUERY_KEY } from '../desk.constants'

// Pedidos aguardando retirada, do prazo mais curto ao mais longo (RF-BAL-05,
// GET /librarian/pickups). Sem `matricula` traz todos; com ela, só os do aluno.
// A lista anterior fica na tela enquanto a nova busca chega.
export function usePickups(matricula?: string) {
  return useQuery({
    queryKey: [...DESK_PICKUPS_QUERY_KEY, matricula ?? ''],
    queryFn: () => getPickups(matricula),
    select: (data) => data.items,
    placeholderData: keepPreviousData,
  })
}
