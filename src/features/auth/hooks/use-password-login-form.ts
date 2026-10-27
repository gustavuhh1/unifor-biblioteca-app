import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { getAuthErrorMessage } from '../auth.errors'
import {
  passwordLoginSchema,
  type PasswordLoginForm,
} from '../schemas/login.schemas'
import { usePasswordLogin } from './use-password-login'

// Formulário de matrícula e senha (RF-AUT-06 e RF-AUT-07): valida com o schema,
// entra pelo Firebase e entrega a mensagem de erro já em português. O aluno e o
// bibliotecário usam o mesmo formulário; o perfil vem de GET /me depois do login.
export function usePasswordLoginForm() {
  const passwordLogin = usePasswordLogin()
  const form = useForm<PasswordLoginForm>({
    resolver: zodResolver(passwordLoginSchema),
    defaultValues: { matricula: '', password: '' },
  })
  const errorMessage = passwordLogin.error
    ? getAuthErrorMessage(passwordLogin.error)
    : null

  // `beforeSubmit` roda só com o formulário válido, antes de chamar o Firebase.
  function submit(beforeSubmit?: () => void) {
    void form.handleSubmit((values) => {
      beforeSubmit?.()
      passwordLogin.mutate(values)
    })()
  }

  return { form, passwordLogin, errorMessage, submit }
}
