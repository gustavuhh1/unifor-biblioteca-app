import { TZDate } from '@date-fns/tz'
import { differenceInCalendarDays, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Fuso de todas as datas mostradas no app (a API grava em UTC).
export const APP_TIME_ZONE = 'America/Fortaleza'

// Converte uma data ISO 8601 (UTC) da API em data no fuso do app.
export function toAppDate(iso: string): TZDate {
  return new TZDate(iso, APP_TIME_ZONE)
}

// Dia e mês no fuso do app, ex.: "24/10".
export function formatDayMonth(iso: string): string {
  return format(toAppDate(iso), 'dd/MM', { locale: ptBR })
}

// Dia, mês e ano no fuso do app, ex.: "24/10/2026".
export function formatDate(iso: string): string {
  return format(toAppDate(iso), 'dd/MM/yyyy', { locale: ptBR })
}

// Dias de calendário de `iso` em relação a `now`, no fuso do app (0 = hoje,
// 1 = amanhã). `now` entra por parâmetro para o cálculo ser testável.
export function calendarDaysFromNow(
  iso: string,
  now: Date = new Date(),
): number {
  return differenceInCalendarDays(
    toAppDate(iso),
    new TZDate(now, APP_TIME_ZONE),
  )
}

// Rótulo do prazo com o dia por extenso quando é perto: "Hoje, 16/10",
// "Amanhã, 16/10" ou só "16/10" nos outros dias (A07, Próxima devolução).
export function formatRelativeDay(iso: string, now: Date = new Date()): string {
  const days = calendarDaysFromNow(iso, now)
  const dayMonth = formatDayMonth(iso)
  if (days === 0) return `Hoje, ${dayMonth}`
  if (days === 1) return `Amanhã, ${dayMonth}`
  return dayMonth
}

// Prazo com a hora, em minúsculas para entrar numa frase: "hoje, 09:12",
// "amanhã, 09:12" ou "16/10, 09:12" (A07, "Confirme até ...").
export function formatRelativeDateTime(
  iso: string,
  now: Date = new Date(),
): string {
  const days = calendarDaysFromNow(iso, now)
  const time = format(toAppDate(iso), 'HH:mm', { locale: ptBR })
  if (days === 0) return `hoje, ${time}`
  if (days === 1) return `amanhã, ${time}`
  return `${formatDayMonth(iso)}, ${time}`
}
