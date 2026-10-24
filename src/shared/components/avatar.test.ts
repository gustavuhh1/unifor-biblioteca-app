import { initialsOf } from './avatar'

describe('iniciais do avatar (initialsOf)', () => {
  it('usa a primeira letra do primeiro e do último nome', () => {
    expect(initialsOf('Lucas Almeida')).toBe('LA')
    expect(initialsOf('Ana Beatriz Lima')).toBe('AL')
  })

  it('com um nome só, usa uma letra', () => {
    expect(initialsOf('Marina')).toBe('M')
  })

  it('ignora espaços sobrando e põe em maiúsculas', () => {
    expect(initialsOf('  carlos   eduardo  sá ')).toBe('CS')
  })

  it('sem nome, mostra "?"', () => {
    expect(initialsOf('   ')).toBe('?')
    expect(initialsOf('')).toBe('?')
  })
})
