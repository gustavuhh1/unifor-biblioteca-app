import { useLocalSearchParams, useRouter } from 'expo-router'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { AppBar, Icon } from '@/shared/components'
import { useLogout } from '@/features/auth/hooks/use-logout'

type Profile = {
  initials: string
  name: string
  studentId: string
  entryYear: string
  course: string
  loans: string
  queues: string
  read: string
  hasFine: boolean
}

const PROFILES: Record<'lucas' | 'marina', Profile> = {
  lucas: {
    initials: 'LA',
    name: 'Lucas Almeida',
    studentId: '2412858',
    entryYear: '2024',
    course: 'Ciência da Computação',
    loans: '3/10',
    queues: '2',
    read: '17',
    hasFine: false,
  },
  marina: {
    initials: 'MC',
    name: 'Marina Castro',
    studentId: '2513320',
    entryYear: '2025',
    course: 'Sistemas de Informação',
    loans: '2/10',
    queues: '0',
    read: '9',
    hasFine: true,
  },
}

function ProfileLink({
  icon,
  title,
  onPress,
  danger = false,
  last = false,
}: {
  icon:
    'bookmark' | 'fingerprint' | 'clock' | 'bell' | 'moon' | 'info' | 'logout'
  title: string
  onPress: () => void
  danger?: boolean
  last?: boolean
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className={`min-h-12 flex-row items-center gap-3 border-line ${last ? '' : 'border-b'}`}
    >
      <Icon name={icon} size={20} color={danger ? 'danger' : 'ink'} />
      <Text
        className={`flex-1 text-label ${danger ? 'text-danger' : 'text-ink'}`}
      >
        {title}
      </Text>
      {!danger ? <Icon name="chevronRight" size={19} color="inkMuted" /> : null}
    </Pressable>
  )
}

function ProfileStat({ value, label }: { value: string; label: string }) {
  return (
    <View className="min-h-[68px] flex-1 justify-center rounded-md border border-line bg-surface-raised px-3 py-2">
      <Text className="text-title text-ink">{value}</Text>
      <Text className="text-caption text-ink-muted">{label}</Text>
    </View>
  )
}

// A47: perfil da Marina com multa. A50: perfil do Lucas sem pendências.
export function StudentProfileScreen() {
  const params = useLocalSearchParams<{ state?: string }>()
  const router = useRouter()
  const logout = useLogout()
  const profile = params.state === 'marina' ? PROFILES.marina : PROFILES.lucas

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Perfil" large />
      <ScrollView contentContainerClassName="gap-4 px-4 pb-6 pt-3">
        <View className="flex-row items-center gap-3">
          <View className="size-16 items-center justify-center rounded-pill bg-brand-soft">
            <Text className="text-label text-brand">{profile.initials}</Text>
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-title text-ink">{profile.name}</Text>
            <Text className="text-caption text-ink-muted">
              Matrícula {profile.studentId} · ingresso em {profile.entryYear}
            </Text>
            <Text className="text-caption text-ink-muted">
              {profile.course}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <ProfileStat value={profile.loans} label="livros com você" />
          <ProfileStat value={profile.queues} label="filas ativas" />
          <ProfileStat value={profile.read} label="lidos em 2026" />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/fine?state=overdue')}
          className={`flex-row items-start gap-3 rounded-md p-4 ${profile.hasFine ? 'bg-warning-soft' : 'bg-success-soft'}`}
        >
          <Icon
            name={profile.hasFine ? 'coin' : 'check'}
            size={20}
            color={profile.hasFine ? 'warning' : 'success'}
          />
          <View className="flex-1 gap-1">
            <Text className="text-label text-ink">
              {profile.hasFine
                ? 'Multa em aberto: R$ 6,00'
                : 'Nenhuma pendência'}
            </Text>
            <Text className="text-body-sm text-ink">
              {profile.hasFine
                ? 'Pague no balcão da biblioteca. Você pode continuar pegando livros. Toque para ver.'
                : 'Você está em dia: pode pegar livros e entrar em filas.'}
            </Text>
          </View>
        </Pressable>

        <View className="rounded-lg border border-line bg-surface-raised px-4">
          <ProfileLink
            icon="bookmark"
            title="Salvos"
            onPress={() => router.push('/saved')}
          />
          <ProfileLink
            icon="fingerprint"
            title="Meus passkeys"
            onPress={() => router.push('/passkeys')}
          />
          <ProfileLink
            icon="clock"
            title="Histórico de empréstimos"
            onPress={() => router.push('/loans?state=history')}
          />
          <ProfileLink
            icon="bell"
            title="Avisos e lembretes"
            onPress={() => router.push('/notifications')}
          />
          <ProfileLink
            icon="moon"
            title="Aparência"
            onPress={() => router.push('/appearance')}
          />
          <ProfileLink
            icon="info"
            title="Regras da biblioteca"
            onPress={() => router.push('/library-rules')}
          />
          <ProfileLink
            icon="logout"
            title="Sair"
            danger
            last
            onPress={() => logout.mutate()}
          />
        </View>
      </ScrollView>
    </View>
  )
}
