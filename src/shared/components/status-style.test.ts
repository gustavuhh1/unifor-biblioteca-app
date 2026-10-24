import { STATUS_STYLE, type Status } from './status-style'

// Os 12 estados e as palavras do Figma (StatusBadge, Board / StatusBadge).
const FIGMA_LABELS: Record<Status, string> = {
  disponivel: 'Disponível',
  emprestado: 'Emprestado',
  fila: 'Na fila',
  reservado: 'Reservado',
  aguardando: 'Confirme',
  retirar: 'Pronto para retirar',
  ativo: 'Em andamento',
  vence: 'Vence em breve',
  atrasado: 'Atrasado',
  devolvido: 'Devolvido',
  expirado: 'Expirado',
  cancelado: 'Cancelado',
}

describe('selo de status (STATUS_STYLE)', () => {
  it('cada estado tem a palavra do Figma', () => {
    for (const [status, label] of Object.entries(FIGMA_LABELS)) {
      expect(STATUS_STYLE[status as Status].label).toBe(label)
    }
  })

  it('o status nunca depende só da cor: todo estado tem ícone e palavra (RNF-USA-04)', () => {
    for (const style of Object.values(STATUS_STYLE)) {
      expect(style.icon).toBeTruthy()
      expect(style.label.length).toBeGreaterThan(0)
    }
  })

  it('segue a regra de cor do design system', () => {
    const background = (status: Status) => STATUS_STYLE[status].background
    expect(background('disponivel')).toBe('bg-success-soft')
    expect(background('devolvido')).toBe('bg-success-soft')
    expect(background('emprestado')).toBe('bg-warning-soft')
    expect(background('aguardando')).toBe('bg-warning-soft')
    expect(background('vence')).toBe('bg-warning-soft')
    expect(background('fila')).toBe('bg-brand-soft')
    expect(background('reservado')).toBe('bg-brand-soft')
    expect(background('retirar')).toBe('bg-brand-soft')
    expect(background('ativo')).toBe('bg-brand-soft')
    expect(background('atrasado')).toBe('bg-danger-soft')
    expect(background('expirado')).toBe('bg-neutral-soft')
    expect(background('cancelado')).toBe('bg-neutral-soft')
  })
})
