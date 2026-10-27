import {
  BOOK_METADATA_SOURCE,
  DATA_SOURCE,
  type BookMetadataSource,
  type DataSource,
} from '@/shared/types'
import { constantsOf } from '@/shared/utils/constants-of'

// Gestão do acervo pelo bibliotecário (RF-GAC-01 a RF-GAC-06).

// Chave do TanStack Query da lista do acervo do bibliotecário.
export const LIBRARIAN_BOOKS_QUERY_KEY = 'librarian-books'

// Livros por página na lista (GET /librarian/books).
export const LIBRARIAN_BOOKS_PAGE_SIZE = 20

// Espera depois da última tecla antes de buscar na API.
export const LIBRARIAN_BOOKS_DEBOUNCE_MS = 400

// Filtros da lista, como o contrato define em `filter` de GET /librarian/books.
export const BOOK_LIST_FILTERS = ['all', 'no_isbn', 'unavailable'] as const
export const BOOK_LIST_FILTER = constantsOf(BOOK_LIST_FILTERS)

// Rótulo de cada filtro nos chips da lista.
export const BOOK_LIST_FILTER_LABEL = {
  [BOOK_LIST_FILTER.all]: 'Todos',
  [BOOK_LIST_FILTER.noIsbn]: 'Sem ISBN',
  [BOOK_LIST_FILTER.unavailable]: 'Indisponíveis',
} as const

// Nome de cada fonte externa que a API consulta (RF-ACE-04).
export const BOOK_SOURCE_LABEL: Record<BookMetadataSource, string> = {
  [BOOK_METADATA_SOURCE.openLibrary]: 'Open Library',
  [BOOK_METADATA_SOURCE.brasilApi]: 'BrasilAPI',
}

// De onde vieram os dados do livro (campo `dataSource`).
export const DATA_SOURCE_LABEL: Record<DataSource, string> = {
  [DATA_SOURCE.external]: 'fontes externas',
  [DATA_SOURCE.manual]: 'cadastro manual',
  [DATA_SOURCE.mixed]: 'fontes externas e cadastro manual',
}

// Campos que a atualização pelas fontes externas preenche (`changedFields`).
export const SYNC_FIELDS = [
  'title',
  'subtitle',
  'authors',
  'publisher',
  'year',
  'synopsis',
  'coverUrl',
  'subjects',
] as const
export const SYNC_FIELD = constantsOf(SYNC_FIELDS)

// Nome de cada campo nas telas de consulta e atualização (B21 e B23).
export const SYNC_FIELD_LABEL: Record<(typeof SYNC_FIELDS)[number], string> = {
  [SYNC_FIELD.title]: 'Título',
  [SYNC_FIELD.subtitle]: 'Subtítulo',
  [SYNC_FIELD.authors]: 'Autores',
  [SYNC_FIELD.publisher]: 'Editora',
  [SYNC_FIELD.year]: 'Ano',
  [SYNC_FIELD.synopsis]: 'Sinopse',
  [SYNC_FIELD.coverUrl]: 'Capa',
  [SYNC_FIELD.subjects]: 'Assuntos',
}

// Códigos de erro da API usados na gestão do acervo (docs/api-openapi.json).
export const LIBRARIAN_BOOK_ERROR_CODES = [
  'book_in_circulation',
  'registration_taken',
  'book_metadata_unavailable',
  'isbn_required',
] as const
export const LIBRARIAN_BOOK_ERROR_CODE = constantsOf(LIBRARIAN_BOOK_ERROR_CODES)

// Avisos que a lista mostra depois de uma ação feita no formulário.
export const BOOK_NOTICES = ['created', 'updated', 'removed'] as const
export const BOOK_NOTICE = constantsOf(BOOK_NOTICES)
export const BOOK_NOTICE_TEXT: Record<(typeof BOOK_NOTICES)[number], string> = {
  [BOOK_NOTICE.created]: 'Livro cadastrado no acervo.',
  [BOOK_NOTICE.updated]: 'Alterações salvas.',
  [BOOK_NOTICE.removed]: 'Livro removido do acervo. O histórico foi mantido.',
}

// ISBN: só dígitos, com 10 ou 13 (a API confere o resto).
export const ISBN_LENGTHS = [10, 13] as const

// Dados de cada exemplar do cadastro: o design só pede a quantidade, e a API
// exige formato e código da biblioteca (docs/modelo-de-dados-firestore.md, copies).
export const COPY_FORMAT = 'Livro'
export const COPY_LIBRARY_LABEL = 'Biblioteca · Livros'
