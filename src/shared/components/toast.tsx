import { Pressable, Text, View } from 'react-native'
import { useTheme } from '../theme/theme-provider'
import { Icon, type IconName } from './icon'

export interface ToastProps {
  message: string
  icon?: IconName
  // "Desfazer", quando a ação permite.
  action?: string
  onAction?: () => void
}

// Confirma o resultado de uma ação: renovou, saiu da fila, desistiu (components.d.ts,
// Toast). Fica acima da navegação e some em 4s (quem mostra controla o tempo). As
// cores invertem: fundo ink e texto surface, então fica claro no tema escuro.
export function Toast({
  message,
  icon = 'check',
  action,
  onAction,
}: ToastProps) {
  const { shadows } = useTheme()
  return (
    <View
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      className="min-h-[52px] flex-row items-center gap-3 rounded-md bg-ink px-4 py-3.5"
      style={{ boxShadow: shadows.sheet }}
    >
      <Icon name={icon} size={20} color="surface" />
      <Text className="text-body-sm flex-1 text-surface">{message}</Text>
      {action ? (
        <Pressable
          accessibilityRole="button"
          className="min-h-[44px] justify-center"
          onPress={onAction}
        >
          <Text className="text-label-sm text-surface">{action}</Text>
        </Pressable>
      ) : null}
    </View>
  )
}
