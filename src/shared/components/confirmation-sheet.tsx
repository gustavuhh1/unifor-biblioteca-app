import { Modal, Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '@/shared/theme/theme-provider'
import { useReducedMotion } from '@/shared/theme/use-reduced-motion'
import { Button } from './button'
import type { ReactNode } from 'react'

export function ConfirmationSheet({ visible, title, description, onCancel, onConfirm, confirmText = 'Confirmar', cancelText = 'Cancelar', children, hideCancel = false, danger = false }: {
  visible: boolean; title: string; description: string; onCancel: () => void; onConfirm: () => void;
  confirmText?: string; cancelText?: string; children?: ReactNode; hideCancel?: boolean; danger?: boolean
}) {
  const { colors } = useTheme()
  const safe = useSafeAreaInsets()
  const reducedMotion = useReducedMotion()
  return <Modal visible={visible} transparent animationType={reducedMotion ? "none" : "fade"} onRequestClose={onCancel}>
    <View className="flex-1 justify-end">
      <Pressable accessibilityRole="button" accessibilityLabel="Cancelar confirmação" onPress={onCancel} className="absolute inset-0" style={{ backgroundColor: colors.scrim }} />
      <View accessibilityViewIsModal className="max-h-[85%] rounded-t-sheet bg-surface-raised p-4" style={{ paddingBottom: Math.max(safe.bottom, 16) }}>
        <View className="mb-4 items-center"><View className="h-1 w-[36px] rounded-pill bg-line-strong" /></View>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: 16 }}>
          <Text accessibilityRole="header" className="text-title text-ink">{title}</Text>
          <Text className="text-body text-ink-muted">{description}</Text>
          {children}
          <Button block variant={danger ? 'danger' : 'primary'} onPress={onConfirm}>{confirmText}</Button>
          {!hideCancel ? <Button block variant="ghost" onPress={onCancel}>{cancelText}</Button> : null}
        </ScrollView>
      </View>
    </View>
  </Modal>
}
