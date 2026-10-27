import type { BookSummary } from '@/features/catalog/catalog.types'

// Tipos exclusivos de Salvos (schemas do Swagger de /me/saved e /me/folders).

// Livro salvo: o resumo do livro mais quando foi salvo e em quais pastas está.
export interface SavedBook extends BookSummary {
  savedAt: string
  folderIds: string[]
}

// Resposta de GET /me/saved: "Todos os salvos" ou os livros de uma pasta.
export interface SavedBooksResponse {
  items: SavedBook[]
}

// Pasta de Salvos com a quantidade de livros.
export interface SavedFolder {
  id: string
  name: string
  bookCount: number
}

// Resposta de GET /me/folders: quantos livros estão em "Todos os salvos" e as pastas.
export interface FoldersResponse {
  savedCount: number
  items: SavedFolder[]
}
