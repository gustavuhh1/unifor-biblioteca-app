import { Text } from 'react-native'
import { SignOutButton } from '@/features/auth/components/sign-out-button'
import {
  getAuthErrorMessage,
  isPasskeyCancelled,
} from '@/features/auth/auth.errors'
import { useCreatePasskey } from '@/features/auth/hooks/use-create-passkey'
import { Button, PlaceholderScreen } from '@/shared/components'

// Tela provisória (A50): Perfil do aluno, com Criar passkey e Sair.
export function StudentProfileScreen() {
  const createPasskey = useCreatePasskey()
  const failed = createPasskey.error && !isPasskeyCancelled(createPasskey.error)

  return (
    <PlaceholderScreen title="Perfil" code="A50">
      <Button
        icon="fingerprint"
        variant="tonal"
        loading={createPasskey.isPending}
        onPress={() => createPasskey.mutate()}
      >
        Criar passkey neste aparelho
      </Button>
      {createPasskey.isSuccess ? (
        <Text className="text-body text-success">Passkey criado.</Text>
      ) : null}
      {failed ? (
        <Text className="text-body text-danger">
          {getAuthErrorMessage(createPasskey.error)}
        </Text>
      ) : null}
      <SignOutButton />
    </PlaceholderScreen>
  )
}
