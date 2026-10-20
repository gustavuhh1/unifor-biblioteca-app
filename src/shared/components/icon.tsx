import Svg, { Path } from 'react-native-svg'
import { useTheme } from '../theme/theme-provider'
import type { ColorToken } from '../theme/tokens.generated'
import { ICON_PATHS, type IconName } from './icon-paths'

export type { IconName } from './icon-paths'

export interface IconProps {
  name: IconName
  // 20 em listas e campos, 22 na AppBar e na navegação, 28 no botão Escanear.
  size?: number
  strokeWidth?: number
  // Só quando o ícone sozinho carrega significado; sem ele fica oculto para leitores de tela.
  label?: string
  // Token de cor (padrão: ink). No React Native o ícone não herda a cor do texto.
  color?: ColorToken
}

// Ícone do design system: traço de 2px numa grade de 24 (components.d.ts, Icon).
export function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  label,
  color = 'ink',
}: IconProps) {
  const { colors } = useTheme()
  const tint = colors[color]

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={tint}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessible={label !== undefined}
      accessibilityRole={label ? 'image' : undefined}
      accessibilityLabel={label}
      importantForAccessibility={label ? 'yes' : 'no-hide-descendants'}
    >
      {ICON_PATHS[name].map((path, index) => (
        <Path
          key={index}
          d={path.d}
          fill={'fill' in path && path.fill ? tint : undefined}
        />
      ))}
    </Svg>
  )
}
