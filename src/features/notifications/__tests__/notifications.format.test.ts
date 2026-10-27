import { NOTIFICATION_TYPES } from '@/shared/types'
import {
  NOTICE_STYLE,
  groupNotifications,
  hasTurnButtons,
  noticeTarget,
  noticeTime,
} from '../notifications.format'
import type { NotificationItem } from '../notifications.types'

// Terça, 27/10/2026, 12:00 em Fortaleza (15:00 UTC).
const NOW = new Date('2026-10-27T15:00:00.000Z')

function makeNotice(
  overrides: Partial<NotificationItem> = {},
): NotificationItem {
  return {
    id: 'n1',
    type: 'queue_turn',
    title: 'Aviso',
    body: 'Texto',
    action: 'none',
    bookId: null,
    loanId: null,
    queueEntryId: null,
    fineId: null,
    readAt: null,
    createdAt: '2026-10-27T12:12:00.000Z',
    ...overrides,
  }
}

describe('NOTICE_STYLE (ícone e tom por tipo, RNF-USA-04)', () => {
  it('cobre todos os tipos de aviso da API', () => {
    for (const type of NOTIFICATION_TYPES) {
      expect(NOTICE_STYLE[type]).toBeDefined()
    }
  })

  it('atraso e multa em aberto são perigo; devolução e pagamento, sucesso', () => {
    expect(NOTICE_STYLE.overdue.tone).toBe('danger')
    expect(NOTICE_STYLE.fine_open.tone).toBe('danger')
    expect(NOTICE_STYLE.return_confirmed.tone).toBe('success')
    expect(NOTICE_STYLE.fine_paid.tone).toBe('success')
  })
})

describe('groupNotifications (Hoje, Esta semana e Antes)', () => {
  it('separa pelos dias de calendário e mantém a ordem da API', () => {
    const today = makeNotice({ id: 'a', createdAt: '2026-10-27T12:12:00.000Z' })
    const yesterday = makeNotice({
      id: 'b',
      createdAt: '2026-10-26T12:00:00.000Z',
    })
    const sixDays = makeNotice({
      id: 'c',
      createdAt: '2026-10-21T15:00:00.000Z',
    })
    const older = makeNotice({ id: 'd', createdAt: '2026-10-15T12:00:00.000Z' })

    const groups = groupNotifications([today, yesterday, sixDays, older], NOW)

    expect(groups.map((group) => group.label)).toEqual([
      'Hoje',
      'Esta semana',
      'Antes',
    ])
    expect(groups[0]!.items.map((item) => item.id)).toEqual(['a'])
    expect(groups[1]!.items.map((item) => item.id)).toEqual(['b', 'c'])
    expect(groups[2]!.items.map((item) => item.id)).toEqual(['d'])
  })

  it('não devolve grupo vazio', () => {
    const groups = groupNotifications([makeNotice()], NOW)
    expect(groups).toHaveLength(1)
    expect(groups[0]!.key).toBe('today')
    expect(groupNotifications([], NOW)).toEqual([])
  })

  it('conta o dia no fuso de Fortaleza, não em UTC', () => {
    // 01:00 UTC de 27/10 ainda é 22:00 de 26/10 em Fortaleza: "ontem".
    const lateNight = makeNotice({ createdAt: '2026-10-27T01:00:00.000Z' })
    expect(groupNotifications([lateNight], NOW)[0]!.key).toBe('week')
  })
})

describe('noticeTime (horário curto do aviso)', () => {
  it('mostra a hora no dia, "ontem", o dia da semana e depois dia/mês', () => {
    expect(noticeTime('2026-10-27T12:12:00.000Z', NOW)).toBe('09:12')
    expect(noticeTime('2026-10-26T12:00:00.000Z', NOW)).toBe('ontem')
    expect(noticeTime('2026-10-23T15:00:00.000Z', NOW)).toBe('sex')
    expect(noticeTime('2026-10-15T12:00:00.000Z', NOW)).toBe('15/10')
  })
})

describe('noticeTarget (para onde o botão do aviso leva)', () => {
  it('sua vez abre a tela Sua vez com o lugar na fila', () => {
    const notice = makeNotice({ action: 'confirm_turn', queueEntryId: 'q1' })
    expect(noticeTarget(notice)).toEqual({
      pathname: '/your-turn',
      params: { entryId: 'q1' },
    })
    expect(hasTurnButtons(notice)).toBe(true)
  })

  it('sua vez sem lugar na fila não leva a lugar nenhum nem mostra botões', () => {
    const notice = makeNotice({ action: 'confirm_turn', queueEntryId: null })
    expect(noticeTarget(notice)).toBeNull()
    expect(hasTurnButtons(notice)).toBe(false)
  })

  it('QR, empréstimo e multa abrem as telas do aluno', () => {
    expect(
      noticeTarget(makeNotice({ action: 'show_qr', loanId: 'l1' })),
    ).toEqual({
      pathname: '/withdrawal',
      params: { loanId: 'l1' },
    })
    expect(noticeTarget(makeNotice({ action: 'open_loan' }))).toEqual({
      pathname: '/loans',
    })
    expect(noticeTarget(makeNotice({ action: 'open_fine' }))).toEqual({
      pathname: '/fine',
    })
  })

  it('aviso sem ação não leva a lugar nenhum', () => {
    expect(noticeTarget(makeNotice({ action: 'none' }))).toBeNull()
    expect(hasTurnButtons(makeNotice({ action: 'none' }))).toBe(false)
  })
})
