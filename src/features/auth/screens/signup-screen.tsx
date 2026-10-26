import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { applyApiFieldErrors } from '@/shared/api/form-errors'
import { Alert } from '@/shared/components/alert'
import { AppBar } from '@/shared/components/app-bar'
import { Button } from '@/shared/components/button'
import { TextField } from '@/shared/components/text-field'
import { MATRICULA_LENGTH, SIGNUP_STEPS } from '../auth.constants'
import {
  AUTH_API_ERROR_CODE,
  getAuthErrorMessage,
  hasApiErrorCode,
} from '../auth.errors'
import { signupSchema, type SignupForm } from '../schemas/registration.schemas'

// Campos do formulário, com os mesmos nomes que a API usa em `fields`.
const SIGNUP_FIELDS = [
  'email',
  'matricula',
  'password',
  'passwordConfirmation',
] as const

export interface SignupScreenProps {
  // Dados já digitados (ao voltar de "Corrigir e-mail").
  defaultValues?: Partial<SignupForm>
  // Envia o cadastro; rejeita com o erro da API.
  onSubmit: (values: SignupForm) => Promise<unknown>
  onBack: () => void
  onSignIn: () => void
}

// Cadastro, passo Dados (RF-AUT-01 e RF-AUT-02; telas A56, A57 e A78).
export function SignupScreen({
  defaultValues,
  onSubmit,
  onBack,
  onSignIn,
}: SignupScreenProps) {
  const safe = useSafeAreaInsets()
  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      matricula: '',
      password: '',
      passwordConfirmation: '',
      ...defaultValues,
    },
  })
  // Erro da API que não coube em nenhum campo (ex.: falha ao enviar o e-mail).
  const [formError, setFormError] = useState<string | null>(null)
  const [conflict, setConflict] = useState(false)

  const continuar = form.handleSubmit(async (values) => {
    setFormError(null)
    setConflict(false)
    try {
      await onSubmit(values)
    } catch (error) {
      setConflict(hasApiErrorCode(error, [AUTH_API_ERROR_CODE.signupConflict]))
      if (!applyApiFieldErrors(error, form.setError, SIGNUP_FIELDS)) {
        setFormError(getAuthErrorMessage(error))
      }
    }
  })

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Criar conta" back onBack={onBack} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}
      >
        <View className="flex-row gap-2">
          {SIGNUP_STEPS.map((s, i) => (
            <View key={s} className="flex-1 gap-2">
              <Text
                className={
                  i === 0
                    ? 'text-caption-strong text-brand'
                    : 'text-caption text-ink-muted'
                }
              >
                {s}
              </Text>
              <View
                className={`h-1.5 rounded-pill ${i === 0 ? 'bg-brand' : 'bg-line'}`}
              />
            </View>
          ))}
        </View>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <TextField
              label="E-mail institucional"
              icon="mail"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              hint="Terminado em @edu.unifor.br."
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          name="matricula"
          render={({ field, fieldState }) => (
            <TextField
              label="Matrícula"
              icon="user"
              value={field.value}
              onChangeText={(v) => field.onChange(v.replace(/\D/g, ''))}
              onBlur={field.onBlur}
              inputMode="numeric"
              keyboardType="number-pad"
              maxLength={MATRICULA_LENGTH}
              hint="7 dígitos. Os dois primeiros são o ano de ingresso."
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
              inputMode="numeric"
              keyboardType="number-pad"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              hint="Use pelo menos 8 dígitos numéricos."
              error={fieldState.error?.message}
            />
          )}
        />
        <Controller
          control={form.control}
          name="passwordConfirmation"
          render={({ field, fieldState }) => (
            <TextField
              label="Confirmar senha"
              icon="lock"
              type="password"
              inputMode="numeric"
              keyboardType="number-pad"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              hint="Repita a senha."
              error={fieldState.error?.message}
            />
          )}
        />
        {conflict ? (
          <Pressable
            accessibilityRole="button"
            onPress={onSignIn}
            className="rounded-md bg-danger-soft p-3"
          >
            <Text className="text-label text-danger">
              Já existe uma conta com esses dados. Toque para entrar.
            </Text>
          </Pressable>
        ) : formError ? (
          <Alert tone="danger">{formError}</Alert>
        ) : null}
      </ScrollView>
      <View
        className="gap-2 border-t border-line bg-surface-raised px-4 pt-3"
        style={{ paddingBottom: Math.max(safe.bottom, 16) }}
      >
        <Button
          block
          loading={form.formState.isSubmitting}
          onPress={() => void continuar()}
        >
          Continuar
        </Button>
        <Button block variant="ghost" onPress={onSignIn}>
          Já tem conta? Entrar
        </Button>
      </View>
    </View>
  )
}
