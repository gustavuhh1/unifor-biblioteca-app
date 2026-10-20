import { useMutation } from '@tanstack/react-query'
import { signInWithCustomToken } from 'firebase/auth'
import { Passkey } from 'react-native-passkey'
import { auth } from '@/shared/config/firebase'
import {
  postPasskeyLoginOptions,
  postPasskeyLoginVerify,
} from '../api/auth.api'
import {
  AUTH_FLOW_ERROR_CODE,
  AUTH_MESSAGE,
  AuthFlowError,
} from '../auth.errors'
import { withRequiredFields } from '../auth.passkey'
import type { PasskeyLoginForm } from '../schemas/login.schemas'

// Login com passkey (RF-AUT): pede o desafio à API, o celular assina
// (digital, rosto ou PIN), a API confere e devolve um custom token, que o
// Firebase troca pela sessão.
export function usePasskeyLogin() {
  return useMutation({
    mutationFn: async ({ matricula }: PasskeyLoginForm) => {
      const options = await postPasskeyLoginOptions(matricula)
      // A API responde igual para matrícula desconhecida, de bibliotecário ou
      // sem passkey: lista vazia e nenhum desafio guardado.
      if (!options.allowCredentials?.length) {
        throw new AuthFlowError(
          AUTH_FLOW_ERROR_CODE.noPasskey,
          AUTH_MESSAGE.noPasskey,
        )
      }
      const assertion = await Passkey.get(options)
      const { customToken } = await postPasskeyLoginVerify({
        response: withRequiredFields(assertion),
      })
      return signInWithCustomToken(auth, customToken)
    },
  })
}
