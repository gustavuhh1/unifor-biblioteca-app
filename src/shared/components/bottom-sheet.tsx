import type { ReactNode } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from '../theme/theme-provider'
import { useReducedMotion } from '../theme/use-reduced-motion'

export interface BottomSheetProps {
  // Controla se a folha está aberta (a tela guarda esse estado).
  visible: boolean
  // Fechar sem decidir: toque no fundo escuro ou botão voltar do Android.
  onClose: () => void
  title?: string
  text?: string
  children?: ReactNode
  // Os botões da decisão: o primário primeiro e "Agora não" depois.
  actions?: ReactNode
}

// Folha de confirmação (components.d.ts, BottomSheet). Toda decisão do app
// (solicitar, cancelar, sair da fila, renovar, remover, registrar devolução ou
// pagamento) passa por ela (RNF-USA-05).
export function BottomSheet({
  visible,
  onClose,
  title,
  text,
  children,
  actions,
}: BottomSheetProps) {
  const { shadows } = useTheme()
  const insets = useSafeAreaInsets()
  // Quem pediu menos animação no celular não vê a folha deslizar.
  const reducedMotion = useReducedMotion()
  return (
    <Modal
      animationType={reducedMotion ? 'none' : 'slide'}
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Fechar"
          className="absolute inset-0 bg-scrim"
          onPress={onClose}
        />
        <View
          accessibilityViewIsModal
          className="gap-4 rounded-t-sheet bg-surface-raised px-5 pt-2"
          style={{
            boxShadow: shadows.sheet,
            paddingBottom: Math.max(insets.bottom, 24),
          }}
        >
          <View className="items-center">
            <View className="h-[5px] w-10 rounded-pill bg-line" />
          </View>
          {title ? (
            <Text accessibilityRole="header" className="text-title text-ink">
              {title}
            </Text>
          ) : null}
          {text ? (
            <Text className="text-body text-ink-muted">{text}</Text>
          ) : null}
          {children}
          {actions ? <View className="gap-2">{actions}</View> : null}
        </View>
      </View>
    </Modal>
  )
}
