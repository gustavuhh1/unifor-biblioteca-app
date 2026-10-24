import type { ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Icon } from './icon'

export interface ChatBubbleProps {
  from?: 'assistant' | 'user'
  children?: ReactNode
  // "19:41".
  time?: string
  // O Assistente está escrevendo: três pontos no lugar do texto.
  typing?: boolean
  // Conteúdo extra abaixo da bolha (ex.: BookCard com sugestões).
  extra?: ReactNode
  // Perguntas prontas que o aluno toca para enviar.
  suggestions?: string[]
  onSuggestion?: (suggestion: string) => void
  // Nome acima da bolha do Assistente.
  name?: string
  showName?: boolean
}

// Bolha do chat do Assistente (components.d.ts, ChatBubble; RF-ASS-01). A do aluno
// é azul e alinhada à direita; a do Assistente, clara e à esquerda, com o nome.
export function ChatBubble({
  from = 'assistant',
  children,
  time,
  typing = false,
  extra,
  suggestions,
  onSuggestion,
  name = 'Assistente',
  showName = true,
}: ChatBubbleProps) {
  const user = from === 'user'
  return (
    <View className={`gap-1 ${user ? 'items-end' : 'items-start'}`}>
      {!user && showName ? (
        <View className="flex-row items-center gap-1.5">
          <Icon name="sparkle" size={14} color="brand" />
          <Text className="text-caption-strong text-brand">{name}</Text>
        </View>
      ) : null}
      <View
        className={`max-w-[280px] rounded-lg px-3.5 py-2.5 ${
          user
            ? 'rounded-br-[6px] bg-brand'
            : 'rounded-bl-[6px] border border-line bg-surface-raised'
        }`}
      >
        {typing ? (
          <Text
            accessibilityLabel="Escrevendo"
            className="text-body text-ink-muted"
          >
            •••
          </Text>
        ) : typeof children === 'string' ? (
          <Text className={`text-body ${user ? 'text-on-brand' : 'text-ink'}`}>
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
      {extra}
      {suggestions?.length ? (
        <View className="gap-2 self-stretch pt-1">
          {suggestions.map((suggestion) => (
            <Pressable
              key={suggestion}
              accessibilityRole="button"
              className="min-h-[44px] justify-center self-start rounded-pill border-[1.5px] border-line bg-surface-raised px-3.5"
              onPress={() => onSuggestion?.(suggestion)}
            >
              <Text className="text-label text-ink">{suggestion}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      {time ? (
        <Text className="text-caption-sm text-ink-muted">{time}</Text>
      ) : null}
    </View>
  )
}
