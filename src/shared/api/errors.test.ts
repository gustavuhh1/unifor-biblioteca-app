import { ApiError, parseApiError } from './errors'

describe('parseApiError', () => {
  it('usa o corpo no formato da API', () => {
    const error = parseApiError(409, {
      code: 'matricula_taken',
      message: 'Esta matrícula já tem conta.',
      fields: [{ field: 'matricula', message: 'Já cadastrada.' }],
    })

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(409)
    expect(error.code).toBe('matricula_taken')
    expect(error.message).toBe('Esta matrícula já tem conta.')
    expect(error.fields).toEqual([
      { field: 'matricula', message: 'Já cadastrada.' },
    ])
  })

  it('guarda retryAfterSeconds para o contador "Reenviar em"', () => {
    const error = parseApiError(429, {
      code: 'too_many_requests',
      message: 'Aguarde.',
      retryAfterSeconds: 60,
    })
    expect(error.retryAfterSeconds).toBe(60)
  })

  it('ignora fields e retryAfterSeconds fora do formato', () => {
    const error = parseApiError(400, {
      code: 'x',
      message: 'y',
      fields: 'nada',
      retryAfterSeconds: '10',
    })
    expect(error.fields).toBeUndefined()
    expect(error.retryAfterSeconds).toBeUndefined()
  })

  it('vira erro de sessão no 401 sem corpo da API', () => {
    const error = parseApiError(401, '<html>')
    expect(error.code).toBe('unauthorized')
    expect(error.message).toBe('Sua sessão expirou. Entre novamente.')
  })

  it('vira erro genérico em português quando o corpo não é da API', () => {
    const error = parseApiError(500, undefined)
    expect(error.code).toBe('unknown_error')
    expect(error.message).toBe('Algo deu errado. Tente de novo.')
  })
})
