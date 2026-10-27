import { useEffect, useState } from 'react'
import { CONFIRM_COUNTDOWN_REFRESH_MS } from '../queues.constants'

// A hora de agora, atualizada de tempos em tempos, para a contagem "Confirme em
// 18h 40min" andar com a tela aberta (RF-FIL-06).
export function useNow(intervalMs: number = CONFIRM_COUNTDOWN_REFRESH_MS) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])
  return now
}
