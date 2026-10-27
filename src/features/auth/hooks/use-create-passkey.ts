import { useMutation } from '@tanstack/react-query'
import { Platform } from 'react-native'
import { Passkey, type PasskeyCreateRequest } from 'react-native-passkey'
import {
  postPasskeyCreationOptions,
  postPasskeyRegister,
} from '../api/auth.api'
import { buildDeviceName, withRequiredFields } from '../auth.passkey'

// Cria um passkey neste aparelho (RF-AUT-04, RF-AUT-09 e RF-AUT-10): o celular
// cria o par de chaves e a API guarda só a pública. No fim do cadastro as
// opções vêm de POST /auth/signup/confirm, sem sessão; sem opções, pede à API
// em nome de quem está logado (POST /auth/passkeys).
export function useCreatePasskey() {
  return useMutation({
    mutationFn: async (passkeyOptions?: PasskeyCreateRequest) => {
      const options = passkeyOptions ?? (await postPasskeyCreationOptions())
      const created = await Passkey.create(options)
      return postPasskeyRegister({
        response: withRequiredFields(created),
        deviceName: buildDeviceName(
          Platform.constants as { Brand?: string; Model?: string },
        ),
      })
    },
  })
}
