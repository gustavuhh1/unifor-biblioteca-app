import type { ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'
import type { PressableProps } from 'react-native'
import { useTheme } from '../theme/theme-provider'
import { BookCover, type CoverTone } from './book-cover'
import { Icon } from './icon'
import { StatusBadge, type Status } from './status-badge'

export interface LoanCardProps extends Omit<
  PressableProps,
  'children' | 'style'
> {
  title: string
  author: string
  tone?: CoverTone
  status?: Status
  statusLabel?: string
  // Quanto do prazo já passou, de 0 a 1.
  progress?: number
  // "Retirado 10/10".
  startLabel?: string
  // "Devolver até 24/10": o prazo sempre concreto, nunca "em breve".
  dueLabel?: string
  // Prazo em destaque (DeadlineChip), quando o cartão é de um pedido.
  deadline?: ReactNode
  // A renovação está bloqueada: mostra o motivo no lugar do botão (RF-EMP-10).
  renewBlocked?: boolean
  renewReason?: string
  // Botões do cartão (Renovar, Ver multa...).
  actions?: ReactNode
}

// Cor do trilho de progresso: o status define o tom (README do DS, Cor).
function progressClass(status?: Status): string {
  if (status === 'atrasado') return 'bg-danger'
  if (status === 'vence') return 'bg-warning'
  return 'bg-brand'
}

// Empréstimo ou pedido em Meus empréstimos (components.d.ts, LoanCard).
export function LoanCard({
  title,
  author,
  tone,
  status,
  statusLabel,
  progress,
  startLabel,
  dueLabel,
  deadline,
  renewBlocked = false,
  renewReason,
  actions,
  ...rest
}: LoanCardProps) {
  const { shadows } = useTheme()
  const overdue = status === 'atrasado'
  const percent = Math.round(Math.min(1, Math.max(0, progress ?? 0)) * 100)

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}, de ${author}`}
      className={`gap-3 rounded-lg bg-surface-raised p-4 ${
        overdue ? 'border-[1.5px] border-danger' : 'border border-line'
      }`}
      style={{ boxShadow: shadows.card }}
      {...rest}
    >
      <View className="flex-row items-start gap-3">
        <BookCover title={title} author={author} tone={tone} size="sm" />
        <View className="min-w-0 flex-1 gap-1">
          <Text className="text-book-title text-ink" numberOfLines={2}>
            {title}
          </Text>
          <Text className="text-caption text-ink-muted" numberOfLines={1}>
            {author}
          </Text>
          {status ? <StatusBadge status={status} label={statusLabel} /> : null}
        </View>
      </View>
      {deadline}
      {progress !== undefined ? (
        <View
          accessible
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: percent }}
          className="h-1.5 overflow-hidden rounded-pill bg-surface-sunken"
        >
          <View
            className={`h-1.5 rounded-[3px] ${progressClass(status)}`}
            style={{ width: `${percent}%` }}
          />
        </View>
      ) : null}
      {startLabel || dueLabel ? (
        <View className="flex-row items-center justify-between gap-2">
          <Text className="text-caption text-ink-muted">{startLabel}</Text>
          <Text className="text-caption-strong text-ink">{dueLabel}</Text>
        </View>
      ) : null}
      {renewBlocked ? (
        <View className="flex-row items-start gap-1.5">
          <Icon name="users" size={16} color="inkMuted" />
          <Text className="text-caption flex-1 text-ink-muted">
            {renewReason}
          </Text>
        </View>
      ) : null}
      {actions ? <View className="flex-row gap-2">{actions}</View> : null}
    </Pressable>
  )
}
