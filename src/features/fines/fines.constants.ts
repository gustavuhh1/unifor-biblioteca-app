import { FINE_STATUS, type FineStatus } from '@/shared/types'

// Chave do TanStack Query da lista de multas do bibliotecário.
export const LIBRARIAN_FINES_QUERY_KEY = ['librarian-fines'] as const

// Chave do resumo do Painel (GET /librarian/desk/summary). É a MESMA que o bloco
// do balcão usa em desk/desk.constants.ts: registrar um pagamento invalida o
// resumo para o número "Multas em aberto" do Painel se atualizar. Depois que os
// dois blocos estiverem na main, importe a chave de desk e apague esta cópia.
export const DESK_SUMMARY_QUERY_KEY = ['desk', 'summary'] as const

// Espera (ms) depois da última tecla antes de buscar por nome ou matrícula.
export const FINES_SEARCH_DEBOUNCE_MS = 300

// As três abas da tela Multas, na ordem do design (B13, B14 e B15).
export const FINE_TABS: { status: FineStatus; label: string }[] = [
  { status: FINE_STATUS.open, label: 'Em aberto' },
  { status: FINE_STATUS.accruing, label: 'Contando' },
  { status: FINE_STATUS.paid, label: 'Pagas' },
]

// Frase de apoio abaixo das abas (RF-BAL-09).
export const FINE_TAB_HINT: Record<FineStatus, string> = {
  open: 'Livro devolvido, multa congelada. Registre o pagamento só depois de receber no balcão.',
  accruing:
    'Livro ainda não devolvido: a multa sobe a cada dia útil. O pagamento só pode ser registrado depois da devolução.',
  paid: 'Pagamentos registrados no balcão, com quem recebeu. Fica no histórico do aluno.',
}

// Texto da lista vazia de cada aba.
export const FINE_TAB_EMPTY: Record<FineStatus, string> = {
  open: 'Nenhuma multa em aberto.',
  accruing: 'Nenhuma multa contando.',
  paid: 'Nenhum pagamento registrado.',
}
