import { ApiError } from '@/shared/api/errors'
import {
  describeLoanRequestError,
  describeRenewError,
  loanErrorText,
} from '../loans.errors'

function apiError(code: string, message = 'Mensagem da API.', status = 409) {
  return new ApiError(status, { code, message })
}

describe('describeLoanRequestError (recusas de POST /loans)', () => {
  it('usa o texto do bloqueio da página do livro para os quatro motivos', () => {
    expect(describeLoanRequestError(apiError('overdue')).title).toBe(
      'Empréstimos bloqueados',
    )
    expect(describeLoanRequestError(apiError('loan_limit')).title).toBe(
      'Limite de 10 livros atingido',
    )
    expect(describeLoanRequestError(apiError('same_title')).title).toBe(
      'Você já tem este título',
    )
    expect(describeLoanRequestError(apiError('unavailable')).title).toBe(
      'Indisponível para novos pedidos',
    )
  })

  it('manda entrar na fila quando não há exemplar na estante', () => {
    const message = describeLoanRequestError(apiError('no_copy_available'))
    expect(message.title).toBe('Sem exemplar na estante')
    expect(message.text).toContain('fila')
  })

  it('mostra a mensagem da API para um código desconhecido', () => {
    const message = describeLoanRequestError(
      apiError('book_not_found', 'Livro não encontrado.', 404),
    )
    expect(message).toEqual({
      title: 'Não foi possível solicitar',
      text: 'Livro não encontrado.',
    })
  })

  it('cai no texto genérico quando o erro não é da API', () => {
    const message = describeLoanRequestError(new Error('boom'))
    expect(message.text).toBe('Algo deu errado. Tente de novo.')
  })
})

describe('describeRenewError (recusas de POST /loans/{id}/renew)', () => {
  it('traduz os três motivos de negar a renovação', () => {
    expect(describeRenewError(apiError('has_queue'))).toContain('fila')
    expect(describeRenewError(apiError('overdue'))).toContain('atraso')
    expect(describeRenewError(apiError('already_renewed'))).toContain('uma vez')
  })

  it('usa a mensagem da API para os outros erros', () => {
    expect(
      describeRenewError(
        apiError('loan_not_active', 'O empréstimo não está ativo.'),
      ),
    ).toBe('O empréstimo não está ativo.')
  })
})

describe('loanErrorText', () => {
  it('devolve a mensagem da API ou o texto genérico', () => {
    expect(
      loanErrorText(apiError('loan_not_cancellable', 'Já retirado.')),
    ).toBe('Já retirado.')
    expect(loanErrorText('qualquer coisa')).toBe(
      'Algo deu errado. Tente de novo.',
    )
  })
})
