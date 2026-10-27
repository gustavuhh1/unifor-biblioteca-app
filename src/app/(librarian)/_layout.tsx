import { Stack } from 'expo-router'

// Grupo do bibliotecário: as abas ficam em (tabs). O Perfil e o Acervo abrem por
// cima delas, pelos atalhos do Painel (não são abas da barra). Tela fora da barra
// precisa ser do Stack: uma aba escondida (`href: null`) não abre por rota.
export default function LibrarianLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="collection-management" />
      <Stack.Screen name="librarian-profile" />
      <Stack.Screen name="appearance" />
    </Stack>
  )
}
