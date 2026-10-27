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
import { MATRICULA_LENGTH } from '../auth.constants'
import { getAuthErrorMessage } from '../auth.errors'
import {
  recoverPasswordSchema,
  type RecoverPasswordForm,
} from '../schemas/recovery.schemas'

export interface RecoverPasswordScreenProps {
  defaultMatricula?: string
  // Pede o token; rejeita com o erro da API.
  onSubmit: (matricula: string) => Promise<unknown>
  onBack: () => void
}

// Recuperar senha, passo Matrícula (RF-AUT-08; tela A65).
export function RecoverPasswordScreen({
  defaultMatricula = '',
  onSubmit,
  onBack,
}: RecoverPasswordScreenProps) {
  const insets = useSafeAreaInsets()
  const form = useForm<RecoverPasswordForm>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: { matricula: defaultMatricula },
  })
  const [formError, setFormError] = useState<string | null>(null)

  const enviar = form.handleSubmit(async ({ matricula }) => {
    setFormError(null)
    try {
      await onSubmit(matricula)
    } catch (error) {
      if (!applyApiFieldErrors(error, form.setError, ['matricula'])) {
        setFormError(getAuthErrorMessage(error))
      }
    }
  })

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
          <Icon name="lock" color="brand" size={30} />
        </View>

        {/* TÍTULO */}
        <View className="gap-2">
          <Text className="text-title-lg text-ink">
            Esqueceu a senha ou trocou de celular?
          </Text>

          <Text className="text-body text-ink-muted">
            Informe sua matrícula. Enviamos um token de 6 dígitos para o e-mail
            do seu cadastro.
          </Text>
        </View>

        {/* MATRÍCULA */}
        <Controller
          control={form.control}
          name="matricula"
          render={({ field, fieldState }) => (
            <TextField
              label="Matrícula"
              icon="user"
              value={field.value}
              onChangeText={(valor) => field.onChange(valor.replace(/\D/g, ''))}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              inputMode="numeric"
              keyboardType="number-pad"
              maxLength={MATRICULA_LENGTH}
              hint="7 dígitos."
            />
          )}
        />

        {formError ? <Alert tone="danger">{formError}</Alert> : null}

        {/* INFORMAÇÃO */}
        <View className="flex-row items-start gap-3 rounded-md bg-brand-soft p-4">
          <Icon name="fingerprint" color="brand" size={20} />

          <Text className="flex-1 text-body text-ink">
            Depois de criar uma nova senha, você entra com ela. Se quiser, cria
            também um passkey neste celular.
          </Text>
        </View>
      </ScrollView>

      {/* BOTÃO INFERIOR */}
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
          onPress={() => void enviar()}
        >
          Enviar token
        </Button>
      </View>
    </View>
  )
}
