import { applyApiFieldErrors } from './form-errors'
import { ApiError } from './errors'

describe('applyApiFieldErrors', () => {
  it('marca nos campos do formulário os erros de `fields` da API (RF-AUT-01)', () => {
    const setError = jest.fn()
    const error = new ApiError(409, {
      code: 'signup_conflict',
      message: 'Matrícula ou e-mail já cadastrados.',
      fields: [
        { field: 'email', message: 'Este e-mail já tem conta.' },
        { field: 'matricula', message: 'Esta matrícula já tem conta.' },
      ],
    })

    expect(applyApiFieldErrors(error, setError, ['email', 'matricula'])).toBe(
      true,
    )
    expect(setError).toHaveBeenCalledWith('email', {
      type: 'server',
      message: 'Este e-mail já tem conta.',
    })
    expect(setError).toHaveBeenCalledWith('matricula', {
      type: 'server',
      message: 'Esta matrícula já tem conta.',
    })
  })

  it('ignora campos que o formulário não tem', () => {
    const setError = jest.fn()
    const error = new ApiError(400, {
      code: 'validation_error',
      message: 'Dados inválidos.',
      fields: [{ field: 'outro', message: 'Campo de outra tela.' }],
    })

    expect(applyApiFieldErrors(error, setError, ['email'])).toBe(false)
    expect(setError).not.toHaveBeenCalled()
  })

  it('devolve false para erro sem `fields` ou que não é da API', () => {
    const setError = jest.fn()
    const semCampos = new ApiError(502, {
      code: 'email_delivery_failed',
      message: 'Não foi possível enviar o e-mail.',
    })

    expect(applyApiFieldErrors(semCampos, setError, ['email'])).toBe(false)
    expect(applyApiFieldErrors(new Error('x'), setError, ['email'])).toBe(false)
    expect(setError).not.toHaveBeenCalled()
  })
})
