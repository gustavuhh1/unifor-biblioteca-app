import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { useSession } from '@/features/auth/hooks/use-session'
import { displayNameOf } from '@/features/profile/profile.format'
import { ApiError } from '@/shared/api/errors'
import {
  Alert,
  AppBar,
  Button,
  ConfirmationSheet,
  EmptyState,
  Icon,
  QRPass,
} from '@/shared/components'
import { LOAN_PERIOD_DAYS } from '@/shared/config/library-rules'
import { useTheme } from '@/shared/theme/theme-provider'
import { useCancelLoan } from '../hooks/use-loan-actions'
import { useMyLoans } from '../hooks/use-my-loans'
import { loanErrorText } from '../loans.errors'
import { findPickupLoan, formatWeekdayDate } from '../loans.format'

// Retirada (A25 e A69, RF-EMP-07 e RF-EMP-05): o QR que o aluno mostra no
// balcão e o cancelamento do pedido. O QR é gerado no aparelho a partir do
// `qrToken` de GET /me/loans, então aparece mesmo sem internet quando o pedido
// já está no cache (RNF-CON-01). Sem `loanId`, mostra o pedido mais novo.
export function PickupQrScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { user } = useSession()
  const { loanId } = useLocalSearchParams<{ loanId?: string }>()
  const query = useMyLoans()
  const cancel = useCancelLoan()
  const [confirmingCancel, setConfirmingCancel] = useState(false)
  const loan = findPickupLoan(query.data?.items ?? [], loanId)

  function closeCancel() {
    cancel.reset()
    setConfirmingCancel(false)
  }

  function confirmCancel() {
    if (!loan || cancel.isPending) return
    cancel.mutate(loan.id, {
      onSuccess: () => {
        closeCancel()
        router.replace('/loans')
      },
    })
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Retirada" back />
      {query.isPending && query.fetchStatus === 'paused' ? (
        <EmptyState
          icon="wifiOff"
          title="Sem internet"
          text="Abra Meus empréstimos com internet uma vez: depois o QR do pedido aparece mesmo sem conexão."
        />
      ) : query.isPending ? (
        <View
          accessibilityLabel="Carregando pedido"
          className="flex-1 items-center justify-center"
        >
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : query.isError && !loan ? (
        <EmptyState
          icon="alert"
          title="Não foi possível abrir o pedido"
          text={
            query.error instanceof ApiError ? query.error.message : undefined
          }
          action={
            <Button icon="refresh" onPress={() => void query.refetch()}>
              Tentar de novo
            </Button>
          }
        />
      ) : !loan || !user ? (
        <EmptyState
          icon="qr"
          title="Nenhum pedido para retirar"
          text="Peça um livro na página dele e o QR de retirada aparece aqui."
          action={
            <Button onPress={() => router.replace('/catalog')}>
              Explorar acervo
            </Button>
          }
        />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerClassName="gap-4 px-4 pb-8 pt-1"
        >
          <Alert tone="success" title="Pedido confirmado">
            Mostre este QR no balcão da biblioteca. O empréstimo de{' '}
            {LOAN_PERIOD_DAYS} dias começa quando você pegar o livro.
          </Alert>

          <QRPass
            value={loan.qrToken as string}
            code={loan.pickupCode ?? ''}
            matricula={user.matricula}
            name={displayNameOf(user)}
            book={loan.bookTitle}
            expires={`até ${formatWeekdayDate(loan.pickupDeadline)}`}
          />

          <View className="flex-row items-start gap-2.5 rounded-md bg-surface-sunken px-3.5 py-3">
            <Icon name="keyboard" size={18} color="inkMuted" />
            <Text className="text-caption flex-1 text-ink-muted">
              Sem QR? Diga sua matrícula {user.matricula} ou o código{' '}
              {loan.pickupCode} ao bibliotecário.
            </Text>
          </View>

          <Button
            block
            variant="secondary"
            onPress={() => setConfirmingCancel(true)}
          >
            Cancelar pedido
          </Button>
        </ScrollView>
      )}

      <ConfirmationSheet
        visible={confirmingCancel && loan !== undefined}
        danger
        title={`Cancelar o pedido de ${loan?.bookTitle ?? 'este livro'}?`}
        description="O exemplar volta para a estante ou segue para o próximo da fila. Você pode pedir de novo depois."
        confirmText="Cancelar pedido"
        cancelText="Manter pedido"
        onCancel={closeCancel}
        onConfirm={confirmCancel}
      >
        {cancel.isError ? (
          <Alert tone="danger" title="Não foi possível cancelar">
            {loanErrorText(cancel.error)}
          </Alert>
        ) : null}
      </ConfirmationSheet>
    </View>
  )
}
