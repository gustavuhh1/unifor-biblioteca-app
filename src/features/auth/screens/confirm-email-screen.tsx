import { zodResolver } from '@hookform/resolvers/zod'
import React, { useRef, useState, type ElementRef } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { z } from 'zod'
import { applyApiFieldErrors } from '@/shared/api/form-errors'
import { AppBar } from '@/shared/components/app-bar'
import { Button } from '@/shared/components/button'
import { Icon } from '@/shared/components/icon'
import { useResendCooldown } from '@/shared/utils/use-resend-cooldown'
import { EMAIL_TOKEN_LENGTH, SIGNUP_STEPS } from '../auth.constants'
import {
  AUTH_API_ERROR_CODE,
  TOKEN_GONE_ERROR_CODES,
  getAuthErrorMessage,
  hasApiErrorCode,
} from '../auth.errors'
import { emailTokenSchema } from '../schemas/registration.schemas'

const tokenFormSchema = z.object({ token: emailTokenSchema })
type TokenForm = z.infer<typeof tokenFormSchema>

// Aviso da tela A77 quando o token não vale mais.
interface ExpiredNotice {
  title: string | null
  text: string
}

export interface ConfirmEmailScreenProps {
  // E-mail para onde o token foi enviado.
  email: string
  // Espera, em segundos, antes de poder pedir outro token.
  resendWaitSeconds: number
  // Confere o token; rejeita com o erro da API.
  onConfirm: (token: string) => Promise<unknown>
  // Pede outro token e devolve a nova espera, em segundos.
  onResend: () => Promise<number>
  onCorrectEmail: () => void
  onBack: () => void
}

// Cadastro, passo E-mail (RF-AUT-03; telas A58 e A77): o aluno digita o token
// de 6 dígitos, pede outro ou volta para corrigir o e-mail.
export function ConfirmEmailScreen({
  email,
  resendWaitSeconds,
  onConfirm,
  onResend,
  onCorrectEmail,
  onBack,
}: ConfirmEmailScreenProps) {
  const insets = useSafeAreaInsets()
  const inputRef = useRef<ElementRef<typeof TextInput>>(null)
  const form = useForm<TokenForm>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues: { token: '' },
  })
  const token = useWatch({ control: form.control, name: 'token' })
  const erroToken = form.formState.errors.token?.message

  const [expirado, setExpirado] = useState<ExpiredNotice | null>(null)
  const [reenviando, setReenviando] = useState(false)
  const cooldown = useResendCooldown(resendWaitSeconds)

  const confirmarToken = form.handleSubmit(async (values) => {
    try {
      await onConfirm(values.token)
    } catch (error) {
      if (hasApiErrorCode(error, TOKEN_GONE_ERROR_CODES)) {
        setExpirado({
          title:
            error.code === AUTH_API_ERROR_CODE.tokenExpiredOrUsed
              ? 'Token expirado ou já usado'
              : null,
          text: error.message,
        })
        return
      }
      if (!applyApiFieldErrors(error, form.setError, ['token'])) {
        form.setError('token', { message: getAuthErrorMessage(error) })
      }
    }
  })

  async function reenviar() {
    if (cooldown.waiting || reenviando) return
    setReenviando(true)
    try {
      const espera = await onResend()
      setExpirado(null)
      form.reset({ token: '' })
      cooldown.restart(espera)
    } catch (error) {
      if (hasApiErrorCode(error, [AUTH_API_ERROR_CODE.tokenResendTooSoon])) {
        cooldown.restart(error.retryAfterSeconds ?? resendWaitSeconds)
      }
      form.setError('token', { message: getAuthErrorMessage(error) })
    } finally {
      setReenviando(false)
    }
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Confirmar e-mail" back onBack={onBack} />

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-5 px-4 pb-8"
      >
        {/* INDICADORES */}
        <View className="flex-row gap-2">
          {SIGNUP_STEPS.map((nome, index) => (
            <View key={nome} className="flex-1 gap-2">
              <Text
                className={
                  index < 2
                    ? 'text-caption-strong text-brand'
                    : 'text-caption text-ink-muted'
                }
              >
                {nome}
              </Text>

              <View
                className={
                  index < 2
                    ? 'h-1.5 rounded-pill bg-brand'
                    : 'h-1.5 rounded-pill bg-line'
                }
              />
            </View>
          ))}
        </View>

        {/* INTRODUÇÃO */}
        <View className="gap-2">
          <Text className="text-title text-ink">Digite o token</Text>

          <Text className="text-body text-ink-muted">
            Enviamos um token de 6 dígitos para {email}.
          </Text>
        </View>

        {/* A77 — TOKEN EXPIRADO */}
        {expirado && (
          <View className="flex-row items-start gap-3 rounded-md border border-warning bg-warning-soft p-4">
            <Icon name="alert" color="warning" size={20} />

            <View className="flex-1 gap-1">
              {expirado.title ? (
                <Text className="text-label text-ink">{expirado.title}</Text>
              ) : null}

              <Text className="text-body text-ink">{expirado.text}</Text>
            </View>
          </View>
        )}

        {/* CÓDIGO */}
        {erroToken ? (
          <Text accessibilityRole="alert" className="text-caption text-danger">
            {erroToken}
          </Text>
        ) : null}
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

        {/* LINKS */}
        <View className="flex-row justify-between gap-3">
          <Pressable
            onPress={() => void reenviar()}
            disabled={cooldown.waiting || reenviando}
            accessibilityState={{ disabled: cooldown.waiting || reenviando }}
            accessibilityRole="button"
            className="min-h-[44px] justify-center"
          >
            <Text className="text-label text-brand">
              {cooldown.waiting
                ? `Reenviar em ${cooldown.label}`
                : 'Reenviar token'}
            </Text>
          </Pressable>

          <Pressable
            onPress={onCorrectEmail}
            accessibilityRole="button"
            className="min-h-[44px] justify-center"
          >
            <Text className="text-label text-brand">Corrigir e-mail</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* CONFIRMAR */}
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
          loading={form.formState.isSubmitting}
          onPress={() => void confirmarToken()}
        >
          Confirmar e-mail
        </Button>
      </View>
    </View>
  )
}
