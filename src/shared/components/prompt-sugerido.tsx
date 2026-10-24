import { Pressable, Text, View } from 'react-native'
import type { PressableProps } from 'react-native'
import { Icon } from './icon'

export interface PromptSugeridoProps extends Omit<
  PressableProps,
  'children' | 'style'
> {
  // A pergunta pronta, montada com o termo da busca. O toque envia e abre o chat.
  text: string
  label?: string
}

// Pergunta pronta para o Assistente (components.d.ts, PromptSugerido), usada abaixo
// da busca sem resultado (RF-ACE-06).
export function PromptSugerido({
  text,
  label = 'Pergunta pronta',
  ...rest
}: PromptSugeridoProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Perguntar ao Assistente: ${text}`}
      className="flex-row items-center gap-3 rounded-lg bg-brand-soft p-4"
      {...rest}
    >
      <Icon name="sparkle" size={20} color="brandStrong" />
      <View className="min-w-0 flex-1 gap-0.5">
        <Text className="text-micro-strong text-brand-strong">{label}</Text>
        <Text className="text-body-sm text-ink">{text}</Text>
      </View>
      <View className="size-[36px] items-center justify-center rounded-pill bg-brand">
        <Icon name="send" size={18} color="onBrand" />
      </View>
    </Pressable>
  )
}
