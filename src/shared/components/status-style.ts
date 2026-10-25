import type { ColorToken } from '../theme/tokens.generated'
import type { IconName } from './icon-paths'

// Estados que o selo mostra (components.d.ts, Status). Cada um tem cor, ícone e
// palavra: o status nunca depende só da cor (RNF-USA-04).
export type Status =
  | 'disponivel'
  | 'emprestado'
  | 'fila'
  | 'reservado'
  | 'aguardando'
  | 'retirar'
  | 'ativo'
  | 'vence'
  | 'atrasado'
  | 'devolvido'
  | 'expirado'
  | 'cancelado'

interface StatusStyle {
  label: string
  icon: IconName
  // Fundo e cor do texto e do ícone (README do DS, seção Cor).
  background: string
  text: string
  color: ColorToken
}

const SUCCESS = {
  background: 'bg-success-soft',
  text: 'text-success',
  color: 'success',
} as const
const WARNING = {
  background: 'bg-warning-soft',
  text: 'text-warning',
  color: 'warning',
} as const
const BRAND = {
  background: 'bg-brand-soft',
  text: 'text-brand-strong',
  color: 'brandStrong',
} as const
const DANGER = {
  background: 'bg-danger-soft',
  text: 'text-danger',
  color: 'danger',
} as const
const NEUTRAL = {
  background: 'bg-neutral-soft',
  text: 'text-neutral-ink',
  color: 'neutralInk',
} as const

// Nomes do código (components.d.ts) e do Figma: Disponível, Emprestado, Na fila,
// Reservado, Confirme, Pronto para retirar, Em andamento, Vence em breve,
// Atrasado, Devolvido, Expirado e Cancelado.
export const STATUS_STYLE: Record<Status, StatusStyle> = {
  disponivel: { label: 'Disponível', icon: 'check', ...SUCCESS },
  devolvido: { label: 'Devolvido', icon: 'check', ...SUCCESS },
  emprestado: { label: 'Emprestado', icon: 'clock', ...WARNING },
  vence: { label: 'Vence em breve', icon: 'clock', ...WARNING },
  aguardando: { label: 'Confirme', icon: 'bell', ...WARNING },
  fila: { label: 'Na fila', icon: 'users', ...BRAND },
  reservado: { label: 'Reservado', icon: 'hand', ...BRAND },
  retirar: { label: 'Pronto para retirar', icon: 'qr', ...BRAND },
  ativo: { label: 'Em andamento', icon: 'book', ...BRAND },
  atrasado: { label: 'Atrasado', icon: 'alert', ...DANGER },
  expirado: { label: 'Expirado', icon: 'x', ...NEUTRAL },
  cancelado: { label: 'Cancelado', icon: 'x', ...NEUTRAL },
}
