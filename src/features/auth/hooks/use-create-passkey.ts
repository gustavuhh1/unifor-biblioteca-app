import { useMutation } from '@tanstack/react-query'
import { Platform } from 'react-native'
import { Passkey } from 'react-native-passkey'
import {
  postPasskeyCreationOptions,
  postPasskeyRegister,
} from '../api/auth.api'
import { buildDeviceName, withRequiredFields } from '../auth.passkey'

// Cria um passkey neste aparelho para quem está logado (RF-AUT, passkey):
// a API dá as opções, o celular cria o par de chaves e a API guarda a pública.
export function useCreatePasskey() {
  return useMutation({
    mutationFn: async () => {
      const options = await postPasskeyCreationOptions()
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
