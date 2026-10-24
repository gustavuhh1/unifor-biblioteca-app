import { Pressable, Text, View } from 'react-native'

export interface ToggleProps {
  checked?: boolean
  disabled?: boolean
  // Rótulo à esquerda: o Toggle sempre vem acompanhado de um.
  label?: string
  onChange?: (checked: boolean) => void
}

// Liga/desliga de 52 x 32 (components.d.ts, Toggle). O toque ocupa a linha inteira,
// com no mínimo 44px de altura.
export function Toggle({
  checked = false,
  disabled = false,
  label,
  onChange,
}: ToggleProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked, disabled }}
      className="min-h-[44px] flex-row items-center justify-between gap-3"
      disabled={disabled}
      onPress={() => onChange?.(!checked)}
    >
      {label ? (
        <Text
          className={`text-label flex-1 ${disabled ? 'text-ink-faint' : 'text-ink'}`}
        >
          {label}
        </Text>
      ) : null}
      <View
        className={`h-8 w-[52px] justify-center rounded-pill px-1 ${
          checked && !disabled ? 'bg-brand' : 'bg-line-strong'
        } ${disabled ? 'opacity-50' : ''}`}
      >
        <View
          className={`size-6 rounded-pill ${
            checked ? 'ml-auto bg-on-brand' : 'bg-surface-raised'
          }`}
        />
      </View>
    </Pressable>
  )
}
