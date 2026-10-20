import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signOut } from 'firebase/auth'
import { auth } from '@/shared/config/firebase'
import { postLogout } from '../api/auth.api'
import { signOutEverywhere } from '../auth.session'

// Sair (RF-AUT, logout): chama POST /auth/logout e depois sai do Firebase. Se a
// API falhar, sai do Firebase mesmo assim. Limpa o cache de dados da conta.
export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () =>
      signOutEverywhere({
        callApiLogout: postLogout,
        signOutFirebase: () => signOut(auth),
      }),
    onSettled: () => queryClient.clear(),
  })
}
