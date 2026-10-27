import type { Me } from '@/features/auth/auth.types'
import {
  buildStudentProfile,
  displayNameOf,
  initialsOfMe,
} from '../profile.format'

function makeMe(overrides: Partial<Me> = {}): Me {
  return {
    uid: 'uid_lucas',
    role: 'student',
    status: 'active',
    matricula: '2412858',
    email: 'aluno@exemplo.edu',
    fullName: 'Lucas Almeida',
    initials: 'LA',
    course: 'Ciência da Computação',
    entryYear: 2024,
    deskLabel: null,
    activeLoanCount: 4,
    activeQueueCount: 1,
    openFineTotalCents: 0,
    booksReadByYear: { '2026': 17 },
    notificationPrefs: {} as Me['notificationPrefs'],
    onboardingSeenAt: null,
    ...overrides,
  }
}

describe('displayNameOf (nome do Perfil)', () => {
  it('usa o nome completo quando o aluno já informou', () => {
    expect(displayNameOf(makeMe())).toBe('Lucas Almeida')
  })

  it('mostra a matrícula enquanto não há nome', () => {
    expect(displayNameOf(makeMe({ fullName: null }))).toBe('2412858')
    expect(displayNameOf(makeMe({ fullName: '  ' }))).toBe('2412858')
  })
})

describe('initialsOfMe (avatar do Perfil)', () => {
  it('prefere as iniciais que a API mandou', () => {
    expect(initialsOfMe(makeMe({ initials: 'XY' }))).toBe('XY')
  })

  it('tira as iniciais do nome quando a API não manda', () => {
    expect(initialsOfMe(makeMe({ initials: null }))).toBe('LA')
  })

  it('usa os dois últimos dígitos da matrícula sem nome', () => {
    expect(initialsOfMe(makeMe({ initials: null, fullName: null }))).toBe('58')
  })
})

describe('buildStudentProfile (RF-PER-01)', () => {
  it('resume livros, filas, lidos no ano e a matrícula com o ingresso', () => {
    const view = buildStudentProfile(makeMe(), 2026)
    expect(view.matriculaLine).toBe('Matrícula 2412858 · ingresso em 2024')
    expect(view.loans).toBe('4/10')
    expect(view.activeQueues).toBe('1')
    expect(view.readThisYear).toBe('17')
    expect(view.fineAmount).toBeNull()
  })

  it('mostra a multa em aberto por extenso', () => {
    const view = buildStudentProfile(makeMe({ openFineTotalCents: 600 }), 2026)
    expect(view.fineAmount).toBe('R$ 6,00')
  })

  it('conta zero lidos num ano sem registro e omite o ingresso vazio', () => {
    const view = buildStudentProfile(makeMe({ entryYear: null }), 2027)
    expect(view.readThisYear).toBe('0')
    expect(view.matriculaLine).toBe('Matrícula 2412858')
  })
})
