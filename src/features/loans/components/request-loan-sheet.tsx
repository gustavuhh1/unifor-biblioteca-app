import { useRouter } from 'expo-router'
import { Text, View } from 'react-native'
import { useSession } from '@/features/auth/hooks/use-session'
import { Alert, BottomSheet, Button } from '@/shared/components'
import {
  LOAN_PERIOD_DAYS,
  MAX_ACTIVE_LOANS,
  PICKUP_BUSINESS_DAYS,
} from '@/shared/config/library-rules'
import { useRequestLoan } from '../hooks/use-loan-actions'
import { describeLoanRequestError } from '../loans.errors'

export interface RequestLoanSheetProps {
  visible: boolean
  bookId: string
  bookTitle: string
  onClose: () => void
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between gap-3 py-2">
      <Text className="text-caption text-ink-muted">{label}</Text>
      <Text className="flex-1 text-right text-caption-strong text-ink">
        {value}
      </Text>
    </View>
  )
}

// Confirmação do pedido (A23, RF-EMP-01 e RNF-USA-05): mostra o que acontece
// antes de pedir, chama POST /loans e leva à tela "Pedido feito". O dia exato da
// retirada só vem da API (conta dias úteis, feriados e recesso), então aqui o
// prazo aparece em dias úteis e o dia concreto aparece na tela seguinte.
export function RequestLoanSheet({
  visible,
  bookId,
  bookTitle,
  onClose,
}: RequestLoanSheetProps) {
  const router = useRouter()
  const { user } = useSession()
  const request = useRequestLoan()
  const error = request.error ? describeLoanRequestError(request.error) : null
  const withYou = (user?.activeLoanCount ?? 0) + 1

  function close() {
    request.reset()
    onClose()
  }

  function confirm() {
    if (request.isPending) return
    request.mutate(bookId, {
      onSuccess: (loan) => {
        request.reset()
        onClose()
        router.replace({
          pathname: '/loan-requested',
          params: { loanId: loan.id },
        })
      },
    })
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={close}
      title={`Solicitar ${bookTitle}?`}
      text="Um exemplar fica separado para você. Retire no balcão da biblioteca mostrando o QR do app."
      actions={
        <>
          <Button
            block
            variant="primary"
            loading={request.isPending}
            onPress={confirm}
          >
            Confirmar solicitação
          </Button>
          <Button block variant="ghost" onPress={close}>
            Cancelar
          </Button>
        </>
      }
    >
      <View className="rounded-md border border-line bg-surface px-3">
        <Row
          label="Retirar em"
          value={`até ${PICKUP_BUSINESS_DAYS} dias úteis`}
        />
        <View className="h-px bg-line" />
        <Row
          label="Empréstimo"
          value={`${LOAN_PERIOD_DAYS} dias a partir da retirada`}
        />
        <View className="h-px bg-line" />
        <Row
          label="Seus empréstimos"
          value={`passa a ${withYou} de ${MAX_ACTIVE_LOANS}`}
        />
      </View>
      <Text className="text-caption text-ink-muted">
        Fim de semana, feriado e recesso não contam. Sem retirada no prazo, o
        pedido expira e o livro volta à estante.
      </Text>
      {error ? (
        <Alert tone="danger" title={error.title}>
          {error.text}
        </Alert>
      ) : null}
    </BottomSheet>
  )
}
