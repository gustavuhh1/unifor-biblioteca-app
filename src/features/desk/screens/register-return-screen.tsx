import { useState } from 'react'
import { ScrollView, Switch, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AppBar, Button, Icon, FineCard } from '@/shared/components'
import { CapaLivro } from '@/shared/components/livro'
import { ConfirmationSheet } from '@/shared/components/confirmation-sheet'
import { useTheme } from '@/shared/theme/theme-provider'
export interface DevolucaoProps {
  multaPagaInicial?: boolean
  onVoltar?: () => void
  onConcluido?: () => void
}
export function RegisterReturnScreen({
  multaPagaInicial = false,
  onVoltar,
  onConcluido,
}: DevolucaoProps) {
  const safe = useSafeAreaInsets()
  const { colors } = useTheme()
  const [confirmar, setConfirmar] = useState(false)
  const [multaPaga, setMultaPaga] = useState(multaPagaInicial)
  const [registrado, setRegistrado] = useState(false)
  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Registrar devolução" back onBack={onVoltar} />
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}
      >
        <View className="flex-row gap-3 rounded-lg border border-line bg-surface-raised p-4">
          <CapaLivro nome="Cálculo, Vol. 1" cor="cover5" largura={56} />
          <View className="min-w-0 flex-1 gap-2">
            <Text className="text-book-title text-ink">Cálculo, Vol. 1</Text>
            <Text className="text-caption text-ink-muted">
              Com Marina Castro · 2513320
            </Text>
            <Text className="text-caption text-ink-muted">
              Retirado 26/09 · venceu 10/10
            </Text>
          </View>
        </View>
        <FineCard
          amount="R$ 6,00"
          daysLate={3}
          book="Cálculo, Vol. 1 · venceu em 10/10"
          note="Cobrar no balcão ao registrar a devolução"
          showPayment={false}
        />
        <View className="flex-row items-center gap-3 rounded-lg border border-line bg-surface-raised p-4">
          <View className="flex-1 gap-1">
            <Text className="text-label text-ink">
              Multa paga agora (R$ 6,00)
            </Text>
            <Text className="text-caption text-ink-muted">
              Pagamento só presencial. Marque depois de receber.
            </Text>
          </View>
          <Switch
            accessibilityLabel="Multa paga agora"
            value={multaPaga}
            onValueChange={setMultaPaga}
            trackColor={{ true: colors.brand }}
          />
        </View>
        <View className="gap-3 rounded-lg bg-brand-soft p-4">
          <View className="flex-row gap-2">
            <Icon name="users" color="brand" />
            <Text className="text-label text-brand">
              2 alunos na fila deste livro
            </Text>
          </View>
          <Text className="text-body text-ink-muted">
            Ao registrar, Rafael Teixeira (1º da fila) é avisado na hora e tem
            24h para confirmar. O bloqueio de Marina para novos empréstimos
            termina com esta devolução.
          </Text>
        </View>
        {registrado ? (
          <Text
            accessibilityLiveRegion="polite"
            className="text-label text-success"
          >
            Devolução registrada apenas nesta simulação.
          </Text>
        ) : null}
      </ScrollView>
      <View
        className="gap-2 border-t border-line bg-surface-raised px-4 pt-3"
        style={{ paddingBottom: Math.max(safe.bottom, 16) }}
      >
        <Button
          block
          icon="check"
          disabled={registrado}
          onPress={() => setConfirmar(true)}
        >
          Registrar devolução
        </Button>
        <Button block variant="ghost" onPress={onVoltar}>
          Cancelar
        </Button>
      </View>
      <ConfirmationSheet
        visible={confirmar}
        title="Confirmar devolução?"
        description={
          multaPaga
            ? 'Demonstração: registrar devolução e pagamento presencial da multa de R$ 6,00.'
            : 'Demonstração: registrar devolução mantendo a multa de R$ 6,00 em aberto.'
        }
        onCancel={() => setConfirmar(false)}
        onConfirm={() => {
          setConfirmar(false)
          setRegistrado(true)
          onConcluido?.()
        }}
      />
    </View>
  )
}
