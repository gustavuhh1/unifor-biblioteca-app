import { pluralize } from './plural'

describe('pluralize', () => {
  it('usa o singular para 1', () => {
    expect(pluralize(1, 'exemplar', 'exemplares')).toBe('1 exemplar')
  })

  it('usa o plural para 0 e para mais de 1', () => {
    expect(pluralize(0, 'exemplar', 'exemplares')).toBe('0 exemplares')
    expect(pluralize(3, 'exemplar', 'exemplares')).toBe('3 exemplares')
  })
})
