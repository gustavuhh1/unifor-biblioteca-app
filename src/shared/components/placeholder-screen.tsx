import type { ReactNode } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { AppBar, type AppBarAction } from './app-bar'

export interface PlaceholderScreenProps {
  title: string
  // Código da tela no design (Figma e canvas), ex.: A07.
  code: string
  back?: boolean
  // Botão de ícone na barra do topo (ex.: o Perfil, no Painel).
  action?: AppBarAction
  children?: ReactNode
}

// Tela provisória: só o título e o código do design, até a tela de verdade entrar.
export function PlaceholderScreen({
  title,
  code,
  back,
  action,
  children,
}: PlaceholderScreenProps) {
  return (
    <View className="flex-1 bg-surface">
      <AppBar
        large
        title={title}
        back={back}
        actions={action ? [action] : undefined}
      />
      <ScrollView
        contentContainerClassName="gap-4 px-4 pb-6 pt-4"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-caption text-ink-muted">
          Tela provisória · {code}
        </Text>
        {children}
      </ScrollView>
    </View>
  )
}
