import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postAssistantMessage } from '../api/assistant.api'
import { appendReply } from '../assistant.format'
import { ASSISTANT_QUERY_KEY } from '../assistant.constants'
import type { AssistantConversation } from '../assistant.types'

// Pergunta ao Assistente (RF-ASS-01, RF-ASS-02 e RF-ASS-03): POST
// /me/assistant/messages. A pergunta e a resposta entram no fim da conversa que
// já está na tela, sem recarregar o histórico.
export function useSendAssistantMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (text: string) => postAssistantMessage(text),
    onSuccess: (reply) => {
      queryClient.setQueryData<AssistantConversation>(
        ASSISTANT_QUERY_KEY,
        (conversation) => appendReply(conversation, reply),
      )
    },
  })
}
