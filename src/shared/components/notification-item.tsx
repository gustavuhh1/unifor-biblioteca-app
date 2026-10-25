import type { ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'
import type { PressableProps } from 'react-native'
import { Icon, type IconName } from './icon'
import { TONE_STYLE, type Tone } from './stat-tile'

export interface NotificationItemProps extends Omit<
  PressableProps,
  'children' | 'style'
> {
  title: string
  text?: string
  // "09:12" ou "ontem".
  time?: string
  icon?: IconName
  tone?: Tone
  // Aviso ainda não lido: um ponto azul ao lado do horário.
  unread?: boolean
  // Botões abaixo do texto (ex.: Confirmar retirada).
  actions?: ReactNode
}

// Um aviso da lista de Notificações (components.d.ts, NotificationItem; RF-AVI-01).
export function NotificationItem({
  title,
  text,
  time,
  icon = 'users',
  tone = 'info',
  unread = false,
  actions,
  ...rest
}: NotificationItemProps) {
  const style = TONE_STYLE[tone]
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${unread ? 'Não lido. ' : ''}${title}`}
      className="flex-row items-start gap-3 bg-surface-raised px-4 py-3"
      {...rest}
    >
      <View
        className={`size-[40px] items-center justify-center rounded-md ${style.background}`}
      >
        <Icon name={icon} size={20} color={style.color} />
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-label text-ink">{title}</Text>
        {text ? (
          <Text className="text-body-sm text-ink-muted">{text}</Text>
        ) : null}
        {actions ? (
          <View className="flex-row gap-2 pt-2">{actions}</View>
        ) : null}
      </View>
      <View className="items-end gap-1.5">
        {time ? (
          <Text className="text-caption text-ink-muted">{time}</Text>
        ) : null}
        {unread ? <View className="size-2 rounded-pill bg-brand" /> : null}
      </View>
    </Pressable>
  )
}
