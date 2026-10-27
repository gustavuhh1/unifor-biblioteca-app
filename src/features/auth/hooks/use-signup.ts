import { useMutation } from '@tanstack/react-query'
import {
  postSignupConfirm,
  postSignupResend,
  postSignupStart,
} from '../api/auth.api'
import type { SignupStartBody } from '../auth.types'

// Primeiro passo do cadastro (RF-AUT-01 e RF-AUT-02): a API cria a conta
// desativada e manda o token ao e-mail. Erros: 400 com `fields`, 409
// `signup_conflict` (campos repetidos), 429 e 502.
export function useSignupStart() {
  return useMutation({
    mutationFn: (body: SignupStartBody) => postSignupStart(body),
  })
}

// Confirma o e-mail com o token (RF-AUT-03) e recebe as opções do passkey.
export function useSignupConfirm() {
  return useMutation({
    mutationFn: (body: { matricula: string; token: string }) =>
      postSignupConfirm(body),
  })
}

// Reenvia o token de confirmação (RF-AUT-03). Antes de 60 segundos a API
// responde 429 com `retryAfterSeconds`.
export function useSignupResend() {
  return useMutation({
    mutationFn: (matricula: string) => postSignupResend(matricula),
  })
}
