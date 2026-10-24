import type { ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'
import type { ColorToken } from '../theme/tokens.generated'
import { Icon, type IconName } from './icon'

export type AlertTone = 'info' | 'success' | 'warning' | 'danger'

interface ToneStyle {
  background: string
  icon: IconName
  color: ColorToken
}

// Fundo, ícone padrão e cor do ícone de cada tom (Info, Sucesso, Aviso, Perigo).
const TONE_STYLE: Record<AlertTone, ToneStyle> = {
  info: { background: 'bg-brand-soft', icon: 'info', color: 'brandStrong' },
  success: {
    background: 'bg-success-soft',
    icon: 'checkCircle',
    color: 'success',
  },
  warning: { background: 'bg-warning-soft', icon: 'alert', color: 'warning' },
  danger: { background: 'bg-danger-soft', icon: 'alert', color: 'danger' },
}

export interface AlertProps {
  tone?: AlertTone
  title?: string
  // O texto do aviso: diga o que aconteceu e o que fazer depois.
  children?: ReactNode
  // Rótulo de um botão de texto no fim do aviso.
  action?: string
  onAction?: () => void
  // Troca o ícone padrão do tom.
  icon?: IconName
}

// Aviso dentro da tela (components.d.ts, Alert). O estado nunca é só a cor: sempre
// vem com ícone e palavra.
export function Alert({
  tone = 'info',
  title,
  children,
  action,
  onAction,
  icon,
}: AlertProps) {
  const style = TONE_STYLE[tone]
  return (
    <View
      accessibilityRole="alert"
      className={`flex-row items-start gap-3 rounded-md px-4 py-3 ${style.background}`}
    >
      <Icon name={icon ?? style.icon} size={20} color={style.color} />
      <View className="min-w-0 flex-1 gap-0.5">
        {title ? <Text className="text-label text-ink">{title}</Text> : null}
        {typeof children === 'string' ? (
          <Text className="text-body-sm text-ink">{children}</Text>
        ) : (
          children
        )}
        {action ? (
          <Pressable
            accessibilityRole="button"
            className="min-h-[44px] justify-center self-start"
            onPress={onAction}
          >
            <Text className="text-label text-brand">{action}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  )
}
