import { useCallback, useEffect, useState } from 'react'

// "00:42" para o contador "Reenviar em 00:42" (tela A58).
export function formatCountdown(totalSeconds: number): string {
  const seconds = Math.max(0, Math.ceil(totalSeconds))
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`
}

// Contador do botão "Reenviar token". A espera vem da API
// (`resendAvailableInSeconds` ou `retryAfterSeconds`): comece com ela e chame
// `restart` com a nova espera a cada envio.
export function useResendCooldown(initialSeconds: number) {
  const [deadline, setDeadline] = useState(
    () => Date.now() + initialSeconds * 1000,
  )
  const [seconds, setSeconds] = useState(() =>
    Math.max(0, Math.ceil(initialSeconds)),
  )

  useEffect(() => {
    const update = () =>
      setSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)))
    if (deadline <= Date.now()) return
    const timer = setInterval(() => {
      update()
      if (deadline <= Date.now()) clearInterval(timer)
    }, 250)
    return () => clearInterval(timer)
  }, [deadline])

  const restart = useCallback((waitSeconds: number) => {
    setSeconds(Math.max(0, Math.ceil(waitSeconds)))
    setDeadline(Date.now() + waitSeconds * 1000)
  }, [])

  return {
    waiting: seconds > 0,
    label: formatCountdown(seconds),
    restart,
  }
}
