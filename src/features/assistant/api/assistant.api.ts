import { apiRequest } from '@/shared/api/client'
import type {
  AssistantActionCancelled,
  AssistantActionConfirmed,
  AssistantConversation,
  AssistantReply,
} from '../assistant.types'

// A conversa com o Assistente (GET /me/assistant/messages).
export function getAssistantConversation() {
  return apiRequest<AssistantConversation>('/me/assistant/messages')
}

// Pergunta ao Assistente (POST /me/assistant/messages): devolve a pergunta salva
// e a resposta, que pode trazer livros e uma ação para confirmar.
export function postAssistantMessage(text: string) {
  return apiRequest<AssistantReply>('/me/assistant/messages', {
    method: 'POST',
    body: { text },
  })
}

// Confirma a ação proposta (POST /me/assistant/actions/{id}/confirm): cria o
// pedido ou a entrada na fila com as mesmas regras do aluno.
export function postConfirmAssistantAction(actionId: string) {
  return apiRequest<AssistantActionConfirmed>(
    `/me/assistant/actions/${encodeURIComponent(actionId)}/confirm`,
    { method: 'POST' },
  )
}

// Cancela a ação proposta (POST /me/assistant/actions/{id}/cancel).
export function postCancelAssistantAction(actionId: string) {
  return apiRequest<AssistantActionCancelled>(
    `/me/assistant/actions/${encodeURIComponent(actionId)}/cancel`,
    { method: 'POST' },
  )
}
