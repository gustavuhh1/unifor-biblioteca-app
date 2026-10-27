import { buildQueryString } from './query-string'

describe('buildQueryString', () => {
  it('monta os parâmetros com valor e codifica o texto', () => {
    expect(buildQueryString({ q: 'código limpo', page: 2 })).toBe(
      '?q=c%C3%B3digo%20limpo&page=2',
    )
  })

  it('ignora parâmetros vazios, nulos e indefinidos', () => {
    expect(buildQueryString({ q: '', page: undefined, size: null })).toBe('')
  })

  it('mantém o número zero e o valor false', () => {
    expect(buildQueryString({ page: 0, all: false })).toBe('?page=0&all=false')
  })
})
