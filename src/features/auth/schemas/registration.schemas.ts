import { z } from 'zod'
import { EMAIL_TOKEN_LENGTH, PASSWORD_MIN_LENGTH } from '../auth.constants'
import { matriculaSchema } from './login.schemas'

// E-mail institucional (RF-AUT-02): só a expressão regular do final
// @edu.unifor.br, sem consultar a Unifor.
export const institutionalEmailSchema = z
  .email({ error: 'Digite um e-mail válido.' })
  .refine((email) => email.toLowerCase().endsWith('@edu.unifor.br'), {
    error: 'Use o e-mail institucional, terminado em @edu.unifor.br.',
  })

// Senha: só números, no mínimo 8 dígitos (decisão de 19/10), no cadastro e na
// redefinição.
export const newPasswordSchema = z
  .string()
  .regex(new RegExp(`^\\d{${PASSWORD_MIN_LENGTH},}$`), {
    error: `Use uma senha numérica de pelo menos ${PASSWORD_MIN_LENGTH} dígitos.`,
  })

// Token de 6 dígitos enviado ao e-mail (confirmação e recuperação).
export const emailTokenSchema = z
  .string()
  .regex(new RegExp(`^\\d{${EMAIL_TOKEN_LENGTH}}$`), {
    error: 'Digite os seis dígitos do token.',
  })

// Formulário do token (confirmação do e-mail e recuperação de senha).
export const emailTokenFormSchema = z.object({ token: emailTokenSchema })
export type EmailTokenForm = z.infer<typeof emailTokenFormSchema>

// Senha e confirmação, com os nomes de campo da API.
export const passwordPairFields = {
  password: newPasswordSchema,
  passwordConfirmation: z.string(),
}

// A confirmação precisa repetir a senha; o erro aparece no campo da confirmação.
export function passwordsMatch(values: {
  password: string
  passwordConfirmation: string
}): boolean {
  return values.password === values.passwordConfirmation
}
export const PASSWORDS_MISMATCH = {
  error: 'As senhas não são iguais.',
  path: ['passwordConfirmation'],
}

// Formulário do cadastro (RF-AUT-01 e RF-AUT-02): e-mail institucional,
// matrícula, senha e confirmação, com os nomes de campo da API.
export const signupSchema = z
  .object({
    email: z.string().trim().pipe(institutionalEmailSchema),
    matricula: matriculaSchema,
    ...passwordPairFields,
  })
  .refine(passwordsMatch, PASSWORDS_MISMATCH)
export type SignupForm = z.infer<typeof signupSchema>
