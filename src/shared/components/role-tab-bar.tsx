import type { BottomTabBarProps } from 'expo-router/build/layouts/Tabs'
import { BottomNav, type NavRole } from './bottom-nav'

// Rotas das abas de cada perfil, na mesma ordem dos itens do BottomNav.
export const TAB_ROUTES: Record<NavRole, readonly string[]> = {
  aluno: ['home', 'catalog', 'loans', 'assistant', 'profile'],
  bibliotecario: ['panel', 'withdrawals', 'scan', 'queues', 'fines'],
}

// Liga o BottomNav do design system às abas do Expo Router (prop `tabBar` do Tabs).
// Rotas fora da barra (ex.: o perfil do bibliotecário) não marcam nenhuma aba.
export function RoleTabBar({
  role,
  state,
  emitter,
  navigateToTab,
}: BottomTabBarProps & { role: NavRole }) {
  const routeNames = TAB_ROUTES[role]
  const focusedName = state.routes[state.index]?.name
  const active = routeNames.indexOf(focusedName ?? '')

  function select(index: number) {
    const route = state.routes.find((item) => item.name === routeNames[index])
    if (!route) return
    const event = emitter.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    })
    if (index !== active && !event.defaultPrevented) {
      navigateToTab(route.key)
    }
  }

  return <BottomNav role={role} active={active} onSelect={select} />
}
