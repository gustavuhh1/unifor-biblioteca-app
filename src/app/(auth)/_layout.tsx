import { Stack } from 'expo-router'
import { KeyboardAvoidingView } from 'react-native'

// Grupo de acesso (sem sessão): login, cadastro e recuperação de senha. O
// KeyboardAvoidingView sobe o rodapé (botões Continuar, Enviar token...) para
// cima do teclado em todas essas telas, em vez de deixá-lo escondido atrás dele.
export default function AuthLayout() {
  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen name="librarian-login" />
      </Stack>
    </KeyboardAvoidingView>
  )
}
