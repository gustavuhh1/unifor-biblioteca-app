import { constantsOf } from '@/shared/utils/constants-of'

// Abas de GET /me/loans: o que está ativo ou o histórico.
export const LOAN_VIEWS = ['active', 'history'] as const
export type LoanView = (typeof LOAN_VIEWS)[number]
export const LOAN_VIEW = constantsOf(LOAN_VIEWS)

// Abas da tela Meus empréstimos (A39): Ativos, Na fila (do bloco da fila) e
// Histórico.
export const LOANS_TABS = ['active', 'queue', 'history'] as const
export type LoansTab = (typeof LOANS_TABS)[number]
export const LOANS_TAB = constantsOf(LOANS_TABS)

// Situação calculada na hora pela API para cada empréstimo (campo `state`).
export const LOAN_STATES = [
  'ready_for_pickup',
  'in_progress',
  'due_soon',
  'overdue',
  'returned',
  'expired',
  'cancelled',
] as const
export type LoanState = (typeof LOAN_STATES)[number]
export const LOAN_STATE = constantsOf(LOAN_STATES)

// Por que a renovação não é possível (campo `renewalDenialReason`).
export const RENEWAL_DENIAL_REASONS = [
  'overdue',
  'has_queue',
  'already_renewed',
] as const
export type RenewalDenialReason = (typeof RENEWAL_DENIAL_REASONS)[number]
export const RENEWAL_DENIAL_REASON = constantsOf(RENEWAL_DENIAL_REASONS)

// Por que a renovação não é possível, em português (RF-EMP-10, tela A70).
export const RENEWAL_DENIAL_MESSAGE: Record<RenewalDenialReason, string> = {
  [RENEWAL_DENIAL_REASON.overdue]:
    'Renovação indisponível: o empréstimo está em atraso. Devolva o livro no balcão.',
  [RENEWAL_DENIAL_REASON.hasQueue]:
    'Renovação indisponível: há alunos na fila deste livro.',
  [RENEWAL_DENIAL_REASON.alreadyRenewed]:
    'Renovação indisponível: este empréstimo já foi renovado uma vez.',
}

// Códigos de erro de pedir, renovar e cancelar que não são motivos de bloqueio
// (docs/api-openapi.json): sem exemplar na estante, empréstimo que não está
// ativo e pedido que não pode mais ser cancelado ou não existe.
export const LOAN_ERROR_CODES = [
  'no_copy_available',
  'loan_not_active',
  'loan_not_cancellable',
  'loan_not_found',
] as const
export const LOAN_ERROR_CODE = constantsOf(LOAN_ERROR_CODES)

// Chave do TanStack Query dos empréstimos do aluno.
export const MY_LOANS_QUERY_KEY = 'my-loans'

// Quanto tempo o cache guarda os pedidos depois que nenhuma tela os usa (24 h):
// o QR de retirada abre mesmo sem internet enquanto o app está aberto (RNF-CON-01).
export const MY_LOANS_GC_TIME_MS = 24 * 60 * 60 * 1000
