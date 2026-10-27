import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ME_QUERY_KEY } from '@/features/auth/auth.constants'
import { BOOK_QUERY_KEY } from '@/features/catalog/catalog.constants'
import { MY_LOANS_QUERY_KEY } from '@/features/loans/loans.constants'
import { MY_QUEUES_QUERY_KEY } from '@/features/queues/queues.constants'
import {
  postCancelAssistantAction,
  postConfirmAssistantAction,
} from '../api/assistant.api'
import { replaceAction } from '../assistant.format'
import { ASSISTANT_QUERY_KEY } from '../assistant.constants'
import type { AssistantAction, AssistantConversation } from '../assistant.types'

// Guarda no cache a ação que mudou, para o cartão da conversa se atualizar.
function useSaveAction() {
  const queryClient = useQueryClient()
  return (action: AssistantAction) =>
    queryClient.setQueryData<AssistantConversation>(
      ASSISTANT_QUERY_KEY,
      (conversation) => replaceAction(conversation, action),
    )
}

// Confirma a ação proposta (RF-ASS-04): POST /me/assistant/actions/{id}/confirm.
// Cria o pedido ou a entrada na fila, então atualiza o Início, o Perfil, Meus
// empréstimos, as filas e a página dos livros envolvidos. Se a API recusar (a
// regra mudou ou o tempo acabou), relê a conversa para o cartão mostrar o estado.
export function useConfirmAssistantAction() {
  const queryClient = useQueryClient()
  const saveAction = useSaveAction()
  return useMutation({
    mutationFn: (actionId: string) => postConfirmAssistantAction(actionId),
    onSuccess: ({ action }) => {
      saveAction(action)
      void queryClient.invalidateQueries({ queryKey: ME_QUERY_KEY })
      void queryClient.invalidateQueries({ queryKey: [MY_LOANS_QUERY_KEY] })
      void queryClient.invalidateQueries({ queryKey: [MY_QUEUES_QUERY_KEY] })
      for (const book of action.books) {
        void queryClient.invalidateQueries({
          queryKey: [BOOK_QUERY_KEY, book.id],
        })
      }
    },
    onError: () => {
      void queryClient.invalidateQueries({ queryKey: ASSISTANT_QUERY_KEY })
    },
  })
}

// Cancela a ação proposta (RF-ASS-04): POST /me/assistant/actions/{id}/cancel.
export function useCancelAssistantAction() {
  const queryClient = useQueryClient()
  const saveAction = useSaveAction()
  return useMutation({
    mutationFn: (actionId: string) => postCancelAssistantAction(actionId),
    onSuccess: ({ action }) => saveAction(action),
    onError: () => {
      void queryClient.invalidateQueries({ queryKey: ASSISTANT_QUERY_KEY })
    },
  })
}
