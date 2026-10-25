import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import type { ColorToken } from '../theme/tokens.generated'
import { Icon, type IconName } from './icon'

export type Tone = 'info' | 'success' | 'warning' | 'danger' | 'neutral'

interface ToneStyle {
  background: string
  color: ColorToken
}

// Fundo e cor do ícone de cada tom (Info, Aviso, Perigo, Sucesso e Neutro).
export const TONE_STYLE: Record<Tone, ToneStyle> = {
  info: { background: 'bg-brand-soft', color: 'brandStrong' },
  warning: { background: 'bg-warning-soft', color: 'warning' },
  danger: { background: 'bg-danger-soft', color: 'danger' },
  success: { background: 'bg-success-soft', color: 'success' },
  neutral: { background: 'bg-neutral-soft', color: 'neutralInk' },
}

export interface StatTileProps {
  icon?: IconName
  value: ReactNode
  label: string
  tone?: Tone
}

// Número do dia no Painel do bibliotecário (components.d.ts, StatTile; RF-BAL-01).
export function StatTile({
  icon = 'inbox',
  value,
  label,
  tone = 'info',
}: StatTileProps) {
  const style = TONE_STYLE[tone]
  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${typeof value === 'string' || typeof value === 'number' ? value : ''}`}
      className="flex-1 gap-2 rounded-lg border border-line bg-surface-raised p-4"
    >
      <View
        className={`size-[36px] items-center justify-center rounded-md ${style.background}`}
      >
        <Icon name={icon} size={20} color={style.color} />
      </View>
      <Text className="text-number text-ink">{value}</Text>
      <Text className="text-caption text-ink-muted">{label}</Text>
    </View>
  )
}
