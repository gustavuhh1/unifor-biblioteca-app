import React from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Alert } from '@/shared/components/alert'
import { Button } from '@/shared/components/button'
import { Icon } from '@/shared/components/icon'

export interface PasswordResetScreenProps {
  creatingPasskey?: boolean
  signingIn?: boolean
  // Falha ao entrar com a nova senha.
  errorMessage?: string | null
  onCreatePasskey: () => void
  onSignInWithPassword: () => void
}

// Recuperar senha, passo Senha redefinida (RF-AUT-08 e RF-AUT-09; tela A68):
// entra com a nova senha e, se o aluno quiser, cria um passkey neste celular.
export function PasswordResetScreen({
  creatingPasskey = false,
  signingIn = false,
  errorMessage,
  onCreatePasskey,
  onSignInWithPassword,
}: PasswordResetScreenProps) {
  const insets = useSafeAreaInsets()

  return (
    <View
      className="flex-1 bg-surface"
      style={{
        paddingTop: insets.top,
      }}
    >
      {/* CONFIRMAÇÃO */}
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <View className="h-[96px] w-[112px] items-center justify-center rounded-sheet bg-success-soft">
          <Icon name="checkCircle" size={48} color="success" />
        </View>

        <Text className="text-center text-title-lg text-ink">
          Senha redefinida
        </Text>

        <Text className="text-center text-body text-ink-muted">
          Você já pode entrar com a nova senha. Quer criar um passkey neste
          celular para entrar só com a biometria?
        </Text>

        {errorMessage ? (
          <View className="w-full">
            <Alert tone="danger">{errorMessage}</Alert>
          </View>
        ) : null}
      </View>

      {/* BOTÕES */}
      <View
        className="gap-3 border-t border-line bg-surface-raised px-4 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <Button
          block
          variant="primary"
          icon="fingerprint"
          loading={creatingPasskey}
          disabled={signingIn}
          onPress={onCreatePasskey}
        >
          Criar passkey
        </Button>

        <Button
          block
          variant="ghost"
          loading={signingIn}
          disabled={creatingPasskey}
          onPress={onSignInWithPassword}
        >
          Agora não, entrar com a senha
        </Button>
      </View>
    </View>
  )
}
