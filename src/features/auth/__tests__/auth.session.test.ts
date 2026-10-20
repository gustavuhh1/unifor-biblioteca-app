import {
  buildAuthEmail,
  resolveAccessGroup,
  signOutEverywhere,
} from '../auth.session'

describe('resolveAccessGroup', () => {
  it('leva quem não tem sessão para o acesso (auth)', () => {
    expect(resolveAccessGroup('signedOut', null)).toBe('(auth)')
  })

  it('leva o aluno para (student)', () => {
    expect(resolveAccessGroup('signedIn', 'student')).toBe('(student)')
  })

  it('leva o bibliotecário para (librarian)', () => {
    expect(resolveAccessGroup('signedIn', 'librarian')).toBe('(librarian)')
  })

  it('não decide nada enquanto a sessão carrega ou falhou', () => {
    expect(resolveAccessGroup('loading', null)).toBeNull()
    expect(resolveAccessGroup('error', null)).toBeNull()
  })
})

describe('buildAuthEmail', () => {
  it('monta o e-mail interno da conta a partir da matrícula', () => {
    expect(buildAuthEmail('2412858')).toBe('2412858@contas.uni-books.app')
    expect(buildAuthEmail(' 2412858 ')).toBe('2412858@contas.uni-books.app')
  })
})

describe('signOutEverywhere', () => {
  it('chama a API e depois sai do Firebase, nessa ordem', async () => {
    const calls: string[] = []
    const result = await signOutEverywhere({
      callApiLogout: async () => void calls.push('api'),
      signOutFirebase: async () => void calls.push('firebase'),
    })

    expect(calls).toEqual(['api', 'firebase'])
    expect(result.apiError).toBeNull()
  })

  it('sai do Firebase mesmo quando a API falha e devolve o erro', async () => {
    const failure = new Error('API fora do ar')
    const signOutFirebase = jest.fn(async () => {})

    const result = await signOutEverywhere({
      callApiLogout: async () => {
        throw failure
      },
      signOutFirebase,
    })

    expect(signOutFirebase).toHaveBeenCalledTimes(1)
    expect(result.apiError).toBe(failure)
  })
})
