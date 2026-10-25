import React, { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { AppBar } from '@/shared/components/app-bar'
import { Button } from '@/shared/components/button'
import { Icon, type IconName } from '@/shared/components/icon'

export interface NotificacoesProps {
  onVoltar?: () => void
  onVouRetirar?: () => void
  onDesistir?: () => void
  onEmprestimos?: () => void
  onMinhasFilas?: () => void
}

const recentes: { id: number; icone: IconName; titulo: string; descricao: string; data: string }[] = [
  { id: 1, icone: 'clock', titulo: 'A 3ª edição de Algoritmos voltou', descricao: 'Confirme até sex, 16/10, 09:12. A fila da 4ª edição foi cancelada.', data: '09:12' },
  { id: 2, icone: 'bell', titulo: 'É a sua vez: Código Limpo', descricao: 'Confirme até amanhã, 09:12, que vai retirar.', data: '09:12' },
]
const antigas: { id: number; icone: IconName; titulo: string; descricao: string; data: string }[] = [
  { id: 3, icone: 'clock', titulo: 'Engenharia de Software vence em 2 dias', descricao: 'Há alunos na fila, então não dá para renovar.', data: 'ontem' },
  { id: 4, icone: 'users', titulo: 'Você subiu na fila', descricao: 'Arquitetura Limpa: agora é a 1 pessoa na sua frente.', data: 'ontem' },
  { id: 5, icone: 'x', titulo: 'Você saiu da fila de Sistemas de Banco de Dados', descricao: 'O prazo de 24h para confirmar terminou e o livro foi para o próximo.', data: 'seg' },
]

function Lista({ itens, onVouRetirar, onDesistir, onEmprestimos, onMinhasFilas }: NotificacoesProps & { itens: typeof recentes }) {
    return (
      <View className="overflow-hidden rounded-md border border-line bg-surface-raised">
        {itens.map((n, i) => (
          <Pressable key={n.id} onPress={n.id === 2 ? undefined : n.id === 1 ? onVouRetirar : n.id === 3 ? onEmprestimos : onMinhasFilas}
            className={`flex-row gap-3 p-3 ${i < itens.length - 1 ? 'border-b border-line' : ''}`} accessibilityRole={n.id === 2 ? undefined : 'button'}>
            <View className="h-[36px] w-[36px] items-center justify-center rounded-md bg-brand-soft"><Icon name={n.icone} color="brand" size={18} /></View>
            <View className="flex-1 gap-1">
              <Text className="text-label text-ink">{n.titulo}</Text>
              <Text className="text-caption text-ink-muted">{n.descricao}</Text>
              {n.id === 2 ? <View className="flex-row gap-2 pt-1"><Button size="sm" onPress={onVouRetirar}>Vou retirar</Button><Button size="sm" variant="ghost" onPress={onDesistir}>Desistir</Button></View> : null}
            </View>
            <Text className="text-micro text-ink-muted">{n.data}</Text>
          </Pressable>
        ))}
      </View>
    )
  }
export function NotificationsScreen({ onVoltar, ...actions }: NotificacoesProps) {
  const [lidas, setLidas] = useState(false)
  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Notificações" back onBack={onVoltar} actions={[{ icon: 'check', label: 'Marcar como lidas', onPress: () => setLidas(true) }]} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30, gap: 12 }}>
        {lidas ? <View className="rounded-md bg-success-soft p-3"><Text className="text-label text-success">Notificações marcadas como lidas.</Text></View> : null}
        <Text className="text-caption-strong text-ink-muted">HOJE</Text>
        <Lista itens={recentes} {...actions} />
        <Text className="mt-3 text-caption-strong text-ink-muted">ESTA SEMANA</Text>
        <Lista itens={antigas} {...actions} />
      </ScrollView>
    </View>
  )
}
