import { useState } from 'react'
import type { PasskeyCreateRequest } from 'react-native-passkey'
import { getAuthErrorMessage, isPasskeyCancelled } from '../auth.errors'
import { useCreatePasskey } from '../hooks/use-create-passkey'
import { useGoToLogin } from '../hooks/use-go-to-login'
import { usePasskeyLogin } from '../hooks/use-passkey-login'
import { usePasswordLogin } from '../hooks/use-password-login'
import {
  useSignupConfirm,
  useSignupResend,
  useSignupStart,
} from '../hooks/use-signup'
import type { SignupForm } from '../schemas/registration.schemas'
import { ConfirmEmailScreen } from './confirm-email-screen'
import {
  CreatePasskeyScreen,
  type CreatePasskeyStep,
} from './create-passkey-screen'
import { SignupScreen } from './signup-screen'

type SignupStep = 'data' | 'email' | 'passkey'

// Cadastro do aluno em 3 passos (RF-AUT-01 a RF-AUT-04): Dados, E-mail (token
// de 6 dígitos) e Passkey. A senha e o token ficam só no estado deste
// container, nunca em parâmetros de rota.
export function SignupFlowScreen() {
  const goToLogin = useGoToLogin()
  const signupStart = useSignupStart()
  const signupConfirm = useSignupConfirm()
  const signupResend = useSignupResend()
  const createPasskey = useCreatePasskey()
  const passkeyLogin = usePasskeyLogin()
  const passwordLogin = usePasswordLogin()

  const [step, setStep] = useState<SignupStep>('data')
  const [data, setData] = useState<SignupForm | null>(null)
  const [resendWaitSeconds, setResendWaitSeconds] = useState(0)
  const [passkeyOptions, setPasskeyOptions] =
    useState<PasskeyCreateRequest | null>(null)
  const [passkeyStep, setPasskeyStep] = useState<CreatePasskeyStep>('create')

  async function submitData(values: SignupForm) {
    const pending = await signupStart.mutateAsync(values)
    setData(values)
    setResendWaitSeconds(pending.resendAvailableInSeconds)
    setStep('email')
  }

  async function confirmEmail(matricula: string, token: string) {
    const confirmed = await signupConfirm.mutateAsync({ matricula, token })
    setPasskeyOptions(confirmed.passkeyOptions)
    setPasskeyStep('create')
    setStep('passkey')
  }

  async function resendToken(matricula: string) {
    const pending = await signupResend.mutateAsync(matricula)
    return pending.resendAvailableInSeconds
  }

  // Desistir na folha da biometria não é erro: o aluno continua na tela.
  function createDevicePasskey() {
    if (!passkeyOptions) return
    createPasskey.mutate(passkeyOptions, {
      onSuccess: () => setPasskeyStep('done'),
      onError: (error) => {
        if (!isPasskeyCancelled(error)) setPasskeyStep('error')
      },
    })
  }

  if (step === 'email' && data) {
    return (
      <ConfirmEmailScreen
        email={data.email}
        resendWaitSeconds={resendWaitSeconds}
        onConfirm={(token) => confirmEmail(data.matricula, token)}
        onResend={() => resendToken(data.matricula)}
        onCorrectEmail={() => setStep('data')}
        onBack={() => setStep('data')}
      />
    )
  }

  if (step === 'passkey' && data) {
    // Falha ao entrar, pelo passkey ou pela senha do cadastro ("Agora não").
    const signInError = passkeyLogin.error ?? passwordLogin.error
    const signInFailed = signInError && !isPasskeyCancelled(signInError)
    return (
      <CreatePasskeyScreen
        step={passkeyStep}
        createdAt={createPasskey.data?.createdAt}
        creating={createPasskey.isPending}
        signingIn={passkeyLogin.isPending || passwordLogin.isPending}
        signInError={signInFailed ? getAuthErrorMessage(signInError) : null}
        onBack={
          passkeyStep === 'error' ? () => setPasskeyStep('create') : goToLogin
        }
        onCreate={createDevicePasskey}
        onRetry={createDevicePasskey}
        // "Agora não" entra no app com a senha do cadastro (RF-AUT-04); o
        // passkey pode ser criado depois em Meus passkeys.
        onSkip={() =>
          passwordLogin.mutate({
            matricula: data.matricula,
            password: data.password,
          })
        }
        // Depois do passkey criado, entra no app com ele.
        onSignIn={() => passkeyLogin.mutate({ matricula: data.matricula })}
      />
    )
  }

  return (
    <SignupScreen
      defaultValues={data ?? undefined}
      onSubmit={submitData}
      onBack={goToLogin}
      onSignIn={goToLogin}
    />
  )
}
