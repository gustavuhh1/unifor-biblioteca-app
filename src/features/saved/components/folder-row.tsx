import { Pressable, Text, View } from 'react-native'
import { Icon, type IconName } from '@/shared/components'
import { bookCountText } from '../saved.format'

interface FolderRowProps {
  name: string
  count: number
  icon?: IconName
  // A última linha da lista não leva divisória embaixo.
  last?: boolean
  onPress: () => void
}

// Linha de uma pasta de Salvos (A18): ícone, nome e quantidade de livros.
// O design system não tem FolderCard em código; esta é a versão da feature.
export function FolderRow({
  name,
  count,
  icon = 'folder',
  last = false,
  onPress,
}: FolderRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, ${bookCountText(count)}`}
      onPress={onPress}
      className={`min-h-[56px] flex-row items-center gap-3 px-4 py-3 ${last ? '' : 'border-b border-line'}`}
    >
      <View className="h-10 w-10 items-center justify-center rounded-md bg-brand-soft">
        <Icon name={icon} color="brand" size={20} />
      </View>
      <View className="min-w-0 flex-1 gap-0.5">
        <Text numberOfLines={1} className="text-label text-ink">
          {name}
        </Text>
        <Text className="text-caption text-ink-muted">
          {bookCountText(count)}
        </Text>
      </View>
      <Icon name="chevronRight" color="inkMuted" size={18} />
    </Pressable>
  )
}
