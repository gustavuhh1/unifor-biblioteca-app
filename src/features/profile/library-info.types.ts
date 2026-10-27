import type { LibraryContact, OpeningHours } from '@/shared/types'

// Resposta de GET /library/info (schema `LibraryInfo` do Swagger): as regras
// numéricas, os horários e os contatos da biblioteca (RF-PER-02).
export interface LibraryInfo {
  openingHours: OpeningHours
  contact: LibraryContact
  officialRulesUrl: string
  maxActiveLoans: number
  loanDays: number
  renewalDays: number
  maxRenewals: number
  fineCentsPerBusinessDay: number
  maxActiveQueues: number
  queueConfirmHours: number
  pickupBusinessDays: number
}
