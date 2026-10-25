import { useRouter } from 'expo-router'
import { useRef, useState, type ComponentRef } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AppBar, Button, Icon, TextField } from '@/shared/components'

type Stage = 'request' | 'token' | 'new-password' | 'success'

function TokenInput({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const ref = useRef<ComponentRef<typeof TextInput>>(null)
  const [focused, setFocused] = useState(false)
  const activeIndex = Math.min(value.length, 5)
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Digitar token de seis dígitos"
      onPress={() => ref.current?.focus()}
      className="relative flex-row gap-2"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <View
          key={index}
          className={`h-14 min-w-0 flex-1 items-center justify-center rounded-md border bg-surface-raised ${focused && index === activeIndex ? 'border-brand' : 'border-line-strong'}`}
        >
          <Text className="text-title text-ink">{value[index] ?? ''}</Text>
        </View>
      ))}
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(text) => onChange(text.replace(/\D/g, '').slice(0, 6))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        maxLength={6}
        accessibilityLabel="Token do e-mail"
        className="absolute inset-0 opacity-0"
      />
    </Pressable>
  )
}

function Success({
  onPasskey,
  onSkip,
}: {
  onPasskey: () => void
  onSkip: () => void
}) {
  const insets = useSafeAreaInsets()
  return (
    <View className="flex-1 bg-surface">
      <View className="flex-1 items-center justify-center px-10">
        <View className="mb-4 size-[100px] items-center justify-center rounded-lg bg-success-soft">
          <Icon name="check" size={44} color="success" />
        </View>
        <Text className="text-center text-hero text-ink">Senha redefinida</Text>
        <Text className="mt-3 text-center text-body text-ink-muted">
          Você já pode entrar com a nova senha. Quer criar um passkey neste
          celular para entrar só com a biometria?
        </Text>
      </View>
      <View
        className="gap-2 bg-surface-raised px-4 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button block icon="fingerprint" onPress={onPasskey}>
          Criar passkey
        </Button>
        <Button block variant="ghost" onPress={onSkip}>
          Agora não, entrar com a senha
        </Button>
      </View>
    </View>
  )
}

export function ForgotPasswordScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [stage, setStage] = useState<Stage>('request')
  const [matricula, setMatricula] = useState('2412858')
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('Biblioteca1')
  const [confirmPassword, setConfirmPassword] = useState('Biblioteca1')
  const [resent, setResent] = useState(false)

  if (stage === 'success') {
    return (
      <Success
        onPasskey={() => router.replace('/signup?state=passkey')}
        onSkip={() => router.replace('/')}
      />
    )
  }

  const isToken = stage === 'token'
  const isNewPassword = stage === 'new-password'
  const title = isNewPassword ? 'Nova senha' : 'Recuperar acesso'
  const canContinue = isToken
    ? token.length === 6
    : isNewPassword
      ? password.length > 0 && password === confirmPassword
      : /^\d{7}$/.test(matricula)

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title={title}
        back
        onBack={() => {
          if (stage === 'token') setStage('request')
          else if (stage === 'new-password') setStage('token')
          else router.back()
        }}
      />
      <ScrollView
        contentContainerClassName="gap-4 px-5 pb-6 pt-4"
        keyboardShouldPersistTaps="handled"
      >
        <View className="size-16 items-center justify-center rounded-lg bg-brand-soft">
          <Icon name={isToken ? 'mail' : 'lock'} size={28} color="brand" />
        </View>
        {stage === 'request' ? (
          <>
            <View className="gap-2">
              <Text className="text-title-lg text-ink">
                Esqueceu a senha ou trocou de celular?
              </Text>
              <Text className="text-body text-ink-muted">
                Informe sua matrícula. Enviamos um token de 6 dígitos para o
                e-mail do seu cadastro.
              </Text>
            </View>
            <TextField
              label="Matrícula"
              icon="user"
              inputMode="numeric"
              keyboardType="number-pad"
              maxLength={7}
              value={matricula}
              onChangeText={setMatricula}
              hint="7 dígitos."
            />
            <View className="flex-row items-start gap-3 rounded-md bg-brand-soft p-4">
              <Icon name="fingerprint" size={20} color="brandStrong" />
              <Text className="flex-1 text-body-sm text-ink">
                Depois de criar uma nova senha, você entra com ela. Se quiser,
                cria também um passkey neste celular.
              </Text>
            </View>
          </>
        ) : isToken ? (
          <>
            <View className="gap-2">
              <Text className="text-title-lg text-ink">Digite o token</Text>
              <Text className="text-body text-ink-muted">
                Enviamos para lu***@edu.unifor.br. Digite o código de 6 dígitos.
              </Text>
            </View>
            <View className="gap-2">
              <Text className="text-caption-strong text-ink">
                Token do e-mail
              </Text>
              <TokenInput value={token} onChange={setToken} />
              <Text className="text-caption text-ink-muted">
                Não chegou? Veja também a caixa de spam.
              </Text>
            </View>
            <View className="items-center">
              <Button
                variant="tonal"
                icon="refresh"
                disabled={!resent}
                onPress={() => setResent(true)}
              >
                Reenviar token (00:42)
              </Button>
            </View>
          </>
        ) : (
          <>
            <View className="gap-2">
              <Text className="text-title-lg text-ink">
                Crie uma nova senha
              </Text>
              <Text className="text-body text-ink-muted">
                Use uma senha que só você saiba. Ela substitui a anterior.
              </Text>
            </View>
            <TextField
              label="Nova senha"
              icon="lock"
              type="password"
              value={password}
              onChangeText={setPassword}
              hint="Você usa a senha para entrar no app."
            />
            <TextField
              label="Confirmar nova senha"
              icon="lock"
              type="password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              hint="Repita a senha."
              error={
                confirmPassword !== password
                  ? 'As senhas não são iguais.'
                  : undefined
              }
            />
          </>
        )}
      </ScrollView>
      <View
        className="bg-surface-raised px-4 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button
          block
          disabled={!canContinue}
          onPress={() => {
            if (stage === 'request') setStage('token')
            else if (stage === 'token') setStage('new-password')
            else setStage('success')
          }}
        >
          {stage === 'request'
            ? 'Enviar token'
            : isToken
              ? 'Continuar'
              : 'Redefinir senha'}
        </Button>
      </View>
    </View>
  )
}
