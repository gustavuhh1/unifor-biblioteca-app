import type { LibrarianQueueEntry } from '../librarian-queues.types'
import {
  QUEUE_NOTICE,
  addPositions,
  buildAddBody,
  buildMoveBody,
  canMove,
  canResend,
  entryBadge,
  entrySince,
  firstMovablePosition,
  movePositions,
  movedDownLine,
  positionLabel,
  queueSubtitle,
  validateAdd,
} from '../librarian-queues.format'

function makeEntry(
  position: number,
  overrides: Partial<LibrarianQueueEntry> = {},
): LibrarianQueueEntry {
  return {
    id: `e${position}`,
    position,
    status: 'waiting',
    studentUid: `uid${position}`,
    studentName: `Aluno ${position}`,
    matricula: `231000${position}`,
    joinedAt: '2026-10-02T15:00:00.000Z',
    origin: 'student',
    addReason: null,
    confirmDeadline: null,
    lastNotifiedAt: null,
    notifyCount: 0,
    editionGroupId: null,
    ...overrides,
  }
}

const waitingQueue = [makeEntry(1), makeEntry(2), makeEntry(3)]
const turnQueue = [
  makeEntry(1, {
    status: 'your_turn',
    confirmDeadline: '2026-10-28T15:00:00.000Z',
  }),
  makeEntry(2),
  makeEntry(3),
]

describe('firstMovablePosition (ninguém passa à frente de quem está na vez)', () => {
  it('sem ninguém na vez, qualquer posição vale a partir da 1ª', () => {
    expect(firstMovablePosition(waitingQueue)).toBe(1)
  })

  it('com alguém na vez, a primeira posição livre vem depois dele', () => {
    expect(firstMovablePosition(turnQueue)).toBe(2)
  })
})

describe('movePositions e addPositions (botões de posição das folhas)', () => {
  it('mover tira a posição que o aluno já ocupa', () => {
    expect(movePositions(waitingQueue, waitingQueue[1]!)).toEqual([1, 3])
  })

  it('mover respeita quem está na vez', () => {
    expect(movePositions(turnQueue, turnQueue[2]!)).toEqual([2])
  })

  it('adicionar inclui o fim da fila, uma a mais que o tamanho', () => {
    expect(addPositions(waitingQueue)).toEqual([1, 2, 3, 4])
    expect(addPositions(turnQueue)).toEqual([2, 3, 4])
  })

  it('fila vazia só tem a posição 1', () => {
    expect(addPositions([])).toEqual([1])
  })
})

describe('canMove e canResend (quem pode o quê)', () => {
  it('quem espera pode mudar de posição, mas não recebe reenvio', () => {
    expect(canMove(waitingQueue[0]!)).toBe(true)
    expect(canResend(waitingQueue[0]!)).toBe(false)
  })

  it('quem está na vez recebe reenvio, mas não muda de posição', () => {
    expect(canMove(turnQueue[0]!)).toBe(false)
    expect(canResend(turnQueue[0]!)).toBe(true)
  })
})

describe('positionLabel', () => {
  it('marca a última posição como "No fim"', () => {
    expect(positionLabel(4, 3)).toBe('No fim (4º)')
    expect(positionLabel(2, 3)).toBe('2º')
  })
})

describe('buildAddBody (RF-BAL-06 e RF-BAL-07)', () => {
  it('no fim: sem posição, a API não pergunta nada', () => {
    expect(
      buildAddBody({
        matricula: ' 2311998 ',
        position: 4,
        queueLength: 3,
        reason: ' Pedido no balcão ',
      }),
    ).toEqual({
      matricula: '2311998',
      reason: 'Pedido no balcão',
      confirmed: false,
    })
  })

  it('à frente de outros: manda a posição e ainda não confirma', () => {
    expect(
      buildAddBody({
        matricula: '2311998',
        position: 2,
        queueLength: 3,
        reason: 'Urgência',
      }),
    ).toEqual({
      matricula: '2311998',
      position: 2,
      reason: 'Urgência',
      confirmed: false,
    })
  })
})

describe('buildMoveBody', () => {
  it('a primeira chamada leva só a posição e confirmed falso', () => {
    expect(buildMoveBody(1)).toEqual({ position: 1, confirmed: false })
  })
})

describe('validateAdd (B10)', () => {
  it('pede 7 dígitos e um motivo', () => {
    expect(validateAdd('123', 'motivo')).toBe(
      'Informe a matrícula de 7 dígitos.',
    )
    expect(validateAdd('2311998', '   ')).toBe('Informe o motivo.')
    expect(validateAdd('2311998', 'Pedido no balcão')).toBeNull()
  })
})

describe('textos do lugar na fila', () => {
  it('movedDownLine mostra de onde para onde o aluno desce', () => {
    expect(
      movedDownLine({
        entryId: 'e2',
        studentName: 'Lucas Almeida',
        matricula: '2412858',
        fromPosition: 2,
        toPosition: 3,
      }),
    ).toBe('Lucas Almeida: 2º → 3º')
  })

  it('quem está na vez ganha o selo "Na vez" e o prazo de confirmação', () => {
    expect(entryBadge(turnQueue[0]!)).toEqual({
      status: 'aguardando',
      label: 'Na vez',
    })
    expect(entryBadge(waitingQueue[0]!)).toEqual({})
    expect(
      entrySince(turnQueue[0]!, new Date('2026-10-27T12:00:00.000Z')),
    ).toBe('confirma até amanhã, 12:00')
    expect(entrySince(waitingQueue[0]!)).toBe('desde 02/10')
  })

  it('queueSubtitle conta os alunos no singular e no plural', () => {
    expect(queueSubtitle([makeEntry(1)])).toBe('1 aluno aguardando')
    expect(queueSubtitle(waitingQueue)).toBe('3 alunos aguardando')
  })

  it('as mensagens de resultado usam o primeiro nome', () => {
    expect(QUEUE_NOTICE.added('Paula Ribeiro', 5)).toBe(
      'Paula entrou em 5º na fila.',
    )
    expect(QUEUE_NOTICE.moved('Paula Ribeiro', 1)).toBe(
      'Paula está em 1º na fila.',
    )
    expect(QUEUE_NOTICE.removed('Paula Ribeiro')).toBe('Paula saiu da fila.')
    expect(QUEUE_NOTICE.resent('Paula Ribeiro')).toBe(
      'Aviso reenviado para Paula.',
    )
  })
})
