import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Text } from 'react-native'
import { Button, PlaceholderScreen, TextField } from '@/shared/components'
import { getAuthErrorMessage, isPasskeyCancelled } from '../auth.errors'
import { usePasskeyLogin } from '../hooks/use-passkey-login'
import { usePasswordLogin } from '../hooks/use-password-login'
import { useSession } from '../hooks/use-session'
import {
  passwordLoginSchema,
  type PasswordLoginForm,
} from '../schemas/login.schemas'

// Login provisório (A62): matrícula + passkey, ou matrícula + senha. A tela de
// verdade (passkey primeiro, "Outras formas de entrar") entra numa próxima tarefa.
export function LoginScreen() {
  const { notice, clearNotice } = useSession()
  const passwordLogin = usePasswordLogin()
  const passkeyLogin = usePasskeyLogin()
  const form = useForm<PasswordLoginForm>({
    resolver: zodResolver(passwordLoginSchema),
    defaultValues: { matricula: '', password: '' },
  })

  // O aviso (ex.: "Sua sessão expirou") some quando a pessoa sai da tela.
  useEffect(() => clearNotice, [clearNotice])

  const failure = passkeyLogin.error ?? passwordLogin.error
  const failureMessage =
    failure && !isPasskeyCancelled(failure)
      ? getAuthErrorMessage(failure)
      : null
  const busy = passwordLogin.isPending || passkeyLogin.isPending

  async function submitPasskey() {
    if (!(await form.trigger('matricula'))) return
    passwordLogin.reset()
    passkeyLogin.mutate({ matricula: form.getValues('matricula') })
  }

  return (
    <PlaceholderScreen title="Entrar" code="A62">
      {notice ? <Text className="text-body text-danger">{notice}</Text> : null}

      <Controller
        control={form.control}
        name="matricula"
        render={({ field, fieldState }) => (
          <TextField
            label="Matrícula"
            icon="user"
            inputMode="numeric"
            maxLength={7}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <TextField
            label="Senha"
            icon="lock"
            type="password"
            inputMode="numeric"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />

      {failureMessage ? (
        <Text className="text-body text-danger">{failureMessage}</Text>
      ) : null}

      <Button
        block
        icon="fingerprint"
        loading={passkeyLogin.isPending}
        disabled={busy && !passkeyLogin.isPending}
        onPress={submitPasskey}
      >
        Entrar com passkey
      </Button>
      <Button
        block
        variant="secondary"
        loading={passwordLogin.isPending}
        disabled={busy && !passwordLogin.isPending}
        onPress={() =>
          void form.handleSubmit((values) => {
            passkeyLogin.reset()
            passwordLogin.mutate(values)
          })()
        }
      >
        Entrar com senha
      </Button>
    </PlaceholderScreen>
  )
}
