import { Stack } from 'expo-router'

export const unstable_settings = { initialRouteName: '(tabs)' }

// O conteúdo de cada aba fica em (tabs); telas internas abrem sem a barra inferior.
export default function StudentLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="book-details" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="library-rules" />
      <Stack.Screen name="withdrawal" />
    </Stack>
  )
}
