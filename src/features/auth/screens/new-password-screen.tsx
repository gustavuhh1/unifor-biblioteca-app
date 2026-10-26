import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { applyApiFieldErrors } from '@/shared/api/form-errors'
import { Alert } from '@/shared/components/alert'
import { AppBar } from '@/shared/components/app-bar'
import { Button } from '@/shared/components/button'
import { TextField } from '@/shared/components/text-field'
import { Icon } from '@/shared/components/icon'
import { getAuthErrorMessage } from '../auth.errors'
import {
  newPasswordFormSchema,
  type NewPasswordForm,
} from '../schemas/recovery.schemas'

// Campos do formulário, com os mesmos nomes que a API usa em `fields`.
const NEW_PASSWORD_FIELDS = ['password', 'passwordConfirmation'] as const

export interface NewPasswordScreenProps {
  // Grava a nova senha; rejeita com o erro da API.
  onSubmit: (values: NewPasswordForm) => Promise<unknown>
  onBack: () => void
}

// Recuperar senha, passo Nova senha (RF-AUT-08; tela A67).
export function NewPasswordScreen({
  onSubmit,
  onBack,
}: NewPasswordScreenProps) {
  const insets = useSafeAreaInsets()
  const form = useForm<NewPasswordForm>({
    resolver: zodResolver(newPasswordFormSchema),
    defaultValues: { password: '', passwordConfirmation: '' },
  })
  const [formError, setFormError] = useState<string | null>(null)

  const redefinir = form.handleSubmit(async (values) => {
    setFormError(null)
    try {
      await onSubmit(values)
    } catch (error) {
      if (!applyApiFieldErrors(error, form.setError, NEW_PASSWORD_FIELDS)) {
        setFormError(getAuthErrorMessage(error))
      }
    }
  })

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Nova senha" back onBack={onBack} />

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-5 px-4 pb-8"
      >
        {/* ÍCONE */}
        <View className="h-14 w-[80px] items-center justify-center rounded-lg bg-brand-soft">
          <Icon name="lock" color="brand" size={30} />
        </View>

        {/* INTRODUÇÃO */}
        <View className="gap-2">
          <Text className="text-title-lg text-ink">Crie uma nova senha</Text>

          <Text className="text-body text-ink-muted">
            Use uma senha que só você saiba. Ela substitui a anterior.
          </Text>
        </View>

        {/* NOVA SENHA */}
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <TextField
              label="Nova senha"
              icon="lock"
              type="password"
              inputMode="numeric"
              keyboardType="number-pad"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              hint="Você usa a senha para entrar no app."
            />
          )}
        />

        {/* CONFIRMAÇÃO */}
        <Controller
          control={form.control}
          name="passwordConfirmation"
          render={({ field, fieldState }) => (
            <TextField
              label="Confirmar nova senha"
              icon="lock"
              type="password"
              inputMode="numeric"
              keyboardType="number-pad"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              hint="Repita a senha."
            />
          )}
        />

        {formError ? <Alert tone="danger">{formError}</Alert> : null}
      </ScrollView>

      {/* BOTÃO */}
      <View
        className="border-t border-line bg-surface-raised px-4 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <Button
          block
          variant="primary"
          loading={form.formState.isSubmitting}
          onPress={() => void redefinir()}
        >
          Redefinir senha
        </Button>
      </View>
    </View>
  )
}
