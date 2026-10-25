import { Pressable, ScrollView, Text, View } from 'react-native'
import { AppBar, Icon } from '@/shared/components'

const FOLDERS = [
  {
    id: 'all',
    name: 'Todos os salvos',
    count: 6,
    covers: ['cover-2', 'cover-4', 'cover-3', 'cover-1'],
  },
  {
    id: 'later',
    name: 'Ler depois',
    count: 2,
    covers: ['cover-4', 'cover-1', 'cover-2', 'cover-3'],
  },
  {
    id: 'loved',
    name: 'Amei!!!',
    count: 3,
    covers: ['cover-2', 'cover-3', 'cover-1', 'cover-4'],
  },
  {
    id: 'thesis',
    name: 'TCC',
    count: 4,
    covers: ['cover-1', 'cover-2', 'cover-3', 'cover-4'],
  },
] as const
const COVER_CLASS = {
  'cover-1': 'bg-cover-1',
  'cover-2': 'bg-cover-2',
  'cover-3': 'bg-cover-3',
  'cover-4': 'bg-cover-4',
} as const

function FolderCard({ folder }: { folder: (typeof FOLDERS)[number] }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${folder.name}, ${folder.count} livros`}
      className="w-[48%] gap-2"
    >
      <View className="h-36 overflow-hidden rounded-md">
        <View className="flex-1 flex-row">
          <View className={`flex-1 ${COVER_CLASS[folder.covers[0]]}`} />
          <View className={`flex-1 ${COVER_CLASS[folder.covers[1]]}`} />
        </View>
        <View className="flex-1 flex-row">
          <View className={`flex-1 ${COVER_CLASS[folder.covers[2]]}`} />
          <View className={`flex-1 ${COVER_CLASS[folder.covers[3]]}`} />
        </View>
      </View>
      <Text className="text-label text-ink" numberOfLines={1}>
        {folder.name}
      </Text>
      <Text className="text-caption text-ink-muted">{folder.count} livros</Text>
    </Pressable>
  )
}

// Destino visual do atalho Salvos nos perfis A47 e A50.
export function SavedScreen() {
  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Salvos" back />
      <ScrollView contentContainerClassName="gap-6 px-4 pb-8 pt-3">
        <Text className="text-body text-ink-muted">
          Só você vê seus salvos. Um livro pode estar em mais de uma pasta.
        </Text>
        <View className="flex-row flex-wrap justify-between gap-y-5">
          {FOLDERS.map((folder) => (
            <FolderCard key={folder.id} folder={folder} />
          ))}
          <View className="w-[48%] gap-2">
            <View className="h-36 items-center justify-center gap-3 rounded-md border-2 border-dashed border-line-strong bg-surface-raised">
              <Icon name="plus" color="brand" size={30} />
              <Text className="text-label text-brand">Nova pasta</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
