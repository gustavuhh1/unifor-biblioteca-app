// Chaves do TanStack Query de Salvos: a lista de livros e a lista de pastas.
export const SAVED_QUERY_KEY = 'saved'
export const FOLDERS_QUERY_KEY = 'folders'

// O nome de uma pasta tem até 30 caracteres (RF-SAL-02).
export const FOLDER_NAME_MAX_LENGTH = 30

// Valor do parâmetro `id` da rota da pasta para "Todos os salvos" (não é pasta).
export const ALL_SAVED_ID = 'all'

// Textos de Salvos (pt-BR).
export const SAVED_MESSAGE = {
  folderNameRequired: 'Dê um nome à pasta.',
  folderNameTooLong: `Use até ${FOLDER_NAME_MAX_LENGTH} caracteres.`,
  genericFailure: 'Algo deu errado. Tente de novo.',
} as const
