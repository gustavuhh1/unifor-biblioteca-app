import { QueryClient } from '@tanstack/react-query'

// Cliente do TanStack Query do app: dados da API com cache de 30 segundos e
// uma nova tentativa só em falha de rede (erros da API não se repetem sozinhos).
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1 },
  },
})
