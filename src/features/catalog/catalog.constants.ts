// Chaves do TanStack Query do acervo.
export const BOOK_SEARCH_QUERY_KEY = 'book-search'
export const BOOK_QUERY_KEY = 'book'

// Livros por página na busca (a API aceita até o limite que ela define).
export const BOOK_SEARCH_PAGE_SIZE = 20

// Espera depois da última tecla antes de buscar na API.
export const BOOK_SEARCH_DEBOUNCE_MS = 400

// O que o botão fixo da página do livro diz, por ação sugerida.
export const BOOK_ACTION_LABEL = {
  request: 'Solicitar empréstimo',
  join_queue: 'Entrar na fila',
} as const

// Situação do exemplar na lista da página do livro (RF-ACE-02).
export const COPY_STATUS_LABEL = {
  available: 'Disponível',
  reserved: 'Reservado',
  on_loan: 'Emprestado',
  withdrawn: 'Fora do acervo',
} as const
