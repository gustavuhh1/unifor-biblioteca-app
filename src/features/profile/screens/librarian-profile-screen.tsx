import { Pressable, ScrollView, Text, View } from 'react-native'
import { AppBar, Icon } from '@/shared/components'
export interface PerfilBibliotecarioProps {
  onVoltar?: () => void
  onSair?: () => void
  onPainel?: () => void
  onAparencia?: () => void
}
export function LibrarianProfileScreen({
  onVoltar,
  onSair,
  onAparencia,
}: PerfilBibliotecarioProps) {
  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Perfil" back onBack={onVoltar} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 24 }}>
        <View className="items-center gap-2 py-4">
          <View className="mb-3 h-[80px] w-[80px] items-center justify-center rounded-pill bg-brand-soft">
            <Text className="text-stat text-brand">AS</Text>
          </View>
          <Text className="text-title-lg text-ink">Ana Souza</Text>
          <Text className="text-body text-ink-muted">Bibliotecária</Text>
          <Text className="text-center text-body text-ink-muted">
            Balcão · Biblioteca (Praça Central)
          </Text>
        </View>
        <View className="overflow-hidden rounded-lg border border-line bg-surface-raised">
          <Pressable
            accessibilityRole="button"
            onPress={onAparencia}
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
            onPress={onSair}
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
