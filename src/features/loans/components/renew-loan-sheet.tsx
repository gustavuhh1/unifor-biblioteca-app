import { Text, View } from 'react-native'
import { Alert, ConfirmationSheet } from '@/shared/components'
import { LOAN_PERIOD_DAYS } from '@/shared/config/library-rules'
import { useRenewLoan } from '../hooks/use-loan-actions'
import { describeRenewError } from '../loans.errors'
import { formatWeekdayDate } from '../loans.format'
import type { MyLoan } from '../loans.types'

export interface RenewLoanSheetProps {
  // O empréstimo a renovar; null com a folha fechada.
  loan: MyLoan | null
  onClose: () => void
  // Recebe o empréstimo com o novo vencimento que a API calculou.
  onRenewed: (loan: MyLoan) => void
}

// Confirmação de renovar (A40, RF-EMP-09 e RNF-USA-05): POST /loans/{id}/renew.
// O novo prazo é calculado pela API (fechamento da biblioteca, feriados e
// recesso), então aparece depois de renovar; aqui vai o prazo atual. Se a API
// negar (RF-EMP-10), o motivo aparece na própria folha.
export function RenewLoanSheet({
  loan,
  onClose,
  onRenewed,
}: RenewLoanSheetProps) {
  const renew = useRenewLoan()

  function close() {
    renew.reset()
    onClose()
  }

  function confirm() {
    if (!loan || renew.isPending) return
    renew.mutate(loan.id, {
      onSuccess: (renewed) => {
        close()
        onRenewed(renewed)
      },
    })
  }

  return (
    <ConfirmationSheet
      visible={loan !== null}
      title={`Renovar ${loan?.bookTitle ?? 'o livro'}?`}
      description={`Você ganha mais ${LOAN_PERIOD_DAYS} dias. Cada empréstimo renova uma única vez, e só quando o livro não está atrasado e ninguém está na fila.`}
      confirmText={`Renovar +${LOAN_PERIOD_DAYS} dias`}
      cancelText="Agora não"
      onCancel={close}
      onConfirm={confirm}
    >
      {loan?.dueAt ? (
        <View className="flex-row justify-between gap-3 rounded-md border border-line bg-surface px-3 py-3">
          <Text className="text-caption text-ink-muted">Prazo atual</Text>
          <Text className="text-caption-strong text-ink">
            {formatWeekdayDate(loan.dueAt)}
          </Text>
        </View>
      ) : null}
      {renew.isError ? (
        <Alert tone="danger" title="Não foi possível renovar">
          {describeRenewError(renew.error)}
        </Alert>
      ) : null}
    </ConfirmationSheet>
  )
}
