import { ApiError } from '@/shared/api/errors'
import {
  AUTH_FLOW_ERROR_CODE,
  AUTH_MESSAGE,
  AuthFlowError,
  getAuthErrorMessage,
  isPasskeyCancelled,
} from '../auth.errors'

describe('getAuthErrorMessage', () => {
  it('mostra a mensagem que a API já mandou em português', () => {
    const error = new ApiError(409, {
      code: 'passkey_exists',
      message: 'Este aparelho já tem passkey.',
    })
    expect(getAuthErrorMessage(error)).toBe('Este aparelho já tem passkey.')
  })

  it('mostra a mensagem dos erros dos fluxos de acesso', () => {
    const error = new AuthFlowError(
      AUTH_FLOW_ERROR_CODE.noPasskey,
      AUTH_MESSAGE.noPasskey,
    )
    expect(getAuthErrorMessage(error)).toBe(AUTH_MESSAGE.noPasskey)
  })

  it('traduz credencial errada do Firebase para "Matrícula ou senha incorretos."', () => {
    for (const code of [
      'auth/invalid-credential',
      'auth/user-not-found',
      'auth/wrong-password',
    ]) {
      expect(getAuthErrorMessage({ code })).toBe(
        'Matrícula ou senha incorretos.',
      )
    }
  })

  it('traduz excesso de tentativas e conta desativada', () => {
    expect(getAuthErrorMessage({ code: 'auth/too-many-requests' })).toBe(
      AUTH_MESSAGE.tooManyRequests,
    )
    expect(getAuthErrorMessage({ code: 'auth/user-disabled' })).toBe(
      AUTH_MESSAGE.accountDisabled,
    )
  })

  it('traduz falha de rede do Firebase', () => {
    expect(
      getAuthErrorMessage({ code: 'auth/network-request-failed' }),
    ).toMatch(/conexão/)
  })

  it('traduz os erros do passkey no celular', () => {
    expect(getAuthErrorMessage({ error: 'UserCancelled' })).toBe(
      AUTH_MESSAGE.passkeyCancelled,
    )
    expect(getAuthErrorMessage({ error: 'NotSupported' })).toBe(
      AUTH_MESSAGE.passkeyNotSupported,
    )
    expect(getAuthErrorMessage({ error: 'CredentialAlreadyExists' })).toBe(
      AUTH_MESSAGE.passkeyAlreadyExists,
    )
  })

  it('usa a mensagem genérica para erro desconhecido', () => {
    expect(getAuthErrorMessage(new Error('boom'))).toBe(
      AUTH_MESSAGE.genericFailure,
    )
    expect(getAuthErrorMessage(undefined)).toBe(AUTH_MESSAGE.genericFailure)
  })
})

describe('isPasskeyCancelled', () => {
  it('reconhece quando a pessoa desistiu na folha do sistema', () => {
    expect(isPasskeyCancelled({ error: 'UserCancelled' })).toBe(true)
    expect(isPasskeyCancelled({ error: 'NotSupported' })).toBe(false)
    expect(isPasskeyCancelled(new Error('x'))).toBe(false)
  })
})
