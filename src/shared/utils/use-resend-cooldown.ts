import { useCallback, useEffect, useState } from 'react'

export function useResendCooldown(initialSeconds = 42) {
  const [deadline, setDeadline] = useState(
    () => Date.now() + initialSeconds * 1000,
  )
  const [seconds, setSeconds] = useState(() =>
    Math.max(0, Math.ceil(initialSeconds)),
  )

  useEffect(() => {
    const update = () =>
      setSeconds(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)))
    update()
    if (deadline <= Date.now()) return
    const timer = setInterval(() => {
      update()
      if (deadline <= Date.now()) clearInterval(timer)
    }, 250)
    return () => clearInterval(timer)
  }, [deadline])

  const restart = useCallback(() => {
    const duration = 42
    setSeconds(duration)
    setDeadline(Date.now() + duration * 1000)
  }, [])

  return {
    waiting: seconds > 0,
    label: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`,
    restart,
  }
}
