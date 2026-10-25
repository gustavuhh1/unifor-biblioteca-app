import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AppBar, BottomSheet, Button, Icon } from '@/shared/components'
import { useTheme } from '@/shared/theme/theme-provider'

function isFinderCell(x: number, y: number, left: number, top: number) {
  const dx = x - left
  const dy = y - top
  if (dx < 0 || dx > 6 || dy < 0 || dy > 6) return false
  return (
    dx === 0 ||
    dx === 6 ||
    dy === 0 ||
    dy === 6 ||
    (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4)
  )
}

function QrPattern({ ink, paper }: { ink: string; paper: string }) {
  const cells: boolean[] = []
  for (let y = 0; y < 21; y += 1) {
    for (let x = 0; x < 21; x += 1) {
      const finder =
        isFinderCell(x, y, 0, 0) ||
        isFinderCell(x, y, 14, 0) ||
        isFinderCell(x, y, 0, 14)
      cells.push(finder || (x * 17 + y * 31 + x * y * 7) % 11 < 5)
    }
  }
  return (
    <View
      className="flex-row flex-wrap bg-qr-paper p-1"
      style={{ width: 176, height: 176 }}
    >
      {cells.map((filled, index) => (
        <View
          key={index}
          style={{ width: 8, height: 8, backgroundColor: filled ? ink : paper }}
        />
      ))}
    </View>
  )
}

export function WithdrawalScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  if (cancelled)
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-surface px-8">
        <View className="size-16 items-center justify-center rounded-lg bg-success-soft">
          <Icon name="check" size={28} color="success" />
        </View>
        <Text className="text-center text-title text-ink">
          Pedido cancelado
        </Text>
        <Button onPress={() => router.back()}>Voltar</Button>
      </View>
    )

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Retirada" back onBack={() => router.back()} />
      <ScrollView
        contentContainerClassName="gap-4 px-4 pb-8 pt-3"
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }}
      >
        <View className="flex-row items-start gap-3 rounded-md bg-success-soft p-4">
          <Icon name="check" size={20} color="success" />
          <View className="flex-1 gap-1">
            <Text className="text-label text-ink">Pedido confirmado</Text>
            <Text className="text-body-sm text-ink-muted">
              Mostre este QR no balcão da biblioteca. O empréstimo de 14 dias
              começa quando você pegar o livro.
            </Text>
          </View>
        </View>
        <View className="overflow-hidden rounded-lg border border-line bg-surface-raised">
          <View className="flex-row items-center justify-between bg-brand px-4 py-3">
            <Text className="text-overline text-on-brand">
              RETIRADA NO BALCÃO
            </Text>
            <View className="flex-row items-center gap-1 rounded-pill bg-brand-soft px-2 py-1">
              <Icon name="qr" size={14} color="brandStrong" />
              <Text className="text-caption-strong text-ink">
                até seg, 19/10
              </Text>
            </View>
          </View>
          <View className="items-center gap-2 py-6">
            <QrPattern ink={colors.qrInk} paper={colors.qrPaper} />
            <Text
              className="text-title-lg text-ink"
              style={{ letterSpacing: 3 }}
            >
              RET-4821
            </Text>
            <Text className="text-body-sm text-ink-muted">Código Limpo</Text>
          </View>
        </View>
        <Button
          block
          variant="danger"
          icon="x"
          onPress={() => setConfirmCancel(true)}
        >
          Cancelar pedido
        </Button>
      </ScrollView>
      <BottomSheet
        visible={confirmCancel}
        title="Cancelar o pedido de Código Limpo?"
        description="O exemplar volta para a estante ou segue para o próximo da fila. Você pode pedir de novo depois."
        onClose={() => setConfirmCancel(false)}
      >
        <Button
          block
          variant="danger"
          icon="x"
          onPress={() => {
            setConfirmCancel(false)
            setCancelled(true)
          }}
        >
          Cancelar pedido
        </Button>
        <Button block variant="ghost" onPress={() => setConfirmCancel(false)}>
          Manter pedido
        </Button>
      </BottomSheet>
    </View>
  )
}
