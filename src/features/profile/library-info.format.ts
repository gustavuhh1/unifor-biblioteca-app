import type { OpeningHours, OpeningPeriod } from '@/shared/types'
import { formatCents } from '@/shared/utils/money'
import { pluralize } from '@/shared/utils/plural'
import type { LibraryInfo } from './library-info.types'

// Dias da semana na ordem do horário, com o nome curto de cada um.
const WEEKDAYS: { key: keyof OpeningHours; short: string }[] = [
  { key: 'mon', short: 'seg' },
  { key: 'tue', short: 'ter' },
  { key: 'wed', short: 'qua' },
  { key: 'thu', short: 'qui' },
  { key: 'fri', short: 'sex' },
  { key: 'sat', short: 'sáb' },
  { key: 'sun', short: 'dom' },
]

// "07:00" vira "7h" e "21:55" vira "21h55".
export function hourText(time: string): string {
  const [hours = '0', minutes = '00'] = time.split(':')
  const h = String(Number(hours))
  return minutes === '00' ? `${h}h` : `${h}h${minutes}`
}

// "7h às 21h55".
export function periodText(period: OpeningPeriod): string {
  return `${hourText(period.open)} às ${hourText(period.close)}`
}

// Agrupa dias seguidos com o mesmo horário: "Seg a sex, 7h às 21h55" e
// "Sáb, 8h às 14h10". Dia fechado (null) fica de fora.
export function openingHoursLines(hours: OpeningHours): string[] {
  const lines: string[] = []
  let start = 0
  while (start < WEEKDAYS.length) {
    const first = hours[WEEKDAYS[start]!.key]
    if (!first) {
      start += 1
      continue
    }
    let end = start
    while (end + 1 < WEEKDAYS.length) {
      const next = hours[WEEKDAYS[end + 1]!.key]
      if (!next || periodText(next) !== periodText(first)) break
      end += 1
    }
    const from = WEEKDAYS[start]!.short
    const to = WEEKDAYS[end]!.short
    const days = start === end ? from : `${from} a ${to}`
    lines.push(
      `${days[0]!.toUpperCase()}${days.slice(1)}, ${periodText(first)}`,
    )
    start = end + 1
  }
  return lines
}

// Uma seção da tela Regras da biblioteca: título e as frases dela.
export interface RulesSection {
  title: string
  lines: string[]
}

// Monta as seções das regras com os números que a API manda (RF-PER-02), para
// o texto nunca ficar diferente da regra de verdade.
export function buildRulesSections(info: LibraryInfo): RulesSection[] {
  const fine = formatCents(info.fineCentsPerBusinessDay)
  return [
    {
      title: 'Empréstimo',
      lines: [
        `Até ${info.maxActiveLoans} livros ao mesmo tempo.`,
        `${info.loanDays} dias para devolver cada livro.`,
        'Não dá para pegar dois exemplares do mesmo título, nem outra edição dele.',
      ],
    },
    {
      title: 'Retirada',
      lines: [
        `Pedido feito: retire no balcão em até ${pluralize(info.pickupBusinessDays, 'dia útil', 'dias úteis')}.`,
        'Mostre o QR do pedido. Sem celular? Informe a matrícula ou o código do pedido.',
      ],
    },
    {
      title: 'Fila (reserva)',
      lines: [
        'Só abre quando todos os exemplares da edição estão emprestados.',
        `Até ${info.maxActiveQueues} filas ao mesmo tempo. Cada edição marcada conta como uma.`,
        `Na sua vez: ${info.queueConfirmHours}h para confirmar e ${pluralize(info.pickupBusinessDays, 'dia útil', 'dias úteis')} para retirar. Se perder um prazo, você sai da fila e o próximo é avisado.`,
      ],
    },
    {
      title: 'Renovação',
      lines: [
        `${info.maxRenewals === 1 ? 'Uma única vez' : `Até ${info.maxRenewals} vezes`} por empréstimo, por mais ${info.renewalDays} dias, dentro do prazo, se o livro não estiver atrasado e ninguém estiver na fila.`,
        'Pelo app, pelo Unifor Online ou no balcão.',
      ],
    },
    {
      title: 'Atraso e multa',
      lines: [
        `${fine} por dia útil de atraso, por livro.`,
        'Com livro atrasado, você não pode pedir, entrar em fila nem retirar até devolver.',
        'Na devolução a multa para de contar e fica em aberto até ser paga.',
        'Pagamento só presencial, no balcão da biblioteca. O app não recebe pagamentos.',
      ],
    },
    {
      title: 'Perda ou dano',
      lines: [
        'Você repõe o livro e ainda paga a multa do atraso, se houver. O app só informa esta regra. A reposição é combinada no balcão.',
      ],
    },
    {
      title: 'Fins de semana e feriados',
      lines: [
        'Prazos em dias úteis não contam fins de semana, feriados (nacionais, do Ceará e de Fortaleza) nem dias de recesso da Unifor.',
        'Se o prazo cair num feriado, ele passa para o próximo dia útil.',
      ],
    },
  ]
}

// O "Atendimento": o lugar, os horários e os contatos (da API).
export function contactLines(info: LibraryInfo): string[] {
  const { contact } = info
  return [
    contact.place,
    ...openingHoursLines(info.openingHours),
    `BiblioZap ${contact.biblioZap} · Empréstimo ${contact.loanPhone}`,
    contact.loanEmail,
  ]
}
