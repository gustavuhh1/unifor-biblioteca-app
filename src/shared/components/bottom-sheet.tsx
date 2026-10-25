import type { ReactNode } from 'react'
import { Modal, Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export interface BottomSheetProps {
  visible: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}

// Folha modal para ações secundárias e alternativas de acesso.
export function BottomSheet({
  visible,
  title,
  description,
  onClose,
  children,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets()

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          onPress={onClose}
          className="absolute inset-0 bg-scrim"
        />
        <View
          accessibilityViewIsModal
          className="max-h-[85%] rounded-t-sheet bg-surface-raised px-5 pt-2"
          style={{ paddingBottom: Math.max(insets.bottom, 24) }}
        >
          <View className="mb-4 h-1.5 w-9 self-center rounded-pill bg-line" />
          <ScrollView
            bounces={false}
            contentContainerClassName="gap-4 pb-2"
            keyboardShouldPersistTaps="handled"
          >
            <Text accessibilityRole="header" className="text-title text-ink">
              {title}
            </Text>
            {description ? (
              <Text className="text-body text-ink-muted">{description}</Text>
            ) : null}
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}
