import { Pressable, ScrollView, Text, View } from 'react-native'
import { AppBar, BottomNav, Icon, type IconName } from '@/shared/components'
export type PerfilAlunoProps = {
  estado?: 'em-dia' | 'multa'; onEmprestimos?: () => void; onMinhasFilas?: () => void; onSalvos?: () => void;
  onAparencia?: () => void; onPasskeys?: () => void; onHistorico?: () => void; onAvisos?: () => void;
  onRegras?: () => void; onMulta?: () => void; onSair?: () => void; onSelecionarAba?: (i: number) => void
}
export function StudentProfileScreen({ estado = 'em-dia', onSalvos, onAparencia, onPasskeys, onHistorico, onAvisos, onRegras, onMulta, onSair, onSelecionarAba }: PerfilAlunoProps) {
  const multa = estado === 'multa'
  const menu: { label: string; icon: IconName; action?: () => void }[] = [
    { label: 'Salvos', icon: 'bookmark', action: onSalvos }, { label: 'Meus passkeys', icon: 'fingerprint', action: onPasskeys },
    { label: 'Histórico de empréstimos', icon: 'clock', action: onHistorico }, { label: 'Avisos e lembretes', icon: 'bell', action: onAvisos },
    { label: 'Aparência', icon: 'moon', action: onAparencia }, { label: 'Regras da biblioteca', icon: 'info', action: onRegras }, { label: 'Sair', icon: 'logout', action: onSair },
  ]
  return <View className="flex-1 bg-surface"><AppBar title="Perfil" large /><ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 16 }}>
    <View className="flex-row items-center gap-3"><View className="h-[64px] w-[64px] items-center justify-center rounded-pill bg-brand-soft"><Text className="text-label text-brand">{multa ? 'MC' : 'LA'}</Text></View><View className="min-w-0 flex-1 gap-1"><Text className="text-title text-ink">{multa ? 'Marina Castro' : 'Lucas Almeida'}</Text><Text className="text-caption text-ink-muted">Matrícula {multa ? '2513320 · ingresso em 2025' : '2412858 · ingresso em 2024'}</Text><Text className="text-caption text-ink-muted">{multa ? 'Sistemas de Informação' : 'Ciência da Computação'}</Text></View></View>
    <View className="flex-row gap-3">{[[multa ? '2/10' : '3/10', 'livros com você'], [multa ? '0' : '2', 'filas ativas'], [multa ? '9' : '17', 'lidos em 2026']].map(([value, label]) => <View key={label} className="min-w-0 flex-1 gap-1 rounded-lg border border-line bg-surface-raised p-3"><Text className="text-stat text-ink">{value}</Text><Text className="text-caption text-ink-muted">{label}</Text></View>)}</View>
    {multa ? <Pressable accessibilityRole="button" onPress={onMulta} className="gap-1 rounded-lg bg-warning-soft p-4"><Text className="text-label text-warning">Multa em aberto: R$ 6,00</Text><Text className="text-body text-ink">Pague no balcão da biblioteca. Você pode continuar pegando livros. Toque para ver.</Text></Pressable> : <View className="gap-1 rounded-lg bg-success-soft p-4"><Text className="text-label text-success">Nenhuma pendência</Text><Text className="text-body text-ink">Você está em dia: pode pegar livros e entrar em filas.</Text></View>}
    <View className="overflow-hidden rounded-lg border border-line bg-surface-raised">{menu.map((item, index) => <Pressable key={item.label} accessibilityRole="button" disabled={!item.action} onPress={item.action} className={`min-h-12 flex-row items-center gap-3 p-4 ${index < menu.length - 1 ? 'border-b border-line' : ''}`}><Icon name={item.icon} color={item.label === 'Sair' ? 'danger' : 'inkMuted'} /><Text className={`flex-1 text-label ${item.label === 'Sair' ? 'text-danger' : 'text-ink'}`}>{item.label}</Text>{item.label !== 'Sair' ? <Icon name="chevronRight" color="inkMuted" size={18} /> : null}</Pressable>)}</View>
  </ScrollView><BottomNav role="aluno" active={4} onSelect={onSelecionarAba} /></View>
}