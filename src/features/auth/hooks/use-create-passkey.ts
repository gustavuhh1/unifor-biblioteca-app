import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Passkey, type PasskeyCreateRequest } from 'react-native-passkey'
import {
  postPasskeyCreationOptions,
  postPasskeyRegister,
} from '../api/auth.api'
import { PASSKEYS_QUERY_KEY } from '../auth.constants'
import { currentDeviceName, withRequiredFields } from '../auth.passkey'

// Cria um passkey neste aparelho (RF-AUT-04, RF-AUT-09 e RF-AUT-10): o celular
// cria o par de chaves e a API guarda só a pública. No fim do cadastro as
// opções vêm de POST /auth/signup/confirm, sem sessão; sem opções, pede à API
// em nome de quem está logado (POST /auth/passkeys). Atualiza Meus passkeys.
export function useCreatePasskey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (passkeyOptions?: PasskeyCreateRequest) => {
      const options = passkeyOptions ?? (await postPasskeyCreationOptions())
      const created = await Passkey.create(options)
      return postPasskeyRegister({
        response: withRequiredFields(created),
        deviceName: currentDeviceName(),
      })
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: PASSKEYS_QUERY_KEY }),
  })
}
