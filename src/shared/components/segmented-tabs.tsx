import { Pressable, Text, View } from 'react-native'
import { useTheme } from '../theme/theme-provider'

export interface SegmentedTabItem {
  label: string
  // Contador ao lado do rótulo.
  count?: number
}

export interface SegmentedTabsProps {
  items: SegmentedTabItem[]
  // Índice da aba ativa.
  value?: number
  onChange?: (index: number) => void
}

// Abas em pílula (components.d.ts, SegmentedTabs), como Ativos · Na fila · Histórico.
export function SegmentedTabs({
  items,
  value = 0,
  onChange,
}: SegmentedTabsProps) {
  const { shadows } = useTheme()
  return (
    <View
      accessibilityRole="tablist"
      className="flex-row items-center gap-1 rounded-pill bg-surface-sunken p-1"
    >
      {items.map((item, index) => {
        const active = index === value
        return (
          <Pressable
            key={item.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            className={`h-[36px] min-w-0 flex-1 flex-row items-center justify-center gap-1.5 rounded-pill ${
              active ? 'bg-surface-raised' : ''
            }`}
            style={active ? { boxShadow: shadows.card } : undefined}
            onPress={() => onChange?.(index)}
          >
            <Text
              className={`text-label ${active ? 'text-ink' : 'text-ink-muted'}`}
              numberOfLines={1}
            >
              {item.count === undefined
                ? item.label
                : `${item.label} ${item.count}`}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
