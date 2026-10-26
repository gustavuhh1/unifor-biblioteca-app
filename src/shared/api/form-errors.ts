import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ApiError } from './errors'

// Marca nos campos do formulário os erros que a API devolveu em `fields` (ex.:
// matrícula repetida no cadastro). Só marca os campos que o formulário tem e
// devolve true se marcou algum; senão a tela mostra a `message` do erro.
export function applyApiFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  formFields: readonly Path<T>[],
): boolean {
  if (!(error instanceof ApiError) || !error.fields) return false
  let applied = false
  for (const { field, message } of error.fields) {
    const name = formFields.find((formField) => formField === field)
    if (name) {
      setError(name, { type: 'server', message })
      applied = true
    }
  }
  return applied
}
