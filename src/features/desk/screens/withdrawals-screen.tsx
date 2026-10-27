import { useState } from 'react'
import { ActivityIndicator, FlatList, Text, View } from 'react-native'
import { ApiError } from '@/shared/api/errors'
import {
  AppBar,
  BookCover,
  Button,
  DeadlineChip,
  EmptyState,
  TextField,
} from '@/shared/components'
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value'
import { useTheme } from '@/shared/theme/theme-provider'
import { pluralize } from '@/shared/utils/plural'
import {
  MATRICULA_SEARCH_PATTERN,
  PICKUP_SEARCH_DEBOUNCE_MS,
} from '../desk.constants'
import {
  coverToneOfTitle,
  isLastPickupDay,
  pickupDeadlineLabel,
} from '../desk.format'
import { usePickups } from '../hooks/use-pickups'

// Retiradas (B07, RF-BAL-05): pedidos aguardando retirada, do prazo mais curto
// ao mais longo (GET /librarian/pickups), com busca pelos primeiros dígitos da
// matrícula do aluno.
export function WithdrawalsScreen() {
  const { colors } = useTheme()
  const [search, setSearch] = useState('')
  const debounced = useDebouncedValue(search, PICKUP_SEARCH_DEBOUNCE_MS)
  const matricula = MATRICULA_SEARCH_PATTERN.test(debounced)
    ? debounced
    : undefined
  const pickups = usePickups(matricula)

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Retiradas"
        subtitle={
          pickups.data
            ? pluralize(
                pickups.data.length,
                'pedido aguardando retirada',
                'pedidos aguardando retirada',
              )
            : undefined
        }
        large
      />
      <View className="mx-4 mb-4">
        <TextField
          label="Buscar pela matrícula do aluno"
          icon="search"
          value={search}
          onChangeText={(value) => setSearch(value.replace(/\D/g, ''))}
          inputMode="numeric"
          maxLength={7}
        />
      </View>
      {pickups.isPending ? (
        <View
          accessibilityLabel="Carregando retiradas"
          className="flex-1 items-center justify-center"
        >
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : pickups.isError ? (
        <EmptyState
          icon="alert"
          title="Não foi possível carregar as retiradas"
          text={
            pickups.error instanceof ApiError
              ? pickups.error.message
              : undefined
          }
          action={
            <Button icon="refresh" onPress={() => void pickups.refetch()}>
              Tentar de novo
            </Button>
          }
        />
      ) : (
        <FlatList
          data={pickups.data}
          keyExtractor={(item) => item.loanId}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 24,
            gap: 12,
          }}
          ListHeaderComponent={
            <Text className="mb-3 text-caption text-ink-muted">
              Pedidos confirmados, do prazo mais curto ao mais longo. Busque
              pela matrícula para ver os pedidos de um aluno.
            </Text>
          }
          ListEmptyComponent={
            <Text className="text-body text-ink-muted">
              {matricula
                ? 'Nenhum pedido encontrado para esta matrícula.'
                : 'Nenhum pedido aguardando retirada.'}
            </Text>
          }
          renderItem={({ item }) => (
            <View className="gap-3 rounded-lg border border-line bg-surface-raised p-3">
              <View className="flex-row gap-3">
                <BookCover
                  title={item.bookTitle}
                  tone={coverToneOfTitle(item.bookTitle)}
                  size="sm"
                />
                <View className="min-w-0 flex-1 gap-2">
                  <Text className="text-book-title text-ink">
                    {item.bookTitle}
                  </Text>
                  <Text className="text-caption text-ink-muted">
                    Estante {item.bookShelf} · {item.pickupCode}
                  </Text>
                  <Text className="text-caption text-ink-muted">
                    {item.studentName} · {item.matricula}
                  </Text>
                </View>
              </View>
              <View className="flex-row">
                <DeadlineChip
                  kind={
                    isLastPickupDay(item.pickupDeadline) ? 'vence' : 'retirar'
                  }
                >
                  {pickupDeadlineLabel(item.pickupDeadline)}
                </DeadlineChip>
              </View>
            </View>
          )}
        />
      )}
    </View>
  )
}
