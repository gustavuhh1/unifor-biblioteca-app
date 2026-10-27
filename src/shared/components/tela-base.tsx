import { useRouter } from 'expo-router'
import type { ReactNode } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/shared/theme/theme-provider'
import { Icon } from '@/shared/components/icon'

interface Props {
  titulo?: string
  children: ReactNode
  interna?: boolean
  rodape?: ReactNode
  onVoltar?: () => void
}

// Contêiner visual compartilhado pelas telas do aluno.
export default function TelaBase({
  titulo,
  children,
  interna = false,
  rodape,
  onVoltar,
}: Props) {
  const { colors } = useTheme()
  const safe = useSafeAreaInsets()
  const router = useRouter()
  return (
    <View
      style={{ flex: 1, backgroundColor: colors.surface, paddingTop: safe.top }}
    >
      {titulo ? (
        <View
          style={{
            minHeight: 56,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}
        >
          {interna ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              onPress={onVoltar ?? (() => router.back())}
              style={{
                minWidth: 44,
                minHeight: 44,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="arrowLeft" color="ink" />
            </Pressable>
          ) : null}
          <Text
            style={{
              color: colors.ink,
              fontSize: interna ? 19 : 24,
              fontFamily: 'Figtree_700Bold',
            }}
          >
            {titulo}
          </Text>
        </View>
      ) : null}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 28 }}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
      {rodape ? (
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: Math.max(safe.bottom, 16),
            backgroundColor: colors.surfaceRaised,
            borderTopColor: colors.line,
            borderTopWidth: 1,
          }}
        >
          {rodape}
        </View>
      ) : null}
    </View>
  )
}
