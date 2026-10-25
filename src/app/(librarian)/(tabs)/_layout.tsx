import { Tabs } from 'expo-router'
import { RoleTabBar } from '@/shared/components/role-tab-bar'

// Abas do bibliotecário: Painel, Retiradas, Escanear, Filas e Multas.
export default function LibrarianLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <RoleTabBar role="bibliotecario" {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="withdrawals" />
      <Tabs.Screen name="scan" />
      <Tabs.Screen name="queues" />
      <Tabs.Screen name="fines" />
      <Tabs.Screen name="collection-management" options={{ href: null }} />
    </Tabs>
  )
}
