import { useState } from 'react'
import { Switch, Text, View } from 'react-native'
import TelaBase from '@/shared/components/tela-base'
import { Icon } from '@/shared/components'
import { useTheme } from '@/shared/theme/theme-provider'

const preferencias = [
  { title: 'Sua vez na fila', detail: 'Você tem 24h para confirmar, então este aviso não desliga.', locked: true },
  { title: 'Atraso e multa', detail: 'Avisamos no 1º dia útil de atraso.', locked: true },
  { title: 'Pedido pronto para retirar', detail: 'Quando o livro estiver separado no balcão.' },
  { title: 'Lembrete de devolução', detail: '2 dias antes e no dia do prazo.' },
  { title: 'Retirada acabando', detail: '1 dia antes de o pedido expirar.' },
  { title: 'Notificação no celular', detail: 'Só no Android. Precisa estar permitida nos ajustes do celular.' },
  { title: 'E-mail institucional', detail: 'O do seu cadastro: lucas.almeida@edu.unifor.br' },
]
export function NotificationSettingsScreen({ onVoltar }: { onVoltar?: () => void }) {
  const { colors } = useTheme()
  const [values, setValues] = useState<Record<string, boolean>>({})
  return <TelaBase titulo="Avisos e lembretes" interna onVoltar={onVoltar}>
    {['Prazos e fila', 'Onde receber'].map((section, index) => <View key={section} className="gap-3"><Text className="text-overline text-ink-muted">{section}</Text><View className="overflow-hidden rounded-lg border border-line bg-surface-raised">{preferencias.slice(index ? 5 : 0, index ? 7 : 5).map(item => <View key={item.title} className="min-h-18 flex-row items-center gap-3 border-b border-line p-4"><View className="flex-1 gap-1"><Text className="text-label text-ink">{item.title}</Text><Text className="text-caption text-ink-muted">{item.detail}</Text></View>{item.locked ? <View className="flex-row items-center gap-1"><Icon name="lock" size={14} color="inkMuted" /><Text className="text-caption text-ink-muted">Sempre</Text></View> : <Switch accessibilityLabel={item.title} value={values[item.title] ?? true} onValueChange={value => setValues(current => ({ ...current, [item.title]: value }))} trackColor={{ true: colors.brand, false: colors.lineStrong }} />}</View>)}</View></View>)}
    <Text className="text-caption text-ink-muted">Preferências demonstrativas. Nenhuma permissão ou assinatura de notificação real será alterada.</Text>
  </TelaBase>
}
