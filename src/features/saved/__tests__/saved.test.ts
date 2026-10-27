import { ApiError } from '@/shared/api/errors'
import { folderNameSchema } from '../schemas/folder.schemas'
import { FOLDER_NAME_MAX_LENGTH, SAVED_MESSAGE } from '../saved.constants'
import { bookCountText, savedErrorMessage, savedStateOf } from '../saved.format'

describe('folderNameSchema (nome da pasta, RF-SAL-02)', () => {
  it('aceita um nome simples e tira os espaços das pontas', () => {
    const result = folderNameSchema.safeParse({ name: '  Ler depois  ' })
    expect(result.success).toBe(true)
    expect(result.data?.name).toBe('Ler depois')
  })

  it('recusa nome vazio ou só com espaços', () => {
    const result = folderNameSchema.safeParse({ name: '   ' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(
      SAVED_MESSAGE.folderNameRequired,
    )
  })

  it('aceita exatamente 30 caracteres e recusa 31', () => {
    const ok = 'a'.repeat(FOLDER_NAME_MAX_LENGTH)
    expect(folderNameSchema.safeParse({ name: ok }).success).toBe(true)
    const tooLong = folderNameSchema.safeParse({ name: `${ok}b` })
    expect(tooLong.success).toBe(false)
    expect(tooLong.error?.issues[0]?.message).toBe(
      SAVED_MESSAGE.folderNameTooLong,
    )
  })
})

describe('bookCountText (linha da pasta, A18)', () => {
  it('escreve nenhum, singular e plural', () => {
    expect(bookCountText(0)).toBe('Nenhum livro')
    expect(bookCountText(1)).toBe('1 livro')
    expect(bookCountText(3)).toBe('3 livros')
  })
})

describe('savedStateOf (livro salvo e suas pastas)', () => {
  const items = [
    { id: 'b1', folderIds: ['f1', 'f2'] },
    { id: 'b2', folderIds: [] },
  ]

  it('acha o livro salvo e as pastas dele', () => {
    expect(savedStateOf(items, 'b1')).toEqual({
      saved: true,
      folderIds: ['f1', 'f2'],
    })
    expect(savedStateOf(items, 'b2')).toEqual({ saved: true, folderIds: [] })
  })

  it('devolve não salvo quando o livro não está na lista ou a lista não chegou', () => {
    expect(savedStateOf(items, 'b9')).toEqual({ saved: false, folderIds: [] })
    expect(savedStateOf(undefined, 'b1')).toEqual({
      saved: false,
      folderIds: [],
    })
  })
})

describe('savedErrorMessage', () => {
  it('usa a mensagem da API quando o erro é dela', () => {
    const error = new ApiError(404, {
      code: 'folder_not_found',
      message: 'Esta pasta não existe mais.',
    })
    expect(savedErrorMessage(error)).toBe('Esta pasta não existe mais.')
  })

  it('cai na mensagem genérica para outros erros', () => {
    expect(savedErrorMessage(new Error('x'))).toBe(SAVED_MESSAGE.genericFailure)
  })
})
