import type { BookMetadataSource } from '@/shared/types'
import { formatDate } from '@/shared/utils/dates'
import { pluralize } from '@/shared/utils/plural'
import {
  BOOK_SOURCE_LABEL,
  COPY_FORMAT,
  COPY_LIBRARY_LABEL,
  DATA_SOURCE_LABEL,
  ISBN_LENGTHS,
  SYNC_FIELD_LABEL,
  SYNC_FIELDS,
} from './librarian-catalog.constants'
import type {
  CreateBookBody,
  IsbnLookupBook,
  LibrarianBook,
  NewCopy,
  SyncField,
  UpdateBookBody,
} from './librarian-catalog.types'

// Textos e conversões da gestão do acervo (RF-GAC-01 a RF-GAC-06).

// Linha de apoio do cartão da lista: "3 exemplares · 1 na fila · Estante 005.1".
export function librarianBookMeta(
  book: Pick<
    LibrarianBook,
    'copiesTotal' | 'queueLength' | 'shelf' | 'unavailableForNewRequests'
  >,
): string {
  const parts = [pluralize(book.copiesTotal, 'exemplar', 'exemplares')]
  parts.push(book.queueLength > 0 ? `${book.queueLength} na fila` : book.shelf)
  if (book.unavailableForNewRequests) {
    parts.push('Indisponível para novos pedidos')
  }
  return parts.join(' · ')
}

// ---------------------------------------------------------------------------
// Formulário de livro (B21 a B23): conversões entre o que se digita e o contrato.
// ---------------------------------------------------------------------------

// Valores do formulário de livro, todos como texto digitado.
export interface BookFormValues {
  isbn: string
  title: string
  // Autores separados por ponto e vírgula ou por linha.
  authors: string
  publisher: string
  edition: string
  year: string
  cdu: string
  cutter: string
  shelf: string
  // Quantidade de exemplares do cadastro (na edição só aparece, não muda).
  copies: string
}

// Dados que só vêm das fontes externas e não têm campo no formulário.
export interface BookFormExtras {
  subtitle?: string
  synopsis?: string
  coverUrl?: string
  subjects: string[]
}

// Só os dígitos do ISBN: "978-85-7608-267-5" vira "9788576082675".
export function normalizeIsbn(text: string): string {
  return text.replace(/\D/g, '')
}

// ISBN com 10 ou 13 dígitos (a API confere o resto na consulta).
export function isIsbnLike(text: string): boolean {
  return ISBN_LENGTHS.some((length) => normalizeIsbn(text).length === length)
}

// "Martin, Robert C.; Fowler, Martin" vira ["Martin, Robert C.", "Fowler, Martin"].
export function parseAuthors(text: string): string[] {
  return text
    .split(/[;\n]/)
    .map((author) => author.trim())
    .filter(Boolean)
}

// Lista de autores como o campo mostra: separados por "; ".
export function formatAuthorsField(authors: string[]): string {
  return authors.join('; ')
}

// Exemplares do cadastro. A API exige `registration` (único) e `libraryCode` por
// exemplar, e o design só pede a quantidade: o registro sai do instante do
// cadastro (segundos + posição) e o código da biblioteca repete o registro.
export function buildCopies(
  count: number,
  now: number,
  year: number,
): NewCopy[] {
  const seconds = Math.floor(now / 1000)
  return Array.from({ length: count }, (_, index) => {
    const registration = `${seconds}${String(index + 1).padStart(2, '0')}`
    return {
      registration,
      format: COPY_FORMAT,
      libraryCode: `${registration} · ${COPY_LIBRARY_LABEL}`,
      acquisitionYear: year,
    }
  })
}

// Texto vazio vira undefined, para o campo opcional nem seguir no corpo.
function optional(text: string | undefined): string | undefined {
  const trimmed = text?.trim()
  return trimmed ? trimmed : undefined
}

// Corpo de POST /librarian/books (RF-GAC-02).
export function buildCreateBody(
  values: BookFormValues,
  extras: BookFormExtras,
  now: number,
  year: number,
): CreateBookBody {
  const isbn = normalizeIsbn(values.isbn)
  return {
    isbn: isbn || undefined,
    title: values.title.trim(),
    subtitle: optional(extras.subtitle),
    authors: parseAuthors(values.authors),
    publisher: optional(values.publisher),
    edition: optional(values.edition),
    year: Number(values.year),
    subjects: extras.subjects.length > 0 ? extras.subjects : undefined,
    synopsis: optional(extras.synopsis),
    coverUrl: optional(extras.coverUrl),
    cdu: values.cdu.trim(),
    cutter: values.cutter.trim(),
    shelf: values.shelf.trim(),
    copies: buildCopies(Number(values.copies), now, year),
  }
}

// Valores do formulário a partir de um livro já cadastrado (edição, B22).
export function formValuesFromBook(book: LibrarianBook): BookFormValues {
  return {
    isbn: book.isbn ?? '',
    title: book.title,
    authors: formatAuthorsField(book.authors),
    publisher: book.publisher ?? '',
    edition: book.edition ?? '',
    year: book.year ? String(book.year) : '',
    cdu: book.cdu,
    cutter: book.cutter,
    shelf: book.shelf,
    copies: String(book.copiesTotal),
  }
}

function sameList(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((item, index) => item === b[index])
}

// Corpo de PATCH /librarian/books/{id}: só o que mudou em relação ao livro
// (RF-GAC-03 e RF-GAC-06). Vazio quando nada mudou.
export function buildUpdateBody(
  values: BookFormValues,
  book: LibrarianBook,
  unavailableForNewRequests: boolean,
): UpdateBookBody {
  const body: UpdateBookBody = {}
  const authors = parseAuthors(values.authors)
  const isbn = normalizeIsbn(values.isbn)
  const publisher = optional(values.publisher) ?? null
  const edition = optional(values.edition) ?? null
  const year = values.year.trim() ? Number(values.year) : null

  if (values.title.trim() !== book.title) body.title = values.title.trim()
  if (!sameList(authors, book.authors)) body.authors = authors
  if (publisher !== book.publisher) body.publisher = publisher
  if (edition !== book.edition) body.edition = edition
  if (year !== book.year) body.year = year
  if (values.cdu.trim() !== book.cdu) body.cdu = values.cdu.trim()
  if (values.cutter.trim() !== book.cutter) body.cutter = values.cutter.trim()
  if (values.shelf.trim() !== book.shelf) body.shelf = values.shelf.trim()
  if ((isbn || null) !== book.isbn) body.isbn = isbn || null
  if (unavailableForNewRequests !== book.unavailableForNewRequests) {
    body.unavailableForNewRequests = unavailableForNewRequests
  }
  return body
}

// "Open Library e BrasilAPI", "Open Library" ou "BrasilAPI".
export function sourcesText(sources: BookMetadataSource[]): string {
  return sources.map((source) => BOOK_SOURCE_LABEL[source]).join(' e ')
}

// De onde vieram os dados do livro, para a edição: "Dados: fontes externas ·
// última consulta 27/10/2026".
export function dataSourceNote(book: LibrarianBook): string {
  const lastSync = book.externalMetadata.lastSyncedAt
  const origin = `Dados: ${DATA_SOURCE_LABEL[book.dataSource]}`
  return lastSync
    ? `${origin} · última consulta ${formatDate(lastSync)}`
    : origin
}

// Valor que a consulta trouxe para um campo, como texto (ou null quando não
// trouxe nada para ele).
function lookupValue(lookup: IsbnLookupBook, field: SyncField): string | null {
  switch (field) {
    case 'title':
      return optional(lookup.title) ?? null
    case 'subtitle':
      return optional(lookup.subtitle) ?? null
    case 'authors':
      return lookup.authors?.length ? formatAuthorsField(lookup.authors) : null
    case 'publisher':
      return optional(lookup.publisher) ?? null
    case 'year':
      return lookup.year ? String(lookup.year) : null
    case 'synopsis':
      return optional(lookup.synopsis) ?? null
    case 'coverUrl':
      return optional(lookup.coverUrl) ?? null
    case 'subjects':
      return lookup.subjects?.length ? lookup.subjects.join('; ') : null
  }
}

// O que a consulta trouxe, campo a campo, na ordem das telas B21 e B23.
export function lookupFields(
  lookup: IsbnLookupBook,
): { field: SyncField; label: string; value: string }[] {
  return SYNC_FIELDS.flatMap((field) => {
    const value = lookupValue(lookup, field)
    return value ? [{ field, label: SYNC_FIELD_LABEL[field], value }] : []
  })
}

// Cadastro (B21): preenche com a consulta só o que ainda está vazio no
// formulário e devolve quais campos foram preenchidos.
export function applyLookupToForm(
  values: BookFormValues,
  extras: BookFormExtras,
  lookup: IsbnLookupBook,
): { values: BookFormValues; extras: BookFormExtras; filled: SyncField[] } {
  const next = { ...values }
  const nextExtras = { ...extras }
  const filled: SyncField[] = []

  if (!values.title.trim() && optional(lookup.title)) {
    next.title = lookup.title!.trim()
    filled.push('title')
  }
  if (!values.authors.trim() && lookup.authors?.length) {
    next.authors = formatAuthorsField(lookup.authors)
    filled.push('authors')
  }
  if (!values.publisher.trim() && optional(lookup.publisher)) {
    next.publisher = lookup.publisher!.trim()
    filled.push('publisher')
  }
  if (!values.year.trim() && lookup.year) {
    next.year = String(lookup.year)
    filled.push('year')
  }
  if (!extras.subtitle && optional(lookup.subtitle)) {
    nextExtras.subtitle = lookup.subtitle!.trim()
    filled.push('subtitle')
  }
  if (!extras.synopsis && optional(lookup.synopsis)) {
    nextExtras.synopsis = lookup.synopsis!.trim()
    filled.push('synopsis')
  }
  if (!extras.coverUrl && optional(lookup.coverUrl)) {
    nextExtras.coverUrl = lookup.coverUrl!.trim()
    filled.push('coverUrl')
  }
  if (extras.subjects.length === 0 && lookup.subjects?.length) {
    nextExtras.subjects = lookup.subjects
    filled.push('subjects')
  }
  return { values: next, extras: nextExtras, filled }
}

// Campo do livro que está vazio, no sentido da atualização pelas fontes.
function isEmptyField(book: LibrarianBook, field: SyncField): boolean {
  switch (field) {
    case 'title':
      return !book.title.trim()
    case 'subtitle':
      return !book.subtitle
    case 'authors':
      return book.authors.length === 0
    case 'publisher':
      return !book.publisher
    case 'year':
      return !book.year
    case 'synopsis':
      return !book.synopsis
    case 'coverUrl':
      return !book.coverUrl
    case 'subjects':
      return book.subjects.length === 0
  }
}

// Atualização (B23): só preenche campo vazio. Separa o que a consulta vai
// preencher do que o livro já tem e a consulta não troca.
export function syncPreview(
  book: LibrarianBook,
  lookup: IsbnLookupBook,
): { willFill: SyncField[]; kept: SyncField[] } {
  const found = lookupFields(lookup).map(({ field }) => field)
  return {
    willFill: found.filter((field) => isEmptyField(book, field)),
    kept: found.filter((field) => !isEmptyField(book, field)),
  }
}

// "Título, Autores e Ano" a partir da lista de campos.
export function fieldsText(fields: SyncField[]): string {
  const labels = fields.map((field) => SYNC_FIELD_LABEL[field])
  if (labels.length <= 1) return labels.join('')
  return `${labels.slice(0, -1).join(', ')} e ${labels[labels.length - 1]}`
}
