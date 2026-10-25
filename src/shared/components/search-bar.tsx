import { Pressable, TextInput, View } from 'react-native'
import type { TextInputProps } from 'react-native'
import { useTheme } from '../theme/theme-provider'
import { Icon } from './icon'

export interface SearchBarProps extends Pick<
  TextInputProps,
  'value' | 'onChangeText' | 'onSubmitEditing' | 'autoFocus'
> {
  placeholder?: string
  // O botão de filtros só existe no acervo do bibliotecário; no aluno a busca não
  // tem filtros (decisão de 18/10), então o padrão é escondê-lo.
  showFilter?: boolean
  filtersActive?: boolean
  onFilterPress?: () => void
}

// Busca do topo do Acervo (components.d.ts, SearchBar). No bibliotecário busca
// aluno por nome ou matrícula.
export function SearchBar({
  placeholder = 'Buscar título, autor ou assunto',
  showFilter = false,
  filtersActive = false,
  onFilterPress,
  ...input
}: SearchBarProps) {
  const { colors } = useTheme()
  return (
    <View className="flex-row items-center gap-2">
      <View className="h-12 flex-1 flex-row items-center gap-2 rounded-pill border-[1.5px] border-line bg-surface-raised px-4">
        <Icon name="search" size={20} color="inkMuted" />
        <TextInput
          accessibilityLabel={placeholder}
          className="text-body flex-1 py-0 text-ink"
          placeholder={placeholder}
          placeholderTextColor={colors.inkMuted}
          returnKeyType="search"
          {...input}
        />
      </View>
      {showFilter ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Filtros"
          accessibilityState={{ selected: filtersActive }}
          className={`size-12 items-center justify-center rounded-pill border-[1.5px] ${
            filtersActive
              ? 'border-brand bg-brand-soft'
              : 'border-line bg-surface-raised'
          }`}
          onPress={onFilterPress}
        >
          <Icon
            name="filter"
            size={20}
            color={filtersActive ? 'brandStrong' : 'ink'}
          />
        </Pressable>
      ) : null}
    </View>
  )
}
