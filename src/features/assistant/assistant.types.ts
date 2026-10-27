import type { BookSummary } from '@/features/catalog/catalog.types'
import type {
  AssistantActionStatus,
  AssistantActionType,
  AssistantBlockedReason,
  AssistantSender,
} from '@/shared/types'

// Tipos do módulo do Assistente: os schemas `AssistantMessage`, `AssistantAction`
// e as respostas de /me/assistant/* do Swagger. As datas chegam como texto ISO 8601.

// O que a ação vai mudar, para o cartão de confirmação (A72).
export interface AssistantActionPreview {
  // Pedido: até quando retirar no balcão.
  pickupDeadline: string | null
  // Pedido: quantos livros o aluno terá depois.
  activeLoansAfter: number | null
  // Fila: a posição que o aluno vai ocupar.
  queuePosition: number | null
}

// Ação que o Assistente propõe em nome do aluno: só acontece depois da confirmação.
export interface AssistantAction {
  id: string
  type: AssistantActionType
  status: AssistantActionStatus
  books: BookSummary[]
  blockedReason: AssistantBlockedReason | null
  // Por que a regra bloqueia, pronto para o aluno ler (A81).
  blockedMessage: string | null
  preview: AssistantActionPreview
  expiresAt: string
  resultLoanId: string | null
  resultQueueEntryIds: string[]
}

// Uma mensagem da conversa, do aluno ou do Assistente.
export interface AssistantMessage {
  id: string
  sender: AssistantSender
  text: string
  // Livros mostrados como cartões (RF-ASS-02).
  suggestedBooks: BookSummary[]
  action: AssistantAction | null
  blockedReason: AssistantBlockedReason | null
  // O Assistente não conseguiu responder (A49).
  error: boolean
  createdAt: string
}

// GET /me/assistant/messages: a conversa e o aviso de que a IA pode errar.
export interface AssistantConversation {
  disclaimer: string
  items: AssistantMessage[]
}

// POST /me/assistant/messages: a pergunta salva e a resposta.
export interface AssistantReply {
  disclaimer: string
  question: AssistantMessage
  reply: AssistantMessage
}

// POST /me/assistant/actions/{id}/confirm: a ação feita e o que ela criou.
export interface AssistantActionConfirmed {
  action: AssistantAction
  loan: unknown | null
  queueEntries: unknown[]
}

// POST /me/assistant/actions/{id}/cancel.
export interface AssistantActionCancelled {
  action: AssistantAction
}
