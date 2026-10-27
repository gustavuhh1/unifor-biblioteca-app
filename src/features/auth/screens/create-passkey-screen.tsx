import React from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Alert } from '@/shared/components/alert'
import { AppBar } from '@/shared/components/app-bar'
import { Button } from '@/shared/components/button'
import { Icon, type IconName } from '@/shared/components/icon'
import { formatDayMonth } from '@/shared/utils/dates'
import { SIGNUP_STEPS } from '../auth.constants'

export type CreatePasskeyStep = 'create' | 'done' | 'error'

export interface CreatePasskeyScreenProps {
  step: CreatePasskeyStep
  // Data em que a API registrou o passkey (passo "done").
  createdAt?: string
  creating?: boolean
  signingIn?: boolean
  // Falha ao entrar no app depois de criar o passkey.
  signInError?: string | null
  onBack: () => void
  onCreate: () => void
  onSkip: () => void
  onSignIn: () => void
  onRetry: () => void
}

type BeneficioProps = {
  icone: IconName
  titulo: string
  descricao: string
}

function Beneficio({ icone, titulo, descricao }: BeneficioProps) {
  return (
    <View className="flex-row items-start gap-3">
      <Icon name={icone} size={22} color="brand" />

      <View className="flex-1 gap-1">
        <Text className="text-label text-ink">{titulo}</Text>

        <Text className="text-body text-ink-muted">{descricao}</Text>
      </View>
    </View>
  )
}

// Cadastro, passo Passkey (RF-AUT-04; telas A59, A60 e A61): recomenda o
// passkey, mostra o passkey criado ou o erro ao criar.
export function CreatePasskeyScreen({
  step,
  createdAt,
  creating = false,
  signingIn = false,
  signInError,
  onBack,
  onCreate,
  onSkip,
  onSignIn,
  onRetry,
}: CreatePasskeyScreenProps) {
  const insets = useSafeAreaInsets()

  const concluido = step === 'done'
  const erro = step === 'error'

  return (
    <View className="flex-1 bg-surface">
      {!concluido && <AppBar title="Segurança da conta" back onBack={onBack} />}

      <ScrollView
        className="flex-1"
        contentContainerClassName={
          concluido ? 'flex-grow justify-center gap-6 px-4' : 'gap-6 px-4 pb-8'
        }
      >
        {/* A59 — CRIAR PASSKEY */}
        {step === 'create' && (
          <>
            {/* ETAPAS */}
            <View className="flex-row gap-2">
              {SIGNUP_STEPS.map((nome) => (
                <View key={nome} className="flex-1 gap-2">
                  <Text className="text-caption-strong text-brand">{nome}</Text>
                  <View className="h-1.5 rounded-pill bg-brand" />
                </View>
              ))}
            </View>

            <View className="items-center gap-3 py-5">
              <View className="h-[96px] w-[96px] items-center justify-center rounded-pill bg-brand-soft">
                <Icon name="fingerprint" size={48} color="brand" />
              </View>

              <Text className="text-center text-title text-ink">
                Entre com sua digital
              </Text>

              <Text className="text-center text-body text-ink-muted">
                Crie um passkey e, nas próximas vezes, entre com a digital, o
                rosto ou o PIN do celular.
              </Text>
            </View>

            <View className="gap-5">
              <Beneficio
                icone="checkCircle"
                titulo="Entrar em um toque"
                descricao="Sem digitar matrícula e senha toda vez."
              />

              <Beneficio
                icone="shield"
                titulo="Mais seguro que senha"
                descricao="A chave fica só no seu celular: não vaza e não funciona em site falso."
              />

              <Beneficio
                icone="lock"
                titulo="Sua biometria é só sua"
                descricao="A digital e o rosto nunca saem do celular. Nem a biblioteca nem o app têm acesso."
              />
            </View>

            <Text className="text-center text-caption text-ink-muted">
              Se trocar de celular, você entra com a senha e cria outro.
            </Text>

            {signInError ? <Alert tone="danger">{signInError}</Alert> : null}
          </>
        )}

        {/* A60 — PASSKEY CRIADO */}
        {concluido && (
          <>
            <View className="items-center gap-4">
              <View className="h-[96px] w-[96px] items-center justify-center rounded-sheet bg-success-soft">
                <Icon name="checkCircle" color="success" size={48} />
              </View>

              <Text className="text-center text-title-lg text-ink">
                Passkey criado
              </Text>

              <Text className="text-center text-body text-ink-muted">
                Pronto. A partir de agora você entra no app com a biometria
                deste celular.
              </Text>
            </View>

            <View className="flex-row items-center gap-3 rounded-md border border-line bg-surface-raised p-4">
              <Icon name="smartphone" color="brand" size={24} />

              <View className="flex-1 gap-1">
                <Text className="text-label text-ink">Este aparelho</Text>

                {createdAt ? (
                  <Text className="text-caption text-ink-muted">
                    Passkey criado hoje, {formatDayMonth(createdAt)}
                  </Text>
                ) : null}
              </View>
            </View>

            <Text className="text-center text-caption text-ink-muted">
              Em Perfil › Meus passkeys você vê, cria e remove seus passkeys.
            </Text>

            {signInError ? <Alert tone="danger">{signInError}</Alert> : null}
          </>
        )}

        {/* A61 — ERRO AO CRIAR PASSKEY */}
        {erro && (
          <>
            <View className="flex-row items-start gap-3 rounded-md border border-danger bg-danger-soft p-4">
              <Icon name="alert" size={22} color="danger" />

              <View className="flex-1 gap-3">
                <Text className="text-label text-danger">
                  Não foi possível criar o passkey
                </Text>

                <Text className="text-body text-ink">
                  • Você cancelou a biometria.
                </Text>

                <Text className="text-body text-ink">
                  • O celular não tem bloqueio de tela ou biometria.
                </Text>

                <Text className="text-body text-ink">
                  • Sem conexão com a internet.
                </Text>
              </View>
            </View>

            <View className="gap-2 rounded-md border border-line bg-surface-raised p-4">
              <Text className="text-label text-ink">Precisa de ajuda?</Text>

              <Text className="text-body text-ink-muted">
                Sem passkey você ainda entra com matrícula e senha. Se o
                problema continuar, chame o BiblioZap: (85) 3477-3257.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* BOTÕES */}
      <View
        className="gap-3 border-t border-line bg-surface-raised px-4 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        {step === 'create' && (
          <>
            <Button
              block
              variant="primary"
              loading={creating}
              onPress={onCreate}
            >
              Criar passkey
            </Button>

            <Button
              block
              variant="ghost"
              loading={signingIn}
              disabled={creating}
              onPress={onSkip}
            >
              Agora não
            </Button>
          </>
        )}

        {concluido && (
          <Button
            block
            variant="primary"
            loading={signingIn}
            onPress={onSignIn}
          >
            Entrar no app
          </Button>
        )}

        {erro && (
          <>
            <Button
              block
              variant="primary"
              loading={creating}
              onPress={onRetry}
            >
              Tentar de novo
            </Button>

            <Button block variant="ghost" onPress={onBack}>
              Voltar
            </Button>
          </>
        )}
      </View>
    </View>
  )
}
