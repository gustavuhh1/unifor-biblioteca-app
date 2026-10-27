import { constantsOf } from '@/shared/utils/constants-of'

// Chaves do TanStack Query do balcão. A ficha do aluno é uma consulta por
// matrícula: o QR e o código do pedido só a abrem, e depois todas as telas a
// releem pela mesma chave (RF-BAL-02 e RF-BAL-03).
export const DESK_QUERY_KEY = ['desk'] as const
export const DESK_SUMMARY_QUERY_KEY = [...DESK_QUERY_KEY, 'summary'] as const
export const DESK_PICKUPS_QUERY_KEY = [...DESK_QUERY_KEY, 'pickups'] as const

export function deskStudentQueryKey(matricula: string) {
  return [...DESK_QUERY_KEY, 'student', matricula] as const
}

// Código curto do pedido digitado no balcão: "RET-" e 4 dígitos, sem diferenciar
// maiúsculas de minúsculas (RF-BAL-03).
export const PICKUP_CODE_PATTERN = /^RET-\d{4}$/i

// A busca da lista Retiradas é pelos primeiros dígitos da matrícula, de 1 a 7
// (RF-BAL-05).
export const MATRICULA_SEARCH_PATTERN = /^\d{1,7}$/

// Espera antes de buscar enquanto a pessoa digita a matrícula.
export const PICKUP_SEARCH_DEBOUNCE_MS = 300

// Quantas retiradas o Painel mostra (a lista completa fica em Retiradas).
export const PANEL_PICKUPS_LIMIT = 3

// Pausa antes de aceitar outra leitura depois de um QR que falhou, para a
// câmera não repetir o mesmo pedido em loop.
export const SCAN_RETRY_DELAY_MS = 2000

// Códigos de erro da API que o balcão trata em cada tela.
export const DESK_API_ERROR_CODES = [
  'loan_not_found',
  'student_not_found',
  'loan_not_awaiting_pickup',
  'loan_not_active',
  'pickup_expired',
  'overdue',
] as const
export const DESK_API_ERROR_CODE = constantsOf(DESK_API_ERROR_CODES)

// Mensagens do balcão (pt-BR).
export const DESK_MESSAGE = {
  invalidSearch:
    'Informe uma matrícula de 7 dígitos ou um código de pedido como RET-4821.',
  cameraDenied:
    'Sem acesso à câmera. Permita o uso nas configurações ou digite a matrícula ou o código do pedido.',
  cameraUnavailable:
    'A câmera não está disponível. Digite a matrícula ou o código do pedido.',
  unreadableQr:
    'Não foi possível ler este QR. Tente de novo ou digite o código.',
} as const
