import '../global.css'

import { QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, StatusBar, Text, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { getAuthErrorMessage } from '@/features/auth/auth.errors'
import { resolveAccessGroup } from '@/features/auth/auth.session'
import { SessionProvider, useSession } from '@/features/auth/hooks/use-session'
import { queryClient } from '@/shared/api/query-client'
import { Button } from '@/shared/components'
import { ThemeProvider, useTheme } from '@/shared/theme/theme-provider'
import { fonts } from '@/shared/theme/fonts.generated'

SplashScreen.preventAutoHideAsync()

// Raiz do app: provedores (Query, tema, sessão) e a guarda de rota.
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <SessionProvider>
            <RootNavigator />
          </SessionProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}

// Guarda de rota: sem sessão vai para (auth); aluno para (student); bibliotecário
// para (librarian). As fontes e a sessão carregam antes de qualquer tela aparecer.
function RootNavigator() {
  const [fontsLoaded, fontsError] = useFonts(fonts)
  const { ready, scheme, colors } = useTheme()
  const session = useSession()
  const group = resolveAccessGroup(session.status, session.role)

  const resourcesReady = (fontsLoaded || fontsError !== null) && ready
  const settled = group !== null || session.status === 'error'

  useEffect(() => {
    if (resourcesReady && settled) SplashScreen.hideAsync()
  }, [resourcesReady, settled])

  if (!resourcesReady) return null

  return (
    <>
      <StatusBar
        barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      {session.status === 'error' ? (
        <View className="flex-1 items-center justify-center gap-4 bg-surface px-4">
          <Text className="text-center text-body text-ink">
            {getAuthErrorMessage(session.error)}
          </Text>
          <Button onPress={session.retry}>Tentar de novo</Button>
        </View>
      ) : group === null ? (
        <View className="flex-1 items-center justify-center bg-surface">
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={group === '(auth)'}>
            <Stack.Screen name="(auth)" />
          </Stack.Protected>
          <Stack.Protected guard={group === '(student)'}>
            <Stack.Screen name="(student)" />
          </Stack.Protected>
          <Stack.Protected guard={group === '(librarian)'}>
            <Stack.Screen name="(librarian)" />
          </Stack.Protected>
        </Stack>
      )}
    </>
  )
}
