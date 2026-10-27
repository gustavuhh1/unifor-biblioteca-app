import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  View,
} from 'react-native'
import { API_ERROR_CODE, ApiError } from '@/shared/api/errors'
import {
  Alert,
  AppBar,
  BookCard,
  Button,
  Chip,
  EmptyState,
  SearchBar,
} from '@/shared/components'
import { useTheme } from '@/shared/theme/theme-provider'
import { pluralize } from '@/shared/utils/plural'
import { authorsLine, bookCoverTone, bookStatus } from '../catalog.format'
import { useLibrarianBooks } from '../hooks/use-librarian-books'
import {
  BOOK_LIST_FILTER,
  BOOK_LIST_FILTERS,
  BOOK_LIST_FILTER_LABEL,
  BOOK_NOTICES,
  BOOK_NOTICE_TEXT,
} from '../librarian-catalog.constants'
import { librarianBookMeta } from '../librarian-catalog.format'
import type { BookListFilter } from '../librarian-catalog.types'

// Acervo do bibliotecário (RF-GAC-01, tela B20): lista e busca por título, autor
// ou ISBN em GET /librarian/books, com os filtros do contrato. O "+" abre o
// cadastro (B21) e o "Editar" de cada livro abre a edição (B22).
export function LibrarianCatalogScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const params = useLocalSearchParams<{ notice?: string; noticeKey?: string }>()
  const [text, setText] = useState('')
  const [filter, setFilter] = useState<BookListFilter>(BOOK_LIST_FILTER.all)
  // Aviso de uma ação feita no formulário; cada ação traz uma chave nova.
  const [dismissedKey, setDismissedKey] = useState<string>()
  const search = useLibrarianBooks(text, filter)

  const notice = BOOK_NOTICES.find((item) => item === params.notice)
  const visibleNotice =
    notice && params.noticeKey !== dismissedKey ? notice : undefined

  const offline =
    search.error instanceof ApiError &&
    (search.error.code === API_ERROR_CODE.networkError ||
      search.error.code === API_ERROR_CODE.timeout)
  const filtering =
    search.searchedText !== '' || filter !== BOOK_LIST_FILTER.all

  function openForm(id?: string) {
    router.push(
      id
        ? { pathname: '/book-form', params: { id } }
        : { pathname: '/book-form' },
    )
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Acervo"
        subtitle="Gestão dos livros da biblioteca"
        back
        actions={[
          { icon: 'plus', label: 'Novo livro', onPress: () => openForm() },
        ]}
      />
      <View className="gap-3 px-4 pb-3 pt-1">
        <SearchBar
          value={text}
          onChangeText={setText}
          placeholder="Buscar título, autor ou ISBN"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
        >
          {BOOK_LIST_FILTERS.map((item) => (
            <Chip
              key={item}
              selected={filter === item}
              onPress={() => setFilter(item)}
            >
              {BOOK_LIST_FILTER_LABEL[item]}
            </Chip>
          ))}
        </ScrollView>
        {visibleNotice ? (
          <Alert
            tone="success"
            action="Fechar"
            onAction={() => setDismissedKey(params.noticeKey)}
          >
            {BOOK_NOTICE_TEXT[visibleNotice]}
          </Alert>
        ) : null}
      </View>

      {search.isPending ? (
        <View
          accessibilityLabel="Carregando acervo"
          className="flex-1 items-center justify-center"
        >
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : search.isError ? (
        <EmptyState
          icon={offline ? 'wifiOff' : 'alert'}
          title={
            offline ? 'Você está sem internet' : 'Não foi possível carregar'
          }
          text={
            search.error instanceof ApiError ? search.error.message : undefined
          }
          action={
            <Button icon="refresh" onPress={() => void search.refetch()}>
              Tentar de novo
            </Button>
          }
        />
      ) : (
        <FlatList
          data={search.books}
          keyExtractor={(book) => book.id}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="gap-3 px-4 pb-6"
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (search.hasNextPage && !search.isFetchingNextPage) {
              void search.fetchNextPage()
            }
          }}
          ListHeaderComponent={
            search.books.length > 0 ? (
              <Text className="text-caption text-ink-muted">
                {pluralize(search.total, 'livro', 'livros')}
                {filtering ? ' encontrados' : ' no acervo'}
              </Text>
            ) : undefined
          }
          ListEmptyComponent={
            <EmptyState
              icon="books"
              title={
                filtering ? 'Nenhum livro encontrado' : 'O acervo está vazio'
              }
              text={
                filtering
                  ? 'Confira a busca ou troque o filtro.'
                  : 'Toque em + para cadastrar o primeiro livro.'
              }
            />
          }
          ListFooterComponent={
            search.isFetchingNextPage ? (
              <ActivityIndicator
                accessibilityLabel="Carregando mais livros"
                color={colors.brand}
              />
            ) : undefined
          }
          renderItem={({ item: book }) => (
            <BookCard
              title={book.title}
              author={authorsLine(book.authors)}
              tone={bookCoverTone(book)}
              status={bookStatus(book)}
              meta={librarianBookMeta(book)}
              onPress={() => openForm(book.id)}
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  icon="pencil"
                  onPress={() => openForm(book.id)}
                >
                  Editar
                </Button>
              }
            />
          )}
        />
      )}
    </View>
  )
}
