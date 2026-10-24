import { Pressable, TextInput, View } from 'react-native'
import { useTheme } from '../theme/theme-provider'
import { Icon } from './icon'

export interface ChatComposerProps {
  value?: string
  onChangeText?: (text: string) => void
  placeholder?: string
  onSend?: () => void
  disabled?: boolean
}

// Campo de mensagem do Assistente, no rodapé da conversa (components.d.ts,
// ChatComposer).
export function ChatComposer({
  value,
  onChangeText,
  placeholder = 'Pergunte sobre livros ou empréstimos',
  onSend,
  disabled = false,
}: ChatComposerProps) {
  const { colors } = useTheme()
  const empty = !value?.trim()
  return (
    <View className="flex-row items-center gap-2 border-t border-line bg-surface-raised px-3 py-2">
      <View className="min-h-[48px] flex-1 justify-center rounded-pill bg-surface-sunken px-4">
        <TextInput
          accessibilityLabel={placeholder}
          className="text-body py-0 text-ink"
          editable={!disabled}
          multiline
          placeholder={placeholder}
          placeholderTextColor={colors.inkMuted}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Enviar"
        accessibilityState={{ disabled: disabled || empty }}
        className={`size-[44px] items-center justify-center rounded-pill ${
          disabled || empty ? 'bg-surface-sunken' : 'bg-brand'
        }`}
        disabled={disabled || empty}
        onPress={onSend}
      >
        <Icon
          name="send"
          size={20}
          color={disabled || empty ? 'inkFaint' : 'onBrand'}
        />
      </Pressable>
    </View>
  )
}
