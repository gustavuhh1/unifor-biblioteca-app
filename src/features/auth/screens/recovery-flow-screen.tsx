import { useState } from 'react'
import { TOKEN_RESEND_COOLDOWN_SECONDS } from '../auth.constants'
import {
  TOKEN_ERROR_CODES,
  getAuthErrorMessage,
  hasApiErrorCode,
  isPasskeyCancelled,
} from '../auth.errors'
import { useCreatePasskey } from '../hooks/use-create-passkey'
import { useGoToLogin } from '../hooks/use-go-to-login'
import {
  usePasswordRecover,
  usePasswordReset,
} from '../hooks/use-password-recovery'
import { usePasswordLogin } from '../hooks/use-password-login'
import type { NewPasswordForm } from '../schemas/recovery.schemas'
import { NewPasswordScreen } from './new-password-screen'
import { PasswordResetScreen } from './password-reset-screen'
import { RecoverPasswordScreen } from './recover-password-screen'
import { RecoveryTokenScreen } from './recovery-token-screen'

type RecoveryStep = 'matricula' | 'token' | 'password' | 'done'

// Segundos que ainda faltam até `deadline` (um instante em milissegundos).
function secondsUntil(deadline: number): number {
  return Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
}

// Recuperar senha (RF-AUT-08, RF-AUT-09 e RF-AUT-16): Matrícula, Token, Nova
// senha e Senha redefinida. A API não tem rota que só confere o token: ele vai
// junto com a nova senha, e um token recusado volta ao passo do token. O token e
// a senha nova ficam só no estado deste container.
export function RecoveryFlowScreen() {
  const goToLogin = useGoToLogin()
  const recover = usePasswordRecover()
  const reset = usePasswordReset()
  const passwordLogin = usePasswordLogin()
  const createPasskey = useCreatePasskey()

  const [step, setStep] = useState<RecoveryStep>('matricula')
  const [matricula, setMatricula] = useState('')
  const [message, setMessage] = useState('')
  const [token, setToken] = useState('')
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  // Quando o próximo token pode ser pedido, e a espera ao abrir o passo.
  const [resendAt, setResendAt] = useState(0)
  const [resendWaitSeconds, setResendWaitSeconds] = useState(0)
  // O que o aluno escolheu em "Senha redefinida", para o carregando certo.
  const [choice, setChoice] = useState<'password' | 'passkey' | null>(null)

  function startResendWait() {
    setResendAt(Date.now() + TOKEN_RESEND_COOLDOWN_SECONDS * 1000)
    setResendWaitSeconds(TOKEN_RESEND_COOLDOWN_SECONDS)
    return TOKEN_RESEND_COOLDOWN_SECONDS
  }

  async function requestToken(value: string) {
    const response = await recover.mutateAsync(value)
    setMatricula(value)
    setMessage(response.message)
    setTokenError(null)
    startResendWait()
    setStep('token')
  }

  async function resendToken() {
    await recover.mutateAsync(matricula)
    return startResendWait()
  }

  function backToToken(error: string | null) {
    setTokenError(error)
    setResendWaitSeconds(secondsUntil(resendAt))
    setStep('token')
  }

  async function resetPassword(values: NewPasswordForm) {
    try {
      await reset.mutateAsync({ matricula, token, ...values })
    } catch (error) {
      if (hasApiErrorCode(error, TOKEN_ERROR_CODES)) {
        backToToken(error.message)
        return
      }
      throw error
    }
    setPassword(values.password)
    setStep('done')
  }

  // Ao entrar, o app troca para a área do aluno sozinho; a criação do passkey
  // continua por trás da folha da biometria.
  async function signInAndCreatePasskey() {
    setChoice('passkey')
    try {
      await passwordLogin.mutateAsync({ matricula, password })
      await createPasskey.mutateAsync(undefined)
    } catch {
      // O erro fica no estado das mutações e aparece na tela, se ela ainda
      // estiver aberta.
    }
  }

  if (step === 'token') {
    return (
      <RecoveryTokenScreen
        message={message}
        resendWaitSeconds={resendWaitSeconds}
        tokenError={tokenError}
        onContinue={(value) => {
          setToken(value)
          setStep('password')
        }}
        onResend={resendToken}
        onBack={() => setStep('matricula')}
      />
    )
  }

  if (step === 'password') {
    return (
      <NewPasswordScreen
        onSubmit={resetPassword}
        onBack={() => backToToken(null)}
      />
    )
  }

  if (step === 'done') {
    const passkeyFailed =
      createPasskey.error && !isPasskeyCancelled(createPasskey.error)
    const error =
      passwordLogin.error ?? (passkeyFailed ? createPasskey.error : null)
    return (
      <PasswordResetScreen
        creatingPasskey={
          choice === 'passkey' &&
          (passwordLogin.isPending || createPasskey.isPending)
        }
        signingIn={choice === 'password' && passwordLogin.isPending}
        errorMessage={error ? getAuthErrorMessage(error) : null}
        onCreatePasskey={() => void signInAndCreatePasskey()}
        onSignInWithPassword={() => {
          setChoice('password')
          passwordLogin.mutate({ matricula, password })
        }}
      />
    )
  }

  return (
    <RecoverPasswordScreen
      defaultMatricula={matricula}
      onSubmit={requestToken}
      onBack={goToLogin}
    />
  )
}
