import { useState, type ComponentProps, type ReactNode } from 'react'
import { Text, TextInput, View } from 'react-native'
import type { TextInputProps } from 'react-native'
import { useTheme } from '../theme/theme-provider'
import { Icon, type IconName } from './icon'

export interface TextFieldProps extends Omit<
  TextInputProps,
  'style' | 'inputMode'
> {
  label?: string
  hint?: string
  // Substitui a dica e pinta o contorno de danger.
  error?: string
  icon?: IconName
  // "password" esconde o texto digitado.
  type?: 'text' | 'password'
  inputMode?: 'text' | 'numeric'
  // Nó à direita, ex.: botão de mostrar senha.
  trailing?: ReactNode
  ref?: ComponentProps<typeof TextInput>['ref']
}

// Campo de texto com rótulo, dica e erro (components.d.ts, TextField).
export function TextField({
  label,
  hint,
  error,
  icon,
  type = 'text',
  inputMode,
  trailing,
  onFocus,
  onBlur,
  ref,
  ...rest
}: TextFieldProps) {
  const { colors } = useTheme()
  const [focused, setFocused] = useState(false)

  const borderClass = error
    ? 'border-danger'
    : focused
      ? 'border-brand'
      : 'border-line-strong'

  return (
    <View className="gap-1.5">
      {label ? (
        <Text className="text-caption-strong text-ink">{label}</Text>
      ) : null}
      <View
        className={`min-h-[52px] flex-row items-center gap-2 rounded-md border-[1.5px] bg-surface-raised px-3 ${borderClass}`}
        style={
          focused && !error
            ? { boxShadow: `0 0 0 3px ${colors.brandSoft}` }
            : undefined
        }
      >
        {icon ? <Icon name={icon} color="inkMuted" /> : null}
        <TextInput
          ref={ref}
          className="min-w-0 flex-1 p-0 text-body-lg text-ink"
          placeholderTextColor={colors.inkFaint}
          secureTextEntry={type === 'password'}
          inputMode={inputMode}
          accessibilityLabel={label}
          aria-invalid={Boolean(error)}
          onFocus={(event) => {
            setFocused(true)
            onFocus?.(event)
          }}
          onBlur={(event) => {
            setFocused(false)
            onBlur?.(event)
          }}
          {...rest}
        />
        {trailing}
      </View>
      {error || hint ? (
        <View className="flex-row items-center gap-1">
          {error ? <Icon name="alert" size={14} color="danger" /> : null}
          <Text
            className={`flex-1 text-caption ${error ? 'text-danger' : 'text-ink-muted'}`}
          >
            {error ?? hint}
          </Text>
        </View>
      ) : null}
    </View>
  )
}
