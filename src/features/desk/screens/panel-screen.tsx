import { Pressable, ScrollView, Text, View } from 'react-native'
import { AppBar, BottomNav, Icon, type IconName } from '@/shared/components'
export interface PainelProps { onRetiradas?: () => void; onEscanear?: () => void; onFilas?: () => void; onMultas?: () => void; onPerfil?: () => void; onAcervo?: () => void; onDevolucao?: () => void }
const itens: { icone: IconName; titulo: string; valor: string; tom: 'brand' | 'warning' | 'danger' | 'success' }[] = [
  { icone: 'inbox', titulo: 'Livros para separar', valor: '12', tom: 'brand' }, { icone: 'bell', titulo: 'Aguardando o aluno confirmar', valor: '7', tom: 'warning' },
  { icone: 'alert', titulo: 'Empréstimos atrasados', valor: '5', tom: 'danger' }, { icone: 'check', titulo: 'Devoluções hoje', valor: '31', tom: 'success' },
]
export function PanelScreen({ onRetiradas, onEscanear, onFilas, onMultas, onPerfil, onAcervo, onDevolucao }: PainelProps) {
  const acoes = [onRetiradas, onFilas, onMultas, onDevolucao]
  const navegar = [undefined, onRetiradas, onEscanear, onFilas, onMultas]
  return <View className="flex-1 bg-surface"><AppBar title="Biblioteca" subtitle="Praça Central · balcão · Ana Souza" actions={[{ icon: 'user', label: 'Perfil', onPress: onPerfil }]} />
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}>
      <View className="flex-row flex-wrap gap-3">{itens.map((item, i) => <Pressable key={item.titulo} onPress={acoes[i]} accessibilityRole="button" className="min-w-0 grow basis-[45%] gap-3 rounded-lg border border-line bg-surface-raised p-4"><Icon name={item.icone} color={item.tom} size={24} /><Text className="text-number text-ink">{item.valor}</Text><Text className="text-caption text-ink-muted">{item.titulo}</Text></Pressable>)}</View>
      <Pressable onPress={onAcervo} accessibilityRole="button" className="min-h-18 flex-row items-center gap-3 rounded-lg border border-line bg-surface-raised p-4"><Icon name="books" color="brand" /><View className="flex-1 gap-1"><Text className="text-label text-ink">Acervo</Text><Text className="text-caption text-ink-muted">Buscar, cadastrar e editar livros</Text></View><Icon name="chevronRight" color="inkMuted" /></Pressable>
      <View className="flex-row items-center justify-between"><Text className="text-title text-ink">Retiradas de hoje</Text><Pressable accessibilityRole="button" onPress={onRetiradas} className="min-h-[44px] justify-center"><Text className="text-label text-brand">Ver todas</Text></Pressable></View>
      <View className="overflow-hidden rounded-lg border border-line bg-surface-raised">{[['LA', 'Lucas Almeida', 'Código Limpo · RET-4821', 'seg, 19/10'], ['BN', 'Beatriz Nogueira', 'Padrões de Projeto · RET-4817', 'hoje'], ['RT', 'Rafael Teixeira', 'Cálculo, Vol. 2 · RET-4809', 'amanhã']].map(([sigla, nome, livro, prazo]) => <Pressable key={sigla} accessibilityRole="button" onPress={onRetiradas} className="flex-row items-center gap-3 border-b border-line p-3"><View className="h-10 w-10 items-center justify-center rounded-pill bg-brand-soft"><Text className="text-caption-strong text-brand">{sigla}</Text></View><View className="min-w-0 flex-1 gap-1"><Text className="text-label text-ink">{nome}</Text><Text className="text-caption text-ink-muted">{livro}</Text></View><Text className="text-caption-strong text-brand">{prazo}</Text></Pressable>)}</View>
    </ScrollView><BottomNav role="bibliotecario" active={0} onSelect={i => navegar[i]?.()} />
  </View>
}