// Domínio do e-mail interno da conta no Firebase: <matrícula>@contas.uni-books.app
// (nunca recebe mensagens; docs/infra.md, AUTH_EMAIL_DOMAIN).
export const AUTH_EMAIL_DOMAIN = 'contas.uni-books.app'

// Matrícula: 7 dígitos, os 2 primeiros são o ano de ingresso.
export const MATRICULA_LENGTH = 7

// Senha: só números, mínimo de 8 dígitos (decisão de 19/10).
export const PASSWORD_MIN_LENGTH = 8

// O nome do aparelho no Meus passkeys aceita até 60 caracteres (API).
export const PASSKEY_DEVICE_NAME_MAX_LENGTH = 60

// Chave do TanStack Query para os dados de quem está logado (GET /me).
export const ME_QUERY_KEY = ['me'] as const
