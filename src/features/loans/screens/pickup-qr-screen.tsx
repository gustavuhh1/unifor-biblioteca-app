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
  EmptyState,
  Icon,
  QRPass,
} from '@/shared/components'
import { LOAN_PERIOD_DAYS } from '@/shared/config/library-rules'
import { useTheme } from '@/shared/theme/theme-provider'
import { CancelLoanSheet } from '../components/cancel-loan-sheet'
import { useMyLoans } from '../hooks/use-my-loans'
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
  const [cancelling, setCancelling] = useState(false)
  const loan = findPickupLoan(query.data?.items ?? [], loanId)

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
          {/* O Alert só embrulha em Text quando o filho é uma string única. */}
          <Alert tone="success" title="Pedido confirmado">
            {`Mostre este QR no balcão da biblioteca. O empréstimo de ${LOAN_PERIOD_DAYS} dias começa quando você pegar o livro.`}
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

          <Button block variant="secondary" onPress={() => setCancelling(true)}>
            Cancelar pedido
          </Button>
        </ScrollView>
      )}

      <CancelLoanSheet
        loan={cancelling ? (loan ?? null) : null}
        onClose={() => setCancelling(false)}
        onCancelled={() => router.replace('/loans')}
      />
    </View>
  )
}
