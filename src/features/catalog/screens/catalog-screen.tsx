import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { API_ERROR_CODE, ApiError } from '@/shared/api/errors'
import { BookCard, Button, EmptyState, SearchBar } from '@/shared/components'
import { pluralize } from '@/shared/utils/plural'
import {
  authorsLine,
  bookCardMeta,
  bookCoverTone,
  bookStatus,
} from '../catalog.format'
import { useBookSearch } from '../hooks/use-book-search'

// Quantos cartões de carregamento aparecem enquanto a primeira página chega.
const SKELETON_COUNT = 3

// Acervo do aluno (RF-ACE-01, RF-ACE-03 e RF-ACE-08; telas A09 a A12): busca por
// título, autor ou assunto no GET /books, com carregando, erro e sem resultado.
export function CatalogScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const params = useLocalSearchParams<{ q?: string }>()
  const [text, setText] = useState(params.q ?? '')
  const search = useBookSearch(text)

  const offline =
    search.error instanceof ApiError &&
    (search.error.code === API_ERROR_CODE.networkError ||
      search.error.code === API_ERROR_CODE.timeout)
  const searching = text.trim() !== ''

  function openBook(id: string) {
    router.push({ pathname: '/book-details', params: { id } })
  }

  return (
    <View className="flex-1 bg-surface">
      <View className="gap-4 px-4 pb-3" style={{ paddingTop: insets.top + 12 }}>
        <Text accessibilityRole="header" className="text-title-lg text-ink">
          Acervo
        </Text>
        <SearchBar value={text} onChangeText={setText} />
      </View>

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-4 pb-8"
      >
        {search.isPending ? (
          <View accessibilityLabel="Carregando acervo" className="gap-3 pt-3">
            {Array.from({ length: SKELETON_COUNT }, (_, item) => (
              <View
                key={item}
                className="h-[144px] flex-row gap-3 rounded-lg border border-line bg-surface-raised p-4"
              >
                <View className="w-14 rounded-md bg-surface-sunken" />
                <View className="flex-1 gap-3">
                  <View className="h-4 rounded-md bg-surface-sunken" />
                  <View className="h-3 w-2/3 rounded-md bg-surface-sunken" />
                  <View className="h-3 w-1/2 rounded-md bg-surface-sunken" />
                </View>
              </View>
            ))}
          </View>
        ) : search.isError ? (
          <EmptyState
            icon={offline ? 'wifiOff' : 'alert'}
            title={
              offline ? 'Você está sem internet' : 'Não foi possível buscar'
            }
            text={
              search.error instanceof ApiError
                ? search.error.message
                : undefined
            }
            action={
              <Button icon="refresh" onPress={() => void search.refetch()}>
                Tentar de novo
              </Button>
            }
          />
        ) : search.books.length === 0 ? (
          <EmptyState
            icon="search"
            title={
              searching
                ? `Nenhum resultado para “${search.searchedText}”`
                : 'O acervo está vazio'
            }
            text="Confira a ortografia, use menos palavras ou busque pelo nome do autor."
          />
        ) : (
          <>
            <Text className="mb-4 text-body text-ink-muted">
              {searching
                ? `${pluralize(search.total, 'resultado', 'resultados')} para “${search.searchedText}”`
                : `${pluralize(search.total, 'livro', 'livros')} no acervo`}
            </Text>
            <View className="gap-4">
              {search.books.map((book) => (
                <BookCard
                  key={book.id}
                  title={book.title}
                  author={authorsLine(book.authors)}
                  tone={bookCoverTone(book)}
                  status={bookStatus(book)}
                  meta={bookCardMeta(book)}
                  onPress={() => openBook(book.id)}
                />
              ))}
            </View>
            {search.hasNextPage ? (
              <View className="pt-4">
                <Button
                  block
                  variant="secondary"
                  loading={search.isFetchingNextPage}
                  onPress={() => void search.fetchNextPage()}
                >
                  Ver mais livros
                </Button>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  )
}
