import { useState, type ReactNode } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { AppBar, Icon, Toggle } from '@/shared/components'

type Preference =
  'pickupReady' | 'dueReminder' | 'pickupExpiring' | 'push' | 'email'

const INITIAL_PREFERENCES: Record<Preference, boolean> = {
  pickupReady: true,
  dueReminder: true,
  pickupExpiring: true,
  push: true,
  email: true,
}

interface SettingRowProps {
  title: string
  description: string
  value?: boolean
  locked?: boolean
  onToggle?: () => void
  last?: boolean
}

function SettingRow({
  title,
  description,
  value,
  locked,
  onToggle,
  last,
}: SettingRowProps) {
  return (
    <View
      className={`min-h-[72px] flex-row items-center gap-3 py-3 ${last ? '' : 'border-b border-line'}`}
    >
      <View className="min-w-0 flex-1 gap-1">
        <Text className="text-label text-ink">{title}</Text>
        <Text className="text-body-sm text-ink-muted">{description}</Text>
      </View>
      {locked ? (
        <View className="flex-row items-center gap-1.5 pl-2">
          <Icon name="lock" size={16} color="inkMuted" />
          <Text className="text-label-sm text-ink-muted">Sempre</Text>
        </View>
      ) : (
        <Toggle label={title} value={Boolean(value)} onValueChange={onToggle} />
      )}
    </View>
  )
}

function SettingsGroup({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <View className="gap-3">
      <Text className="text-overline text-ink-muted">{title}</Text>
      <View className="rounded-lg border border-line bg-surface-raised px-4">
        {children}
      </View>
    </View>
  )
}

// Tela A51. Estado local apenas para a demonstração visual; preferências serão ligadas à API.
export function NotificationSettingsScreen() {
  const [preferences, setPreferences] = useState(INITIAL_PREFERENCES)
  const toggle = (key: Preference) =>
    setPreferences((current) => ({ ...current, [key]: !current[key] }))

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Avisos e lembretes" back />
      <ScrollView contentContainerClassName="gap-6 px-4 pb-8 pt-4">
        <SettingsGroup title="Prazos e fila">
          <SettingRow
            title="Sua vez na fila"
            description="Você tem 24h para confirmar, então este aviso não desliga."
            locked
          />
          <SettingRow
            title="Atraso e multa"
            description="Avisamos no 1º dia útil de atraso."
            locked
          />
          <SettingRow
            title="Pedido pronto para retirar"
            description="Quando o livro estiver separado no balcão."
            value={preferences.pickupReady}
            onToggle={() => toggle('pickupReady')}
          />
          <SettingRow
            title="Lembrete de devolução"
            description="2 dias antes e no dia do prazo."
            value={preferences.dueReminder}
            onToggle={() => toggle('dueReminder')}
          />
          <SettingRow
            title="Retirada acabando"
            description="1 dia antes de o pedido expirar."
            value={preferences.pickupExpiring}
            onToggle={() => toggle('pickupExpiring')}
            last
          />
        </SettingsGroup>

        <SettingsGroup title="Onde receber">
          <SettingRow
            title="Notificação no celular"
            description="Só no Android. Precisa estar permitida nos ajustes do celular."
            value={preferences.push}
            onToggle={() => toggle('push')}
          />
          <SettingRow
            title="E-mail institucional"
            description="Do seu cadastro: lucas.almeida@edu.unifor.br"
            value={preferences.email}
            onToggle={() => toggle('email')}
            last
          />
        </SettingsGroup>
      </ScrollView>
    </View>
  )
}
