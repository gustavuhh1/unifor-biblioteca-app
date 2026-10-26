import { COPY_STATUS, type CopyStatus } from '@/shared/types'
import { constantsOf } from '@/shared/utils/constants-of'

// Chaves do TanStack Query do acervo.
export const BOOK_SEARCH_QUERY_KEY = 'book-search'
export const BOOK_QUERY_KEY = 'book'

// Livros por página na busca (a API aceita até o limite que ela define).
export const BOOK_SEARCH_PAGE_SIZE = 20

// Espera depois da última tecla antes de buscar na API.
export const BOOK_SEARCH_DEBOUNCE_MS = 400

// O que o botão fixo da página do livro faz para este aluno (campo
// `action.suggestedAction` de GET /books/{bookId}).
export const BOOK_SUGGESTED_ACTIONS = ['request', 'join_queue'] as const
export const BOOK_SUGGESTED_ACTION = constantsOf(BOOK_SUGGESTED_ACTIONS)

// O que o botão fixo da página do livro diz, por ação sugerida.
export const BOOK_ACTION_LABEL = {
  [BOOK_SUGGESTED_ACTION.request]: 'Solicitar empréstimo',
  [BOOK_SUGGESTED_ACTION.joinQueue]: 'Entrar na fila',
} as const

// Situação do exemplar na lista da página do livro (RF-ACE-02).
export const COPY_STATUS_LABEL: Record<CopyStatus, string> = {
  [COPY_STATUS.available]: 'Disponível',
  [COPY_STATUS.reserved]: 'Reservado',
  [COPY_STATUS.onLoan]: 'Emprestado',
  [COPY_STATUS.withdrawn]: 'Fora do acervo',
}
