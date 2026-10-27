import { useEffect, useState } from 'react'

// A hora de agora, atualizada a cada `intervalMs`, para a tela conferir se uma
// ação proposta venceu sem ler o relógio dentro da renderização.
export function useNow(intervalMs: number): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])
  return now
}
