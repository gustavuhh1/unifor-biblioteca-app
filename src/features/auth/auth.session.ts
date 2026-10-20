import type { UserRole } from '@/shared/types'
import { USER_ROLE } from '@/shared/types'
import { AUTH_EMAIL_DOMAIN } from './auth.constants'
import type { AccessGroup, SessionStatus } from './auth.types'

// Monta o e-mail interno da conta no Firebase a partir da matrícula (RF-AUT, login).
export function buildAuthEmail(matricula: string): string {
  return `${matricula.trim()}@${AUTH_EMAIL_DOMAIN}`
}

// Decide para qual grupo de rotas a pessoa vai: sem sessão, o acesso (auth);
// aluno, (student); bibliotecário, (librarian). Devolve null enquanto a sessão
// ainda carrega (ou falhou), para o app não trocar de tela antes da hora.
export function resolveAccessGroup(
  status: SessionStatus,
  role: UserRole | null,
): AccessGroup | null {
  if (status === 'signedOut') return '(auth)'
  if (status !== 'signedIn') return null
  return role === USER_ROLE.librarian ? '(librarian)' : '(student)'
}

// Sai da conta: chama o logout da API (que revoga a sessão) e, aconteça o que
// acontecer, sai do Firebase em seguida. Se a API falhar, sai assim mesmo e o
// erro da API é devolvido para quem chamou decidir se mostra (RF-AUT, logout).
export async function signOutEverywhere({
  callApiLogout,
  signOutFirebase,
}: {
  callApiLogout: () => Promise<unknown>
  signOutFirebase: () => Promise<unknown>
}): Promise<{ apiError: unknown }> {
  let apiError: unknown = null
  try {
    await callApiLogout()
  } catch (error) {
    apiError = error
  }
  await signOutFirebase()
  return { apiError }
}
