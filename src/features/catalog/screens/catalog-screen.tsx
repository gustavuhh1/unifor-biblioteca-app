import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { AppBar, Button, Icon } from '@/shared/components'
import { useTheme } from '@/shared/theme/theme-provider'

export type CatalogMode = 'loading' | 'offline'

function SearchBarVisual() {
  const { colors } = useTheme()
  return (
    <View className="h-12 flex-row items-center gap-2 rounded-pill border border-line bg-surface-raised px-4">
      <Icon name="search" size={20} color="inkMuted" />
      <TextInput
        accessibilityLabel="Buscar no acervo"
        className="flex-1 p-0 text-body text-ink"
        placeholder="Buscar título, autor ou assunto"
        placeholderTextColor={colors.inkFaint}
        defaultValue="código"
        editable={false}
      />
    </View>
  )
}

function SkeletonLine({ className }: { className: string }) {
  return <View className={`h-3 rounded-pill bg-surface-sunken ${className}`} />
}

function BookSkeleton() {
  return (
    <View className="min-h-[108px] flex-row items-center gap-3 rounded-lg border border-line bg-surface-raised p-4">
      <View className="h-[76px] w-[54px] rounded-sm bg-surface-sunken" />
      <View className="flex-1 gap-2">
        <SkeletonLine className="w-4/5" />
        <SkeletonLine className="w-1/2" />
        <SkeletonLine className="h-[22px] w-1/3" />
      </View>
    </View>
  )
}

function CatalogLoading() {
  return (
    <View className="gap-3">
      <SearchBarVisual />
      <SkeletonLine className="h-3 w-1/2" />
      <BookSkeleton />
      <BookSkeleton />
      <BookSkeleton />
    </View>
  )
}

function CatalogOffline({
  onRetry,
  onShowQr,
}: {
  onRetry?: () => void
  onShowQr?: () => void
}) {
  return (
    <View className="flex-1 items-center px-4 pt-12">
      <View className="mb-3 size-[72px] items-center justify-center rounded-lg bg-brand-soft">
        <Icon name="wifiOff" size={32} color="brandStrong" />
      </View>
      <Text className="text-center text-title text-ink">
        Você está sem internet
      </Text>
      <Text className="mt-2 max-w-[320px] text-center text-body text-ink-muted">
        Confira o Wi-Fi ou os dados móveis. O QR de retirada continua
        funcionando sem conexão.
      </Text>
      <View className="mt-2">
        <Button icon="refresh" onPress={onRetry}>
          Tentar de novo
        </Button>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onShowQr}
        className="mt-8 min-h-11 flex-row items-center gap-2 px-3"
      >
        <Icon name="qr" size={20} color="brand" />
        <Text className="text-label text-brand">Ver QR de retirada</Text>
      </Pressable>
    </View>
  )
}

// Tela A09. O modo offline fica como estado visual separado para a integração de conectividade.
export function CatalogScreen({
  mode,
  onRetry,
}: {
  mode?: CatalogMode
  onRetry?: () => void
}) {
  const params = useLocalSearchParams<{ mode?: string }>()
  const router = useRouter()
  const currentMode: CatalogMode =
    mode ?? (params.mode === 'offline' ? 'offline' : 'loading')

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Acervo" large />
      {currentMode === 'offline' ? (
        <CatalogOffline
          onRetry={onRetry ?? (() => router.setParams({ mode: 'loading' }))}
          onShowQr={() => router.push('/withdrawal')}
        />
      ) : (
        <ScrollView contentContainerClassName="gap-3 px-4 pb-6 pt-3">
          <CatalogLoading />
        </ScrollView>
      )}
    </View>
  )
}
