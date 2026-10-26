import { TZDate } from '@date-fns/tz'
import { format } from 'date-fns'
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
