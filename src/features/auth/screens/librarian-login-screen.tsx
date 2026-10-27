import { useRouter } from 'expo-router'
import { Controller } from 'react-hook-form'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button } from '@/shared/components/button'
import { TextField } from '@/shared/components/text-field'
import { usePasswordLoginForm } from '../hooks/use-password-login-form'

// Login do bibliotecário (B19, RF-AUT-07): matrícula e senha pelo Firebase, sem
// passkey e sem cadastro. O app abre o Painel pelo perfil que vem de GET /me.
export function LibrarianLoginScreen() {
  const router = useRouter()
  const safe = useSafeAreaInsets()
  const { form, passwordLogin, errorMessage, submit } = usePasswordLoginForm()

  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 20,
          paddingTop: safe.top + 20,
          paddingBottom: safe.bottom + 24,
          gap: 16,
        }}
      >
        <View className="items-center gap-2 pb-6">
          <Image
            source={require('../../../../assets/logo-unifor.png')}
            style={{ width: 73, height: 78 }}
            resizeMode="contain"
          />
          <Text className="text-title-lg text-ink">Unifor Biblioteca</Text>
          <Text className="text-body text-ink-muted">
            Acesso do bibliotecário
          </Text>
        </View>
        {errorMessage ? (
          <View className="rounded-md border border-danger bg-danger-soft p-3">
            <Text className="text-label text-danger">{errorMessage}</Text>
          </View>
        ) : null}
        <Controller
          control={form.control}
          name="matricula"
          render={({ field, fieldState }) => (
            <TextField
              label="Matrícula"
              icon="user"
              inputMode="numeric"
              keyboardType="number-pad"
              maxLength={7}
              autoCapitalize="none"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <TextField
              label="Senha"
              icon="lock"
              type="password"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />
        <Button
          block
          variant="ghost"
          onPress={() => router.push('/forgot-password')}
        >
          Esqueci minha senha
        </Button>
        <Button
          block
          loading={passwordLogin.isPending}
          onPress={() => submit()}
        >
          Entrar
        </Button>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          className="min-h-[44px] items-center justify-center"
        >
          <Text className="text-label text-brand">Acessar como aluno</Text>
        </Pressable>
      </ScrollView>
    </View>
  )
}
