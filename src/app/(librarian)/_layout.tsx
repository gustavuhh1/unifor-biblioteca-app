import { Stack } from 'expo-router'

// Grupo do bibliotecário: as abas ficam em (tabs) e o Perfil abre por cima delas,
// pelo ícone de usuário do Painel (não é uma aba da barra).
export default function LibrarianLayout() {
  return <Stack screenOptions={{ headerShown: false }} />
}
