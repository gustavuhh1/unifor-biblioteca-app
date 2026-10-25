import { z } from 'zod'

export const institutionalEmailSchema = z
  .email({ error: 'Digite um e-mail válido.' })
  .refine((email) => email.toLowerCase().endsWith('@edu.unifor.br'), {
    error: 'Use o e-mail institucional, terminado em @edu.unifor.br.',
  })

export const newPasswordSchema = z.string().regex(/^\d{8,}$/, {
  error: 'Use uma senha numérica de pelo menos 8 dígitos.',
})
