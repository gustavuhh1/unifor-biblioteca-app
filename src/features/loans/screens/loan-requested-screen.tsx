import { useLocalSearchParams, useRouter } from 'expo-router'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ApiError } from '@/shared/api/errors'
import {
  BookCover,
  Button,
  DeadlineChip,
  EmptyState,
  Icon,
} from '@/shared/components'
import {
  LOAN_PERIOD_DAYS,
  PICKUP_BUSINESS_DAYS,
} from '@/shared/config/library-rules'
import { useTheme } from '@/shared/theme/theme-provider'
import { useMyLoans } from '../hooks/use-my-loans'
import { pickupDeadlineText } from '../loans.format'

// Pedido feito (A24, RF-EMP-01): o prazo concreto de retirada e o que fazer a
// seguir. Lê o pedido pelo id (`loanId`) em GET /me/loans.
export function LoanRequestedScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()
  const { loanId } = useLocalSearchParams<{ loanId?: string }>()
  const query = useMyLoans()
  const loan = query.data?.items.find((item) => item.id === loanId)

  if (query.isPending) {
    return (
      <View
        accessibilityLabel="Carregando pedido"
        className="flex-1 items-center justify-center bg-surface"
      >
        <ActivityIndicator color={colors.brand} />
      </View>
    )
  }

  if (query.isError || !loan) {
    return (
      <View className="flex-1 justify-center bg-surface">
        <EmptyState
          icon="alert"
          title="Não encontramos este pedido"
          text={
            query.error instanceof ApiError
              ? query.error.message
              : 'Veja seus pedidos em Meus empréstimos.'
          }
          action={
            <Button onPress={() => router.replace('/loans')}>
              Ver meus empréstimos
            </Button>
          }
        />
      </View>
    )
  }

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-4 pt-10 pb-8"
      >
        <View className="items-center gap-3">
          <View className="rounded-pill bg-success-soft p-5">
            <Icon name="checkCircle" color="success" size={40} />
          </View>
          <Text className="text-center text-title-lg text-ink">
            Pedido feito!
          </Text>
          <Text className="text-center text-body text-ink-muted">
            {loan.bookTitle} está separado para você no balcão da biblioteca.
          </Text>
        </View>

        <View className="items-center">
          <DeadlineChip kind="retirar">{pickupDeadlineText(loan)}</DeadlineChip>
        </View>

        <View className="flex-row gap-3 rounded-md border border-line bg-surface-raised p-4">
          <BookCover title={loan.bookTitle} size="md" />
          <View className="flex-1 justify-center gap-2">
            <Text className="text-book-title text-ink">{loan.bookTitle}</Text>
            <Text className="text-caption text-ink-muted">
              Biblioteca (Praça Central) · {loan.bookShelf}
            </Text>
            {loan.pickupCode ? (
              <Text className="text-caption-strong text-ink">
                Código do pedido: {loan.pickupCode}
              </Text>
            ) : null}
          </View>
        </View>

        <View className="gap-5">
          <View className="flex-row items-start gap-3">
            <Icon name="qr" color="brand" size={21} />
            <Text className="flex-1 text-body text-ink">
              Mostre o QR do pedido no balcão.
            </Text>
          </View>
          <View className="flex-row items-start gap-3">
            <Icon name="clock" color="brand" size={21} />
            <Text className="flex-1 text-body text-ink">
              O empréstimo de {LOAN_PERIOD_DAYS} dias começa na retirada.
            </Text>
          </View>
          <View className="flex-row items-start gap-3">
            <Icon name="calendar" color="brand" size={21} />
            <Text className="flex-1 text-body text-ink">
              Você tem {PICKUP_BUSINESS_DAYS} dias úteis para retirar. Fim de
              semana, feriado e recesso não contam.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        className="gap-3 border-t border-line bg-surface-raised px-4 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button
          block
          variant="primary"
          icon="qr"
          onPress={() =>
            router.push({
              pathname: '/withdrawal',
              params: { loanId: loan.id },
            })
          }
        >
          Mostrar QR de retirada
        </Button>
        <Button
          block
          variant="ghost"
          onPress={() => router.replace('/catalog')}
        >
          Voltar ao acervo
        </Button>
      </View>
    </View>
  )
}
