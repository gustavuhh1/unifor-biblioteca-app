// Chave do TanStack Query da conversa (GET /me/assistant/messages).
export const ASSISTANT_QUERY_KEY = ['assistant', 'messages'] as const

// Tamanho máximo de uma pergunta (AssistantMessageBody do Swagger).
export const ASSISTANT_MESSAGE_MAX_LENGTH = 500

// Prazo de uma pergunta ao Assistente (ms). A resposta chega a levar 22 s quando
// ele prepara uma ação (Gemini e regras); o Firebase Hosting corta em 60 s, então
// 45 s dá margem sem estourar o corte.
export const ASSISTANT_REQUEST_TIMEOUT_MS = 45_000

// Quanto tempo o cartão de uma ação espera antes de conferir se venceu (ms).
export const ASSISTANT_NOW_INTERVAL_MS = 30_000

// Perguntas prontas da conversa vazia (RF-ASS-01, RF-ASS-02 e RF-ASS-03).
export const ASSISTANT_QUICK_QUESTIONS = [
  'Como funciona a fila?',
  'Me indica algo parecido com Código Limpo',
  'Que livros você me indica pelo que eu já li?',
] as const

// Aviso de que a IA pode errar (RF-ASS-05), usado enquanto a API não o entregou.
export const ASSISTANT_DISCLAIMER_FALLBACK =
  'O Assistente usa IA e pode errar. Confira prazos e regras na página do livro e em Meus empréstimos.'

// Textos fixos do Assistente (pt-BR).
export const ASSISTANT_MESSAGE = {
  welcome:
    'Oi! Eu ensino a usar o app, busco livros no acervo, indico leituras e posso pedir um empréstimo ou entrar numa fila por você. Só faço isso depois da sua confirmação.',
  actionCancelled: 'Solicitação cancelada. Nenhum pedido foi enviado.',
  actionExpired: 'O tempo para confirmar acabou. Peça de novo se ainda quiser.',
  actionFailed: 'Não foi possível concluir a solicitação. Peça de novo.',
  blockedFallbackTitle: 'Não foi possível fazer o pedido',
  loadFailed: 'Não foi possível abrir a conversa',
  sendFailed: 'Não consegui responder agora',
} as const
