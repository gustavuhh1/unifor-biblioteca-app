import { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { currentDeviceName } from '@/features/auth/auth.passkey'
import { getAuthErrorMessage } from '@/features/auth/auth.errors'
import type { PasskeySummary } from '@/features/auth/auth.types'
import { useCreatePasskey } from '@/features/auth/hooks/use-create-passkey'
import {
  usePasskeys,
  useRemovePasskey,
} from '@/features/auth/hooks/use-passkeys'
import { ApiError } from '@/shared/api/errors'
import { Alert, AppBar, Button, EmptyState, Icon } from '@/shared/components'
import { ConfirmationSheet } from '@/shared/components/confirmation-sheet'
import { useTheme } from '@/shared/theme/theme-provider'
import { formatDate } from '@/shared/utils/dates'

// "Criado em 14/10/2026 · usado em 20/10/2026" (ou "ainda sem uso").
function passkeyDates(passkey: PasskeySummary): string {
  const created = `Criado em ${formatDate(passkey.createdAt)}`
  return passkey.lastUsedAt
    ? `${created} · usado em ${formatDate(passkey.lastUsedAt)}`
    : `${created} · ainda sem uso`
}

// Meus passkeys (A73, A74 e A80; RF-AUT-09 e RF-AUT-10): lista os aparelhos
// (GET /auth/passkeys), cria um passkey neste aparelho (POST /auth/passkeys e
// /auth/passkey/register) e remove um deles com confirmação (DELETE).
export function MyPasskeysScreen() {
  const { colors } = useTheme()
  const passkeys = usePasskeys()
  const create = useCreatePasskey()
  const remove = useRemovePasskey()
  const [removing, setRemoving] = useState<PasskeySummary | null>(null)

  const thisDevice = currentDeviceName()
  const list = passkeys.data ?? []
  const hasThisDevice = list.some((item) => item.deviceName === thisDevice)

  function confirmRemoval() {
    if (!removing) return
    remove.mutate(removing.id, { onSettled: () => setRemoving(null) })
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Meus passkeys" subtitle="Entrar com biometria" back />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View className="flex-row gap-3 rounded-lg bg-brand-soft p-4">
          <Icon name="fingerprint" color="brand" />
          <Text className="flex-1 text-body text-ink">
            Cada passkey vale para um aparelho. Se perder um celular, remova o
            passkey dele aqui ou recupere o acesso pelo e-mail.
          </Text>
        </View>

        {passkeys.isPending ? (
          <View
            accessibilityLabel="Carregando passkeys"
            className="items-center py-6"
          >
            <ActivityIndicator color={colors.brand} />
          </View>
        ) : passkeys.isError ? (
          <EmptyState
            icon="alert"
            title="Não foi possível carregar os passkeys"
            text={
              passkeys.error instanceof ApiError
                ? passkeys.error.message
                : undefined
            }
            action={
              <Button icon="refresh" onPress={() => void passkeys.refetch()}>
                Tentar de novo
              </Button>
            }
          />
        ) : (
          list.map((passkey) => {
            const here = passkey.deviceName === thisDevice
            return (
              <View
                key={passkey.id}
                className="flex-row items-center gap-3 rounded-lg border border-line bg-surface-raised p-4"
              >
                <Icon name="smartphone" color="brand" size={24} />
                <View className="min-w-0 flex-1 gap-1">
                  <Text className="text-label text-ink">
                    {here
                      ? `${passkey.deviceName} (este aparelho)`
                      : passkey.deviceName}
                  </Text>
                  <Text className="text-caption text-ink-muted">
                    {passkeyDates(passkey)}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Remover o passkey de ${passkey.deviceName}`}
                  onPress={() => setRemoving(passkey)}
                  className="min-h-[44px] justify-center"
                >
                  <Text className="text-label text-brand">Remover</Text>
                </Pressable>
              </View>
            )
          })
        )}

        <Button
          block
          icon="fingerprint"
          loading={create.isPending}
          disabled={hasThisDevice || passkeys.isPending}
          onPress={() => create.mutate(undefined)}
        >
          Criar passkey neste aparelho
        </Button>
        <Text className="text-caption text-ink-muted">
          {hasThisDevice
            ? 'Este aparelho já tem um passkey. Para usar outro celular, entre no app por ele e crie o passkey em Meus passkeys.'
            : 'Este aparelho ainda não tem passkey. Crie um para entrar com a biometria, sem digitar a senha.'}
        </Text>

        {create.isSuccess ? (
          <Alert tone="success">Passkey criado neste aparelho.</Alert>
        ) : null}
        {create.isError ? (
          <Alert tone="danger" title="Não foi possível criar o passkey">
            {getAuthErrorMessage(create.error)}
          </Alert>
        ) : null}
        {remove.isError ? (
          <Alert tone="danger" title="Não foi possível remover o passkey">
            {getAuthErrorMessage(remove.error)}
          </Alert>
        ) : null}
      </ScrollView>
      <ConfirmationSheet
        visible={removing !== null}
        title={`Remover o passkey de ${removing?.deviceName ?? ''}?`}
        description="Esse aparelho deixa de entrar no app com a biometria. Você pode criar outro passkey nele quando quiser."
        danger
        confirmText="Remover passkey"
        onCancel={() => setRemoving(null)}
        onConfirm={confirmRemoval}
      />
    </View>
  )
}
