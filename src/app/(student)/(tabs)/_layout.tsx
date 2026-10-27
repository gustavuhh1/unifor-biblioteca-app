import { Tabs } from 'expo-router'
import { RoleTabBar } from '@/shared/components/role-tab-bar'

// Abas do aluno: Início, Acervo, Empréstimos, Assistente e Perfil.
export default function StudentTabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <RoleTabBar role="aluno" {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="catalog" />
      <Tabs.Screen name="loans" />
      <Tabs.Screen name="assistant" />
      <Tabs.Screen name="profile" />
    </Tabs>
  )
}
