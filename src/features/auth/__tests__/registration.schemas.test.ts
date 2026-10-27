import {
  emailTokenSchema,
  institutionalEmailSchema,
  newPasswordSchema,
  signupSchema,
} from '../schemas/registration.schemas'
import {
  newPasswordFormSchema,
  recoverPasswordSchema,
} from '../schemas/recovery.schemas'

const signup = {
  email: 'aluno@edu.unifor.br',
  matricula: '2412858',
  password: '12345678',
  passwordConfirmation: '12345678',
}

// Mensagem do primeiro erro de um campo, para conferir o texto em português.
function firstError(
  result: {
    success: boolean
    error?: { issues: { path: PropertyKey[]; message: string }[] }
  },
  field: string,
) {
  return result.error?.issues.find((issue) => issue.path[0] === field)?.message
}

describe('institutionalEmailSchema (RF-AUT-02)', () => {
  it('aceita só e-mail terminado em @edu.unifor.br, sem diferenciar maiúsculas', () => {
    expect(
      institutionalEmailSchema.safeParse('aluno@edu.unifor.br').success,
    ).toBe(true)
    expect(
      institutionalEmailSchema.safeParse('Aluno@EDU.UNIFOR.BR').success,
    ).toBe(true)
    expect(institutionalEmailSchema.safeParse('aluno@unifor.br').success).toBe(
      false,
    )
    expect(institutionalEmailSchema.safeParse('aluno@gmail.com').success).toBe(
      false,
    )
    expect(institutionalEmailSchema.safeParse('não é e-mail').success).toBe(
      false,
    )
  })
})

describe('newPasswordSchema (decisão de 19/10)', () => {
  it('aceita só números, com pelo menos 8 dígitos', () => {
    expect(newPasswordSchema.safeParse('12345678').success).toBe(true)
    expect(newPasswordSchema.safeParse('1234567').success).toBe(false)
    expect(newPasswordSchema.safeParse('abcdefgh').success).toBe(false)
    expect(newPasswordSchema.safeParse('1234 5678').success).toBe(false)
  })
})

describe('emailTokenSchema (RF-AUT-03)', () => {
  it('aceita só os 6 dígitos do token', () => {
    expect(emailTokenSchema.safeParse('482913').success).toBe(true)
    expect(emailTokenSchema.safeParse('48291').success).toBe(false)
    expect(emailTokenSchema.safeParse('48291a').success).toBe(false)
    expect(emailTokenSchema.safeParse('4829131').success).toBe(false)
  })
})

describe('signupSchema (RF-AUT-01)', () => {
  it('aceita o cadastro completo e tira espaços do e-mail', () => {
    const result = signupSchema.safeParse({
      ...signup,
      email: ' aluno@edu.unifor.br ',
    })
    expect(result.success).toBe(true)
    expect(result.data?.email).toBe('aluno@edu.unifor.br')
  })

  it('marca cada campo errado com mensagem em português', () => {
    const result = signupSchema.safeParse({
      email: 'aluno@gmail.com',
      matricula: '241285',
      password: '123',
      passwordConfirmation: '123',
    })
    expect(firstError(result, 'email')).toBe(
      'Use o e-mail institucional, terminado em @edu.unifor.br.',
    )
    expect(firstError(result, 'matricula')).toBe('A matrícula tem 7 dígitos.')
    expect(firstError(result, 'password')).toBe(
      'Use uma senha numérica de pelo menos 8 dígitos.',
    )
  })

  it('mostra no campo da confirmação quando as senhas não são iguais', () => {
    const result = signupSchema.safeParse({
      ...signup,
      passwordConfirmation: '87654321',
    })
    expect(firstError(result, 'passwordConfirmation')).toBe(
      'As senhas não são iguais.',
    )
  })
})

describe('esquemas da recuperação de senha (RF-AUT-08)', () => {
  it('pede só a matrícula de 7 dígitos', () => {
    expect(
      recoverPasswordSchema.safeParse({ matricula: '2412858' }).success,
    ).toBe(true)
    expect(
      recoverPasswordSchema.safeParse({ matricula: '24128' }).success,
    ).toBe(false)
  })

  it('confere a nova senha e a confirmação', () => {
    expect(
      newPasswordFormSchema.safeParse({
        password: '12345678',
        passwordConfirmation: '12345678',
      }).success,
    ).toBe(true)
    const result = newPasswordFormSchema.safeParse({
      password: '12345678',
      passwordConfirmation: '12345679',
    })
    expect(firstError(result, 'passwordConfirmation')).toBe(
      'As senhas não são iguais.',
    )
  })
})
