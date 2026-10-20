import { Tabs } from 'expo-router'
import { RoleTabBar } from '@/shared/components/role-tab-bar'

// Abas do bibliotecário: Painel, Retiradas, Escanear, Filas e Multas. O Perfil
// abre pelo ícone do Painel e fica fora da barra (href: null).
export default function LibrarianLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <RoleTabBar role="bibliotecario" {...props} />}
    >
      <Tabs.Screen name="panel" />
      <Tabs.Screen name="withdrawals" />
      <Tabs.Screen name="scan" />
      <Tabs.Screen name="queues" />
      <Tabs.Screen name="fines" />
      <Tabs.Screen name="librarian-profile" options={{ href: null }} />
    </Tabs>
  )
}
