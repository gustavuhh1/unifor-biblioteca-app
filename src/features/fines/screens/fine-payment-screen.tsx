import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { AppBar, BottomSheet, Button, Icon } from '@/shared/components'

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="min-h-11 flex-row items-center justify-between gap-3 border-b border-line py-2.5">
      <Text className="text-body-sm text-ink-muted">{label}</Text>
      <Text className="text-label-sm text-ink" numberOfLines={1}>
        {value}
      </Text>
    </View>
  )
}

export function FinePaymentScreen() {
  const params = useLocalSearchParams<{ state?: string }>()
  const router = useRouter()
  const [confirmVisible, setConfirmVisible] = useState(
    params.state === 'confirm',
  )

  function recordPayment() {
    setConfirmVisible(false)
    router.replace('/fines?state=payment-registered')
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Multa em aberto" subtitle="Marina Castro · 2513320" back />
      <ScrollView contentContainerClassName="gap-3 px-4 pb-6 pt-2">
        <View className="min-h-[72px] flex-row items-center gap-3 rounded-lg border border-line bg-surface-raised p-4">
          <View className="size-10 items-center justify-center rounded-pill bg-brand-soft">
            <Text className="text-label-sm text-brand">MC</Text>
          </View>
          <View className="gap-1">
            <Text className="text-label text-ink">Marina Castro</Text>
            <Text className="text-caption text-ink-muted">
              2513320 · Sistemas de Informação
            </Text>
          </View>
        </View>

        <View className="gap-3 rounded-lg border-[1.5px] border-danger bg-surface-raised p-4">
          <View className="flex-row items-start justify-between gap-2">
            <View className="gap-1">
              <Text className="text-overline text-ink-muted">
                MULTA ACUMULADA
              </Text>
              <Text className="text-hero text-danger">R$ 6,00</Text>
            </View>
            <View className="flex-row items-center gap-1 rounded-sm bg-danger-soft px-2 py-1">
              <Icon name="alert" size={14} color="danger" />
              <Text className="text-micro-strong text-danger">CONGELADA</Text>
            </View>
          </View>
          <Text className="text-caption text-ink-muted">
            Cálculo, Vol. 1 · devolvido hoje, 15/10
          </Text>
          <View className="h-px bg-line" />
          <View className="flex-row justify-between gap-2">
            <Text className="text-caption-strong text-ink">
              3 dias úteis × R$ 2,00
            </Text>
            <Text className="text-caption text-ink-muted">
              R$ 2,00 por dia útil
            </Text>
          </View>
        </View>

        <View className="rounded-lg border border-line bg-surface-raised px-4">
          <InfoRow label="Venceu em" value="sáb, 10/10" />
          <InfoRow
            label="Devolução registrada"
            value="15/10, 10:42 · Ana Souza"
          />
          <InfoRow label="Situação" value="Aguardando pagamento" />
        </View>

        <View className="flex-row items-start gap-3 rounded-md bg-brand-soft p-4">
          <Icon name="info" size={20} color="brandStrong" />
          <View className="flex-1 gap-1">
            <Text className="text-label text-ink">Pagamento só no balcão</Text>
            <Text className="text-body-sm text-ink">
              O app não recebe pagamentos. Confirme só depois de receber o
              valor. O registro fica com seu nome.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View className="bg-surface px-4 pb-4 pt-2">
        <Button block icon="coin" onPress={() => setConfirmVisible(true)}>
          Registrar pagamento de R$ 6,00
        </Button>
      </View>

      <BottomSheet
        visible={confirmVisible}
        title="Recebeu R$ 6,00 de Marina?"
        description="A multa sai do app da aluna e o pagamento fica registrado com seu nome. Isso não pode ser desfeito pelo app."
        onClose={() => setConfirmVisible(false)}
      >
        <View className="rounded-lg border border-line bg-surface-raised px-4">
          <InfoRow label="Aluna" value="Marina Castro · 2513320" />
          <InfoRow label="Livro" value="Cálculo, Vol. 1" />
          <InfoRow label="Valor recebido" value="R$ 6,00" />
          <InfoRow label="Onde" value="Balcão, presencial" />
        </View>
        <Button block icon="check" onPress={recordPayment}>
          Confirmar pagamento
        </Button>
        <Button block variant="ghost" onPress={() => setConfirmVisible(false)}>
          Ainda não recebi
        </Button>
      </BottomSheet>
    </View>
  )
}
