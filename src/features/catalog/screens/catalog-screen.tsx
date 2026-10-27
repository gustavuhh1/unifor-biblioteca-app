import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native'
import { API_ERROR_CODE, ApiError } from '@/shared/api/errors'
import {
  AppBar,
  BookCard,
  Button,
  EmptyState,
  PromptSugerido,
  SearchBar,
} from '@/shared/components'
import { useTheme } from '@/shared/theme/theme-provider'
import { pluralize } from '@/shared/utils/plural'
import {
  authorsLine,
  bookCardMeta,
  bookCoverTone,
  bookStatus,
} from '../catalog.format'
import { useBookSearch } from '../hooks/use-book-search'

// Larguras das linhas de cada cartão de carregamento, como no Figma (A53).
const SKELETON_LINES = [
  { title: 'w-[200px]', byline: 'w-[130px]' },
  { title: 'w-[170px]', byline: 'w-[110px]' },
  { title: 'w-[220px]', byline: 'w-[150px]' },
]

// Distância do fim da lista (em px) que já carrega a próxima página.
const LOAD_MORE_THRESHOLD = 300

// Pergunta pronta da busca sem resultado (A11): o Assistente busca e, se não
// achar no acervo, sugere parecidos.
function noResultQuestion(term: string): string {
  return `Procure livros sobre ${term}. Se não tiver no acervo, sugira parecidos.`
}

function isNearEnd({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) {
  const { layoutMeasurement, contentOffset, contentSize } = nativeEvent
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - LOAD_MORE_THRESHOLD
  )
}

// Acervo do aluno (RF-ACE-01, RF-ACE-06 e RF-ACE-08): busca por título, autor ou
// assunto no GET /books. Estados do Figma: resultados (A09), nenhum resultado
// (A11), carregando (A53) e sem internet (A54).
export function CatalogScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const params = useLocalSearchParams<{ q?: string }>()
  const [text, setText] = useState(params.q ?? '')
  // A busca do Início abre esta aba com ?q=, e a aba pode já estar montada:
  // um ?q= novo troca o texto da busca.
  const [lastParam, setLastParam] = useState(params.q)
  if (params.q !== lastParam) {
    setLastParam(params.q)
    if (params.q !== undefined) setText(params.q)
  }
  const search = useBookSearch(text)

  const offline =
    search.error instanceof ApiError &&
    (search.error.code === API_ERROR_CODE.networkError ||
      search.error.code === API_ERROR_CODE.timeout)
  const searching = search.searchedText !== ''

  function openBook(id: string) {
    router.push({ pathname: '/book-details', params: { id } })
  }

  // Abre o Assistente já perguntando (a aba lê ?q= uma vez ao abrir).
  function askAssistant(term: string) {
    router.push({
      pathname: '/assistant',
      params: { q: noResultQuestion(term) },
    })
  }

  function loadMore(event: NativeSyntheticEvent<NativeScrollEvent>) {
    if (search.hasNextPage && !search.isFetchingNextPage && isNearEnd(event)) {
      void search.fetchNextPage()
    }
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Acervo" large />
      <View className="px-4 pb-3 pt-1">
        <SearchBar value={text} onChangeText={setText} />
      </View>

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-4 pb-4"
        onScroll={loadMore}
        scrollEventThrottle={200}
      >
        {search.isPending ? (
          /* A53 — CARREGANDO */
          <View accessibilityLabel="Carregando acervo" className="gap-3">
            <View className="h-3.5 w-[180px] rounded-sm bg-surface-sunken" />
            {SKELETON_LINES.map((lines, item) => (
              <View
                key={item}
                className="flex-row gap-3 rounded-lg border border-line bg-surface-raised p-4"
              >
                <View className="h-[80px] w-14 rounded-sm bg-surface-sunken" />
                <View className="flex-1 gap-2.5">
                  <View
                    className={`h-4 rounded-sm bg-surface-sunken ${lines.title}`}
                  />
                  <View
                    className={`h-3 rounded-sm bg-surface-sunken ${lines.byline}`}
                  />
                  <View className="h-[22px] w-[90px] rounded-pill bg-surface-sunken" />
                </View>
              </View>
            ))}
          </View>
        ) : search.isError ? (
          offline ? (
            /* A54 — SEM INTERNET */
            <View className="items-center">
              <EmptyState
                icon="wifiOff"
                title="Você está sem internet"
                text="Confira o Wi-Fi ou os dados móveis. O QR de retirada continua funcionando sem conexão."
                action={
                  <Button icon="refresh" onPress={() => void search.refetch()}>
                    Tentar de novo
                  </Button>
                }
              />
              <Button
                variant="ghost"
                icon="qr"
                onPress={() => router.push('/loans')}
              >
                Ver QR de retirada
              </Button>
            </View>
          ) : (
            <EmptyState
              icon="alert"
              title="Não foi possível buscar"
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
          )
        ) : search.books.length === 0 ? (
          searching ? (
            /* A11 — NENHUM RESULTADO */
            <View className="gap-4">
              <EmptyState
                icon="books"
                title={`Nenhum resultado para “${search.searchedText}”`}
                text="Confira a ortografia, use menos palavras ou busque pelo nome do autor."
                // Os dois botões abrem o Assistente já com a pergunta enviada (RF-ACE-06).
                action={
                  <Button
                    variant="secondary"
                    icon="sparkle"
                    onPress={() => askAssistant(search.searchedText)}
                  >
                    Perguntar ao Assistente
                  </Button>
                }
              />
              <PromptSugerido
                text={`“${noResultQuestion(search.searchedText)}”`}
                onPress={() => askAssistant(search.searchedText)}
              />
            </View>
          ) : (
            <EmptyState icon="books" title="O acervo está vazio" />
          )
        ) : (
          /* A09 — RESULTADOS */
          <View className="gap-3">
            <Text className="text-caption text-ink-muted">
              {searching
                ? `${pluralize(search.total, 'resultado', 'resultados')} para “${search.searchedText}”`
                : `${pluralize(search.total, 'livro', 'livros')} no acervo`}
            </Text>
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
            {search.isFetchingNextPage ? (
              <ActivityIndicator
                accessibilityLabel="Carregando mais livros"
                color={colors.brand}
              />
            ) : null}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
