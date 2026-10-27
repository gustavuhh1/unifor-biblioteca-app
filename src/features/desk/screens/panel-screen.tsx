import { useRouter } from 'expo-router'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { useSession } from '@/features/auth/hooks/use-session'
import { displayNameOf } from '@/features/profile/profile.format'
import {
  AppBar,
  Button,
  EmptyState,
  Icon,
  type IconName,
} from '@/shared/components'
import { initialsOf } from '@/shared/components/avatar'
import { useTheme } from '@/shared/theme/theme-provider'
import { ApiError } from '@/shared/api/errors'
import { PANEL_PICKUPS_LIMIT } from '../desk.constants'
import { pickupDeadlineLabel } from '../desk.format'
import type { DeskSummary } from '../desk.types'
import { useDeskSummary } from '../hooks/use-desk-summary'
import { usePickups } from '../hooks/use-pickups'

// Rotas do bibliotecário abertas pelo Painel (as abas e o Acervo).
const ROUTE = {
  withdrawals: '/withdrawals',
  queues: '/queues',
  fines: '/fines',
  scan: '/scan',
  collection: '/collection-management',
  profile: '/librarian-profile',
} as const

interface SummaryCard {
  icon: IconName
  title: string
  tone: 'brand' | 'warning' | 'danger' | 'success'
  href: string
  value: (summary: DeskSummary) => number
}

// Os quatro números do dia (RF-BAL-01), na ordem do design (B01).
const CARDS: SummaryCard[] = [
  {
    icon: 'inbox',
    title: 'Livros para separar',
    tone: 'brand',
    href: ROUTE.withdrawals,
    value: (summary) => summary.pendingPickups,
  },
  {
    icon: 'bell',
    title: 'Aguardando o aluno confirmar',
    tone: 'warning',
    href: ROUTE.queues,
    value: (summary) => summary.queueAwaitingConfirm,
  },
  {
    icon: 'alert',
    title: 'Multas em aberto',
    tone: 'danger',
    href: ROUTE.fines,
    value: (summary) => summary.openFines,
  },
  {
    icon: 'check',
    title: 'Devoluções hoje',
    tone: 'success',
    href: ROUTE.scan,
    value: (summary) => summary.returnsToday,
  },
]

// Painel do bibliotecário (B01, RF-BAL-01): os números do dia de
// GET /librarian/desk/summary, as próximas retiradas de GET /librarian/pickups
// e atalhos para as abas, o Acervo e o Perfil.
export function PanelScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { user } = useSession()
  const summary = useDeskSummary()
  const pickups = usePickups()

  const subtitle = [
    user?.deskLabel ?? 'Balcão',
    user ? displayNameOf(user) : null,
  ]
    .filter(Boolean)
    .join(' · ')
  const nextPickups = pickups.data?.slice(0, PANEL_PICKUPS_LIMIT) ?? []

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Biblioteca"
        subtitle={subtitle}
        actions={[
          {
            icon: 'user',
            label: 'Perfil',
            onPress: () => router.push(ROUTE.profile),
          },
        ]}
      />
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}
      >
        {summary.isError ? (
          <EmptyState
            icon="alert"
            title="Não foi possível carregar os números do dia"
            text={
              summary.error instanceof ApiError
                ? summary.error.message
                : undefined
            }
            action={
              <Button icon="refresh" onPress={() => void summary.refetch()}>
                Tentar de novo
              </Button>
            }
          />
        ) : (
          <View className="flex-row flex-wrap gap-3">
            {CARDS.map((card) => (
              <Pressable
                key={card.title}
                onPress={() => router.push(card.href)}
                accessibilityRole="button"
                className="min-w-0 grow basis-[45%] gap-3 rounded-lg border border-line bg-surface-raised p-4"
              >
                <Icon name={card.icon} color={card.tone} size={24} />
                {summary.data ? (
                  <Text className="text-number text-ink">
                    {card.value(summary.data)}
                  </Text>
                ) : (
                  <ActivityIndicator
                    accessibilityLabel="Carregando"
                    color={colors.brand}
                    className="self-start"
                  />
                )}
                <Text className="text-caption text-ink-muted">
                  {card.title}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
        <Pressable
          onPress={() => router.push(ROUTE.collection)}
          accessibilityRole="button"
          className="min-h-18 flex-row items-center gap-3 rounded-lg border border-line bg-surface-raised p-4"
        >
          <Icon name="books" color="brand" />
          <View className="flex-1 gap-1">
            <Text className="text-label text-ink">Acervo</Text>
            <Text className="text-caption text-ink-muted">
              Buscar, cadastrar e editar livros
            </Text>
          </View>
          <Icon name="chevronRight" color="inkMuted" />
        </Pressable>
        <View className="flex-row items-center justify-between">
          <Text className="text-title text-ink">Próximas retiradas</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(ROUTE.withdrawals)}
            className="min-h-[44px] justify-center"
          >
            <Text className="text-label text-brand">Ver todas</Text>
          </Pressable>
        </View>
        {pickups.isPending ? (
          <ActivityIndicator
            accessibilityLabel="Carregando retiradas"
            color={colors.brand}
          />
        ) : pickups.isError ? (
          <Text className="text-body text-ink-muted">
            Não foi possível carregar as retiradas.
          </Text>
        ) : nextPickups.length === 0 ? (
          <Text className="text-body text-ink-muted">
            Nenhum pedido aguardando retirada.
          </Text>
        ) : (
          <View className="overflow-hidden rounded-lg border border-line bg-surface-raised">
            {nextPickups.map((item) => (
              <Pressable
                key={item.loanId}
                accessibilityRole="button"
                onPress={() => router.push(ROUTE.withdrawals)}
                className="flex-row items-center gap-3 border-b border-line p-3"
              >
                <View className="h-10 w-10 items-center justify-center rounded-pill bg-brand-soft">
                  <Text className="text-caption-strong text-brand">
                    {initialsOf(item.studentName)}
                  </Text>
                </View>
                <View className="min-w-0 flex-1 gap-1">
                  <Text className="text-label text-ink">
                    {item.studentName}
                  </Text>
                  <Text className="text-caption text-ink-muted">
                    {item.bookTitle} · {item.pickupCode}
                  </Text>
                </View>
                <Text className="text-caption-strong text-brand">
                  {pickupDeadlineLabel(item.pickupDeadline)}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
