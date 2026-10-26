import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BottomSheet, Button, Icon, TextField } from '@/shared/components'
import { getAuthErrorMessage, isPasskeyCancelled } from '../auth.errors'
import { usePasskeyLogin } from '../hooks/use-passkey-login'
import { usePasswordLogin } from '../hooks/use-password-login'
import { useSession } from '../hooks/use-session'
import {
  passwordLoginSchema,
  type PasswordLoginForm,
} from '../schemas/login.schemas'

export function LoginScreen() {
  const { notice, clearNotice } = useSession()
  const router = useRouter()
  const params = useLocalSearchParams<{ state?: string }>()
  const insets = useSafeAreaInsets()
  const passwordLogin = usePasswordLogin()
  const passkeyLogin = usePasskeyLogin()
  const [otherWays, setOtherWays] = useState(false)
  const [passwordMode, setPasswordMode] = useState(
    params.state === 'session-expired' || Boolean(notice),
  )
  const sessionExpired = params.state === 'session-expired' || Boolean(notice)
  const form = useForm<PasswordLoginForm>({
    resolver: zodResolver(passwordLoginSchema),
    defaultValues: { matricula: '', password: '' },
  })

  const busy = passwordLogin.isPending || passkeyLogin.isPending
  const failedPasskey = Boolean(
    passkeyLogin.error && !isPasskeyCancelled(passkeyLogin.error),
  )
  const errorMessage = passwordLogin.error
    ? getAuthErrorMessage(passwordLogin.error)
    : null

  async function submitPasskey() {
    if (!(await form.trigger('matricula'))) return
    passwordLogin.reset()
    passkeyLogin.mutate({ matricula: form.getValues('matricula') })
  }

  function showPassword() {
    setOtherWays(false)
    passkeyLogin.reset()
    setPasswordMode(true)
  }

  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-grow px-6 pb-5"
      >
        <View className="items-center pt-3">
          <Image
            source={require('../../../../assets/unifor-biblioteca-mark.png')}
            className="h-[100px] w-[92px]"
            resizeMode="contain"
            accessibilityLabel="Símbolo Unifor Biblioteca"
          />
          <Text className="mt-3 text-center text-hero text-ink">
            Unifor Biblioteca
          </Text>
          <Text className="mt-3 px-2 text-center text-body text-ink-muted">
            {passwordMode
              ? 'Entre com a matrícula e a senha que você criou no cadastro.'
              : 'Digite sua matrícula e confirme com a digital, o rosto ou o PIN do celular.'}
          </Text>
        </View>
        <View className="mt-10 gap-3">
          {sessionExpired ? (
            <View className="flex-row items-start gap-3 rounded-md bg-warning-soft p-4">
              <Icon name="alert" size={20} color="warning" />
              <View className="flex-1 gap-1">
                <Text className="text-label text-ink">Sua sessão expirou</Text>
                <Text className="text-body-sm text-ink">
                  Por segurança, entre de novo para continuar de onde parou.
                </Text>
              </View>
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
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                hint="7 dígitos. Os dois primeiros são o ano de ingresso."
                error={fieldState.error?.message}
              />
            )}
          />
          {!passwordMode ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setOtherWays(true)}
              className="min-h-11 self-end justify-center px-1"
            >
              <Text className="text-label-sm text-brand">
                Outras formas de entrar
              </Text>
            </Pressable>
          ) : (
            <>
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
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/forgot-password')}
                className="min-h-9 self-end justify-center px-1"
              >
                <Text className="text-label-sm text-brand">
                  Esqueci minha senha
                </Text>
              </Pressable>
              {errorMessage ? (
                <Text className="text-body text-danger">{errorMessage}</Text>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>
      <View
        className="gap-2 bg-surface px-6 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 24) }}
      >
        {!passwordMode ? (
          <>
            <Button
              block
              icon="fingerprint"
              loading={passkeyLogin.isPending}
              disabled={busy && !passkeyLogin.isPending}
              onPress={submitPasskey}
            >
              Entrar
            </Button>
            <Button
              block
              variant="secondary"
              onPress={() => router.push('/signup')}
            >
              Criar conta
            </Button>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/librarian-login')}
              className="min-h-10 items-center justify-center"
            >
              <Text className="text-label-sm text-brand">
                Acessar como bibliotecário
              </Text>
            </Pressable>
          </>
        ) : (
          <>
            <Button
              block
              loading={passwordLogin.isPending}
              disabled={busy && !passwordLogin.isPending}
              onPress={() =>
                void form.handleSubmit((values) => {
                  clearNotice()
                  passkeyLogin.reset()
                  passwordLogin.mutate(values)
                })()
              }
            >
              Entrar
            </Button>
            <Button
              block
              variant="secondary"
              onPress={() => router.push('/signup')}
            >
              Criar conta
            </Button>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/librarian-login')}
              className="min-h-10 items-center justify-center"
            >
              <Text className="text-label-sm text-brand">
                Acessar como bibliotecário
              </Text>
            </Pressable>
          </>
        )}
      </View>

      <BottomSheet
        visible={otherWays}
        title="Outras formas de entrar"
        text="Se o passkey não funcionar neste celular, entre com a senha do seu cadastro. Se esqueceu a senha, enviamos um token para o seu e-mail."
        onClose={() => setOtherWays(false)}
      >
        <Button block variant="secondary" icon="lock" onPress={showPassword}>
          Entrar com matrícula e senha
        </Button>
        <Button
          block
          variant="secondary"
          icon="mail"
          onPress={() => {
            setOtherWays(false)
            router.push('/forgot-password')
          }}
        >
          Esqueci minha senha
        </Button>
        <Button block variant="ghost" onPress={() => setOtherWays(false)}>
          Fechar
        </Button>
      </BottomSheet>
      <BottomSheet
        visible={failedPasskey}
        title="Não foi possível entrar"
        text={`A biometria não foi reconhecida, ou este celular não tem um passkey para matrícula ${form.getValues('matricula')}. Você pode entrar com a senha.`}
        onClose={() => passkeyLogin.reset()}
      >
        <Button
          block
          icon="fingerprint"
          loading={passkeyLogin.isPending}
          onPress={() => {
            passkeyLogin.reset()
            void submitPasskey()
          }}
        >
          Tentar de novo
        </Button>
        <Button block variant="secondary" icon="lock" onPress={showPassword}>
          Entrar com matrícula e senha
        </Button>
        <Button
          block
          variant="ghost"
          icon="mail"
          onPress={() => {
            passkeyLogin.reset()
            router.push('/forgot-password')
          }}
        >
          Esqueci minha senha
        </Button>
      </BottomSheet>
    </View>
  )
}
