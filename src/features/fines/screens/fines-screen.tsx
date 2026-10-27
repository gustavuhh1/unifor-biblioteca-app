import { useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ApiError } from '@/shared/api/errors'
import {
  Alert,
  AppBar,
  Button,
  EmptyState,
  SegmentedTabs,
  TextField,
} from '@/shared/components'
import { ConfirmationSheet } from '@/shared/components/confirmation-sheet'
import { useTheme } from '@/shared/theme/theme-provider'
import { FINE_STATUS } from '@/shared/types'
import { formatCents } from '@/shared/utils/money'
import { FineDetail } from '../components/fine-detail'
import { FineListRow } from '../components/fine-list-row'
import { FINE_TAB_EMPTY, FINE_TAB_HINT, FINE_TABS } from '../fines.constants'
import {
  finesSubtitle,
  firstName,
  paymentSuccessMessage,
  tabLabel,
} from '../fines.format'
import type { LibrarianFine } from '../fines.types'
import { useLibrarianFines } from '../hooks/use-librarian-fines'
import { usePayFine } from '../hooks/use-pay-fine'

// Aba Multas do bibliotecário (B13 a B18, RF-BAL-09): Em aberto, Contando e
// Pagas (GET /librarian/fines), busca por nome ou matrícula, detalhe da multa em
// aberto e registro do pagamento recebido no balcão (POST .../pay).
export function FinesScreen() {
  const safe = useSafeAreaInsets()
  const { colors } = useTheme()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState(0)
  const [target, setTarget] = useState<LibrarianFine | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [notice, setNotice] = useState('')
  const fines = useLibrarianFines(search)
  const pay = usePayFine()

  const current = FINE_TABS[tab]!
  const query = fines.byStatus[current.status]
  const openFines = fines.open.data?.items ?? []

  function confirmPayment() {
    if (!target) return
    const fine = target
    pay.mutate(fine.id, {
      onSuccess: () => {
        setNotice(paymentSuccessMessage(fine))
        setTarget(null)
        setConfirming(false)
      },
      onError: () => setConfirming(false),
    })
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title={target ? 'Multa em aberto' : 'Multas'}
        subtitle={
          target
            ? `${target.studentName} · ${target.matricula}`
            : fines.open.data
              ? finesSubtitle(openFines)
              : undefined
        }
        back={Boolean(target)}
        large={!target}
        onBack={() => {
          pay.reset()
          setTarget(null)
        }}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}
      >
        {target ? (
          <>
            <FineDetail fine={target} />
            {pay.isError ? (
              <Alert tone="danger" title="Não foi possível registrar">
                {pay.error instanceof ApiError
                  ? pay.error.message
                  : 'Algo deu errado. Tente de novo.'}
              </Alert>
            ) : null}
          </>
        ) : (
          <>
            {notice ? (
              <Alert
                tone="success"
                icon="checkCircle"
                action="Fechar"
                onAction={() => setNotice('')}
              >
                {notice}
              </Alert>
            ) : null}
            <TextField
              label="Nome ou matrícula"
              icon="search"
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
            />
            <SegmentedTabs
              items={FINE_TABS.map((item) => ({
                label: tabLabel(
                  item.label,
                  fines.byStatus[item.status].data?.items.length,
                ),
              }))}
              value={tab}
              onChange={setTab}
            />
            <Text className="text-caption text-ink-muted">
              {FINE_TAB_HINT[current.status]}
            </Text>
            {query.isPending ? (
              <View
                accessibilityLabel="Carregando multas"
                className="items-center py-6"
              >
                <ActivityIndicator color={colors.brand} />
              </View>
            ) : query.isError ? (
              <EmptyState
                icon="alert"
                title="Não foi possível carregar as multas"
                text={
                  query.error instanceof ApiError
                    ? query.error.message
                    : undefined
                }
                action={
                  <Button icon="refresh" onPress={() => void query.refetch()}>
                    Tentar de novo
                  </Button>
                }
              />
            ) : query.data.items.length === 0 ? (
              <EmptyState
                icon="coin"
                title={
                  search.trim()
                    ? 'Nenhuma multa encontrada'
                    : FINE_TAB_EMPTY[current.status]
                }
              />
            ) : (
              <View className="overflow-hidden rounded-lg border border-line bg-surface-raised">
                {query.data.items.map((fine) => (
                  <FineListRow
                    key={fine.id}
                    fine={fine}
                    onPress={
                      current.status === FINE_STATUS.open
                        ? () => {
                            pay.reset()
                            setTarget(fine)
                          }
                        : undefined
                    }
                  />
                ))}
              </View>
            )}
            <Text className="text-caption text-ink-muted">
              O pagamento é feito presencialmente na biblioteca.
            </Text>
          </>
        )}
      </ScrollView>
      {target ? (
        <View
          className="border-t border-line bg-surface-raised px-4 pt-3"
          style={{ paddingBottom: Math.max(safe.bottom, 16) }}
        >
          <Button block icon="coin" onPress={() => setConfirming(true)}>
            {`Registrar pagamento de ${formatCents(target.amountCents)}`}
          </Button>
        </View>
      ) : null}
      <ConfirmationSheet
        visible={confirming && Boolean(target)}
        title={`Recebeu ${formatCents(target?.amountCents ?? 0)} de ${firstName(target?.studentName ?? '')}?`}
        description="A multa sai do app do aluno e o pagamento fica registrado com seu nome. Isso não pode ser desfeito pelo app."
        confirmText={pay.isPending ? 'Registrando...' : 'Confirmar pagamento'}
        cancelText="Ainda não recebi"
        onCancel={() => setConfirming(false)}
        onConfirm={confirmPayment}
      >
        <View className="gap-1 rounded-lg border border-line bg-surface p-3">
          <Text className="text-caption text-ink">
            {`Aluno: ${target?.studentName ?? ''} · ${target?.matricula ?? ''}`}
          </Text>
          <Text className="text-caption text-ink">
            {`Livro: ${target?.bookTitle ?? ''}`}
          </Text>
          <Text className="text-caption text-ink">
            {`Valor recebido: ${formatCents(target?.amountCents ?? 0)}`}
          </Text>
          <Text className="text-caption text-ink">
            Onde: balcão, presencial
          </Text>
        </View>
      </ConfirmationSheet>
    </View>
  )
}
