import { useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { AppBar, Button, EmptyState } from '@/shared/components'
import { useTheme } from '@/shared/theme/theme-provider'
import { FolderNameSheet } from '../components/folder-name-sheet'
import { FolderRow } from '../components/folder-row'
import { useCreateFolder } from '../hooks/use-saved-actions'
import { useFolders } from '../hooks/use-saved'
import { ALL_SAVED_ID } from '../saved.constants'
import { savedErrorMessage } from '../saved.format'

// Salvos (A18; RF-SAL-01 e RF-SAL-02): "Todos os salvos" e as pastas do aluno,
// vindos de GET /me/folders. Tocar numa linha abre a pasta; "Nova pasta" cria.
export function SavedScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const folders = useFolders()
  const createFolder = useCreateFolder()
  const [creating, setCreating] = useState(false)

  function openFolder(id: string) {
    router.push({ pathname: '/folder', params: { id } })
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Salvos" back />
      {folders.isPending ? (
        <View
          accessibilityLabel="Carregando salvos"
          className="flex-1 items-center justify-center"
        >
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : folders.isError ? (
        <EmptyState
          icon="alert"
          title="Não foi possível carregar os salvos"
          text={savedErrorMessage(folders.error)}
          action={
            <Button icon="refresh" onPress={() => void folders.refetch()}>
              Tentar de novo
            </Button>
          }
        />
      ) : (
        <ScrollView
          contentContainerClassName="gap-4 px-4 pb-6 pt-2"
          keyboardShouldPersistTaps="handled"
        >
          {folders.data.savedCount === 0 && folders.data.items.length === 0 ? (
            <EmptyState
              icon="bookmark"
              title="Você ainda não salvou nenhum livro"
              text="Toque em Salvar na página de um livro para guardá-lo aqui."
              action={
                <Button icon="search" onPress={() => router.push('/catalog')}>
                  Explorar acervo
                </Button>
              }
            />
          ) : (
            <View className="overflow-hidden rounded-lg border border-line bg-surface-raised">
              <FolderRow
                name="Todos os salvos"
                icon="bookmark"
                count={folders.data.savedCount}
                last={folders.data.items.length === 0}
                onPress={() => openFolder(ALL_SAVED_ID)}
              />
              {folders.data.items.map((folder, index) => (
                <FolderRow
                  key={folder.id}
                  name={folder.name}
                  count={folder.bookCount}
                  last={index === folders.data.items.length - 1}
                  onPress={() => openFolder(folder.id)}
                />
              ))}
            </View>
          )}
          <Button
            block
            variant="secondary"
            icon="plus"
            onPress={() => setCreating(true)}
          >
            Nova pasta
          </Button>
        </ScrollView>
      )}
      {creating ? (
        <FolderNameSheet
          title="Nova pasta"
          submitLabel="Criar pasta"
          onClose={() => setCreating(false)}
          onSubmit={(name) => createFolder.mutateAsync(name)}
        />
      ) : null}
    </View>
  )
}
