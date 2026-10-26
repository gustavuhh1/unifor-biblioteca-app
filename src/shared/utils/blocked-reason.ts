import { ASSISTANT_BLOCKED_REASON, type AssistantBlockedReason } from '../types'
import { MAX_ACTIVE_LOANS, MAX_ACTIVE_QUEUES } from '../config/library-rules'

// Motivo pelo qual o aluno não pode pedir o livro nem entrar na fila (campo
// `blockedReason` da página do livro e da prévia da fila). Os valores são os
// mesmos do espelho `AssistantBlockedReason`.
export type BlockedReason = AssistantBlockedReason

// Título curto e explicação de cada motivo (RF-ACE-08, RF-EMP-02, RF-EMP-03,
// RF-EMP-04 e RF-FIL-03).
export const BLOCKED_REASON_MESSAGE: Record<
  BlockedReason,
  { title: string; text: string }
> = {
  [ASSISTANT_BLOCKED_REASON.unavailable]: {
    title: 'Indisponível para novos pedidos',
    text: 'A biblioteca pausou novos pedidos deste livro. Ele continua no catálogo, mas não dá para solicitar nem entrar na fila agora.',
  },
  [ASSISTANT_BLOCKED_REASON.overdue]: {
    title: 'Empréstimos bloqueados',
    text: 'Você tem um livro em atraso. Devolva no balcão para voltar a solicitar livros e entrar em filas.',
  },
  [ASSISTANT_BLOCKED_REASON.loanLimit]: {
    title: `Limite de ${MAX_ACTIVE_LOANS} livros atingido`,
    text: `Você já está com ${MAX_ACTIVE_LOANS} livros. Devolva um para solicitar outro.`,
  },
  [ASSISTANT_BLOCKED_REASON.queueLimit]: {
    title: `Limite de ${MAX_ACTIVE_QUEUES} filas atingido`,
    text: `Você já está em ${MAX_ACTIVE_QUEUES} filas. Saia de uma delas para entrar em outra.`,
  },
  [ASSISTANT_BLOCKED_REASON.sameTitle]: {
    title: 'Você já tem este título',
    text: 'Este livro, ou outra edição dele, já está emprestado para você ou na sua fila. Não dá para pegar dois do mesmo título.',
  },
  [ASSISTANT_BLOCKED_REASON.notQueueable]: {
    title: 'Há exemplar na estante',
    text: 'A fila só abre quando todos os exemplares estão emprestados. Solicite o empréstimo.',
  },
}
