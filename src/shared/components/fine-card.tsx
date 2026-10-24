import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import { useTheme } from '../theme/theme-provider'
import { Icon } from './icon'

export interface FineCardProps {
  // Valor já formatado: "R$ 6,00" (o dinheiro vem em centavos da API).
  amount?: string
  daysLate: number
  // Valor do dia útil: "R$ 2,00".
  rate?: string
  // "Cálculo, Vol. 1 · venceu em 11/10".
  book?: string
  // Texto de apoio do cartão no lugar do livro, quando houver.
  note?: string
  label?: string
  // O aviso fixo de pagamento só presencial (README do DS). No bibliotecário fica oculto.
  showPayment?: boolean
  action?: ReactNode
}

// "3 dias úteis" ou "1 dia útil".
function daysText(days: number): string {
  return `${days} ${days === 1 ? 'dia útil' : 'dias úteis'}`
}

// Multa por atraso: dias úteis × valor do dia (components.d.ts, FineCard;
// RF-MUL-01). O app não recebe pagamento: a multa se paga só no balcão (RF-MUL-03).
export function FineCard({
  amount = 'R$ 0,00',
  daysLate,
  rate = 'R$ 2,00',
  book,
  note,
  label = 'Multa acumulada',
  showPayment = true,
  action,
}: FineCardProps) {
  const { shadows } = useTheme()
  return (
    <View
      className="gap-3 rounded-lg border-[1.5px] border-danger bg-surface-raised p-4"
      style={{ boxShadow: shadows.card }}
    >
      <View className="flex-row items-start justify-between gap-2">
        <View className="gap-0.5">
          <Text className="text-overline text-ink-muted">{label}</Text>
          <Text className="text-number text-danger">{amount}</Text>
        </View>
        <View className="min-h-6 flex-row items-center gap-1 rounded-sm bg-danger-soft pl-1.5 pr-2">
          <Icon name="alert" size={14} color="danger" />
          <Text className="text-overline text-danger">
            {daysLate} {daysLate === 1 ? 'dia' : 'dias'}
          </Text>
        </View>
      </View>
      {(note ?? book) ? (
        <Text className="text-caption text-ink-muted">{note ?? book}</Text>
      ) : null}
      <View className="h-px bg-line" />
      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-caption text-ink">
          {daysText(daysLate)} × {rate}
        </Text>
        <Text className="text-caption text-ink-muted">{rate} por dia útil</Text>
      </View>
      {showPayment ? (
        <View className="flex-row items-center gap-2 rounded-md bg-surface-sunken px-3 py-2.5">
          <Icon name="mapPin" size={16} />
          <Text className="text-caption-strong flex-1 text-ink">
            Pagamento só presencial, no balcão da biblioteca. O app não recebe
            pagamentos.
          </Text>
        </View>
      ) : null}
      {action}
    </View>
  )
}
