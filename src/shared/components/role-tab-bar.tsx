import type { BottomTabBarProps } from 'expo-router/build/layouts/Tabs'
import { BottomNav, type NavRole } from './bottom-nav'

// Rotas das abas de cada perfil, na mesma ordem dos itens do BottomNav.
export const TAB_ROUTES: Record<NavRole, readonly string[]> = {
  aluno: ['index', 'catalog', 'loans', 'assistant', 'profile'],
  bibliotecario: ['index', 'withdrawals', 'scan', 'queues', 'fines'],
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
  const focusedRoute = state.routes[state.index]
  const focusedName = focusedRoute?.name
  if (focusedName === 'appearance') return null
  const fineState =
    focusedRoute?.params && typeof focusedRoute.params === 'object'
      ? (focusedRoute.params as { state?: string }).state
      : undefined
  if (focusedName === 'fine' && ['overdue', 'paid'].includes(fineState ?? '')) {
    return null
  }
  const active = routeNames.indexOf(
    focusedName === 'collection-management'
      ? 'scan'
      : focusedName === 'fine' ||
          focusedName === 'passkeys' ||
          focusedName === 'saved'
        ? 'profile'
        : (focusedName ?? ''),
  )

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
