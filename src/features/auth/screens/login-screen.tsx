import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BottomSheet, Button, Icon, TextField } from '@/shared/components'
import { MATRICULA_HINT } from '../auth.constants'
import { isPasskeyCancelled } from '../auth.errors'
import { usePasskeyLogin } from '../hooks/use-passkey-login'
import { usePasswordLoginForm } from '../hooks/use-password-login-form'
import { useSession } from '../hooks/use-session'

export function LoginScreen() {
  const { notice, clearNotice } = useSession()
  const router = useRouter()
  const params = useLocalSearchParams<{ state?: string }>()
  const insets = useSafeAreaInsets()
  const { form, passwordLogin, errorMessage, submit } = usePasswordLoginForm()
  const passkeyLogin = usePasskeyLogin()
  const [otherWays, setOtherWays] = useState(false)
  const [passwordMode, setPasswordMode] = useState(
    params.state === 'session-expired' || Boolean(notice),
  )
  const sessionExpired = params.state === 'session-expired' || Boolean(notice)

  const busy = passwordLogin.isPending || passkeyLogin.isPending
  const failedPasskey = Boolean(
    passkeyLogin.error && !isPasskeyCancelled(passkeyLogin.error),
  )

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
      {/* Os botões ficam dentro da rolagem: com o teclado aberto, o rodapé não
          cobre o campo Senha e o aluno ainda alcança "Entrar". */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-grow px-6"
        contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }}
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
                hint={MATRICULA_HINT}
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
        <View className="mt-auto gap-2 pt-6">
          {!passwordMode ? (
            <Button
              block
              icon="fingerprint"
              loading={passkeyLogin.isPending}
              disabled={busy && !passkeyLogin.isPending}
              onPress={submitPasskey}
            >
              Entrar
            </Button>
          ) : (
            <Button
              block
              loading={passwordLogin.isPending}
              disabled={busy && !passwordLogin.isPending}
              onPress={() =>
                submit(() => {
                  clearNotice()
                  passkeyLogin.reset()
                })
              }
            >
              Entrar
            </Button>
          )}
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
        </View>
      </ScrollView>

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
