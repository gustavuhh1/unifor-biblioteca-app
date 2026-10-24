import { Pressable, Text } from 'react-native'
import type { PressableProps } from 'react-native'
import { Icon, type IconName } from './icon'

export interface ChipProps extends Omit<PressableProps, 'children' | 'style'> {
  selected?: boolean
  icon?: IconName
  // Contador ao lado do rótulo (ex.: "Todos 12").
  count?: number
  children: string
}

// Filtro rápido (components.d.ts, Chip). No app do aluno a busca não tem chips
// (decisão de 18/10); só o acervo do bibliotecário usa. A área de toque tem 44px.
export function Chip({
  selected = false,
  icon,
  count,
  children,
  ...rest
}: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={`min-h-[36px] flex-row items-center gap-1.5 self-start rounded-pill border-[1.5px] px-3.5 ${
        selected
          ? 'border-brand bg-brand-soft'
          : 'border-line bg-surface-raised'
      }`}
      hitSlop={{ top: 4, bottom: 4 }}
      {...rest}
    >
      {icon ? (
        <Icon name={icon} size={16} color={selected ? 'brandStrong' : 'ink'} />
      ) : null}
      <Text
        className={`text-label ${selected ? 'text-brand-strong' : 'text-ink'}`}
      >
        {count === undefined ? children : `${children} ${count}`}
      </Text>
    </Pressable>
  )
}
