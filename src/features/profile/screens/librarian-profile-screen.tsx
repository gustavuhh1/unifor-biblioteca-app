import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import { useLogout } from '@/features/auth/hooks/use-logout'
import { AppBar, Icon } from '@/shared/components'

export function LibrarianProfileScreen() {
  const router = useRouter()
  const logout = useLogout()

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Perfil" back />
      <View className="flex-1 px-5 pt-6">
        <View className="items-center gap-2">
          <View className="size-20 items-center justify-center rounded-pill bg-brand-soft">
            <Text className="text-title-lg text-brand">AS</Text>
          </View>
          <Text className="text-title text-ink">Ana Souza</Text>
          <Text className="text-body-sm text-ink-muted">Bibliotecária</Text>
          <Text className="max-w-[240px] text-center text-caption text-ink-muted">
            Balcão · Biblioteca (Praça Central)
          </Text>
        </View>

        <View className="mt-6 rounded-lg border border-line bg-surface-raised px-4">
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/appearance')}
            className="min-h-[76px] flex-row items-center gap-3 border-b border-line"
          >
            <View className="size-9 items-center justify-center rounded-md bg-surface-sunken">
              <Icon name="moon" size={19} color="inkMuted" />
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-label text-ink">Aparência</Text>
              <Text className="text-caption text-ink-muted">
                Claro, escuro ou igual ao celular.
              </Text>
            </View>
            <Icon name="chevronRight" size={20} color="inkMuted" />
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => logout.mutate()}
            disabled={logout.isPending}
            className="min-h-[60px] flex-row items-center gap-3"
          >
            <View className="size-9 items-center justify-center rounded-md bg-danger-soft">
              <Icon name="logout" size={19} color="danger" />
            </View>
            <Text className="text-label text-danger">
              {logout.isPending ? 'Saindo…' : 'Sair'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}
