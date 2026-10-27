import { librarianBookMeta } from '../librarian-catalog.format'

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
