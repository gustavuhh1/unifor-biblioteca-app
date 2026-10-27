import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import {
  authorsLine,
  bookCardMeta,
  bookCoverTone,
  bookStatus,
} from '@/features/catalog/catalog.format'
import {
  Alert,
  AppBar,
  BookCard,
  Button,
  EmptyState,
} from '@/shared/components'
import { ConfirmationSheet } from '@/shared/components/confirmation-sheet'
import { useTheme } from '@/shared/theme/theme-provider'
import { pluralize } from '@/shared/utils/plural'
import { FolderNameSheet } from '../components/folder-name-sheet'
import {
  useDeleteFolder,
  useRenameFolder,
  useSetBookInFolder,
  useToggleSaved,
} from '../hooks/use-saved-actions'
import { useFolders, useSavedBooks } from '../hooks/use-saved'
import { ALL_SAVED_ID } from '../saved.constants'
import { savedErrorMessage } from '../saved.format'

// Uma pasta de Salvos ou "Todos os salvos" (A18 a A22; RF-SAL-01 a RF-SAL-03).
// A rota recebe `id` (o da pasta ou "all"). Na pasta dá para renomear e apagar
// (apagar não remove os livros de Todos os salvos) e tirar livros dela; em
// "Todos os salvos" dá para remover o livro dos salvos.
export function FolderScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()
  const isAll = !id || id === ALL_SAVED_ID
  const folderId = isAll ? undefined : id

  const books = useSavedBooks(folderId)
  const folders = useFolders()
  const rename = useRenameFolder()
  const deleteFolder = useDeleteFolder()
  const unsave = useToggleSaved()
  const removeFromFolder = useSetBookInFolder()
  const [renaming, setRenaming] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const folder = folders.data?.items.find((item) => item.id === folderId)
  const title = isAll ? 'Todos os salvos' : (folder?.name ?? 'Pasta')
  const failure = unsave.error ?? removeFromFolder.error ?? deleteFolder.error

  function removeBook(bookId: string) {
    if (folderId) {
      removeFromFolder.mutate({ folderId, bookId, inFolder: true })
    } else {
      unsave.mutate({ bookId, saved: true })
    }
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title={title}
        subtitle={
          books.data
            ? pluralize(books.data.length, 'livro', 'livros')
            : undefined
        }
        back
        actions={
          isAll || !folder
            ? undefined
            : [
                {
                  icon: 'pencil',
                  label: 'Renomear pasta',
                  onPress: () => setRenaming(true),
                },
                {
                  icon: 'trash',
                  label: 'Apagar pasta',
                  onPress: () => setConfirmingDelete(true),
                },
              ]
        }
      />
      {books.isPending ? (
        <View
          accessibilityLabel="Carregando livros salvos"
          className="flex-1 items-center justify-center"
        >
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : books.isError ? (
        <EmptyState
          icon="alert"
          title="Não foi possível abrir a pasta"
          text={savedErrorMessage(books.error)}
          action={
            <Button icon="refresh" onPress={() => void books.refetch()}>
              Tentar de novo
            </Button>
          }
        />
      ) : books.data.length === 0 ? (
        <EmptyState
          icon="bookmark"
          title={
            isAll ? 'Nenhum livro salvo' : 'Nenhum livro nesta pasta ainda'
          }
          text={
            isAll
              ? 'Toque em Salvar na página de um livro.'
              : 'Na página de um livro salvo, escolha Salvar em pasta.'
          }
          action={
            <Button icon="search" onPress={() => router.push('/catalog')}>
              Explorar acervo
            </Button>
          }
        />
      ) : (
        <ScrollView contentContainerClassName="gap-3 px-4 pb-6 pt-2">
          {failure ? (
            <Alert tone="danger">{savedErrorMessage(failure)}</Alert>
          ) : null}
          {books.data.map((book) => (
            <BookCard
              key={book.id}
              title={book.title}
              author={authorsLine(book.authors)}
              tone={bookCoverTone(book)}
              status={bookStatus(book)}
              meta={bookCardMeta(book)}
              onPress={() =>
                router.push({
                  pathname: '/book-details',
                  params: { id: book.id },
                })
              }
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  icon="x"
                  onPress={() => removeBook(book.id)}
                >
                  {isAll ? 'Remover dos salvos' : 'Tirar da pasta'}
                </Button>
              }
            />
          ))}
          <Text className="text-caption text-ink-muted">
            {isAll
              ? 'Remover daqui também tira o livro das pastas.'
              : 'Tirar da pasta não remove o livro de Todos os salvos.'}
          </Text>
        </ScrollView>
      )}

      {renaming && folder ? (
        <FolderNameSheet
          title="Renomear pasta"
          submitLabel="Salvar nome"
          initialName={folder.name}
          onClose={() => setRenaming(false)}
          onSubmit={(name) => rename.mutateAsync({ folderId: folder.id, name })}
        />
      ) : null}
      <ConfirmationSheet
        visible={confirmingDelete}
        title={`Apagar a pasta ${folder?.name ?? ''}?`}
        description="Os livros continuam em Todos os salvos. Só a pasta é apagada."
        danger
        confirmText="Apagar pasta"
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => {
          if (!folderId) return
          deleteFolder.mutate(folderId, {
            onSuccess: () => router.back(),
            onSettled: () => setConfirmingDelete(false),
          })
        }}
      />
    </View>
  )
}
