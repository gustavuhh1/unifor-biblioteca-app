import { Alert, ConfirmationSheet } from '@/shared/components'
import { useCancelLoan } from '../hooks/use-loan-actions'
import { loanErrorText } from '../loans.errors'
import type { MyLoan } from '../loans.types'

export interface CancelLoanSheetProps {
  // O pedido a cancelar; null com a folha fechada.
  loan: Pick<MyLoan, 'id' | 'bookTitle'> | null
  onClose: () => void
  // Roda depois que a API confirma o cancelamento.
  onCancelled?: () => void
}

// Confirmação de cancelar um pedido antes da retirada (A69, RF-EMP-05 e
// RNF-USA-05): POST /loans/{id}/cancel. Usada na lista de empréstimos e na tela
// do QR.
export function CancelLoanSheet({
  loan,
  onClose,
  onCancelled,
}: CancelLoanSheetProps) {
  const cancel = useCancelLoan()

  function close() {
    cancel.reset()
    onClose()
  }

  function confirm() {
    if (!loan || cancel.isPending) return
    cancel.mutate(loan.id, {
      onSuccess: () => {
        close()
        onCancelled?.()
      },
    })
  }

  return (
    <ConfirmationSheet
      visible={loan !== null}
      danger
      title={`Cancelar o pedido de ${loan?.bookTitle ?? 'este livro'}?`}
      description="O exemplar volta para a estante ou segue para o próximo da fila. Você pode pedir de novo depois."
      confirmText="Cancelar pedido"
      cancelText="Manter pedido"
      onCancel={close}
      onConfirm={confirm}
    >
      {cancel.isError ? (
        <Alert tone="danger" title="Não foi possível cancelar">
          {loanErrorText(cancel.error)}
        </Alert>
      ) : null}
    </ConfirmationSheet>
  )
}
