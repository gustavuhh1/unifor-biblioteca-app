import { API_ERROR_MESSAGE, ApiError } from '@/shared/api/errors'
import { ASSISTANT_BLOCKED_REASONS } from '@/shared/types'
import {
  BLOCKED_REASON_MESSAGE,
  type BlockedReason,
} from '@/shared/utils/blocked-reason'
import {
  LOAN_ERROR_CODE,
  RENEWAL_DENIAL_MESSAGE,
  RENEWAL_DENIAL_REASONS,
  type RenewalDenialReason,
} from './loans.constants'

// Título e texto de um erro de empréstimo, prontos para um Alert ou uma folha.
export interface LoanErrorMessage {
  title: string
  text: string
}

// Recusa de POST /loans quando não há exemplar na estante (ou há fila).
const NO_COPY_AVAILABLE_MESSAGE: LoanErrorMessage = {
  title: 'Sem exemplar na estante',
  text: 'Todos os exemplares estão emprestados ou há fila para este livro. Entre na fila para ser avisado quando ele voltar.',
}

// Erro de uma chamada sem corpo de API (queda de rede, tempo esgotado).
const GENERIC_REQUEST_TITLE = 'Não foi possível solicitar'

function isBlockedReason(code: string): code is BlockedReason {
  return (ASSISTANT_BLOCKED_REASONS as readonly string[]).includes(code)
}

function isRenewalDenial(code: string): code is RenewalDenialReason {
  return (RENEWAL_DENIAL_REASONS as readonly string[]).includes(code)
}

// Texto de qualquer erro da API (já em português) ou o genérico (RF-EMP-01 a 10).
export function loanErrorText(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : API_ERROR_MESSAGE.unknownError
}

// Traduz a recusa de POST /loans: `unavailable`, `overdue`, `same_title` e
// `loan_limit` usam os textos do bloqueio da página do livro (A26, A27, A44 e
// RF-ACE-08); `no_copy_available` leva à fila (RF-EMP-01, RF-EMP-02, RF-EMP-03
// e RF-EMP-04).
export function describeLoanRequestError(error: unknown): LoanErrorMessage {
  if (error instanceof ApiError) {
    if (isBlockedReason(error.code)) return BLOCKED_REASON_MESSAGE[error.code]
    if (error.code === LOAN_ERROR_CODE.noCopyAvailable) {
      return NO_COPY_AVAILABLE_MESSAGE
    }
  }
  return { title: GENERIC_REQUEST_TITLE, text: loanErrorText(error) }
}

// Traduz a recusa de POST /loans/{id}/renew: os três motivos de negar usam o
// texto do app (A70, RF-EMP-10); o resto fica com a mensagem da API.
export function describeRenewError(error: unknown): string {
  if (error instanceof ApiError && isRenewalDenial(error.code)) {
    return RENEWAL_DENIAL_MESSAGE[error.code]
  }
  return loanErrorText(error)
}
