import { PASSKEY_DEVICE_NAME_MAX_LENGTH } from './auth.constants'

// Nome do aparelho quando o sistema não informa marca nem modelo.
const DEFAULT_DEVICE_NAME = 'Aparelho Android'

// A API exige `rawId`, `type` e `clientExtensionResults`, que o celular pode
// omitir na resposta. Completa o que faltar antes de enviar (RF-AUT, passkey).
export function withRequiredFields<T extends { id: string; rawId?: string }>(
  result: T,
) {
  return {
    ...result,
    rawId: result.rawId ?? result.id,
    type: 'public-key' as const,
    clientExtensionResults:
      (result as { clientExtensionResults?: object }).clientExtensionResults ??
      {},
  }
}

// Nome que aparece em Meus passkeys, ex.: "Google Pixel 6a" (até 60 caracteres).
export function buildDeviceName(constants: {
  Brand?: string
  Model?: string
}): string {
  const name = [constants.Brand, constants.Model].filter(Boolean).join(' ')
  return (name || DEFAULT_DEVICE_NAME).slice(0, PASSKEY_DEVICE_NAME_MAX_LENGTH)
}
