import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  deleteFolder,
  deleteFolderBook,
  deleteSavedBook,
  patchFolder,
  postFolder,
  putFolderBook,
  putSavedBook,
} from '../api/saved.api'
import { FOLDERS_QUERY_KEY, SAVED_QUERY_KEY } from '../saved.constants'

// Depois de qualquer ação, relê os livros salvos e as pastas (contadores).
function useRefreshSaved() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: [SAVED_QUERY_KEY] }),
      queryClient.invalidateQueries({ queryKey: [FOLDERS_QUERY_KEY] }),
    ])
}

// Salva ou tira dos salvos um livro (RF-SAL-01).
export function useToggleSaved() {
  const refresh = useRefreshSaved()
  return useMutation({
    mutationFn: async ({
      bookId,
      saved,
    }: {
      bookId: string
      saved: boolean
    }) => {
      await (saved ? deleteSavedBook(bookId) : putSavedBook(bookId))
    },
    onSuccess: refresh,
  })
}

// Cria uma pasta (RF-SAL-02).
export function useCreateFolder() {
  const refresh = useRefreshSaved()
  return useMutation({
    mutationFn: (name: string) => postFolder(name),
    onSuccess: refresh,
  })
}

// Renomeia uma pasta (RF-SAL-02).
export function useRenameFolder() {
  const refresh = useRefreshSaved()
  return useMutation({
    mutationFn: ({ folderId, name }: { folderId: string; name: string }) =>
      patchFolder(folderId, name),
    onSuccess: refresh,
  })
}

// Apaga uma pasta; os livros continuam em "Todos os salvos" (RF-SAL-02).
export function useDeleteFolder() {
  const refresh = useRefreshSaved()
  return useMutation({
    mutationFn: (folderId: string) => deleteFolder(folderId),
    onSuccess: refresh,
  })
}

// Coloca um livro numa pasta ou tira dela (RF-SAL-03).
export function useSetBookInFolder() {
  const refresh = useRefreshSaved()
  return useMutation({
    mutationFn: async ({
      folderId,
      bookId,
      inFolder,
    }: {
      folderId: string
      bookId: string
      inFolder: boolean
    }) => {
      await (inFolder
        ? deleteFolderBook(folderId, bookId)
        : putFolderBook(folderId, bookId))
    },
    onSuccess: refresh,
  })
}
