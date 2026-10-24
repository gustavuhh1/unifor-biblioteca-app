import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import type { ColorToken } from '../theme/tokens.generated'
import { Icon } from './icon'

export type DeadlineKind =
  'confirmar' | 'retirar' | 'devolver' | 'vence' | 'atrasado' | 'ok' | 'neutro'

interface DeadlineStyle {
  background: string
  text: string
  color: ColorToken
}

// Tom de cada prazo: Warning = confirmar (24h) ou vence logo; Info = retirar e
// devolver; Danger = atrasado (descrição do componente no Figma).
const KIND_STYLE: Record<DeadlineKind, DeadlineStyle> = {
  confirmar: {
    background: 'bg-warning-soft',
    text: 'text-warning',
    color: 'warning',
  },
  vence: {
    background: 'bg-warning-soft',
    text: 'text-warning',
    color: 'warning',
  },
  retirar: {
    background: 'bg-brand-soft',
    text: 'text-brand-strong',
    color: 'brandStrong',
  },
  devolver: {
    background: 'bg-brand-soft',
    text: 'text-brand-strong',
    color: 'brandStrong',
  },
  atrasado: {
    background: 'bg-danger-soft',
    text: 'text-danger',
    color: 'danger',
  },
  ok: { background: 'bg-success-soft', text: 'text-success', color: 'success' },
  neutro: {
    background: 'bg-neutral-soft',
    text: 'text-neutral-ink',
    color: 'neutralInk',
  },
}

export interface DeadlineChipProps {
  kind: DeadlineKind
  // O prazo por extenso e concreto: "Retire até seg, 19/10".
  children: ReactNode
}

// Prazo em destaque num cartão (components.d.ts, DeadlineChip).
export function DeadlineChip({ kind, children }: DeadlineChipProps) {
  const style = KIND_STYLE[kind]
  return (
    <View
      className={`min-h-[30px] flex-row items-center gap-1.5 self-start rounded-pill pl-2.5 pr-3 ${style.background}`}
    >
      <Icon name="calendar" size={16} color={style.color} />
      <Text className={`text-caption ${style.text}`}>{children}</Text>
    </View>
  )
}
