import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon, type IconName } from './icon'

export interface AppBarAction {
  icon: IconName
  // Nome acessível do botão (ícone sem texto).
  label: string
  // Contador no canto do ícone (ex.: avisos não lidos).
  badge?: number
  onPress?: () => void
}

export interface AppBarProps {
  title: string
  subtitle?: string
  // Mostra a seta de voltar (telas internas).
  back?: boolean
  // Por padrão volta uma tela no roteador.
  onBack?: () => void
  // Título grande das telas raiz das abas.
  large?: boolean
  actions?: AppBarAction[]
}

// Barra do topo da tela, já com a margem da barra de status (components.d.ts, AppBar).
export function AppBar({
  title,
  subtitle,
  back = false,
  onBack,
  large = false,
  actions = [],
}: AppBarProps) {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  return (
    <View
      className={`min-h-14 flex-row items-center gap-2 bg-surface py-2 pr-2 ${
        back ? 'pl-1' : 'pl-4'
      } ${large ? 'pt-4' : ''}`}
      style={{ marginTop: insets.top }}
    >
      {back ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          className="size-[44px] items-center justify-center rounded-pill"
          onPress={onBack ?? (() => router.back())}
        >
          <Icon name="arrowLeft" size={22} />
        </Pressable>
      ) : null}
      <View className="min-w-0 flex-1">
        <Text
          accessibilityRole="header"
          className={
            large ? 'text-title-lg text-ink' : 'text-label-lg text-ink'
          }
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-caption text-ink-muted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {actions.map((action) => (
        <Pressable
          key={action.label}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          className="size-[44px] items-center justify-center rounded-pill"
          onPress={action.onPress}
        >
          <Icon name={action.icon} size={22} />
          {action.badge ? (
            <View className="absolute right-1.5 top-1.5 h-[18px] min-w-[18px] items-center justify-center rounded-pill border-2 border-surface bg-danger px-1">
              <Text className="text-micro-strong text-on-danger">
                {action.badge}
              </Text>
            </View>
          ) : null}
        </Pressable>
      ))}
    </View>
  )
}
