import { useRouter } from 'expo-router'
import { PlaceholderScreen } from '@/shared/components'

// Tela provisória (B01): Painel do bibliotecário, com o atalho para o Perfil (B25).
export function PanelScreen() {
  const router = useRouter()
  return (
    <PlaceholderScreen
      title="Painel"
      code="B01"
      action={{
        icon: 'user',
        label: 'Perfil',
        onPress: () => router.push('/librarian-profile'),
      }}
    />
  )
}
