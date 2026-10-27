import { z } from 'zod'
import { FOLDER_NAME_MAX_LENGTH, SAVED_MESSAGE } from '../saved.constants'

// Formulário de criar e renomear pasta: nome de 1 a 30 caracteres (RF-SAL-02).
export const folderNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { error: SAVED_MESSAGE.folderNameRequired })
    .max(FOLDER_NAME_MAX_LENGTH, { error: SAVED_MESSAGE.folderNameTooLong }),
})
export type FolderNameForm = z.infer<typeof folderNameSchema>
