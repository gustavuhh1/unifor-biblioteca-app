import { ApiError } from '@/shared/api/errors'
import {
  describeConfirmTurnError,
  describeJoinQueueError,
  queueErrorText,
} from '../queues.errors'

function apiError(code: string, message = 'Mensagem da API.', status = 409) {
  return new ApiError(status, { code, message })
}

describe('describeJoinQueueError (recusas de POST /queues)', () => {
  it('usa o texto do bloqueio da página do livro para os motivos conhecidos', () => {
    expect(describeJoinQueueError(apiError('queue_limit')).title).toBe(
      'Limite de 7 filas atingido',
    )
    expect(describeJoinQueueError(apiError('overdue')).title).toBe(
      'Empréstimos bloqueados',
    )
    expect(describeJoinQueueError(apiError('unavailable')).title).toBe(
      'Indisponível para novos pedidos',
    )
    expect(describeJoinQueueError(apiError('same_title')).title).toBe(
      'Você já tem este título',
    )
  })

  it('avisa que o aluno já está na fila', () => {
    expect(describeJoinQueueError(apiError('already_in_queue')).title).toBe(
      'Você já está nesta fila',
    )
  })

  it('mostra a mensagem da API para um código desconhecido', () => {
    expect(
      describeJoinQueueError(
        apiError('editions_mismatch', 'Edições de livros diferentes.', 400),
      ),
    ).toEqual({
      title: 'Não foi possível entrar na fila',
      text: 'Edições de livros diferentes.',
    })
  })

  it('usa o texto genérico quando não veio um corpo da API', () => {
    expect(describeJoinQueueError(new Error('rede')).text).toBe(
      queueErrorText(new Error('rede')),
    )
  })
})

describe('describeConfirmTurnError (recusas de POST /queues/{id}/confirm)', () => {
  it('explica o prazo de 24 horas vencido', () => {
    const message = describeConfirmTurnError(apiError('turn_expired'))
    expect(message.title).toBe('Não foi possível confirmar')
    expect(message.text).toContain('24 horas')
  })

  it('explica que ainda não é a vez', () => {
    expect(describeConfirmTurnError(apiError('not_your_turn')).text).toContain(
      'Ainda não é a sua vez',
    )
  })

  it('explica o lugar que já saiu da fila', () => {
    expect(
      describeConfirmTurnError(apiError('queue_entry_not_active')).text,
    ).toContain('não está mais ativo')
  })

  it('usa o texto do bloqueio quando uma regra do pedido recusa', () => {
    expect(describeConfirmTurnError(apiError('loan_limit')).title).toBe(
      'Limite de 10 livros atingido',
    )
  })

  it('mostra a mensagem da API para o resto', () => {
    expect(
      describeConfirmTurnError(apiError('outro', 'Algo deu errado.')).text,
    ).toBe('Algo deu errado.')
  })
})
