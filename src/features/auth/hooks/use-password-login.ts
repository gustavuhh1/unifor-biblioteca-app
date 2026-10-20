import { useMutation } from '@tanstack/react-query'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/shared/config/firebase'
import { buildAuthEmail } from '../auth.session'
import type { PasswordLoginForm } from '../schemas/login.schemas'

// Login com matrícula e senha, direto no Firebase Auth (não passa pela API).
// Depois do login, o provedor de sessão busca /me e o app troca de grupo.
export function usePasswordLogin() {
  return useMutation({
    mutationFn: ({ matricula, password }: PasswordLoginForm) =>
      signInWithEmailAndPassword(auth, buildAuthEmail(matricula), password),
  })
}
