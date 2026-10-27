import type { BookMetadataSource, BookStatus, DataSource } from '@/shared/types'
import type { BookPage } from './catalog.types'
import type {
  BOOK_LIST_FILTERS,
  SYNC_FIELDS,
} from './librarian-catalog.constants'

// Tipos exclusivos da gestão do acervo: o que a API devolve e recebe nas rotas
// /librarian/books (docs/api-openapi.json). As datas chegam como texto ISO 8601.

export type BookListFilter = (typeof BOOK_LIST_FILTERS)[number]
export type SyncField = (typeof SYNC_FIELDS)[number]

// Dados da última consulta às fontes externas (`externalMetadata`).
export interface ExternalMetadata {
  sources: BookMetadataSource[]
  openLibraryKey?: string | null
  lastSyncedAt?: string | null
  found: boolean
}

// Registro completo de um livro, como o bibliotecário o vê (schema `LibrarianBook`).
// É a página do livro do aluno sem os exemplares e sem a ação sugerida.
export interface LibrarianBook extends Omit<BookPage, 'copies' | 'action'> {
  externalMetadata: ExternalMetadata
  dataSource: DataSource
  unavailableSetAt: string | null
  unavailableSetBy: string | null
  status: BookStatus
  createdBy: string | null
  createdAt: string
  updatedAt: string
}

// Uma página da lista do acervo.
export interface LibrarianBookPage {
  items: LibrarianBook[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// Dados que as fontes externas trouxeram para um ISBN (GET /librarian/books/isbn/{isbn}).
export interface IsbnLookupBook {
  title?: string
  subtitle?: string
  authors?: string[]
  publisher?: string
  year?: number
  synopsis?: string
  subjects?: string[]
  coverUrl?: string
}

export interface IsbnLookup {
  found: boolean
  sources: BookMetadataSource[]
  openLibraryKey?: string | null
  book: IsbnLookupBook
}

// Um exemplar do cadastro (POST /librarian/books).
export interface NewCopy {
  registration: string
  format?: string
  libraryCode: string
  acquisitionYear?: number
}

// Corpo de POST /librarian/books.
export interface CreateBookBody {
  isbn?: string
  title: string
  subtitle?: string
  authors: string[]
  publisher?: string
  edition?: string
  year?: number
  subjects?: string[]
  synopsis?: string
  coverUrl?: string
  cdu: string
  cutter: string
  shelf: string
  copies: NewCopy[]
}

// Corpo de PATCH /librarian/books/{id}: só os campos que mudaram.
export interface UpdateBookBody {
  title?: string
  subtitle?: string | null
  authors?: string[]
  publisher?: string | null
  edition?: string | null
  year?: number | null
  subjects?: string[]
  synopsis?: string | null
  coverUrl?: string | null
  cdu?: string
  cutter?: string
  shelf?: string
  isbn?: string | null
  unavailableForNewRequests?: boolean
}

// Resposta de POST /librarian/books/{id}/sync.
export interface SyncBookResult {
  book: LibrarianBook
  changedFields: SyncField[]
}
