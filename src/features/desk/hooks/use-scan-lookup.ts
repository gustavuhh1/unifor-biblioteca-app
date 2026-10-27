import { useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '@/shared/api/errors'
import { DESK_MESSAGE, SCAN_RETRY_DELAY_MS } from '../desk.constants'
import type { DeskLookupResponse } from '../desk.types'
import { useDeskLookup } from './use-desk-lookup'

// Liga o leitor de QR à ficha do aluno (RF-BAL-02): lê uma vez por vez (a câmera
// repete o mesmo QR dezenas de vezes por segundo), consulta a API e chama
// `onFound` com a ficha. Se a leitura falha, mostra o motivo e só aceita outra
// depois de uma pausa; ao voltar para a tela, o leitor destrava.
export function useScanLookup(onFound: (record: DeskLookupResponse) => void) {
  const { mutate, isPending } = useDeskLookup()
  const locked = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useFocusEffect(
    useCallback(() => {
      locked.current = false
      setErrorMessage(null)
    }, []),
  )

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const onScanned = useCallback(
    (qrToken: string) => {
      if (locked.current) return
      locked.current = true
      setErrorMessage(null)
      mutate(
        { qrToken: qrToken.trim() },
        {
          onSuccess: onFound,
          onError: (error) => {
            setErrorMessage(
              error instanceof ApiError
                ? error.message
                : DESK_MESSAGE.unreadableQr,
            )
            timer.current = setTimeout(() => {
              locked.current = false
            }, SCAN_RETRY_DELAY_MS)
          },
        },
      )
    },
    [mutate, onFound],
  )

  return { onScanned, isLooking: isPending, errorMessage }
}
