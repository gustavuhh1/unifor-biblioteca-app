import { useRouter } from 'expo-router'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { useSession } from '@/features/auth/hooks/use-session'
import { AppBar, Icon, type IconName } from '@/shared/components'
import { toAppDate } from '@/shared/utils/dates'
import { buildStudentProfile } from '../profile.format'

interface MenuItem {
  label: string
  icon: IconName
  // Rota aberta ao tocar no item.
  href: string
}

// Itens do Perfil do aluno, na ordem do design (A50).
const MENU: MenuItem[] = [
  { label: 'Salvos', icon: 'bookmark', href: '/saved' },
  { label: 'Meus passkeys', icon: 'fingerprint', href: '/passkeys' },
  { label: 'Histórico de empréstimos', icon: 'clock', href: '/loans' },
  { label: 'Avisos e lembretes', icon: 'bell', href: '/notification-settings' },
  { label: 'Aparência', icon: 'moon', href: '/appearance' },
  { label: 'Regras da biblioteca', icon: 'info', href: '/library-rules' },
]

// Perfil do aluno (A47 e A50, RF-PER-01): dados de GET /me, menu que abre cada
// tela e o Sair (POST /auth/logout e depois o Firebase, RF-AUT-11).
export function StudentProfileScreen() {
  const router = useRouter()
  const { user } = useSession()
  const logout = useLogout()
  if (!user) return null

  const year = toAppDate(new Date().toISOString()).getFullYear()
  const view = buildStudentProfile(user, year)
  const stats = [
    [view.loans, 'livros com você'],
    [view.activeQueues, 'filas ativas'],
    [view.readThisYear, `lidos em ${view.readYear}`],
  ]

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Perfil" large />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 24,
          gap: 16,
        }}
      >
        <View className="flex-row items-center gap-3">
          <View className="h-[64px] w-[64px] items-center justify-center rounded-pill bg-brand-soft">
            <Text className="text-label text-brand">{view.initials}</Text>
          </View>
          <View className="min-w-0 flex-1 gap-1">
            <Text className="text-title text-ink">{view.name}</Text>
            <Text className="text-caption text-ink-muted">
              {view.matriculaLine}
            </Text>
            {view.course ? (
              <Text className="text-caption text-ink-muted">{view.course}</Text>
            ) : null}
          </View>
        </View>
        <View className="flex-row gap-3">
          {stats.map(([value, label]) => (
            <View
              key={label}
              className="min-w-0 flex-1 gap-1 rounded-lg border border-line bg-surface-raised p-3"
            >
              <Text className="text-stat text-ink">{value}</Text>
              <Text className="text-caption text-ink-muted">{label}</Text>
            </View>
          ))}
        </View>
        {view.fineAmount ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/fine')}
            className="gap-1 rounded-lg bg-warning-soft p-4"
          >
            <Text className="text-label text-warning">
              Multa em aberto: {view.fineAmount}
            </Text>
            <Text className="text-body text-ink">
              Pague no balcão da biblioteca. Você pode continuar pegando livros.
              Toque para ver.
            </Text>
          </Pressable>
        ) : (
          <View className="flex-row items-start gap-3 rounded-lg bg-success-soft p-4">
            <Icon name="check" size={20} color="success" />
            <View className="flex-1 gap-1">
              <Text className="text-label text-success">Nenhuma pendência</Text>
              <Text className="text-body text-ink">
                Você está em dia: pode pegar livros e entrar em filas.
              </Text>
            </View>
          </View>
        )}
        <View className="overflow-hidden rounded-lg border border-line bg-surface-raised">
          {MENU.map((item) => (
            <Pressable
              key={item.label}
              accessibilityRole="button"
              onPress={() => router.push(item.href)}
              className="min-h-12 flex-row items-center gap-3 border-b border-line p-4"
            >
              <Icon name={item.icon} color="inkMuted" />
              <Text className="flex-1 text-label text-ink">{item.label}</Text>
              <Icon name="chevronRight" color="inkMuted" size={18} />
            </Pressable>
          ))}
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ busy: logout.isPending }}
            disabled={logout.isPending}
            onPress={() => logout.mutate()}
            className="min-h-12 flex-row items-center gap-3 p-4"
          >
            <Icon name="logout" color="danger" />
            <Text className="flex-1 text-label text-danger">Sair</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}
