// Domínio do e-mail interno da conta no Firebase: <matrícula>@contas.uni-books.app
// (nunca recebe mensagens; docs/infra.md, AUTH_EMAIL_DOMAIN).
export const AUTH_EMAIL_DOMAIN = 'contas.uni-books.app'

// Matrícula: 7 dígitos, os 2 primeiros são o ano de ingresso.
export const MATRICULA_LENGTH = 7

// Dica do campo Matrícula no login e no cadastro.
export const MATRICULA_HINT =
  '7 dígitos. Os dois primeiros são o ano de ingresso.'

// Senha: só números, mínimo de 8 dígitos (decisão de 19/10).
export const PASSWORD_MIN_LENGTH = 8

// O nome do aparelho no Meus passkeys aceita até 60 caracteres (API).
export const PASSKEY_DEVICE_NAME_MAX_LENGTH = 60

// Chave do TanStack Query para os dados de quem está logado (GET /me).
export const ME_QUERY_KEY = ['me'] as const

// Token de e-mail (confirmação e recuperação): 6 dígitos, vale 20 minutos.
export const EMAIL_TOKEN_LENGTH = 6

// Espera entre dois envios do token (decisão de 19/10). A API manda o valor de
// cada vez (`resendAvailableInSeconds` ou `retryAfterSeconds`); este é o padrão
// quando ela não informa, como na recuperação de senha.
export const TOKEN_RESEND_COOLDOWN_SECONDS = 60

// Etapas do cadastro mostradas no topo das telas A56 a A59.
export const SIGNUP_STEPS = ['Dados', 'E-mail', 'Passkey'] as const
