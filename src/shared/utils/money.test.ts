import { formatCents } from './money'

describe('formatCents (dinheiro em centavos da API)', () => {
  it('escreve reais e centavos com vírgula', () => {
    expect(formatCents(600)).toBe('R$ 6,00')
    expect(formatCents(250)).toBe('R$ 2,50')
  })

  it('completa os centavos com zero à esquerda', () => {
    expect(formatCents(5)).toBe('R$ 0,05')
    expect(formatCents(0)).toBe('R$ 0,00')
  })

  it('separa os milhares com ponto', () => {
    expect(formatCents(123456)).toBe('R$ 1.234,56')
    expect(formatCents(100000000)).toBe('R$ 1.000.000,00')
  })
})
