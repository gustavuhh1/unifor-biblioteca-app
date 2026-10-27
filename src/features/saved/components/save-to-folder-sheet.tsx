import { useState } from 'react'
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native'
import { Alert, BottomSheet, Button, Icon } from '@/shared/components'
import { useTheme } from '@/shared/theme/theme-provider'
import {
  useCreateFolder,
  useSetBookInFolder,
  useToggleSaved,
} from '../hooks/use-saved-actions'
import { useFolders, useSavedBooks } from '../hooks/use-saved'
import { savedErrorMessage, savedStateOf } from '../saved.format'
import { FolderNameSheet } from './folder-name-sheet'

interface SaveToFolderSheetProps {
  bookId: string
  visible: boolean
  onClose: () => void
}

// "Salvar em pasta" (A16; RF-SAL-03): marca em quais pastas o livro salvo está,
// cria uma pasta nova já com o livro e permite tirar o livro dos salvos.
export function SaveToFolderSheet({
  bookId,
  visible,
  onClose,
}: SaveToFolderSheetProps) {
  const { colors } = useTheme()
  const folders = useFolders()
  const saved = useSavedBooks()
  const setInFolder = useSetBookInFolder()
  const toggleSaved = useToggleSaved()
  const createFolder = useCreateFolder()
  const [creating, setCreating] = useState(false)

  const { folderIds } = savedStateOf(saved.data, bookId)
  const failure = setInFolder.error ?? toggleSaved.error

  // A folha de nova pasta ocupa o lugar desta enquanto está aberta.
  if (creating) {
    return (
      <FolderNameSheet
        title="Nova pasta"
        submitLabel="Criar pasta e salvar"
        onClose={() => setCreating(false)}
        onSubmit={async (name) => {
          const folder = await createFolder.mutateAsync(name)
          await setInFolder.mutateAsync({
            folderId: folder.id,
            bookId,
            inFolder: false,
          })
        }}
      />
    )
  }

  return (
    <BottomSheet
      visible={visible}
      title="Salvar em pasta"
      text="O livro já está em Todos os salvos. Escolha as pastas em que ele também fica."
      onClose={onClose}
      actions={
        <>
          <Button block onPress={onClose}>
            Pronto
          </Button>
          <Button
            block
            variant="ghost"
            loading={toggleSaved.isPending}
            onPress={() =>
              toggleSaved.mutate({ bookId, saved: true }, { onSuccess: onClose })
            }
          >
            Remover dos salvos
          </Button>
        </>
      }
    >
      {folders.isPending ? (
        <View accessibilityLabel="Carregando pastas" className="items-center">
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : folders.isError ? (
        <Alert tone="danger" action="Tentar de novo" onAction={() => void folders.refetch()}>
          {savedErrorMessage(folders.error)}
        </Alert>
      ) : (
        <ScrollView className="max-h-[240px]">
          {folders.data.items.map((folder) => {
            const inFolder = folderIds.includes(folder.id)
            return (
              <Pressable
                key={folder.id}
                accessibilityRole="checkbox"
                accessibilityState={{
                  checked: inFolder,
                  busy: setInFolder.isPending,
                }}
                accessibilityLabel={folder.name}
                disabled={setInFolder.isPending}
                onPress={() =>
                  setInFolder.mutate({ folderId: folder.id, bookId, inFolder })
                }
                className="min-h-[48px] flex-row items-center gap-3 border-b border-line py-2"
              >
                <Icon
                  name={inFolder ? 'checkCircle' : 'folder'}
                  color={inFolder ? 'brand' : 'inkMuted'}
                  size={22}
                />
                <Text className="flex-1 text-label text-ink">{folder.name}</Text>
              </Pressable>
            )
          })}
        </ScrollView>
      )}
      <Button
        block
        variant="secondary"
        icon="plus"
        onPress={() => setCreating(true)}
      >
        Nova pasta
      </Button>
      {failure ? <Alert tone="danger">{savedErrorMessage(failure)}</Alert> : null}
    </BottomSheet>
  )
}
