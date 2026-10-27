import { z } from 'zod'
import { isIsbnLike, parseAuthors } from '../librarian-catalog.format'

// Limites de tamanho do contrato (docs/api-openapi.json, POST /librarian/books).
const MAX_TITLE = 300
const MAX_AUTHOR = 200
const MAX_PUBLISHER = 200
const MAX_EDITION = 100
const MAX_CDU = 30
const MAX_CUTTER = 30
const MAX_SHELF = 60

function required(message: string, max: number) {
  return z
    .string()
    .trim()
    .min(1, { error: message })
    .max(max, { error: `Use até ${max} caracteres.` })
}

// Formulário de livro (RF-GAC-02 e RF-GAC-03). No cadastro o número de exemplares
// é obrigatório; na edição ele só aparece e não é conferido.
export function makeBookFormSchema(requireCopies: boolean) {
  return z.object({
    isbn: z
      .string()
      .trim()
      .refine((value) => value === '' || isIsbnLike(value), {
        error: 'O ISBN tem 10 ou 13 dígitos.',
      }),
    title: required('Informe o título.', MAX_TITLE),
    authors: z
      .string()
      .trim()
      .min(1, { error: 'Informe os autores.' })
      .refine(
        (value) => parseAuthors(value).every((a) => a.length <= MAX_AUTHOR),
        { error: `Cada autor aceita até ${MAX_AUTHOR} caracteres.` },
      ),
    publisher: required('Informe a editora.', MAX_PUBLISHER),
    edition: z
      .string()
      .trim()
      .max(MAX_EDITION, { error: `Use até ${MAX_EDITION} caracteres.` }),
    year: z
      .string()
      .trim()
      .regex(/^\d{4}$/, { error: 'Informe 4 dígitos.' }),
    cdu: required('Informe a CDU.', MAX_CDU),
    cutter: required('Informe o Cutter.', MAX_CUTTER),
    shelf: required('Informe a estante.', MAX_SHELF),
    copies: requireCopies
      ? z
          .string()
          .trim()
          .regex(/^[1-9]\d*$/, { error: 'Informe pelo menos 1 exemplar.' })
      : z.string(),
  })
}

// Nomes dos campos do formulário, para marcar os erros que a API devolve.
export const BOOK_FORM_FIELDS = [
  'isbn',
  'title',
  'authors',
  'publisher',
  'edition',
  'year',
  'cdu',
  'cutter',
  'shelf',
  'copies',
] as const
