import { useRouter } from 'expo-router'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { useSession } from '@/features/auth/hooks/use-session'
import { AppBar, Icon } from '@/shared/components'
import { displayNameOf, initialsOfMe } from '../profile.format'

// Perfil do bibliotecário (B25, RF-BAL-10): dados de GET /me, tema e Sair
// (POST /auth/logout e depois o Firebase, RF-AUT-11).
export function LibrarianProfileScreen() {
  const router = useRouter()
  const { user } = useSession()
  const logout = useLogout()
  if (!user) return null

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Perfil" back />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
        <View className="items-center gap-2 py-4">
          <View className="mb-3 h-[80px] w-[80px] items-center justify-center rounded-pill bg-brand-soft">
            <Text className="text-stat text-brand">{initialsOfMe(user)}</Text>
          </View>
          <Text className="text-title-lg text-ink">{displayNameOf(user)}</Text>
          <Text className="text-body text-ink-muted">Bibliotecário(a)</Text>
          {user.deskLabel ? (
            <Text className="text-center text-body text-ink-muted">
              {user.deskLabel}
            </Text>
          ) : null}
        </View>
        <View className="overflow-hidden rounded-lg border border-line bg-surface-raised">
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/appearance')}
            className="min-h-18 flex-row items-center gap-3 border-b border-line p-4"
          >
            <Icon name="moon" color="inkMuted" />
            <View className="flex-1">
              <Text className="text-label text-ink">Aparência</Text>
              <Text className="text-caption text-ink-muted">
                Claro, escuro ou igual ao celular.
              </Text>
            </View>
            <Icon name="chevronRight" color="inkMuted" />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ busy: logout.isPending }}
            disabled={logout.isPending}
            onPress={() => logout.mutate()}
            className="min-h-12 flex-row items-center gap-3 p-4"
          >
            <Icon name="logout" color="danger" />
            <Text className="text-label text-danger">Sair</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}
