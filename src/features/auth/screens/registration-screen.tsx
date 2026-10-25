import { useRef, useState, type ComponentRef } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { AppBar, Button, Icon, TextField } from '@/shared/components'

type Stage = 'data' | 'email' | 'passkey' | 'passkey-error' | 'success'
interface RegistrationData {
  email: string
  matricula: string
  password: string
  confirmPassword: string
}
type RegistrationErrors = Partial<Record<keyof RegistrationData, string>>

const INITIAL_DATA: RegistrationData = {
  email: 'lucas.almeida@edu.unifor.br',
  matricula: '2412858',
  password: 'Biblioteca1',
  confirmPassword: 'Biblioteca1',
}

function validate(data: RegistrationData): RegistrationErrors {
  const errors: RegistrationErrors = {}
  if (!/^[^\s@]+@edu\.unifor\.br$/i.test(data.email)) {
    errors.email = 'Use o e-mail institucional, terminado em @edu.unifor.br.'
  }
  if (!/^\d{7}$/.test(data.matricula)) {
    errors.matricula = 'A matrícula tem 7 dígitos.'
  }
  if (!data.password) errors.password = 'Informe uma senha.'
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'As senhas não são iguais.'
  }
  return errors
}

function Stepper({ current }: { current: 0 | 1 | 2 }) {
  const steps = ['Dados', 'E-mail', 'Passkey']
  return (
    <View className="flex-row gap-2">
      {steps.map((step, index) => (
        <View key={step} className="flex-1 gap-1.5">
          <View
            className={`h-1 rounded-pill ${index <= current ? 'bg-brand' : 'bg-line-strong'}`}
          />
          <Text
            className={`text-caption-sm ${index <= current ? 'text-ink' : 'text-ink-muted'}`}
          >
            {step}
          </Text>
        </View>
      ))}
    </View>
  )
}

function DataStage({
  data,
  errors,
  onChange,
}: {
  data: RegistrationData
  errors: RegistrationErrors
  onChange: (key: keyof RegistrationData, value: string) => void
}) {
  return (
    <View className="gap-4">
      <TextField
        label="E-mail institucional"
        icon="mail"
        value={data.email}
        onChangeText={(value) => onChange('email', value)}
        autoCapitalize="none"
        keyboardType="email-address"
        hint="Terminado em @edu.unifor.br."
        error={errors.email}
      />
      <TextField
        label="Matrícula"
        icon="user"
        value={data.matricula}
        onChangeText={(value) => onChange('matricula', value)}
        inputMode="numeric"
        keyboardType="number-pad"
        maxLength={7}
        hint="7 dígitos. Os dois primeiros são o ano de ingresso."
        error={errors.matricula}
      />
      <TextField
        label="Senha"
        icon="lock"
        type="password"
        value={data.password}
        onChangeText={(value) => onChange('password', value)}
        hint="Você usa a senha para entrar no app."
        error={errors.password}
      />
      <TextField
        label="Confirmar senha"
        icon="lock"
        type="password"
        value={data.confirmPassword}
        onChangeText={(value) => onChange('confirmPassword', value)}
        hint="Repita a senha."
        error={errors.confirmPassword}
      />
    </View>
  )
}

function TokenBoxes({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const input = useRef<ComponentRef<typeof TextInput>>(null)
  const [focused, setFocused] = useState(false)
  const activeIndex = Math.min(value.length, 5)

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Digitar token de seis dígitos"
      onPress={() => input.current?.focus()}
      className="relative flex-row gap-2"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <View
          key={index}
          className={`h-14 min-w-0 flex-1 items-center justify-center rounded-md border bg-surface-raised ${
            focused && index === activeIndex
              ? 'border-brand'
              : 'border-line-strong'
          }`}
        >
          <Text className="text-title text-ink">{value[index] ?? ''}</Text>
        </View>
      ))}
      <TextInput
        ref={input}
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

function EmailStage({
  email,
  token,
  setToken,
  onCorrectEmail,
  tokenExpired,
  onResend,
}: {
  email: string
  token: string
  setToken: (value: string) => void
  onCorrectEmail: () => void
  tokenExpired: boolean
  onResend: () => void
}) {
  return (
    <View className="gap-5">
      <View className="size-16 items-center justify-center rounded-lg bg-brand-soft">
        <Icon name="mail" size={28} color="brand" />
      </View>
      <View className="gap-2">
        <Text className="text-title-lg text-ink">Digite o token</Text>
        <Text className="text-body text-ink-muted">
          Enviamos um token de 6 dígitos para {email}.
        </Text>
      </View>
      {tokenExpired ? (
        <View className="flex-row items-start gap-3 rounded-md bg-danger-soft p-4">
          <Icon name="alert" size={20} color="danger" />
          <View className="flex-1 gap-1">
            <Text className="text-label text-ink">
              Token expirado ou já usado
            </Text>
            <Text className="text-body-sm text-ink">
              Cada token vale 20 minutos e só pode ser usado uma vez. Toque em
              Reenviar token para receber outro.
            </Text>
          </View>
        </View>
      ) : null}
      <View className="gap-2">
        <Text className="text-caption-strong text-ink">Token do e-mail</Text>
        <TokenBoxes value={token} onChange={setToken} />
        <Text className="text-caption text-ink-muted">
          Não chegou? Veja também a caixa de spam.
        </Text>
      </View>
      <View className="flex-row items-center justify-between gap-3">
        <Pressable
          accessibilityRole="button"
          onPress={onResend}
          className="min-h-11 justify-center px-1"
        >
          <Text
            className={`text-label-sm ${tokenExpired ? 'text-brand' : 'text-ink-muted'}`}
          >
            {tokenExpired ? 'Reenviar token' : 'Reenviar em 00:42'}
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={onCorrectEmail}
          className="min-h-11 flex-row items-center gap-2 px-2"
        >
          <Icon name="pencil" size={18} color="brand" />
          <Text className="text-label-sm text-brand">Corrigir e-mail</Text>
        </Pressable>
      </View>
    </View>
  )
}

function PasskeyIllustration() {
  return (
    <View className="size-[120px] items-center justify-center rounded-pill bg-brand-soft">
      <View className="h-[104px] w-[62px] items-center rounded-md border-2 border-brand bg-surface-raised pt-1.5">
        <View className="h-0.5 w-4 rounded-pill bg-line-strong" />
        <Icon name="fingerprint" size={46} color="brand" />
      </View>
      <View className="absolute bottom-1 right-0 size-10 items-center justify-center rounded-pill bg-success">
        <Icon name="shield" size={24} color="onBrand" />
        <View className="absolute">
          <Icon name="check" size={13} color="onBrand" />
        </View>
      </View>
    </View>
  )
}

function PasskeyStage() {
  const benefits = [
    {
      icon: 'fingerprint' as const,
      title: 'Entrar em um toque',
      text: 'Sem digitar matrícula e senha toda vez.',
    },
    {
      icon: 'shield' as const,
      title: 'Mais seguro que senha',
      text: 'A chave fica só no seu celular: não vaza e não funciona em site falso.',
    },
    {
      icon: 'smartphone' as const,
      title: 'Sua biometria é só sua',
      text: 'A digital e o rosto nunca saem do celular. Nem a biblioteca nem o app têm acesso.',
    },
  ]
  return (
    <View className="items-center gap-4">
      <PasskeyIllustration />
      <View className="items-center gap-2">
        <Text className="text-center text-title-lg text-ink">
          Entre com sua digital
        </Text>
        <Text className="text-center text-body text-ink-muted">
          Crie um passkey e, nas próximas vezes, entre com a digital, o rosto ou
          o PIN do celular.
        </Text>
      </View>
      <View className="w-full gap-3 rounded-lg border border-line bg-surface-raised p-4">
        {benefits.map((benefit) => (
          <View key={benefit.title} className="flex-row items-start gap-3">
            <View className="size-9 items-center justify-center rounded-sm bg-brand-soft">
              <Icon name={benefit.icon} size={20} color="brandStrong" />
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-label text-ink">{benefit.title}</Text>
              <Text className="text-body-sm text-ink-muted">
                {benefit.text}
              </Text>
            </View>
          </View>
        ))}
      </View>
      <Text className="px-2 text-center text-caption text-ink-muted">
        Se trocar de celular, você entra com a senha e cria outro.
      </Text>
    </View>
  )
}

function PasskeyErrorStage() {
  return (
    <View className="gap-4">
      <View className="flex-row items-start gap-3 rounded-md bg-danger-soft p-4">
        <Icon name="alert" size={22} color="danger" />
        <View className="flex-1 gap-1">
          <Text className="text-label text-ink">
            Não foi possível criar o passkey
          </Text>
          <Text className="text-body-sm text-ink">
            • Você cancelou a biometria.{'\n'}• O celular não tem bloqueio de
            tela ou biometria.{'\n'}• Sem conexão com a internet.
          </Text>
        </View>
      </View>
      <View className="flex-row items-start gap-3 rounded-md bg-brand-soft p-4">
        <Icon name="info" size={20} color="brandStrong" />
        <View className="flex-1 gap-1">
          <Text className="text-label text-ink">Precisa de ajuda?</Text>
          <Text className="text-body-sm text-ink">
            Sem passkey você ainda entra com matrícula e senha. Se o problema
            continuar, chame o BiblioZap: (85) 3477-3257.
          </Text>
        </View>
      </View>
    </View>
  )
}

function SuccessStage() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  return (
    <View className="flex-1 bg-surface">
      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-4 size-[100px] items-center justify-center rounded-lg bg-success-soft">
          <Icon name="check" size={44} color="success" />
        </View>
        <Text className="text-center text-hero text-ink">Passkey criado</Text>
        <Text className="mt-3 text-center text-body text-ink-muted">
          Pronto, Lucas. A partir de agora você entra no app com a biometria
          deste celular.
        </Text>
        <View className="mt-5 w-full flex-row items-center gap-3 rounded-lg border border-line bg-surface-raised p-4">
          <View className="size-9 items-center justify-center rounded-md bg-success-soft">
            <Icon name="smartphone" size={20} color="success" />
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-label text-ink">Este aparelho</Text>
            <Text className="text-caption text-ink-muted">
              Passkey criado hoje, 15/10
            </Text>
          </View>
        </View>
      </View>
      <View
        className="gap-2 bg-surface-raised px-4 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button block onPress={() => router.replace('/')}>
          Entrar no app
        </Button>
        <Text className="px-3 text-center text-caption text-ink-muted">
          Em Perfil › Meus passkeys você vê, cria e remove seus passkeys.
        </Text>
      </View>
    </View>
  )
}

// Fluxo visual das telas A56–A60. Cadastro, token e passkey serão conectados à API/Firebase.
export function RegistrationScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const params = useLocalSearchParams<{ state?: string }>()
  const [stage, setStage] = useState<Stage>(
    params.state === 'token-expired'
      ? 'email'
      : params.state === 'passkey-error'
        ? 'passkey-error'
        : params.state === 'passkey'
          ? 'passkey'
          : 'data',
  )
  const [data, setData] = useState(INITIAL_DATA)
  const [duplicate, setDuplicate] = useState(params.state === 'duplicate')
  const [hasEdited, setHasEdited] = useState(params.state === 'duplicate')
  const [token, setToken] = useState('482')
  const [tokenExpired, setTokenExpired] = useState(
    params.state === 'token-expired',
  )
  const errors: RegistrationErrors = {
    ...(hasEdited ? validate(data) : {}),
    ...(duplicate
      ? {
          email: 'Este e-mail já tem conta. Entre ou recupere a senha.',
          matricula: 'Esta matrícula já tem conta.',
        }
      : {}),
  }

  function updateField(key: keyof RegistrationData, value: string) {
    setHasEdited(true)
    setDuplicate(false)
    setData((current) => ({ ...current, [key]: value }))
  }

  function continueFromData() {
    setHasEdited(true)
    if (!duplicate && Object.keys(validate(data)).length === 0)
      setStage('email')
  }

  if (stage === 'success') return <SuccessStage />

  const stepIndex = stage === 'data' ? 0 : stage === 'email' ? 1 : 2
  const headerTitle =
    stage === 'email'
      ? 'Confirmar e-mail'
      : stage === 'passkey'
        ? 'Segurança da conta'
        : stage === 'passkey-error'
          ? 'Criar passkey'
          : 'Criar conta'

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title={headerTitle}
        back
        onBack={() => {
          if (stage === 'email') setStage('data')
          else if (stage === 'data') router.back()
          else if (stage === 'passkey-error') setStage('passkey')
          else setStage('email')
        }}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-5 px-4 pb-6 pt-3"
      >
        <Stepper current={stepIndex as 0 | 1 | 2} />
        {stage === 'data' ? (
          <DataStage data={data} errors={errors} onChange={updateField} />
        ) : stage === 'email' ? (
          <EmailStage
            email={data.email}
            token={token}
            setToken={setToken}
            onCorrectEmail={() => setStage('data')}
            tokenExpired={tokenExpired}
            onResend={() => setTokenExpired(false)}
          />
        ) : stage === 'passkey-error' ? (
          <PasskeyErrorStage />
        ) : (
          <PasskeyStage />
        )}
      </ScrollView>

      <View
        className="gap-2 bg-surface-raised px-4 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        {stage === 'data' ? (
          <>
            <Button block onPress={continueFromData}>
              Continuar
            </Button>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace('/')}
              className="min-h-8 flex-row items-center justify-center gap-1"
            >
              <Text className="text-caption text-ink-muted">Já tem conta?</Text>
              <Text className="text-label-sm text-brand">Entrar</Text>
            </Pressable>
          </>
        ) : stage === 'email' ? (
          <Button
            block
            disabled={token.length !== 6}
            onPress={() => setStage('passkey')}
          >
            Confirmar e-mail
          </Button>
        ) : stage === 'passkey-error' ? (
          <>
            <Button
              block
              icon="fingerprint"
              onPress={() => setStage('passkey')}
            >
              Tentar de novo
            </Button>
            <Pressable
              accessibilityRole="button"
              onPress={() => setStage('passkey')}
              className="min-h-10 items-center justify-center"
            >
              <Text className="text-label text-brand">Voltar</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Button
              block
              icon="fingerprint"
              onPress={() => setStage('success')}
            >
              Criar passkey
            </Button>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace('/')}
              className="min-h-10 items-center justify-center"
            >
              <Text className="text-label text-brand">Agora não</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  )
}
