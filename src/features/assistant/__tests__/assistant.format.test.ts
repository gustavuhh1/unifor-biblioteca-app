import { ApiError } from '@/shared/api/errors'
import {
  actionConfirmLabel,
  actionNote,
  actionPreviewLines,
  actionTitle,
  actionView,
  appendReply,
  blockedInfo,
  confirmedText,
  errorText,
  fitMessage,
  messageTime,
  previousQuestion,
  replaceAction,
  weekdayDate,
} from '../assistant.format'
import type {
  AssistantAction,
  AssistantConversation,
  AssistantMessage,
} from '../assistant.types'

const book = {
  id: 'b1',
  title: 'Refatoração',
  authors: ['Martin Fowler'],
  coverUrl: null,
  coverTone: 2,
  copiesTotal: 2,
  copiesAvailable: 1,
  queueLength: 0,
  nextReturnAt: null,
  unavailableForNewRequests: false,
}

function makeAction(overrides: Partial<AssistantAction> = {}): AssistantAction {
  return {
    id: 'a1',
    type: 'request_loan',
    status: 'proposed',
    books: [book],
    blockedReason: null,
    blockedMessage: null,
    preview: {
      pickupDeadline: '2026-10-20T00:55:00.000Z',
      activeLoansAfter: 5,
      queuePosition: null,
    },
    expiresAt: '2026-10-27T15:00:00.000Z',
    resultLoanId: null,
    resultQueueEntryIds: [],
    ...overrides,
  }
}

function makeMessage(
  overrides: Partial<AssistantMessage> = {},
): AssistantMessage {
  return {
    id: 'm1',
    sender: 'assistant',
    text: 'Olá',
    suggestedBooks: [],
    action: null,
    blockedReason: null,
    error: false,
    createdAt: '2026-10-27T22:44:00.000Z',
    ...overrides,
  }
}

describe('datas da conversa (fuso America/Fortaleza)', () => {
  it('mostra a hora da mensagem no fuso do app', () => {
    expect(messageTime('2026-10-19T22:44:00.000Z')).toBe('19:44')
  })

  it('escreve o dia da semana com o dia e o mês', () => {
    // 20/10 00:55 UTC é segunda, 19/10, 21:55 em Fortaleza.
    expect(weekdayDate('2026-10-20T00:55:00.000Z')).toBe('seg, 19/10')
  })
})

describe('fitMessage (limite da pergunta)', () => {
  it('tira os espaços das pontas', () => {
    expect(fitMessage('  oi  ')).toBe('oi')
  })

  it('corta no limite de 500 caracteres da API', () => {
    expect(fitMessage('a'.repeat(600))).toHaveLength(500)
  })
})

describe('cartão da ação proposta (A72, RF-ASS-04)', () => {
  it('dá o título e o botão de cada tipo de ação', () => {
    expect(actionTitle(makeAction())).toBe('Solicitar empréstimo')
    expect(actionConfirmLabel(makeAction())).toBe('Confirmar solicitação')
    const queue = makeAction({ type: 'join_queue' })
    expect(actionTitle(queue)).toBe('Entrar na fila')
    expect(actionConfirmLabel(queue)).toBe('Confirmar entrada na fila')
  })

  it('monta a prévia do pedido com o prazo e a contagem', () => {
    expect(actionPreviewLines(makeAction())).toEqual([
      { label: 'Retirar até', value: 'seg, 19/10 (2 dias úteis)' },
      { label: 'Seus empréstimos', value: 'passa a 5 de 10' },
    ])
  })

  it('monta a prévia da fila com a posição e quem está na frente', () => {
    const queue = makeAction({
      type: 'join_queue',
      preview: {
        pickupDeadline: null,
        activeLoansAfter: null,
        queuePosition: 3,
      },
    })
    expect(actionPreviewLines(queue)).toEqual([
      { label: 'Sua posição', value: '3º da fila' },
      { label: 'Na sua frente', value: '2 pessoas' },
    ])
  })

  it('explica o que acontece depois de confirmar', () => {
    expect(actionNote(makeAction())).toBe(
      'O empréstimo de 14 dias começa na retirada.',
    )
    expect(actionNote(makeAction({ type: 'join_queue' }))).toBe(
      'Quando chegar sua vez, você terá 24h para confirmar.',
    )
  })
})

describe('actionView (qual cartão aparece)', () => {
  const now = new Date('2026-10-27T12:00:00.000Z')

  it('pede confirmação enquanto a proposta vale', () => {
    expect(actionView(makeAction(), now)).toBe('confirm')
  })

  it('trata a proposta vencida como expirada, sem botão', () => {
    expect(
      actionView(makeAction({ expiresAt: '2026-10-27T11:00:00.000Z' }), now),
    ).toBe('expired')
  })

  it('segue o status que a API mandou nos demais casos', () => {
    expect(actionView(makeAction({ status: 'blocked' }), now)).toBe('blocked')
    expect(actionView(makeAction({ status: 'confirmed' }), now)).toBe(
      'confirmed',
    )
    expect(actionView(makeAction({ status: 'cancelled' }), now)).toBe(
      'cancelled',
    )
    expect(actionView(makeAction({ status: 'failed' }), now)).toBe('failed')
    expect(actionView(makeAction({ status: 'expired' }), now)).toBe('expired')
  })
})

describe('blockedInfo (A81, resposta bloqueada)', () => {
  it('usa a frase da API e o título do motivo conhecido', () => {
    const message = makeMessage({
      action: makeAction({
        status: 'blocked',
        blockedReason: 'overdue',
        blockedMessage: 'Você está com Cálculo, Vol. 1 em atraso.',
      }),
    })
    expect(blockedInfo(message)).toEqual({
      title: 'Empréstimos bloqueados',
      text: 'Você está com Cálculo, Vol. 1 em atraso.',
      overdue: true,
    })
  })

  it('cai na explicação do app quando a API não manda a frase', () => {
    const message = makeMessage({ blockedReason: 'loan_limit' })
    const info = blockedInfo(message)
    expect(info.title).toBe('Limite de 10 livros atingido')
    expect(info.overdue).toBe(false)
  })

  it('mostra o texto da resposta se o motivo é desconhecido', () => {
    const message = makeMessage({ text: 'Não dá agora.' })
    expect(blockedInfo(message)).toEqual({
      title: 'Não foi possível fazer o pedido',
      text: 'Não dá agora.',
      overdue: false,
    })
  })
})

describe('confirmedText (depois do Confirmar)', () => {
  it('mostra o prazo do pedido', () => {
    expect(confirmedText(makeAction({ status: 'confirmed' }))).toBe(
      'Pedido feito! Retire até seg, 19/10.',
    )
  })

  it('diz em qual fila o aluno entrou', () => {
    expect(
      confirmedText(makeAction({ type: 'join_queue', status: 'confirmed' })),
    ).toBe('Você entrou na fila de Refatoração.')
  })
})

describe('errorText', () => {
  it('mostra a mensagem da API, já em português', () => {
    const error = new ApiError(409, {
      code: 'assistant_action_expired',
      message: 'O tempo para confirmar acabou.',
    })
    expect(errorText(error)).toBe('O tempo para confirmar acabou.')
  })

  it('usa a mensagem genérica para erro de outro tipo', () => {
    expect(errorText(new Error('x'))).toBe('Algo deu errado. Tente de novo.')
  })
})

describe('previousQuestion (Tentar de novo, A49)', () => {
  it('acha a pergunta do aluno que veio antes da resposta com erro', () => {
    const items = [
      makeMessage({ id: '1', sender: 'student', text: 'Oi' }),
      makeMessage({ id: '2', sender: 'assistant', error: true }),
    ]
    expect(previousQuestion(items, 1)).toBe('Oi')
  })

  it('devolve null quando não há pergunta antes', () => {
    expect(previousQuestion([makeMessage()], 0)).toBeNull()
  })
})

describe('conversa no cache', () => {
  const conversation: AssistantConversation = {
    disclaimer: 'Pode errar',
    items: [makeMessage({ id: 'm0', action: makeAction() })],
  }

  it('coloca a pergunta e a resposta no fim', () => {
    const question = makeMessage({ id: 'q', sender: 'student', text: 'Oi' })
    const reply = makeMessage({ id: 'r' })
    const next = appendReply(conversation, {
      disclaimer: 'Aviso novo',
      question,
      reply,
    })
    expect(next.items.map((item) => item.id)).toEqual(['m0', 'q', 'r'])
    expect(next.disclaimer).toBe('Aviso novo')
  })

  it('começa a conversa quando o cache ainda está vazio', () => {
    const question = makeMessage({ id: 'q', sender: 'student' })
    const reply = makeMessage({ id: 'r' })
    expect(
      appendReply(undefined, { disclaimer: 'x', question, reply }).items,
    ).toHaveLength(2)
  })

  it('troca só a ação que mudou', () => {
    const confirmed = makeAction({ status: 'confirmed' })
    const next = replaceAction(conversation, confirmed)
    expect(next?.items[0]?.action?.status).toBe('confirmed')
  })

  it('não inventa conversa se o cache está vazio', () => {
    expect(replaceAction(undefined, makeAction())).toBeUndefined()
  })
})
