import type { ReactNode } from 'react'
import { BottomSheet } from './bottom-sheet'
import { Button } from './button'

export interface ConfirmationSheetProps {
  visible: boolean
  title: string
  description: string
  onCancel: () => void
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
  // Conteúdo extra entre o texto e os botões (ex.: resumo do que muda).
  children?: ReactNode
  // Só o botão de confirmar (ex.: "Entendi").
  hideCancel?: boolean
  // Decisão destrutiva: o botão de confirmar fica vermelho.
  danger?: boolean
}

// Folha de confirmação de uma decisão (RNF-USA-05): o BottomSheet do design system
// com o botão de confirmar em cima e o "Agora não" embaixo.
export function ConfirmationSheet({
  visible,
  title,
  description,
  onCancel,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  children,
  hideCancel = false,
  danger = false,
}: ConfirmationSheetProps) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onCancel}
      title={title}
      text={description}
      actions={
        <>
          <Button
            block
            variant={danger ? 'danger' : 'primary'}
            onPress={onConfirm}
          >
            {confirmText}
          </Button>
          {hideCancel ? null : (
            <Button block variant="ghost" onPress={onCancel}>
              {cancelText}
            </Button>
          )}
        </>
      }
    >
      {children}
    </BottomSheet>
  )
}
