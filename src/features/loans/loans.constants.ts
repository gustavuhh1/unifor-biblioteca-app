import { constantsOf } from '@/shared/utils/constants-of'

// Abas de GET /me/loans: o que está ativo ou o histórico.
export const LOAN_VIEWS = ['active', 'history'] as const
export type LoanView = (typeof LOAN_VIEWS)[number]
export const LOAN_VIEW = constantsOf(LOAN_VIEWS)

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

// Chave do TanStack Query dos empréstimos do aluno.
export const MY_LOANS_QUERY_KEY = 'my-loans'
