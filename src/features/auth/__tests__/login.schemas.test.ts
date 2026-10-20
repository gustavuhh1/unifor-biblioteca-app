import {
  passkeyLoginSchema,
  passwordLoginSchema,
} from '../schemas/login.schemas'

describe('passwordLoginSchema', () => {
  it('aceita matrícula de 7 dígitos e senha preenchida', () => {
    expect(
      passwordLoginSchema.safeParse({
        matricula: '2412858',
        password: 'senha-ficticia',
      }).success,
    ).toBe(true)
  })

  it('recusa matrícula que não tem 7 dígitos', () => {
    for (const matricula of ['', '241285', '24128589', '24128a8']) {
      const result = passwordLoginSchema.safeParse({
        matricula,
        password: 'senha-ficticia',
      })
      expect(result.success).toBe(false)
    }
  })

  it('recusa senha vazia, com mensagem em português', () => {
    const result = passwordLoginSchema.safeParse({
      matricula: '2412858',
      password: '',
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Digite sua senha.')
  })
})

describe('passkeyLoginSchema', () => {
  it('só confere a matrícula', () => {
    expect(passkeyLoginSchema.safeParse({ matricula: '2412858' }).success).toBe(
      true,
    )
    expect(passkeyLoginSchema.safeParse({ matricula: '12' }).success).toBe(
      false,
    )
  })
})
