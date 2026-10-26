import { zodResolver } from '@hookform/resolvers/zod'
import React, { type ComponentRef, useRef, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { z } from 'zod'

import { AppBar } from '@/shared/components/app-bar'
import { Button } from '@/shared/components/button'
import { Icon } from '@/shared/components/icon'
import { useResendCooldown } from '@/shared/utils/use-resend-cooldown'
import { EMAIL_TOKEN_LENGTH } from '../auth.constants'
import { getAuthErrorMessage } from '../auth.errors'
import { emailTokenSchema } from '../schemas/registration.schemas'

const tokenFormSchema = z.object({ token: emailTokenSchema })
type TokenForm = z.infer<typeof tokenFormSchema>

export interface RecoveryTokenScreenProps {
  // Mensagem da API sobre o envio do token (igual exista a conta ou não).
  message: string
  // Espera, em segundos, antes de poder pedir outro token.
  resendWaitSeconds: number
  // Erro do token devolvido pelo passo da nova senha (errado, vencido...).
  tokenError?: string | null
  onContinue: (token: string) => void
  // Pede outro token e devolve a nova espera, em segundos.
  onResend: () => Promise<number>
  onBack: () => void
}

// Recuperar senha, passo Token (RF-AUT-08; tela A66). A API não confere o token
// sozinho: ele segue com a nova senha no passo seguinte.
export function RecoveryTokenScreen({
  message,
  resendWaitSeconds,
  tokenError,
  onContinue,
  onResend,
  onBack,
}: RecoveryTokenScreenProps) {
  const insets = useSafeAreaInsets()
  const cooldown = useResendCooldown(resendWaitSeconds)
  const form = useForm<TokenForm>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: { token: '' },
  })
  const token = useWatch({ control: form.control, name: 'token' })
  // O erro que voltou do passo da nova senha some quando chega outro token.
  const [erroAnterior, setErroAnterior] = useState(tokenError ?? null)
  const erroToken = form.formState.errors.token?.message ?? erroAnterior
  const [reenviando, setReenviando] = useState(false)
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null)

  const confirmarToken = form.handleSubmit(({ token: valor }) =>
    onContinue(valor),
  )

  async function reenviar() {
    if (cooldown.waiting || reenviando) return
    setReenviando(true)
    try {
      const espera = await onResend()
      form.reset({ token: '' })
      setErroAnterior(null)
      cooldown.restart(espera)
    } catch (error) {
      form.setError('token', { message: getAuthErrorMessage(error) })
    } finally {
      setReenviando(false)
    }
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Recuperar acesso" back onBack={onBack} />

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-5 px-4 pb-8"
      >
        {/* ÍCONE */}
        <View className="h-14 w-[80px] items-center justify-center rounded-lg bg-brand-soft">
          <Icon name="mail" color="brand" size={30} />
        </View>

        {/* INTRODUÇÃO */}
        <View className="gap-2">
          <Text className="text-title-lg text-ink">Digite o token</Text>

          <Text className="text-body text-ink-muted">{message}</Text>
        </View>

        {erroToken ? (
          <Text accessibilityRole="alert" className="text-caption text-danger">
            {erroToken}
          </Text>
        ) : null}
        {/* TOKEN */}
        <View className="gap-3">
          <Text className="text-caption-strong text-ink">Token do e-mail</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Digitar token"
            onPress={() => inputRef.current?.focus()}
            className="flex-row gap-2"
          >
            {Array.from({ length: EMAIL_TOKEN_LENGTH }, (_, index) => (
              <View
                key={index}
                className="h-14 flex-1 items-center justify-center rounded-md border border-line-strong bg-surface-raised"
              >
                <Text className="text-title text-ink">
                  {token[index] ?? ''}
                </Text>
              </View>
            ))}
          </Pressable>

          <Controller
            control={form.control}
            name="token"
            render={({ field }) => (
              <TextInput
                ref={inputRef}
                value={field.value}
                onChangeText={(valor) =>
                  field.onChange(
                    valor.replace(/\D/g, '').slice(0, EMAIL_TOKEN_LENGTH),
                  )
                }
                keyboardType="number-pad"
                maxLength={EMAIL_TOKEN_LENGTH}
                autoComplete="one-time-code"
                accessibilityLabel="Token de seis dígitos"
                className="h-0 w-0 opacity-0"
              />
            )}
          />

          <Text className="text-caption text-ink-muted">
            Não chegou? Veja também a caixa de spam.
          </Text>
        </View>

        {/* REENVIAR */}
        <View className="items-center">
          <Pressable
            accessibilityRole="button"
            onPress={() => void reenviar()}
            disabled={cooldown.waiting || reenviando}
            accessibilityState={{ disabled: cooldown.waiting || reenviando }}
            className="min-h-[44px] justify-center rounded-md bg-surface-sunken px-5"
          >
            <Text className="text-label text-brand">
              {cooldown.waiting
                ? `Reenviar token (${cooldown.label})`
                : 'Reenviar token'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* CONTINUAR */}
      <View
        className="border-t border-line bg-surface-raised px-4 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <Button
          block
          variant="primary"
          disabled={token.length !== EMAIL_TOKEN_LENGTH}
          onPress={() => void confirmarToken()}
        >
          Continuar
        </Button>
      </View>
    </View>
  )
}
