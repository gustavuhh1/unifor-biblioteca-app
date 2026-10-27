import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deletePasskey, getPasskeys } from '../api/auth.api'
import { PASSKEYS_QUERY_KEY } from '../auth.constants'

// Lista os passkeys da conta, um por aparelho (RF-AUT-10, GET /auth/passkeys).
export function usePasskeys() {
  return useQuery({
    queryKey: PASSKEYS_QUERY_KEY,
    queryFn: getPasskeys,
    select: (data) => data.passkeys,
  })
}

// Remove o passkey de um aparelho (RF-AUT-10, DELETE /auth/passkeys/{id}) e
// atualiza a lista.
export function useRemovePasskey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePasskey(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PASSKEYS_QUERY_KEY }),
  })
}
