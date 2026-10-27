import { View } from 'react-native'
import { Button, DeadlineChip, LoanCard } from '@/shared/components'
import { LOAN_PERIOD_DAYS } from '@/shared/config/library-rules'
import { LOAN_STATUS } from '@/shared/types'
import {
  LOAN_STATE,
  RENEWAL_DENIAL_MESSAGE,
  RENEWAL_DENIAL_REASON,
} from '../loans.constants'
import {
  loanBadge,
  loanDueText,
  loanStartText,
  pickupDeadlineText,
} from '../loans.format'
import type { MyLoan } from '../loans.types'

export interface ActiveLoanCardProps {
  loan: MyLoan
  onOpenBook: () => void
  onShowQr: () => void
  onCancel: () => void
  onRenew: () => void
  // Abre a explicação de por que a renovação não é possível (A70).
  onRenewBlocked: () => void
  onShowFine: () => void
}

// Cartão de um pedido ou empréstimo ativo em Meus empréstimos (A39, RF-EMP-08):
// o pedido aguardando retirada mostra o prazo e o QR; o empréstimo em andamento
// mostra o progresso e a renovação (ou o motivo de não poder renovar).
export function ActiveLoanCard({
  loan,
  onOpenBook,
  onShowQr,
  onCancel,
  onRenew,
  onRenewBlocked,
  onShowFine,
}: ActiveLoanCardProps) {
  const badge = loanBadge(loan)
  const waiting = loan.status === LOAN_STATUS.awaitingPickup
  const overdue = loan.state === LOAN_STATE.overdue
  const reason = loan.renewalDenialReason
  const renewalUsed = reason === RENEWAL_DENIAL_REASON.alreadyRenewed

  return (
    <LoanCard
      title={loan.bookTitle}
      author={loan.bookShelf}
      status={badge.status}
      statusLabel={badge.label}
      progress={waiting ? undefined : (loan.progress ?? undefined)}
      startLabel={waiting ? undefined : loanStartText(loan)}
      dueLabel={waiting ? undefined : loanDueText(loan)}
      deadline={
        waiting ? (
          <DeadlineChip kind="retirar">{pickupDeadlineText(loan)}</DeadlineChip>
        ) : undefined
      }
      renewBlocked={!waiting && !overdue && reason !== null}
      renewReason={reason ? RENEWAL_DENIAL_MESSAGE[reason] : undefined}
      onPress={onOpenBook}
      actions={
        <View className="gap-2">
          {waiting ? (
            <>
              <Button block size="sm" icon="qr" onPress={onShowQr}>
                Mostrar QR
              </Button>
              <Button block size="sm" variant="ghost" onPress={onCancel}>
                Cancelar pedido
              </Button>
            </>
          ) : overdue ? (
            <Button
              block
              size="sm"
              variant="danger"
              icon="coin"
              onPress={onShowFine}
            >
              Ver multa
            </Button>
          ) : loan.canRenew ? (
            <Button
              block
              size="sm"
              variant="tonal"
              icon="refresh"
              onPress={onRenew}
            >
              {`Renovar +${LOAN_PERIOD_DAYS} dias`}
            </Button>
          ) : (
            <Button
              block
              size="sm"
              variant="ghost"
              icon="refresh"
              disabled={renewalUsed}
              onPress={onRenewBlocked}
            >
              {renewalUsed ? 'Renovação já utilizada' : 'Renovar'}
            </Button>
          )}
        </View>
      }
    />
  )
}
