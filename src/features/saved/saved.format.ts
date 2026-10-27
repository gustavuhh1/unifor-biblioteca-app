import { ApiError } from '@/shared/api/errors'
import { pluralize } from '@/shared/utils/plural'
import { SAVED_MESSAGE } from './saved.constants'

// "Nenhum livro", "1 livro" ou "3 livros" na linha da pasta (A18).
export function bookCountText(count: number): string {
  return count === 0 ? 'Nenhum livro' : pluralize(count, 'livro', 'livros')
}

// Mensagem de erro para o aluno: a da API (já em português) ou a genérica.
export function savedErrorMessage(error: unknown): string {
  return error instanceof ApiError
    ? error.message
    : SAVED_MESSAGE.genericFailure
}

// Diz se o livro está salvo e em quais pastas, a partir da lista "Todos os salvos".
export function savedStateOf(
  items: readonly { id: string; folderIds: string[] }[] | undefined,
  bookId: string,
): { saved: boolean; folderIds: string[] } {
  const found = items?.find((item) => item.id === bookId)
  return { saved: Boolean(found), folderIds: found?.folderIds ?? [] }
}
