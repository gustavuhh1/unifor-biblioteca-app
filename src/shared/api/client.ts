import { auth } from '../config/firebase'
import { env } from '../config/env'
import { createApiClient } from './create-api-client'

// Cliente HTTP único do app: base URL de EXPO_PUBLIC_API_URL e o ID token do
// Firebase no cabeçalho Authorization. Toda chamada à API passa por aqui.
export const apiClient = createApiClient({
  baseUrl: env.apiUrl,
  getIdToken: async () =>
    auth.currentUser ? auth.currentUser.getIdToken() : null,
})

export const apiRequest = apiClient.request
