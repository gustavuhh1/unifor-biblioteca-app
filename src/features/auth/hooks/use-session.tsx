import { useQuery, useQueryClient } from '@tanstack/react-query'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { apiClient } from '@/shared/api/client'
import { ApiError } from '@/shared/api/errors'
import { auth } from '@/shared/config/firebase'
import type { UserRole } from '@/shared/types'
import { getMe } from '../api/auth.api'
import { ME_QUERY_KEY } from '../auth.constants'
import { AUTH_MESSAGE, getAuthErrorMessage } from '../auth.errors'
import type { Me, SessionStatus } from '../auth.types'

interface SessionValue {
  status: SessionStatus
  // Dados de /me; null sem sessão.
  user: Me | null
  role: UserRole | null
  // Aviso para a tela de login (ex.: "Sua sessão expirou", tela A79).
  notice: string | null
  clearNotice: () => void
  // Erro ao carregar /me com a sessão aberta (status "error").
  error: unknown
  retry: () => void
}

const SessionContext = createContext<SessionValue | null>(null)

// Provedor da sessão: acompanha o Firebase Auth, busca /me e entrega o usuário
// com o perfil (aluno ou bibliotecário). Um 401 da API desfaz a sessão e deixa
// o aviso "Sua sessão expirou" para o login (RF-AUT, sessão).
export function SessionProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  // undefined = o Firebase ainda está restaurando a sessão do aparelho.
  const [firebaseUser, setFirebaseUser] = useState<User | null | undefined>(
    undefined,
  )
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => onAuthStateChanged(auth, setFirebaseUser), [])

  const endSession = useCallback(
    (message: string) => {
      setNotice(message)
      queryClient.clear()
      signOut(auth).catch(() => {})
    },
    [queryClient],
  )

  useEffect(() => {
    apiClient.setUnauthorizedHandler(() =>
      endSession(AUTH_MESSAGE.sessionExpired),
    )
    return () => apiClient.setUnauthorizedHandler(undefined)
  }, [endSession])

  const meQuery = useQuery({
    queryKey: ME_QUERY_KEY,
    // Conta sem perfil ou desativada (403): sai e avisa no login.
    queryFn: async () => {
      try {
        return await getMe()
      } catch (error) {
        if (error instanceof ApiError && error.status === 403) {
          endSession(getAuthErrorMessage(error))
        }
        throw error
      }
    },
    enabled: firebaseUser != null,
    retry: false,
  })
  const forbidden =
    meQuery.error instanceof ApiError && meQuery.error.status === 403

  const clearNotice = useCallback(() => setNotice(null), [])
  const { refetch } = meQuery
  const retry = useCallback(() => void refetch(), [refetch])

  let status: SessionStatus
  if (firebaseUser === undefined) status = 'loading'
  else if (firebaseUser === null) status = 'signedOut'
  else if (meQuery.data) status = 'signedIn'
  else if (meQuery.error && !forbidden) status = 'error'
  else status = 'loading'

  const user = firebaseUser ? (meQuery.data ?? null) : null
  const value = useMemo<SessionValue>(
    () => ({
      status,
      user,
      role: user?.role ?? null,
      notice,
      clearNotice,
      error: meQuery.error,
      retry,
    }),
    [status, user, notice, clearNotice, meQuery.error, retry],
  )

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  )
}

// Sessão atual. Só funciona dentro do SessionProvider.
export function useSession(): SessionValue {
  const value = useContext(SessionContext)
  if (!value) {
    throw new Error('useSession precisa estar dentro do SessionProvider.')
  }
  return value
}
