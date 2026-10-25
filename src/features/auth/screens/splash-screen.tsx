import React from 'react'
import { View, Text, Image } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function SplashScreen() {
  const insets = useSafeAreaInsets()

  return (
    <View className="flex-1 items-center justify-center bg-surface">
      <View className="items-center gap-3">
        <Image
          source={require('../../../assets/logo-unifor.png')}
          className="h-[112px] w-[104px]"
          resizeMode="contain"
        />

        <Text className="text-title-lg text-ink">Unifor Biblioteca</Text>
      </View>

      <View
        className="absolute bottom-0 items-center"
        style={{
          paddingBottom: Math.max(insets.bottom, 24),
        }}
      >
        <Text className="text-caption text-ink-muted">
          Universidade de Fortaleza
        </Text>
      </View>
    </View>
  )
}
