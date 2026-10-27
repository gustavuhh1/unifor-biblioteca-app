// Chave do TanStack Query das filas vistas pelo bibliotecário.
export const LIBRARIAN_QUEUES_QUERY_KEY = ['librarian-queues'] as const

// Livros por página ao procurar os que têm fila (máximo da API).
export const QUEUE_BOOKS_PAGE_SIZE = 50

// Trava de segurança: quantas páginas do acervo se leem ao procurar livros com fila.
export const QUEUE_BOOKS_MAX_PAGES = 10

// O motivo de uma mudança na fila aceita até 300 caracteres (API).
export const QUEUE_REASON_MAX_LENGTH = 300

// Mensagem da folha "Adicionar aluno" quando falta a matrícula ou o motivo.
export const QUEUE_ADD_VALIDATION = {
  matricula: 'Informe a matrícula de 7 dígitos.',
  reason: 'Informe o motivo.',
} as const
