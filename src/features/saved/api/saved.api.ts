import { apiRequest } from '@/shared/api/client'
import type {
  FoldersResponse,
  SavedBook,
  SavedBooksResponse,
  SavedFolder,
} from '../saved.types'

// Livros salvos: "Todos os salvos" ou os de uma pasta (GET /me/saved).
export function getSavedBooks(folderId?: string) {
  const query = folderId ? `?folderId=${encodeURIComponent(folderId)}` : ''
  return apiRequest<SavedBooksResponse>(`/me/saved${query}`)
}

// Salva um livro em "Todos os salvos" (PUT /me/saved/{bookId}).
export function putSavedBook(bookId: string) {
  return apiRequest<SavedBook>(`/me/saved/${encodeURIComponent(bookId)}`, {
    method: 'PUT',
  })
}

// Tira um livro de "Todos os salvos" e das pastas (DELETE /me/saved/{bookId}).
export function deleteSavedBook(bookId: string) {
  return apiRequest<void>(`/me/saved/${encodeURIComponent(bookId)}`, {
    method: 'DELETE',
  })
}

// Pastas do aluno com a quantidade de livros (GET /me/folders).
export function getFolders() {
  return apiRequest<FoldersResponse>('/me/folders')
}

// Cria uma pasta (POST /me/folders).
export function postFolder(name: string) {
  return apiRequest<SavedFolder>('/me/folders', {
    method: 'POST',
    body: { name },
  })
}

// Renomeia uma pasta (PATCH /me/folders/{folderId}).
export function patchFolder(folderId: string, name: string) {
  return apiRequest<SavedFolder>(
    `/me/folders/${encodeURIComponent(folderId)}`,
    {
      method: 'PATCH',
      body: { name },
    },
  )
}

// Apaga uma pasta; os livros continuam em "Todos os salvos" (DELETE /me/folders/{folderId}).
export function deleteFolder(folderId: string) {
  return apiRequest<void>(`/me/folders/${encodeURIComponent(folderId)}`, {
    method: 'DELETE',
  })
}

function folderBookPath(folderId: string, bookId: string) {
  return `/me/folders/${encodeURIComponent(folderId)}/books/${encodeURIComponent(bookId)}`
}

// Coloca um livro salvo numa pasta (PUT /me/folders/{folderId}/books/{bookId}).
export function putFolderBook(folderId: string, bookId: string) {
  return apiRequest<SavedBook>(folderBookPath(folderId, bookId), {
    method: 'PUT',
  })
}

// Tira um livro de uma pasta (DELETE /me/folders/{folderId}/books/{bookId}).
export function deleteFolderBook(folderId: string, bookId: string) {
  return apiRequest<void>(folderBookPath(folderId, bookId), {
    method: 'DELETE',
  })
}
