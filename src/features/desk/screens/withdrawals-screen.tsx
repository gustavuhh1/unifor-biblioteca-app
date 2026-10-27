import { useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native'
import { ApiError } from '@/shared/api/errors'
import {
  Alert,
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
import { useDeskLookup } from '../hooks/use-desk-lookup'
import { usePickups } from '../hooks/use-pickups'

// Retiradas (B07, RF-BAL-05): pedidos aguardando retirada, do prazo mais curto
// ao mais longo (GET /librarian/pickups), com busca pelos primeiros dígitos da
// matrícula do aluno. Tocar num pedido abre a ficha do aluno pelo código do
// pedido (POST /librarian/desk/lookup), de onde se registra a retirada.
export function WithdrawalsScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const lookup = useDeskLookup()
  const [search, setSearch] = useState('')
  const debounced = useDebouncedValue(search, PICKUP_SEARCH_DEBOUNCE_MS)
  const matricula = MATRICULA_SEARCH_PATTERN.test(debounced)
    ? debounced
    : undefined
  const pickups = usePickups(matricula)

  function openRecord(pickupCode: string) {
    lookup.mutate(
      { pickupCode },
      {
        onSuccess: (record) =>
          router.push({
            pathname: '/identify-student',
            params: { matricula: record.student.matricula },
          }),
      },
    )
  }

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
      {lookup.isError ? (
        <View className="mx-4 mb-4">
          <Alert tone="danger" title="Não foi possível abrir o pedido">
            {lookup.error instanceof ApiError
              ? lookup.error.message
              : 'Tente de novo.'}
          </Alert>
        </View>
      ) : null}
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
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Abrir o pedido ${item.pickupCode} de ${item.studentName}`}
              disabled={lookup.isPending}
              onPress={() => openRecord(item.pickupCode)}
              className="gap-3 rounded-lg border border-line bg-surface-raised p-3"
            >
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
                    {item.bookShelf} · {item.pickupCode}
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
            </Pressable>
          )}
        />
      )}
    </View>
  )
}
