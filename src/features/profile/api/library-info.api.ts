import { apiRequest } from '@/shared/api/client'
import type { LibraryInfo } from '../library-info.types'

// Regras, horários e contatos da biblioteca (GET /library/info).
export function getLibraryInfo() {
  return apiRequest<LibraryInfo>('/library/info')
}
