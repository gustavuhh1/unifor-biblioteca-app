import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSession } from '@/features/auth/hooks/use-session'
import { Icon } from '@/shared/components/icon'
import {
  MAX_ACTIVE_LOANS,
  MAX_ACTIVE_QUEUES,
} from '@/shared/config/library-rules'
import { useTheme } from '@/shared/theme/theme-provider'

// Início do aluno (A07). Só mostra o que a API já entrega em GET /me: nome,
// matrícula, livros com o aluno e filas ativas. O aviso "É a sua vez", a
// próxima devolução e os Recomendados voltam nas etapas que trazem essas rotas.
export function HomeScreen() {
  const safe = useSafeAreaInsets()
  const router = useRouter()
  const { colors } = useTheme()
  const { user } = useSession()
  const [busca, setBusca] = useState('')

  function buscar() {
    router.push({ pathname: '/catalog', params: { q: busca.trim() } })
  }

  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: safe.top + 14, paddingBottom: 26 }}
      >
        <View className="mb-6 flex-row items-center justify-between px-4">
          <View>
            <Text className="text-title-lg text-ink">
              Olá, {user?.fullName?.split(' ')[0] ?? 'aluno'}
            </Text>
            <Text className="mt-1 text-body text-ink-muted">
              Matrícula {user?.matricula}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/notifications')}
            accessibilityRole="button"
            accessibilityLabel="Notificações"
            className="h-12 w-12 items-center justify-center"
          >
            <Icon name="bell" size={25} color="ink" />
          </Pressable>
        </View>
        <View className="mb-5 flex-row items-center gap-2 px-4">
          <View className="min-h-[52px] flex-1 flex-row items-center gap-3 rounded-pill border border-line bg-surface-raised px-4">
            <Icon name="search" color="inkMuted" size={22} />
            <TextInput
              value={busca}
              onChangeText={setBusca}
              onSubmitEditing={buscar}
              placeholder="Buscar título, autor ou assunto"
              placeholderTextColor={colors.inkMuted}
              returnKeyType="search"
              className="min-w-0 flex-1 text-body text-ink"
            />
          </View>
          <Pressable
            onPress={buscar}
            accessibilityRole="button"
            accessibilityLabel="Buscar no acervo"
            className="h-[52px] w-[52px] items-center justify-center rounded-pill border border-line bg-surface-raised"
          >
            <Icon name="search" color="ink" size={22} />
          </Pressable>
        </View>
        <View className="mb-6 flex-row gap-3 px-4">
          <Pressable
            onPress={() => router.push('/loans')}
            accessibilityRole="button"
            className="min-h-[110px] flex-1 rounded-md border border-line bg-surface-raised p-4"
          >
            <Text className="text-caption-strong text-ink-muted">COM VOCÊ</Text>
            <Text className="mt-1 text-title-lg text-ink">
              {user?.activeLoanCount ?? 0} de {MAX_ACTIVE_LOANS}
            </Text>
            <Text className="text-body text-ink-muted">livros</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push('/loans')}
            accessibilityRole="button"
            className="min-h-[110px] flex-1 rounded-md border border-line bg-surface-raised p-4"
          >
            <Text className="text-caption-strong text-ink-muted">NA FILA</Text>
            <Text className="mt-1 text-title-lg text-ink">
              {user?.activeQueueCount ?? 0} de {MAX_ACTIVE_QUEUES}
            </Text>
            <Text className="text-body text-ink-muted">filas</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}
