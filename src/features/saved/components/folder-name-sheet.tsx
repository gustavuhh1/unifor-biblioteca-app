import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { applyApiFieldErrors } from '@/shared/api/form-errors'
import { Alert, BottomSheet, Button, TextField } from '@/shared/components'
import { folderNameSchema, type FolderNameForm } from '../schemas/folder.schemas'
import { FOLDER_NAME_MAX_LENGTH } from '../saved.constants'
import { savedErrorMessage } from '../saved.format'

interface FolderNameSheetProps {
  title: string
  submitLabel: string
  initialName?: string
  onClose: () => void
  // Cria ou renomeia; lança o erro da API para a folha mostrar no campo.
  onSubmit: (name: string) => Promise<unknown>
}

// Folha para criar ou renomear uma pasta (A17 e A21; RF-SAL-02): nome de até 30
// caracteres e o erro do campo vindo da API. A tela só monta a folha quando ela
// abre, então o formulário sempre começa limpo (ou com o nome atual).
export function FolderNameSheet({
  title,
  submitLabel,
  initialName = '',
  onClose,
  onSubmit,
}: FolderNameSheetProps) {
  const [failure, setFailure] = useState<string | null>(null)
  const form = useForm<FolderNameForm>({
    resolver: zodResolver(folderNameSchema),
    defaultValues: { name: initialName },
  })

  const submit = form.handleSubmit(async ({ name }) => {
    setFailure(null)
    try {
      await onSubmit(name)
      onClose()
    } catch (error) {
      if (!applyApiFieldErrors(error, form.setError, ['name'])) {
        setFailure(savedErrorMessage(error))
      }
    }
  })

  return (
    <BottomSheet
      visible
      title={title}
      onClose={onClose}
      actions={
        <>
          <Button
            block
            loading={form.formState.isSubmitting}
            onPress={() => void submit()}
          >
            {submitLabel}
          </Button>
          <Button block variant="ghost" onPress={onClose}>
            Agora não
          </Button>
        </>
      }
    >
      <Controller
        control={form.control}
        name="name"
        render={({ field, fieldState }) => (
          <TextField
            label="Nome da pasta"
            icon="folder"
            maxLength={FOLDER_NAME_MAX_LENGTH}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            hint={`Até ${FOLDER_NAME_MAX_LENGTH} caracteres.`}
            error={fieldState.error?.message}
            autoFocus
          />
        )}
      />
      {failure ? <Alert tone="danger">{failure}</Alert> : null}
    </BottomSheet>
  )
}
