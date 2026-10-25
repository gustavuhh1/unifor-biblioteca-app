import { Pressable, View } from 'react-native'

export interface ToggleProps {
  value: boolean
  onValueChange?: (value: boolean) => void
  label: string
  disabled?: boolean
}

// Controle de liga/desliga com área de toque acessível.
export function Toggle({ value, onValueChange, label, disabled = false }: ToggleProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange?.(!value)}
      className={`h-8 w-[52px] justify-center rounded-pill px-1 ${
        value ? 'bg-brand' : 'bg-line-strong'
      } ${disabled ? 'opacity-70' : ''}`}
    >
      <View
        className={`size-6 rounded-pill bg-surface-raised ${
          value ? 'self-end' : 'self-start'
        }`}
      />
    </Pressable>
  )
}
