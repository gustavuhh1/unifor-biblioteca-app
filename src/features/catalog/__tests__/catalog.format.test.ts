import {
  authorsLine,
  bookDescription,
  bookLocationText,
  publicationText,
  bookCardMeta,
  bookStatus,
  copiesText,
  bookCoverTone,
  nextReturnText,
  queueText,
  reservationsText,
  shelfText,
  callNumberText,
} from '../catalog.format'
import type { BookPage, BookSummary } from '../catalog.types'

function makeBook(overrides: Partial<BookSummary> = {}): BookSummary {
  return {
    id: 'b1',
    title: 'Código Limpo',
    authors: ['Martin, Robert C.'],
    coverUrl: null,
    coverTone: 3,
    copiesTotal: 3,
    copiesAvailable: 2,
    queueLength: 0,
    nextReturnAt: null,
    unavailableForNewRequests: false,
    ...overrides,
  }
}

describe('textos do acervo', () => {
  it('marca Disponível com exemplar na estante e Emprestado sem nenhum', () => {
    expect(bookStatus(makeBook())).toBe('disponivel')
    expect(bookStatus(makeBook({ copiesAvailable: 0 }))).toBe('emprestado')
  })

  it('usa o tom da API e volta ao tom 1 quando ele sai de 1 a 6', () => {
    expect(bookCoverTone(makeBook({ coverTone: 5 }))).toBe(5)
    expect(bookCoverTone(makeBook({ coverTone: 0 }))).toBe(1)
    expect(bookCoverTone(makeBook({ coverTone: 9 }))).toBe(1)
  })

  it('junta os autores e avisa quando não há nenhum', () => {
    expect(authorsLine(['A', 'B'])).toBe('A; B')
    expect(authorsLine([])).toBe('Autoria não informada')
  })

  it('conta os exemplares na estante', () => {
    expect(copiesText(makeBook())).toBe('2 de 3 exemplares na estante')
    expect(copiesText(makeBook({ copiesTotal: 1, copiesAvailable: 0 }))).toBe(
      '0 de 1 exemplar na estante',
    )
    expect(copiesText(makeBook({ copiesTotal: 0, copiesAvailable: 0 }))).toBe(
      'Nenhum exemplar cadastrado',
    )
  })

  it('diz quantas pessoas estão na fila', () => {
    expect(queueText(0)).toBe('Ninguém na fila')
    expect(queueText(1)).toBe('1 pessoa na fila')
    expect(queueText(4)).toBe('4 pessoas na fila')
  })

  it('mostra a devolução prevista só quando não há exemplar na estante', () => {
    const iso = '2026-10-24T15:00:00.000Z'
    expect(nextReturnText(makeBook({ nextReturnAt: iso }))).toBeNull()
    expect(
      nextReturnText(makeBook({ copiesAvailable: 0, nextReturnAt: iso })),
    ).toBe('Devolução prevista: 24/10')
    expect(nextReturnText(makeBook({ copiesAvailable: 0 }))).toBeNull()
  })

  it('diz quantas reservas há, para o lado da capa na página do livro', () => {
    expect(reservationsText(0)).toBe('Nenhuma reserva')
    expect(reservationsText(1)).toBe('1 reserva na fila')
    expect(reservationsText(3)).toBe('3 reservas na fila')
  })

  it('monta a linha do card como no Figma (A09)', () => {
    expect(bookCardMeta(makeBook())).toBe('2 exemplares na estante')
    expect(bookCardMeta(makeBook({ copiesAvailable: 1 }))).toBe(
      '1 exemplar na estante',
    )
    expect(bookCardMeta(makeBook({ copiesAvailable: 0, queueLength: 1 }))).toBe(
      '1 pessoa na fila · 3 exemplares',
    )
    expect(bookCardMeta(makeBook({ copiesAvailable: 0 }))).toBe(
      'Ninguém na fila: você seria o 1º',
    )
  })

  it('avisa no card que o livro está indisponível para novos pedidos (RF-ACE-08)', () => {
    expect(
      bookCardMeta(
        makeBook({ copiesAvailable: 0, unavailableForNewRequests: true }),
      ),
    ).toBe(['Ninguém na fila', 'Indisponível para novos pedidos'].join('\n'))
    expect(bookCardMeta(makeBook({ unavailableForNewRequests: true }))).toBe(
      ['2 exemplares na estante', 'Indisponível para novos pedidos'].join('\n'),
    )
  })
})

describe('textos da página do livro', () => {
  const page = {
    ...makeBook(),
    materialType: 'Livro impresso',
    edition: '2. ed.',
    publisher: 'Novatec',
    publicationPlace: 'São Paulo',
    year: 2020,
    location: 'Biblioteca (Praça Central)',
    shelf: '005.1',
  } as unknown as BookPage

  it('descreve o livro com material, edição, editora e ano', () => {
    expect(bookDescription(page)).toBe(
      'Livro impresso · 2. ed. · Novatec, 2020',
    )
  })

  it('pula o que a API não informou', () => {
    expect(
      bookDescription({
        ...page,
        edition: null,
        publisher: null,
        year: null,
      }),
    ).toBe('Livro impresso')
  })

  it('monta a publicação e devolve null sem nenhum dado', () => {
    expect(publicationText(page)).toBe('São Paulo : Novatec, 2020')
    expect(
      publicationText({
        ...page,
        publicationPlace: null,
        publisher: null,
        year: null,
      }),
    ).toBeNull()
  })

  it('monta o local com a estante', () => {
    expect(bookLocationText(page)).toBe(
      'Biblioteca (Praça Central) · Estante 005.1',
    )
  })

  it('mostra os exemplares na estante na linha Exemplares (RF-ACE-02)', () => {
    expect(shelfText(page)).toBe('2 de 3 na estante')
  })

  it('junta CDU e Cutter da etiqueta da lombada (RF-ACE-02)', () => {
    expect(callNumberText({ ...page, cdu: '005.1', cutter: 'F787r' })).toBe(
      '005.1 F787r',
    )
  })
})
