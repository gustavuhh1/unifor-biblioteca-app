import { z } from 'zod'
import { matriculaSchema } from './login.schemas'
import {
  PASSWORDS_MISMATCH,
  passwordPairFields,
  passwordsMatch,
} from './registration.schemas'

// Primeiro passo da recuperação de senha (RF-AUT-08): só a matrícula.
export const recoverPasswordSchema = z.object({ matricula: matriculaSchema })
export type RecoverPasswordForm = z.infer<typeof recoverPasswordSchema>

// Nova senha e confirmação (RF-AUT-08), com os nomes de campo da API.
export const newPasswordFormSchema = z
  .object(passwordPairFields)
  .refine(passwordsMatch, PASSWORDS_MISMATCH)
export type NewPasswordForm = z.infer<typeof newPasswordFormSchema>
