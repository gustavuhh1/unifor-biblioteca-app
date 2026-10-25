import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import { Icon, type IconName } from './icon'

export interface EmptyStateProps {
  icon?: IconName
  title: string
  text?: string
  // Normalmente um Button com a saída mais útil (ex.: "Explorar acervo").
  action?: ReactNode
}

// Lista vazia ou tela sem resultado (components.d.ts, EmptyState): diz o que
// aconteceu e oferece o próximo passo.
export function EmptyState({
  icon = 'books',
  title,
  text,
  action,
}: EmptyStateProps) {
  return (
    <View className="items-center gap-2 px-6 py-8">
      <View className="size-[72px] items-center justify-center rounded-lg bg-brand-soft">
        <Icon name={icon} size={34} color="brandStrong" />
      </View>
      <Text
        accessibilityRole="header"
        className="text-title text-center text-ink"
      >
        {title}
      </Text>
      {text ? (
        <Text className="text-body text-center text-ink-muted">{text}</Text>
      ) : null}
      {action ? <View className="pt-2">{action}</View> : null}
    </View>
  )
}
