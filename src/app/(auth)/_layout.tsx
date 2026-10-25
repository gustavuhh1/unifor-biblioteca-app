import { Stack } from 'expo-router'

// Grupo de acesso (sem sessão): login e, nas próximas tarefas, cadastro e recuperação.
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="librarian-login" />
    </Stack>
  )
}
