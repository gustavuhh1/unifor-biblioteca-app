import { useQuery } from '@tanstack/react-query'
import { getAssistantConversation } from '../api/assistant.api'
import { ASSISTANT_QUERY_KEY } from '../assistant.constants'

// A conversa do aluno com o Assistente (RF-ASS-01): GET /me/assistant/messages.
export function useAssistantConversation() {
  return useQuery({
    queryKey: ASSISTANT_QUERY_KEY,
    queryFn: getAssistantConversation,
  })
}
