import { Stack } from 'expo-router'

// Grupo de acesso (sem sessão): login e, nas próximas tarefas, cadastro e recuperação.
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />
}
