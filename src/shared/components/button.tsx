import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import type { PressableProps } from 'react-native'
import { useTheme } from '../theme/theme-provider'
import type { ColorToken } from '../theme/tokens.generated'
import { Icon, type IconName } from './icon'

export type ButtonVariant =
  'primary' | 'secondary' | 'tonal' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends Omit<
  PressableProps,
  'children' | 'style'
> {
  variant?: ButtonVariant
  size?: ButtonSize
  // Largura total (use no rodapé da tela).
  block?: boolean
  icon?: IconName
  iconRight?: IconName
  loading?: boolean
  children: string
}

// Classes de fundo e contorno por variante (o texto vem de TEXT_CLASS).
const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: 'border-transparent bg-brand active:bg-brand-strong',
  secondary: 'bg-surface-raised border-brand',
  tonal: 'border-transparent bg-brand-soft',
  ghost: 'border-transparent bg-transparent',
  danger: 'bg-surface-raised border-danger',
}
const DISABLED_CLASS = 'border-transparent bg-surface-sunken'

const TEXT_CLASS: Record<ButtonVariant, string> = {
  primary: 'text-on-brand',
  secondary: 'text-brand',
  tonal: 'text-brand-strong',
  ghost: 'text-brand',
  danger: 'text-danger',
}
const DISABLED_TEXT_CLASS = 'text-ink-faint'

const ICON_COLOR: Record<ButtonVariant, ColorToken> = {
  primary: 'onBrand',
  secondary: 'brand',
  tonal: 'brandStrong',
  ghost: 'brand',
  danger: 'danger',
}

// Altura mínima de 48px (toque); o pequeno tem 36px e o raio menor.
const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'min-h-[36px] px-3 rounded-sm',
  md: 'min-h-12 px-5 rounded-md',
  lg: 'min-h-[56px] px-5 rounded-md',
}
const TEXT_SIZE_CLASS: Record<ButtonSize, string> = {
  sm: 'text-label-sm',
  md: 'text-label',
  lg: 'text-label-lg',
}

// Botão do design system. Um único `primary` por tela: a ação que avança o fluxo.
export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  icon,
  iconRight,
  loading = false,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme()
  const inactive = Boolean(disabled) || loading
  const iconColor: ColorToken = disabled ? 'inkFaint' : ICON_COLOR[variant]
  const iconSize = size === 'sm' ? 16 : 20

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      className={`flex-row items-center justify-center gap-2 border-[1.5px] ${SIZE_CLASS[size]} ${
        disabled ? DISABLED_CLASS : VARIANT_CLASS[variant]
      } ${block ? 'w-full' : 'self-start'}`}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors[iconColor]} />
      ) : icon ? (
        <Icon name={icon} size={iconSize} color={iconColor} />
      ) : null}
      <Text
        className={`${TEXT_SIZE_CLASS[size]} ${
          disabled ? DISABLED_TEXT_CLASS : TEXT_CLASS[variant]
        }`}
      >
        {children}
      </Text>
      {iconRight ? (
        <View>
          <Icon name={iconRight} size={18} color={iconColor} />
        </View>
      ) : null}
    </Pressable>
  )
}
