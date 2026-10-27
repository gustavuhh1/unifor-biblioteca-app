import {
  applyLookupToForm,
  buildCopies,
  buildCreateBody,
  buildUpdateBody,
  dataSourceNote,
  fieldsText,
  formValuesFromBook,
  isIsbnLike,
  librarianBookMeta,
  lookupFields,
  normalizeIsbn,
  parseAuthors,
  sourcesText,
  syncPreview,
  type BookFormValues,
} from '../librarian-catalog.format'
import type { LibrarianBook } from '../librarian-catalog.types'

function makeBook(overrides: Partial<LibrarianBook> = {}): LibrarianBook {
  return {
    id: 'b1',
    workId: 'w1',
    isbn: '9780132350884',
    title: 'Código Limpo',
    subtitle: null,
    authors: ['Martin, Robert C.'],
    translators: [],
    publisher: 'Alta Books',
    publicationPlace: null,
    edition: '1. ed.',
    year: 2011,
    language: 'pt-BR',
    materialType: 'Livro',
    series: null,
    subjects: [],
    synopsis: null,
    coverUrl: null,
    coverTone: 1,
    cdu: '005.1',
    cutter: 'M386c',
    shelf: 'Estante 005.1',
    location: 'Biblioteca (Praça Central)',
    externalMetadata: { sources: ['open_library'], found: true },
    dataSource: 'mixed',
    copiesTotal: 3,
    copiesAvailable: 0,
    queueLength: 1,
    nextReturnAt: null,
    unavailableForNewRequests: false,
    unavailableSetAt: null,
    unavailableSetBy: null,
    status: 'active',
    createdBy: null,
    createdAt: '2026-10-01T12:00:00.000Z',
    updatedAt: '2026-10-01T12:00:00.000Z',
    ...overrides,
  }
}

function makeValues(overrides: Partial<BookFormValues> = {}): BookFormValues {
  return {
    isbn: '978-0-13-235088-4',
    title: ' Código Limpo ',
    authors: 'Martin, Robert C.; Fowler, Martin',
    publisher: 'Alta Books',
    edition: '',
    year: '2011',
    cdu: '005.1',
    cutter: 'M386c',
    shelf: 'Estante 005.1',
    copies: '2',
    ...overrides,
  }
}

describe('librarianBookMeta (cartão da lista do acervo, RF-GAC-01)', () => {
  const base = {
    copiesTotal: 3,
    queueLength: 0,
    shelf: 'Estante 005.1',
    unavailableForNewRequests: false,
  }

  it('mostra os exemplares e a estante quando não há fila', () => {
    expect(librarianBookMeta(base)).toBe('3 exemplares · Estante 005.1')
  })

  it('troca a estante pela fila quando há gente esperando', () => {
    expect(librarianBookMeta({ ...base, queueLength: 4 })).toBe(
      '3 exemplares · 4 na fila',
    )
  })

  it('usa o singular com um exemplar', () => {
    expect(librarianBookMeta({ ...base, copiesTotal: 1 })).toBe(
      '1 exemplar · Estante 005.1',
    )
  })

  it('avisa quando o livro está indisponível para novos pedidos', () => {
    expect(
      librarianBookMeta({ ...base, unavailableForNewRequests: true }),
    ).toBe('3 exemplares · Estante 005.1 · Indisponível para novos pedidos')
  })
})

describe('ISBN (RF-GAC-02)', () => {
  it('guarda só os dígitos', () => {
    expect(normalizeIsbn('978-85-7608-267-5')).toBe('9788576082675')
  })

  it('aceita 10 ou 13 dígitos', () => {
    expect(isIsbnLike('9780132350884')).toBe(true)
    expect(isIsbnLike('0-13-235088-2')).toBe(true)
    expect(isIsbnLike('12345')).toBe(false)
    expect(isIsbnLike('')).toBe(false)
  })
})

describe('parseAuthors', () => {
  it('separa por ponto e vírgula ou por linha e ignora vazios', () => {
    expect(
      parseAuthors('Martin, Robert C.; Fowler, Martin;\n  ; Beck'),
    ).toEqual(['Martin, Robert C.', 'Fowler, Martin', 'Beck'])
  })
})

describe('buildCopies (exemplares do cadastro)', () => {
  it('gera um registro único por exemplar a partir do instante do cadastro', () => {
    const copies = buildCopies(2, 1_790_000_000_000, 2026)
    expect(copies.map((c) => c.registration)).toEqual([
      '179000000001',
      '179000000002',
    ])
    expect(copies[0]).toMatchObject({
      format: 'Livro',
      libraryCode: '179000000001 · Biblioteca · Livros',
      acquisitionYear: 2026,
    })
  })
})

describe('buildCreateBody (POST /librarian/books)', () => {
  it('monta o corpo com o ISBN só em dígitos e os dados das fontes', () => {
    const body = buildCreateBody(
      makeValues(),
      { subtitle: 'habilidades', synopsis: 'Texto', subjects: ['Software'] },
      1_790_000_000_000,
      2026,
    )
    expect(body).toMatchObject({
      isbn: '9780132350884',
      title: 'Código Limpo',
      subtitle: 'habilidades',
      authors: ['Martin, Robert C.', 'Fowler, Martin'],
      publisher: 'Alta Books',
      edition: undefined,
      year: 2011,
      subjects: ['Software'],
      synopsis: 'Texto',
      cdu: '005.1',
      cutter: 'M386c',
      shelf: 'Estante 005.1',
    })
    expect(body.copies).toHaveLength(2)
  })

  it('omite o ISBN e os campos das fontes quando não há', () => {
    const body = buildCreateBody(
      makeValues({ isbn: '' }),
      { subjects: [] },
      1_790_000_000_000,
      2026,
    )
    expect(body.isbn).toBeUndefined()
    expect(body.subjects).toBeUndefined()
    expect(body.synopsis).toBeUndefined()
  })
})

describe('buildUpdateBody (PATCH, RF-GAC-03 e RF-GAC-06)', () => {
  const book = makeBook()

  it('fica vazio quando nada mudou', () => {
    const values = makeValues({
      title: 'Código Limpo',
      authors: 'Martin, Robert C.',
      edition: '1. ed.',
    })
    expect(buildUpdateBody(values, book, false)).toEqual({})
  })

  it('manda só os campos que mudaram', () => {
    const values = makeValues({
      title: 'Código Limpo, 2ª edição',
      authors: 'Martin, Robert C.',
      edition: '1. ed.',
      year: '2012',
    })
    expect(buildUpdateBody(values, book, false)).toEqual({
      title: 'Código Limpo, 2ª edição',
      year: 2012,
    })
  })

  it('manda a marca de indisponível quando ela muda', () => {
    const values = makeValues({
      title: 'Código Limpo',
      authors: 'Martin, Robert C.',
      edition: '1. ed.',
    })
    expect(buildUpdateBody(values, book, true)).toEqual({
      unavailableForNewRequests: true,
    })
  })

  it('limpa um campo opcional apagado e o ISBN com null', () => {
    const values = makeValues({
      title: 'Código Limpo',
      authors: 'Martin, Robert C.',
      edition: '',
      isbn: '',
    })
    expect(buildUpdateBody(values, book, false)).toEqual({
      edition: null,
      isbn: null,
    })
  })
})

describe('formValuesFromBook', () => {
  it('traz os campos do livro como texto', () => {
    expect(formValuesFromBook(makeBook({ authors: ['A', 'B'] }))).toMatchObject(
      {
        isbn: '9780132350884',
        authors: 'A; B',
        year: '2011',
        copies: '3',
      },
    )
  })
})

describe('consulta de ISBN nas fontes externas (RF-ACE-04)', () => {
  const lookup = {
    title: 'Clean Code',
    authors: ['Robert C. Martin'],
    publisher: 'Prentice Hall',
    year: 2008,
    synopsis: 'Sinopse da BrasilAPI',
    subjects: ['Software'],
    coverUrl: 'https://capa.exemplo/1.jpg',
  }

  it('lista o que as fontes trouxeram, com o nome de cada campo', () => {
    expect(lookupFields(lookup).map((item) => item.label)).toEqual([
      'Título',
      'Autores',
      'Editora',
      'Ano',
      'Sinopse',
      'Capa',
      'Assuntos',
    ])
  })

  it('no cadastro, preenche só o que ainda está vazio', () => {
    const result = applyLookupToForm(
      makeValues({ isbn: '9780132350884', title: 'Meu título', authors: '' }),
      { subjects: [] },
      lookup,
    )
    expect(result.values.title).toBe('Meu título')
    expect(result.values.authors).toBe('Robert C. Martin')
    expect(result.values.publisher).toBe('Alta Books')
    expect(result.extras.synopsis).toBe('Sinopse da BrasilAPI')
    expect(result.filled).toEqual([
      'authors',
      'synopsis',
      'coverUrl',
      'subjects',
    ])
  })

  it('na atualização, só preenche campo vazio e mantém o resto', () => {
    const preview = syncPreview(makeBook({ synopsis: null }), lookup)
    expect(preview.willFill).toEqual(['synopsis', 'coverUrl', 'subjects'])
    expect(preview.kept).toEqual(['title', 'authors', 'publisher', 'year'])
  })

  it('escreve a lista de campos por extenso', () => {
    expect(fieldsText(['title'])).toBe('Título')
    expect(fieldsText(['title', 'year'])).toBe('Título e Ano')
    expect(fieldsText(['title', 'authors', 'year'])).toBe(
      'Título, Autores e Ano',
    )
  })

  it('nomeia as fontes que responderam', () => {
    expect(sourcesText(['open_library', 'brasil_api'])).toBe(
      'Open Library e BrasilAPI',
    )
    expect(sourcesText(['brasil_api'])).toBe('BrasilAPI')
  })
})

describe('dataSourceNote (de onde vieram os dados)', () => {
  it('diz a origem e a data da última consulta', () => {
    const book = makeBook({
      externalMetadata: {
        sources: ['open_library'],
        found: true,
        lastSyncedAt: '2026-10-26T15:00:00.000Z',
      },
    })
    expect(dataSourceNote(book)).toBe(
      'Dados: fontes externas e cadastro manual · última consulta 26/10/2026',
    )
  })

  it('só diz a origem quando nunca consultou as fontes', () => {
    expect(dataSourceNote(makeBook({ dataSource: 'manual' }))).toBe(
      'Dados: cadastro manual',
    )
  })
})
