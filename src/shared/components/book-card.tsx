import type { ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'
import type { PressableProps } from 'react-native'
import { useTheme } from '../theme/theme-provider'
import { BookCover, type CoverTone } from './book-cover'
import { StatusBadge, type Status } from './status-badge'

export interface BookCardProps extends Omit<
  PressableProps,
  'children' | 'style'
> {
  title: string
  author: string
  year?: number
  tone?: CoverTone
  status?: Status
  statusLabel?: string
  // Linha de apoio abaixo do autor (ex.: "3 pessoas na fila").
  meta?: ReactNode
  // Ação do cartão (ex.: um Button pequeno).
  action?: ReactNode
  layout?: 'row' | 'grid'
}

// Livro na lista do Acervo (components.d.ts, BookCard). O toque abre a página do
// livro: a decisão (solicitar ou entrar na fila) acontece lá.
export function BookCard({
  title,
  author,
  year,
  tone,
  status,
  statusLabel,
  meta,
  action,
  layout = 'row',
  ...rest
}: BookCardProps) {
  const { shadows } = useTheme()
  const byline = year ? `${author} · ${year}` : author
  const accessibilityLabel = `${title}, de ${author}`

  if (layout === 'grid') {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        className="w-[148px] gap-2"
        {...rest}
      >
        <BookCover title={title} author={author} tone={tone} size="lg" />
        <Text className="text-book-title-sm text-ink" numberOfLines={3}>
          {title}
        </Text>
        <Text className="text-caption text-ink-muted" numberOfLines={2}>
          {byline}
        </Text>
        {status ? <StatusBadge status={status} label={statusLabel} /> : null}
      </Pressable>
    )
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      className="flex-row gap-3 rounded-lg border border-line bg-surface-raised p-3"
      style={{ boxShadow: shadows.card }}
      {...rest}
    >
      {/* No cartão em linha a capa só leva o título (Figma, A09). */}
      <BookCover title={title} tone={tone} size="md" />
      <View className="min-w-0 flex-1 gap-1">
        <Text className="text-book-title text-ink" numberOfLines={3}>
          {title}
        </Text>
        <Text className="text-caption text-ink-muted" numberOfLines={1}>
          {byline}
        </Text>
        {typeof meta === 'string' ? (
          <Text className="text-caption text-ink-muted">{meta}</Text>
        ) : (
          meta
        )}
        <View className="flex-1" />
        {status ? <StatusBadge status={status} label={statusLabel} /> : null}
        {action}
      </View>
    </Pressable>
  )
}
