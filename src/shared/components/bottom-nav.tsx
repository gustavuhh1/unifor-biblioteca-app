import { Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../theme/theme-provider'
import { Icon, type IconName } from './icon'

export type NavRole = 'aluno' | 'bibliotecario'

interface NavItem {
  icon: IconName
  label: string
  // Botão central elevado do bibliotecário (Escanear).
  fab?: boolean
}

// Abas de cada perfil, na ordem da barra (docs/design-system/README.md, Navegação).
export const NAV_ITEMS: Record<NavRole, NavItem[]> = {
  aluno: [
    { icon: 'home', label: 'Início' },
    { icon: 'books', label: 'Acervo' },
    { icon: 'book', label: 'Empréstimos' },
    { icon: 'sparkle', label: 'Assistente' },
    { icon: 'user', label: 'Perfil' },
  ],
  bibliotecario: [
    { icon: 'home', label: 'Painel' },
    { icon: 'inbox', label: 'Retiradas' },
    { icon: 'scan', label: 'Escanear', fab: true },
    { icon: 'users', label: 'Filas' },
    { icon: 'coin', label: 'Multas' },
  ],
}

export interface BottomNavProps {
  role?: NavRole
  // Índice da aba ativa.
  active?: number
  // Contador por índice de aba.
  badges?: Record<number, number>
  onSelect?: (index: number) => void
}

// Navegação principal; as abas mudam conforme o perfil (components.d.ts, BottomNav).
export function BottomNav({
  role = 'aluno',
  active = 0,
  badges = {},
  onSelect,
}: BottomNavProps) {
  const { shadows } = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <View
      className="border-t border-line bg-surface-raised"
      style={{ paddingBottom: insets.bottom }}
    >
      <View className="h-[72px] flex-row items-end justify-around px-2 pb-2.5">
        {NAV_ITEMS[role].map((item, index) => {
          const selected = index === active
          const badge = badges[index]

          if (item.fab) {
            return (
              <Pressable
                key={item.label}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                className="flex-1 items-center gap-1"
                onPress={() => onSelect?.(index)}
              >
                <View
                  className="mb-1 size-[60px] -translate-y-2.5 items-center justify-center rounded-lg bg-brand"
                  style={{ boxShadow: shadows.float }}
                >
                  <Icon name={item.icon} size={28} color="onBrand" />
                </View>
                <Text className="text-micro text-ink-muted">{item.label}</Text>
              </Pressable>
            )
          }

          return (
            <Pressable
              key={item.label}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              accessibilityState={{ selected }}
              className="flex-1 items-center gap-1"
              onPress={() => onSelect?.(index)}
            >
              <View
                className={`h-[30px] w-14 items-center justify-center rounded-pill ${
                  selected ? 'bg-brand-soft' : ''
                }`}
              >
                <Icon
                  name={item.icon}
                  size={22}
                  color={selected ? 'brandStrong' : 'inkMuted'}
                />
                {badge ? (
                  <View className="absolute -top-0.5 right-2 h-4 min-w-4 items-center justify-center rounded-sm bg-danger px-1">
                    <Text className="text-micro-strong text-on-danger">
                      {badge}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text
                className={`text-micro ${selected ? 'text-brand' : 'text-ink-muted'}`}
              >
                {item.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
