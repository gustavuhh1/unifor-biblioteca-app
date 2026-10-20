import { z } from 'zod'
import { MATRICULA_LENGTH } from '../auth.constants'

// Matrícula de 7 dígitos (RF-AUT, login).
export const matriculaSchema = z
  .string()
  .regex(new RegExp(`^\\d{${MATRICULA_LENGTH}}$`), {
    error: `A matrícula tem ${MATRICULA_LENGTH} dígitos.`,
  })

// Formulário do login com matrícula e senha. A regra da senha (só números, 8 ou
// mais) vale no cadastro; aqui só confere que a senha foi digitada.
export const passwordLoginSchema = z.object({
  matricula: matriculaSchema,
  password: z.string().min(1, { error: 'Digite sua senha.' }),
})
export type PasswordLoginForm = z.infer<typeof passwordLoginSchema>

// Formulário do login com passkey: só a matrícula.
export const passkeyLoginSchema = z.object({ matricula: matriculaSchema })
export type PasskeyLoginForm = z.infer<typeof passkeyLoginSchema>
