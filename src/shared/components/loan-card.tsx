import { Text, View } from 'react-native'
import { CapaLivro } from './livro'
import { Icon } from './icon'
import { Button } from './button'
import type { ColorToken } from '@/shared/theme/tokens.generated'

export interface LoanCardProps {
  title: string; author: string; color: ColorToken; status: string; start: string; due: string;
  progress?: number; late?: boolean; renewed?: boolean; blocked?: boolean; onRenew?: () => void; onFine?: () => void
}
export function LoanCard({ title, author, color, status, start, due, progress = .5, late, renewed, blocked, onRenew, onFine }: LoanCardProps) {
  return <View className={`gap-3 rounded-lg border bg-surface-raised p-3 ${late ? 'border-danger' : 'border-line'}`}>
    <View className="flex-row gap-3"><CapaLivro nome={title} autor={author} cor={color} largura={56} /><View className="min-w-0 flex-1 gap-1"><Text className="text-book-title text-ink">{title}</Text><Text className="text-caption text-ink-muted">{author}</Text><View className={`self-start rounded-sm px-2 py-1 ${late ? 'bg-danger-soft' : blocked ? 'bg-warning-soft' : 'bg-brand-soft'}`}><Text className={`text-overline ${late ? 'text-danger' : blocked ? 'text-warning' : 'text-brand-strong'}`}>{status}</Text></View></View></View>
    <View accessible accessibilityLabel={`Prazo decorrido: ${Math.round(progress * 100)} por cento`} className="h-1 overflow-hidden rounded-pill bg-surface-sunken"><View style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }} className={`h-1 ${late ? 'bg-danger' : blocked ? 'bg-warning' : 'bg-brand'}`} /></View>
    <View className="flex-row justify-between gap-2"><Text className="text-micro text-ink-muted">{start}</Text><Text className="text-micro-strong text-ink">{due}</Text></View>
    {blocked ? <View className="flex-row gap-1"><Icon name="users" size={14} color="inkMuted" /><Text className="flex-1 text-caption text-ink-muted">Renovação indisponível: 2 alunos na fila deste livro.</Text></View> : null}
    {late ? <Button block size="sm" variant="danger" icon="coin" onPress={onFine}>Ver multa</Button> : <Button block size="sm" variant={blocked ? 'ghost' : 'tonal'} icon="refresh" disabled={renewed} onPress={onRenew}>{blocked ? 'Renovar' : renewed ? 'Renovação já utilizada' : 'Renovar +14 dias'}</Button>}
  </View>
}
