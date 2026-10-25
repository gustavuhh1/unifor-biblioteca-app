import React, { useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BottomNav } from '@/shared/components/bottom-nav'
import { CapaLivro } from '@/shared/components/livro'
import { Icon } from '@/shared/components/icon'
import { useTheme } from '@/shared/theme/theme-provider'

export interface HomeAlunoProps {
  onNotificacoes?: () => void
  onAcervo?: () => void
  onDetalheLivro?: () => void
  onEmprestimos?: () => void
  onAssistente?: () => void
  onPerfil?: () => void
  onMinhaVez?: () => void
  onBuscar?: (texto: string) => void
}

const recomendados = [
  { id: 1, titulo: 'Refatoração', autor: 'Martin Fowler', cor: 'cover2' as const },
  { id: 2, titulo: 'Arquitetura Limpa', autor: 'Robert C. Martin', cor: 'cover6' as const },
  { id: 3, titulo: 'Padrões de Projeto', autor: 'Gamma et al.', cor: 'cover3' as const },
]

export default function HomeAluno({ onNotificacoes, onAcervo, onDetalheLivro, onEmprestimos, onAssistente, onPerfil, onMinhaVez, onBuscar }: HomeAlunoProps) {
  const safe = useSafeAreaInsets()
  const { colors } = useTheme()
  const [busca, setBusca] = useState('')

  function aba(i: number) {
    ;[undefined, onAcervo, onEmprestimos, onAssistente, onPerfil][i]?.()
  }

  return (
    <View className="flex-1 bg-surface">
      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingTop: safe.top + 14, paddingBottom: 26 }}>
        <View className="mb-6 flex-row items-center justify-between px-4">
          <View>
            <Text className="text-title-lg text-ink">Olá, Lucas</Text>
            <Text className="mt-1 text-body text-ink-muted">Matrícula 2412858</Text>
          </View>
          <Pressable onPress={onNotificacoes} accessibilityRole="button" accessibilityLabel="Notificações, duas não lidas" className="h-12 w-12 items-center justify-center">
            <Icon name="bell" size={25} color="ink" />
            <View className="absolute right-0 top-0 h-5 w-5 items-center justify-center rounded-pill bg-danger">
              <Text className="text-caption-strong text-on-danger">2</Text>
            </View>
          </Pressable>
        </View>
        <View className="mb-5 flex-row items-center gap-2 px-4">
          <View className="min-h-[52px] flex-1 flex-row items-center gap-3 rounded-pill border border-line bg-surface-raised px-4">
            <Icon name="search" color="inkMuted" size={22} />
            <TextInput value={busca} onChangeText={setBusca} onSubmitEditing={() => onBuscar?.(busca)} placeholder="Buscar título, autor ou assunto" placeholderTextColor={colors.inkMuted} returnKeyType="search" className="min-w-0 flex-1 text-body text-ink" />
          </View>
          <Pressable onPress={() => onBuscar?.(busca)} accessibilityRole="button" accessibilityLabel="Buscar no acervo" className="h-[52px] w-[52px] items-center justify-center rounded-pill border border-line bg-surface-raised">
            <Icon name="search" color="ink" size={22} />
          </Pressable>
        </View>
        <Pressable onPress={onMinhaVez} accessibilityRole="button" className="mx-4 mb-5 flex-row gap-3 rounded-md bg-warning-soft p-4">
          <Icon name="bell" color="ink" size={22} />
          <View className="flex-1 gap-1">
            <Text className="text-label text-ink">É a sua vez: Código Limpo</Text>
            <Text className="text-body text-ink">Confirme até amanhã, 09:12, ou o livro passa para o próximo da fila.</Text>
          </View>
        </Pressable>
        <View className="mb-6 flex-row gap-3 px-4">
          <Pressable onPress={onEmprestimos} accessibilityRole="button" className="min-h-[110px] flex-1 rounded-md border border-line bg-surface-raised p-4">
            <Text className="text-caption-strong text-ink-muted">COM VOCÊ</Text>
            <Text className="mt-1 text-title-lg text-ink">3 de 10</Text>
            <Text className="text-body text-ink-muted">livros</Text>
          </Pressable>
          <Pressable onPress={onEmprestimos} accessibilityRole="button" className="min-h-[110px] flex-1 rounded-md border border-line bg-surface-raised p-4">
            <Text className="text-caption-strong text-ink-muted">PRÓXIMA DEVOLUÇÃO</Text>
            <Text className="mt-1 text-title text-ink">Amanhã, 16/10</Text>
            <Text className="text-body text-ink-muted">Engenharia de Software</Text>
          </Pressable>
        </View>
        <View className="mb-4 gap-1 px-4">
          <Text className="text-title text-ink">Recomendados para você</Text>
          <View className="flex-row items-center gap-2"><Icon name="sparkle" size={17} color="brand" /><Text className="flex-1 text-body text-ink-muted">Pelo que você mais leu em Engenharia de Software</Text></View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16, paddingBottom: 8 }}>
          {recomendados.map(l => (
            <Pressable key={l.id} onPress={onDetalheLivro} accessibilityRole="button" style={{ width: 147, gap: 6 }}>
              <CapaLivro nome={l.titulo} cor={l.cor} largura={147} />
              <Text className="text-book-title text-ink" numberOfLines={2}>{l.titulo}</Text>
              <Text className="text-caption text-ink-muted" numberOfLines={1}>{l.autor}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>
      <BottomNav role="aluno" active={0} badges={{ 0: 0 }} onSelect={aba} />
    </View>
  )
}
