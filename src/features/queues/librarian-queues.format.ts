import type { Status } from '@/shared/components'
import { MATRICULA_LENGTH } from '@/features/auth/auth.constants'
import { QUEUE_ENTRY_STATUS } from '@/shared/types'
import { formatDayMonth, formatRelativeDateTime } from '@/shared/utils/dates'
import { pluralize } from '@/shared/utils/plural'
import { QUEUE_ADD_VALIDATION } from './librarian-queues.constants'
import type {
  AddToQueueBody,
  LibrarianQueueEntry,
  MoveInQueueBody,
  QueueMovedDown,
} from './librarian-queues.types'

// Primeira posição para onde alguém pode ir: ninguém passa à frente de quem já
// está na vez (`your_turn`), então ela vem depois deles (RF-BAL-06).
export function firstMovablePosition(entries: LibrarianQueueEntry[]): number {
  return (
    entries.filter((entry) => entry.status === QUEUE_ENTRY_STATUS.yourTurn)
      .length + 1
  )
}

// Quem está na vez não muda de posição (`turn_in_progress`).
export function canMove(entry: LibrarianQueueEntry): boolean {
  return entry.status === QUEUE_ENTRY_STATUS.waiting
}

// Só quem está na vez recebe o reenvio do aviso (`not_your_turn`).
export function canResend(entry: LibrarianQueueEntry): boolean {
  return entry.status === QUEUE_ENTRY_STATUS.yourTurn
}

// Posições que o bibliotecário pode escolher ao mover `entry`: da primeira livre
// até o fim, sem a que ele já ocupa.
export function movePositions(
  entries: LibrarianQueueEntry[],
  entry: LibrarianQueueEntry,
): number[] {
  const first = firstMovablePosition(entries)
  const positions: number[] = []
  for (let position = first; position <= entries.length; position++) {
    if (position !== entry.position) positions.push(position)
  }
  return positions
}

// Posições para adicionar um aluno novo: da primeira livre até o fim da fila, que
// é uma a mais que o tamanho atual.
export function addPositions(entries: LibrarianQueueEntry[]): number[] {
  const first = firstMovablePosition(entries)
  const positions: number[] = []
  for (let position = first; position <= entries.length + 1; position++) {
    positions.push(position)
  }
  return positions
}

// Rótulo do botão de posição: "No fim (5º)" para a última e "2º" nas demais.
export function positionLabel(position: number, queueLength: number): string {
  return position > queueLength ? `No fim (${position}º)` : `${position}º`
}

// Corpo de "Adicionar aluno": no fim a posição fica de fora e a API não pergunta
// nada; à frente de outros a primeira chamada só pede a lista de quem desce.
export function buildAddBody(input: {
  matricula: string
  position: number
  queueLength: number
  reason: string
}): AddToQueueBody {
  const atEnd = input.position > input.queueLength
  return {
    matricula: input.matricula.trim(),
    ...(atEnd ? {} : { position: input.position }),
    reason: input.reason.trim(),
    confirmed: false,
  }
}

// Corpo de "Mudar posição" (primeira chamada, sem confirmar).
export function buildMoveBody(position: number): MoveInQueueBody {
  return { position, confirmed: false }
}

// Valida a folha "Adicionar aluno": matrícula de 7 dígitos e motivo (B10).
export function validateAdd(matricula: string, reason: string): string | null {
  if (!new RegExp(`^\\d{${MATRICULA_LENGTH}}$`).test(matricula.trim())) {
    return QUEUE_ADD_VALIDATION.matricula
  }
  if (!reason.trim()) return QUEUE_ADD_VALIDATION.reason
  return null
}

// "Beatriz Nogueira: 2º → 3º", uma linha da confirmação de passar à frente.
export function movedDownLine(item: QueueMovedDown): string {
  return `${item.studentName}: ${item.fromPosition}º → ${item.toPosition}º`
}

// Selo do lugar: quem está na vez aparece como "Na vez" (com ícone e palavra).
export function entryBadge(entry: LibrarianQueueEntry): {
  status?: Status
  label?: string
} {
  return entry.status === QUEUE_ENTRY_STATUS.yourTurn
    ? { status: 'aguardando', label: 'Na vez' }
    : {}
}

// Texto pequeno de cada lugar: "desde 02/10" ou, na vez, o prazo para confirmar.
export function entrySince(entry: LibrarianQueueEntry, now?: Date): string {
  if (entry.status === QUEUE_ENTRY_STATUS.yourTurn && entry.confirmDeadline) {
    return `confirma até ${formatRelativeDateTime(entry.confirmDeadline, now)}`
  }
  return `desde ${formatDayMonth(entry.joinedAt)}`
}

// "4 alunos aguardando" / "1 aluno aguardando".
export function queueSubtitle(entries: LibrarianQueueEntry[]): string {
  return `${pluralize(entries.length, 'aluno', 'alunos')} aguardando`
}

// "4 na fila" na lista de livros com fila.
export function queueLengthText(length: number): string {
  return `${length} na fila`
}

// Primeiro nome do aluno para as mensagens de resultado.
function firstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] ?? fullName
}

// Mensagens de resultado (aviso verde no alto da tela).
export const QUEUE_NOTICE = {
  added: (name: string, position: number) =>
    `${firstName(name)} entrou em ${position}º na fila.`,
  moved: (name: string, position: number) =>
    `${firstName(name)} está em ${position}º na fila.`,
  removed: (name: string) => `${firstName(name)} saiu da fila.`,
  resent: (name: string) => `Aviso reenviado para ${firstName(name)}.`,
}
