import { AppBar, Icon } from '@/shared/components'
import { useTheme } from '@/shared/theme/theme-provider'
import type { ThemePreference } from '@/shared/theme/theme-preference'
import { Pressable, Text, View } from 'react-native'

const OPTIONS: {
  value: ThemePreference
  title: string
  description: string
  icon: 'info' | 'moon' | 'smartphone'
}[] = [
  {
    value: 'light',
    title: 'Claro',
    description: 'Fundo claro, ideal para ambientes iluminados.',
    icon: 'info',
  },
  {
    value: 'dark',
    title: 'Escuro',
    description: 'Fundo escuro, mais confortável à noite.',
    icon: 'moon',
  },
  {
    value: 'system',
    title: 'Igual ao celular',
    description: 'Muda sozinho com a configuração do aparelho.',
    icon: 'smartphone',
  },
]

export function AppearanceScreen() {
  const { preference, setPreference } = useTheme()
  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Aparência" back />
      <View className="gap-4 px-5 pt-3">
        <Text className="mb-1 text-body text-ink-muted">
          Escolha como o app aparece. O tema vale para aluno e bibliotecário.
        </Text>
        {OPTIONS.map((option) => {
          const selected = preference === option.value
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              onPress={() => setPreference(option.value)}
              className={`min-h-[92px] flex-row items-center gap-3 rounded-lg border-[1.5px] px-4 py-3 ${selected ? 'border-brand bg-brand-soft' : 'border-line bg-surface-raised'}`}
            >
              <View
                className={`size-11 items-center justify-center rounded-md ${selected ? 'bg-transparent' : 'bg-surface-sunken'}`}
              >
                <Icon
                  name={option.icon}
                  size={21}
                  color={selected ? 'brand' : 'inkMuted'}
                />
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-label text-ink">{option.title}</Text>
                <Text className="text-caption text-ink-muted">
                  {option.description}
                </Text>
              </View>
              <View
                className={`size-[22px] items-center justify-center rounded-pill border-2 ${selected ? 'border-brand bg-brand' : 'border-line-strong bg-transparent'}`}
              >
                {selected ? (
                  <View className="size-2 rounded-pill bg-white" />
                ) : null}
              </View>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
