import { buildDeviceName, withRequiredFields } from '../auth.passkey'

describe('withRequiredFields', () => {
  it('completa rawId, type e clientExtensionResults que o celular omitiu', () => {
    const result = withRequiredFields({ id: 'abc', response: { x: 1 } })

    expect(result.rawId).toBe('abc')
    expect(result.type).toBe('public-key')
    expect(result.clientExtensionResults).toEqual({})
    expect(result.response).toEqual({ x: 1 })
  })

  it('mantém o que o celular já mandou', () => {
    const result = withRequiredFields({
      id: 'abc',
      rawId: 'raw',
      clientExtensionResults: { credProps: { rk: true } },
    })

    expect(result.rawId).toBe('raw')
    expect(result.clientExtensionResults).toEqual({ credProps: { rk: true } })
  })
})

describe('buildDeviceName', () => {
  it('junta marca e modelo', () => {
    expect(buildDeviceName({ Brand: 'google', Model: 'Pixel 6a' })).toBe(
      'google Pixel 6a',
    )
  })

  it('usa um nome padrão quando o sistema não informa nada', () => {
    expect(buildDeviceName({})).toBe('Aparelho Android')
  })

  it('corta em 60 caracteres, o limite da API', () => {
    expect(buildDeviceName({ Model: 'x'.repeat(100) })).toHaveLength(60)
  })
})
