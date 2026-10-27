import { Stack } from 'expo-router'

export const unstable_settings = { initialRouteName: '(tabs)' }

// O conteúdo de cada aba fica em (tabs); telas internas abrem sem a barra inferior.
// Tela fora da barra precisa ser do Stack: uma aba escondida (`href: null`) não
// abre por rota.
export default function StudentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="book-details" />
      <Stack.Screen name="fine" />
      <Stack.Screen name="passkeys" />
      <Stack.Screen name="appearance" />
      <Stack.Screen name="saved" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="library-rules" />
      <Stack.Screen name="notification-settings" />
      <Stack.Screen name="withdrawal" />
    </Stack>
  )
}
