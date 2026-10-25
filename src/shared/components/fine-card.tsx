import { Text, View } from 'react-native'
import { Icon } from './icon'

export function FineCard({ frozen = false, librarian = false, amount = 'R$ 6,00', book = 'Cálculo, Vol. 1', days = 3 }: { frozen?: boolean; librarian?: boolean; amount?: string; book?: string; days?: number }) {
  return <View className="gap-3 rounded-lg border border-danger bg-surface-raised p-4">
    <View className="flex-row items-center justify-between gap-2"><Text className="text-overline text-ink-muted">Multa acumulada</Text><View className="rounded-sm bg-danger-soft px-2 py-1"><Text className="text-overline text-danger">{frozen ? 'Congelada' : `${days} dias úteis`}</Text></View></View>
    <Text className="text-number text-danger">{amount}</Text>
    <Text className="text-caption text-ink-muted">{book} · {frozen ? 'devolvido em 15/10' : 'venceu em 10/10'}</Text>
    <View className="flex-row justify-between gap-2 border-t border-line pt-3"><Text className="text-caption text-ink">{days} dias úteis × R$ 2,00</Text><Text className="text-caption text-ink-muted">R$ 2,00 por dia útil</Text></View>
    {!librarian ? <View className="flex-row gap-2 rounded-md bg-surface-sunken p-3"><Icon name="mapPin" color="inkMuted" size={16} /><Text className="flex-1 text-caption-strong text-ink-muted">Pagamento só presencial, no balcão da biblioteca. O app não recebe pagamentos.</Text></View> : null}
  </View>
}
