import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { useLibraryInfo } from '@/features/profile/hooks/use-library-info'
import { contactLines } from '@/features/profile/library-info.format'
import { ApiError } from '@/shared/api/errors'
import {
  Alert,
  AppBar,
  Button,
  EmptyState,
  FineCard,
} from '@/shared/components'
import { useTheme } from '@/shared/theme/theme-provider'
import { formatCents } from '@/shared/utils/money'
import { useMyFines } from '../hooks/use-my-fines'
import {
  fineBookLine,
  fineStateText,
  finesNotice,
  groupFines,
  paidFineLine,
} from '../my-fines.format'

// Minhas multas (A45, A46 e A71; RF-MUL-03 e RF-MUL-04): as multas de
// GET /me/fines, contando (livro com o aluno), congeladas (já devolvido) e pagas.
// O app só consulta: a multa se paga no balcão e o bibliotecário registra.
export function MyFinesScreen() {
  const { colors } = useTheme()
  const fines = useMyFines()
  const library = useLibraryInfo()

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Minhas multas" back />
      {fines.isPending ? (
        <View
          accessibilityLabel="Carregando as multas"
          className="flex-1 items-center justify-center"
        >
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : fines.isError ? (
        <EmptyState
          icon="alert"
          title="Não foi possível abrir as multas"
          text={
            fines.error instanceof ApiError ? fines.error.message : undefined
          }
          action={
            <Button icon="refresh" onPress={() => void fines.refetch()}>
              Tentar de novo
            </Button>
          }
        />
      ) : (
        <FinesContent
          data={fines.data}
          attendance={library.data ? contactLines(library.data) : []}
        />
      )}
    </View>
  )
}

function FinesContent({
  data,
  attendance,
}: {
  data: NonNullable<ReturnType<typeof useMyFines>['data']>
  attendance: string[]
}) {
  const grouped = groupFines(data.items)
  const toPay = [...grouped.accruing, ...grouped.open]
  const notice = finesNotice(data)

  if (data.items.length === 0) {
    return (
      <EmptyState
        icon="checkCircle"
        title="Nenhuma pendência"
        text="Você não tem multas. Pode pegar livros e entrar em filas."
      />
    )
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      {notice ? (
        <Alert
          tone={data.blocksNewLoans ? 'danger' : 'info'}
          title={notice.title}
        >
          {notice.text}
        </Alert>
      ) : null}
      {toPay.map((fine) => (
        <View key={fine.id} className="gap-2">
          <FineCard
            amount={formatCents(fine.amountCents)}
            daysLate={fine.businessDaysLate}
            rate={formatCents(fine.ratePerBusinessDayCents)}
            book={fineBookLine(fine)}
            tag={fine.status === 'open' ? 'Congelada' : undefined}
          />
          <Text className="text-caption text-ink-muted">
            {fineStateText(fine)}
          </Text>
        </View>
      ))}
      {data.openTotalCents > 0 ? (
        <Text className="text-label text-ink">
          {`Total a pagar no balcão: ${formatCents(data.openTotalCents)}`}
        </Text>
      ) : null}
      {grouped.paid.length > 0 ? (
        <View className="gap-2">
          <Text className="text-overline text-ink-muted">Pagas</Text>
          <View className="overflow-hidden rounded-lg border border-line bg-surface-raised">
            {grouped.paid.map((fine) => (
              <View
                key={fine.id}
                className="flex-row items-center justify-between gap-3 border-b border-line p-4"
              >
                <Text className="min-w-0 flex-1 text-body text-ink-muted">
                  {paidFineLine(fine)}
                </Text>
                <Text className="text-label text-ink">
                  {formatCents(fine.amountCents)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
      {attendance.length > 0 ? (
        <View className="gap-2">
          <Text className="text-overline text-ink-muted">Atendimento</Text>
          <View className="gap-1 rounded-lg border border-line bg-surface-raised p-4">
            {attendance.map((line) => (
              <Text key={line} className="text-body text-ink-muted">
                {line}
              </Text>
            ))}
          </View>
        </View>
      ) : null}
    </ScrollView>
  )
}
