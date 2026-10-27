import { makeBookFormSchema } from '../schemas/book-form.schemas'

const valid = {
  isbn: '',
  title: 'Código Limpo',
  authors: 'Martin, Robert C.',
  publisher: 'Alta Books',
  edition: '',
  year: '2011',
  cdu: '005.1',
  cutter: 'M386c',
  shelf: 'Estante 005.1',
  copies: '3',
}

function messages(
  result: ReturnType<ReturnType<typeof makeBookFormSchema>['safeParse']>,
) {
  return result.success ? [] : result.error.issues.map((issue) => issue.message)
}

describe('makeBookFormSchema (formulário de livro, RF-GAC-02)', () => {
  it('aceita um livro completo sem ISBN (cadastro à mão)', () => {
    expect(makeBookFormSchema(true).safeParse(valid).success).toBe(true)
  })

  it('exige os campos da biblioteca e o título', () => {
    const result = makeBookFormSchema(true).safeParse({
      ...valid,
      title: ' ',
      cdu: '',
      cutter: '',
      shelf: '',
    })
    expect(messages(result)).toEqual(
      expect.arrayContaining([
        'Informe o título.',
        'Informe a CDU.',
        'Informe o Cutter.',
        'Informe a estante.',
      ]),
    )
  })

  it('confere o tamanho do ISBN, do ano e dos exemplares', () => {
    const result = makeBookFormSchema(true).safeParse({
      ...valid,
      isbn: '123',
      year: '20',
      copies: '0',
    })
    expect(messages(result)).toEqual(
      expect.arrayContaining([
        'O ISBN tem 10 ou 13 dígitos.',
        'Informe 4 dígitos.',
        'Informe pelo menos 1 exemplar.',
      ]),
    )
  })

  it('aceita o ISBN com hífens', () => {
    expect(
      makeBookFormSchema(true).safeParse({
        ...valid,
        isbn: '978-0-13-235088-4',
      }).success,
    ).toBe(true)
  })

  it('na edição não confere os exemplares', () => {
    expect(
      makeBookFormSchema(false).safeParse({ ...valid, copies: '' }).success,
    ).toBe(true)
  })
})
