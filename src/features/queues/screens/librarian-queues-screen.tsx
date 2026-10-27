import { useRouter } from 'expo-router'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { ApiError } from '@/shared/api/errors'
import {
  AppBar,
  BookCover,
  Button,
  EmptyState,
  Icon,
} from '@/shared/components'
import { authorsLine, bookCoverTone } from '@/features/catalog/catalog.format'
import { useTheme } from '@/shared/theme/theme-provider'
import { formatDayMonth } from '@/shared/utils/dates'
import { pluralize } from '@/shared/utils/plural'
import { useQueueBooks } from '../hooks/use-librarian-queue'
import { queueLengthText } from '../librarian-queues.format'

// Aba Filas do bibliotecário (RF-BAL-06): os livros que têm gente na fila, a mais
// longa primeiro (GET /librarian/books). Tocar num livro abre a fila dele.
export function LibrarianQueuesScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const books = useQueueBooks()
  const list = books.data ?? []

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        large
        title="Filas"
        subtitle={
          books.data
            ? `${pluralize(list.length, 'livro', 'livros')} com fila`
            : undefined
        }
      />
      {books.isPending ? (
        <View
          accessibilityLabel="Carregando as filas"
          className="flex-1 items-center justify-center"
        >
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : books.isError ? (
        <EmptyState
          icon="alert"
          title="Não foi possível carregar as filas"
          text={
            books.error instanceof ApiError ? books.error.message : undefined
          }
          action={
            <Button icon="refresh" onPress={() => void books.refetch()}>
              Tentar de novo
            </Button>
          }
        />
      ) : list.length === 0 ? (
        <EmptyState
          icon="users"
          title="Nenhum livro com fila"
          text="Quando todos os exemplares de um livro estiverem emprestados, os alunos podem entrar na fila dele."
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 24 }}
        >
          {list.map((book) => (
            <Pressable
              key={book.id}
              accessibilityRole="button"
              accessibilityLabel={`Abrir a fila de ${book.title}`}
              onPress={() =>
                router.push({
                  pathname: '/book-queue',
                  params: { bookId: book.id },
                })
              }
              className="flex-row items-center gap-3 rounded-lg border border-line bg-surface-raised p-3"
            >
              <BookCover
                title={book.title}
                tone={bookCoverTone(book)}
                size="sm"
              />
              <View className="min-w-0 flex-1 gap-1">
                <Text className="text-label text-ink">{book.title}</Text>
                <Text className="text-caption text-ink-muted">
                  {authorsLine(book.authors)}
                </Text>
                <Text className="text-caption-strong text-brand">
                  {queueLengthText(book.queueLength)}
                  {book.nextReturnAt
                    ? ` · volta ${formatDayMonth(book.nextReturnAt)}`
                    : ''}
                </Text>
              </View>
              <Icon name="chevronRight" color="inkMuted" />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  )
}
