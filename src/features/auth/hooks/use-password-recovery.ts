import { useMutation } from '@tanstack/react-query'
import { postPasswordRecover, postPasswordReset } from '../api/auth.api'
import type { PasswordResetBody } from '../auth.types'

// Pede o token de recuperação ao e-mail da conta (RF-AUT-08). A API responde a
// mesma mensagem exista a conta ou não.
export function usePasswordRecover() {
  return useMutation({
    mutationFn: (matricula: string) => postPasswordRecover(matricula),
  })
}

// Grava a nova senha com o token (RF-AUT-08). Token errado, vencido ou com
// tentativas demais volta como `token_invalid`, `token_expired_or_used` ou
// `token_attempts_exceeded`.
export function usePasswordReset() {
  return useMutation({
    mutationFn: (body: PasswordResetBody) => postPasswordReset(body),
  })
}
