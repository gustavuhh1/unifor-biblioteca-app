import { useRouter } from 'expo-router'
import { useCallback } from 'react'

// Volta à tela de login (a raiz do acesso), de onde o cadastro e a recuperação
// de senha foram abertos.
export function useGoToLogin() {
  const router = useRouter()
  return useCallback(() => {
    if (router.canDismiss()) router.dismissAll()
    else router.replace('/')
  }, [router])
}
