import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { BottomSheet, Button, Icon, AppBar } from '@/shared/components'

function DeviceCard({
  name,
  created,
  used,
  active,
  onRemove,
}: {
  name: string
  created: string
  used: string
  active?: boolean
  onRemove?: () => void
}) {
  return (
    <View className="min-h-[72px] flex-row items-center gap-3 rounded-lg border border-line bg-surface-raised p-4">
      <View className="size-11 items-center justify-center rounded-md bg-brand-soft">
        <Icon name="smartphone" size={20} color="brand" />
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-label-sm text-ink">{name}</Text>
        <Text className="text-caption text-ink-muted">
          Criado em {created} · usado {used}
        </Text>
      </View>
      {active ? (
        <View className="flex-row items-center gap-1 rounded-pill bg-success-soft px-2 py-1">
          <Icon name="check" size={13} color="success" />
          <Text className="text-micro-strong text-success">ATIVO</Text>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          onPress={onRemove}
          className="flex-row items-center gap-1 px-1"
        >
          <Icon name="trash" size={17} color="brand" />
          <Text className="text-label-sm text-brand">Remover</Text>
        </Pressable>
      )}
    </View>
  )
}

export function PasskeysScreen() {
  const params = useLocalSearchParams<{ state?: string }>()
  const alternateDevice = params.state === 'new-device'
  const [removeVisible, setRemoveVisible] = useState(false)
  const [hasCurrent, setHasCurrent] = useState(!alternateDevice)
  const [hasSecond, setHasSecond] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false)
  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Meus passkeys" subtitle="Entrar com biometria" back />
      <ScrollView contentContainerClassName="gap-4 px-5 pb-8 pt-3">
        <View className="flex-row items-start gap-3 rounded-md bg-brand-soft p-4">
          <Icon name="fingerprint" size={20} color="brandStrong" />
          <Text className="flex-1 text-body-sm text-ink">
            Cada passkey vale para um aparelho. Se perder um celular, remova o
            passkey dele aqui ou recupere o acesso pelo e-mail.
          </Text>
        </View>
        {hasCurrent ? (
          <DeviceCard
            name="Pixel 8 (este aparelho)"
            created="14/10"
            used="hoje"
            active
          />
        ) : null}
        {hasSecond ? (
          <DeviceCard
            name="Galaxy A54"
            created="02/09"
            used="em 11/10"
            onRemove={() => setRemoveVisible(true)}
          />
        ) : null}
        <Button block disabled={hasCurrent} onPress={() => setHasCurrent(true)}>
          Criar passkey neste aparelho
        </Button>
        <Text className="px-2 text-center text-caption text-ink-muted">
          {hasCurrent
            ? 'Este aparelho já tem um passkey. Para usar outro celular, entre no app por ele e crie o passkey em Meus passkeys.'
            : 'Este aparelho ainda não tem passkey. Crie um para entrar com a biometria, sem digitar a senha.'}
        </Text>
      </ScrollView>
      <BottomSheet
        visible={removeVisible}
        title="Remover o passkey do Galaxy A54?"
        description="Esse aparelho deixa de entrar no app com a biometria. Você pode criar outro passkey nele quando quiser."
        onClose={() => setRemoveVisible(false)}
      >
        <Button
          block
          variant="danger"
          icon="trash"
          onPress={() => {
            setRemoveVisible(false)
            setShowConfirmation(true)
          }}
        >
          Remover passkey
        </Button>
        <Button block variant="ghost" onPress={() => setRemoveVisible(false)}>
          Cancelar
        </Button>
      </BottomSheet>
      <BottomSheet
        visible={showConfirmation}
        title="Passkey removido"
        description="O passkey do Galaxy A54 foi removido desta demonstração."
        onClose={() => setShowConfirmation(false)}
      >
        <Button
          block
          onPress={() => {
            setShowConfirmation(false)
            setHasSecond(false)
          }}
        >
          Entendi
        </Button>
      </BottomSheet>
    </View>
  )
}
