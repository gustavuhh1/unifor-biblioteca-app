import { SignOutButton } from '@/features/auth/components/sign-out-button'
import { PlaceholderScreen } from '@/shared/components'

// Tela provisória (B25): Perfil do bibliotecário, com o Sair.
export function LibrarianProfileScreen() {
  return (
    <PlaceholderScreen title="Perfil" code="B25" back>
      <SignOutButton />
    </PlaceholderScreen>
  )
}
