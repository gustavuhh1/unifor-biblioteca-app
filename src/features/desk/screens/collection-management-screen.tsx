import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { AppBar, BottomSheet, Button, Icon } from '@/shared/components'

type ManagedBook = {
  title: string
  author: string
  coverTitle: string
  meta: string
  status: string
  tone: 'warning' | 'success'
}

const BOOKS: ManagedBook[] = [
  {
    title: 'Código Limpo: Habilidades Práticas do Agile Software',
    author: 'Robert C. Martin',
    coverTitle: 'Código\nLimpo',
    meta: '3 exemplares · 1 pessoa na fila',
    status: 'EMPRESTADO',
    tone: 'warning',
  },
  {
    title: 'O Codificador Limpo',
    author: 'Robert C. Martin',
    coverTitle: 'O\nCodificador\nLimpo',
    meta: '2 exemplares · Estante 005.1',
    status: 'DISPONÍVEL',
    tone: 'success',
  },
  {
    title: 'Arquitetura Limpa',
    author: 'Robert C. Martin',
    coverTitle: 'Arquitetura\nLimpa',
    meta: '1 exemplar · 4 na fila · Indisponível para novos pedidos',
    status: 'EMPRESTADO',
    tone: 'warning',
  },
]

function ManagedBookCard({ book, onEdit, onRemove }: { book: ManagedBook; onEdit: () => void; onRemove: () => void }) {
  return (
    <View className="gap-2">
      <View className="flex-row gap-3 rounded-lg border border-line bg-surface-raised p-3 shadow-sm">
        <View className="h-[124px] w-[86px] justify-between overflow-hidden rounded-md bg-[#102f78] p-2.5">
          <Text className="font-serif text-label text-white">
            {book.coverTitle}
          </Text>
          <View>
            <Text className="text-micro-strong text-white">ROBERT C.</Text>
            <Text className="text-micro-strong text-white">MARTIN</Text>
          </View>
          <View className="absolute -bottom-5 -right-4 size-16 rounded-pill border-2 border-white/20" />
        </View>
        <View className="min-w-0 flex-1 gap-1">
          <Text className="font-serif text-title text-ink" numberOfLines={2}>
            {book.title}
          </Text>
          <Text className="text-caption text-ink-muted">{book.author}</Text>
          <Text className="text-caption text-ink-muted">{book.meta}</Text>
          <View
            className={`mt-1 flex-row items-center gap-1 self-start rounded-sm px-2 py-1 ${book.tone === 'warning' ? 'bg-warning-soft' : book.tone === 'success' ? 'bg-success-soft' : 'bg-surface-sunken'}`}
          >
            <Icon
              name={book.tone === 'success' ? 'check' : 'clock'}
              size={14}
              color={book.tone === 'warning' ? 'warning' : book.tone}
            />
            <Text
              className={`text-micro-strong ${book.tone === 'warning' ? 'text-warning' : book.tone === 'success' ? 'text-success' : 'text-ink-muted'}`}
            >
              {book.status}
            </Text>
          </View>
        </View>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onEdit}
        className="min-h-8 flex-row items-center justify-end gap-1 px-3"
      >
        <Icon name="pencil" size={17} color="brand" />
        <Text className="text-label-sm text-brand">Editar</Text>
      </Pressable>
      {book.title === 'O Codificador Limpo' ? (
        <Pressable accessibilityRole="button" onPress={onRemove} className="min-h-8 self-end px-3">
          <Text className="text-caption text-danger">Remover do acervo</Text>
        </Pressable>
      ) : null}
    </View>
  )
}

// B20: gerenciamento visual do acervo; pesquisa, filtros e edição serão ligados depois.
export function CollectionManagementScreen() {
  const router = useRouter()
  const [removeVisible, setRemoveVisible] = useState(false)
  const filters = ['Todos', 'Emprestados', 'Sem ISBN', 'Com fila']

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Acervo"
        subtitle="Gestão dos livros da biblioteca"
        back
        actions={[{ icon: 'plus', label: 'Adicionar livro', onPress: () => router.push('/new-book') }]}
      />
      <ScrollView contentContainerClassName="gap-3 px-4 pb-5 pt-2">
        <View className="flex-row items-center gap-2">
          <View className="h-12 flex-1 flex-row items-center gap-2 rounded-pill border border-line bg-surface-raised px-4">
            <Icon name="search" size={20} color="inkMuted" />
            <TextInput
              accessibilityLabel="Buscar título, autor ou ISBN"
              placeholder="Buscar título, autor ou ISBN"
              className="flex-1 p-0 text-body text-ink"
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Filtros"
            className="size-12 items-center justify-center rounded-pill border border-line bg-surface-raised"
          >
            <Icon name="filter" size={20} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2"
        >
          {filters.map((filter, index) => (
            <View
              key={filter}
              className={`h-9 items-center justify-center rounded-pill border px-3 ${index === 0 ? 'border-brand bg-brand-soft' : 'border-line bg-surface-raised'}`}
            >
              <Text
                className={`text-label-sm ${index === 0 ? 'text-brand' : 'text-ink'}`}
              >
                {filter}
              </Text>
            </View>
          ))}
        </ScrollView>

        {BOOKS.map((book) => (
          <ManagedBookCard key={book.title} book={book} onEdit={() => router.push('/edit-book')} onRemove={() => setRemoveVisible(true)} />
        ))}
      </ScrollView>
      <BottomSheet visible={removeVisible} title="Remover O Codificador Limpo do acervo?" description="O livro some da busca dos alunos. O histórico de empréstimos é mantido." onClose={() => setRemoveVisible(false)}>
        <View className="flex-row items-start gap-3 rounded-md bg-brand-soft p-4">
          <Icon name="info" size={20} color="brandStrong" />
          <Text className="flex-1 text-body-sm text-ink">Só dá para remover livros sem exemplar emprestado e sem fila.</Text>
        </View>
        <Button block variant="danger" icon="trash" onPress={() => setRemoveVisible(false)}>Remover livro</Button>
        <Button block variant="ghost" onPress={() => setRemoveVisible(false)}>Cancelar</Button>
      </BottomSheet>
    </View>
  )
}
