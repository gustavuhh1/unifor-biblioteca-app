import { useQuery } from '@tanstack/react-query'
import { getFolders, getSavedBooks } from '../api/saved.api'
import { FOLDERS_QUERY_KEY, SAVED_QUERY_KEY } from '../saved.constants'

// Livros salvos (RF-SAL-01): "Todos os salvos" ou os de uma pasta (RF-SAL-03).
export function useSavedBooks(folderId?: string) {
  return useQuery({
    queryKey: [SAVED_QUERY_KEY, folderId ?? 'all'],
    queryFn: () => getSavedBooks(folderId),
    select: (data) => data.items,
  })
}

// Pastas do aluno e o total de "Todos os salvos" (RF-SAL-02).
export function useFolders() {
  return useQuery({
    queryKey: [FOLDERS_QUERY_KEY],
    queryFn: getFolders,
  })
}
