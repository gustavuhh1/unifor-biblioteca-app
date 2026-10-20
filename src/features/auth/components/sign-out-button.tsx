import { Button } from '@/shared/components'
import { useLogout } from '../hooks/use-logout'

// Botão Sair do Perfil: encerra a sessão na API e no Firebase (RF-AUT, logout).
export function SignOutButton() {
  const logout = useLogout()
  return (
    <Button
      variant="secondary"
      icon="logout"
      loading={logout.isPending}
      onPress={() => logout.mutate()}
    >
      Sair
    </Button>
  )
}
