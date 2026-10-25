import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { AppBar, BottomNav, TextField } from '@/shared/components'
import type { CodigoRetirada } from '@/features/desk/screens/register-pickup-screen'
import { CapaLivro } from '@/shared/components/livro'
export interface RetiradasProps { onAbrirRetirada?: (codigo: CodigoRetirada) => void; onSelecionarAba?: (i: number) => void }
const dados = [
  { titulo: 'Padrões de Projeto', pessoa: 'Beatriz Nogueira', matricula: '2311052', codigo: 'RET-4817' as const, estante: '005.1', prazo: 'Último dia: hoje', cor: 'cover2' as const },
  { titulo: 'Cálculo, Vol. 2', pessoa: 'Rafael Teixeira', matricula: '2210478', codigo: 'RET-4809' as const, estante: '515', prazo: 'Retirar até amanhã', cor: 'cover4' as const },
  { titulo: 'Código Limpo', pessoa: 'Lucas Almeida', matricula: '2412858', codigo: 'RET-4821' as const, estante: '005.1', prazo: 'Retirar até seg, 19/10', cor: 'cover1' as const },
]
export function WithdrawalsScreen({ onAbrirRetirada, onSelecionarAba }: RetiradasProps) {
  const [busca, setBusca] = useState('')
  const resultados = dados.filter(d => d.matricula.includes(busca.trim()))
  return <View className="flex-1 bg-surface"><AppBar title="Retiradas" subtitle="12 pedidos aguardando retirada" large />
    <View className="mx-4 mb-4"><TextField label="Buscar pela matrícula do aluno" icon="search" value={busca} onChangeText={v => setBusca(v.replace(/\D/g, ''))} inputMode="numeric" maxLength={7} /></View>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 12 }}>
      <Text className="text-caption text-ink-muted">Pedidos confirmados, do prazo mais curto ao mais longo. Busque pela matrícula para ver os pedidos de um aluno.</Text>
      {resultados.map(d => <Pressable key={d.codigo} onPress={() => onAbrirRetirada?.(d.codigo)} accessibilityRole="button" className="gap-3 rounded-lg border border-line bg-surface-raised p-3"><View className="flex-row gap-3"><CapaLivro nome={d.titulo} cor={d.cor} largura={56} /><View className="min-w-0 flex-1 gap-2"><Text className="text-book-title text-ink">{d.titulo}</Text><Text className="text-caption text-ink-muted">Estante {d.estante} · {d.codigo}</Text><Text className="text-caption text-ink-muted">{d.pessoa} · {d.matricula}</Text></View></View><View className={`self-start rounded-pill px-3 py-1 ${d.prazo.startsWith('Último') ? 'bg-warning-soft' : 'bg-brand-soft'}`}><Text className={`text-caption-strong ${d.prazo.startsWith('Último') ? 'text-warning' : 'text-brand'}`}>{d.prazo}</Text></View></Pressable>)}
      {!resultados.length ? <Text className="text-body text-ink-muted">Nenhum pedido encontrado para esta matrícula.</Text> : null}
    </ScrollView><BottomNav role="bibliotecario" active={1} onSelect={onSelecionarAba} />
  </View>
}