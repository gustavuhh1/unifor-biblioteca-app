import { useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import {
  Alert,
  AppBar,
  Button,
  ConfirmationSheet,
  Icon,
  QRPass,
} from '@/shared/components'

// O pedido que o QR carrega. Vem da API (GET /me/loans): `qrToken` é o segredo que
// o leitor do balcão confere e `pickupCode` é o código digitado sem QR (RF-EMP-07).
export interface PickupPass {
  qrToken: string
  pickupCode: string
  matricula: string
  studentName: string
  bookTitle: string
  author?: string
  // "até seg, 19/10".
  deadline: string
}

// Exemplo da demonstração, enquanto a tela não lê o pedido da API.
const DEMO_PASS: PickupPass = {
  qrToken: 'q9Zr0bH6v3S1kT8xY2mW4pLc',
  pickupCode: 'RET-4821',
  matricula: '2412858',
  studentName: 'Lucas Almeida',
  bookTitle: 'Código Limpo',
  author: 'Robert C. Martin',
  deadline: 'até seg, 19/10',
}

export interface PickupQrScreenProps {
  pass?: PickupPass
  // Abre já com a pergunta "Cancelar o pedido?" (A69).
  askToCancel?: boolean
  onBack?: () => void
  onCancelOrder?: () => void
}

// Retirada (A25): o QR que o aluno mostra no balcão. É gerado no aparelho, então
// aparece mesmo sem internet (RF-EMP-07, RNF-CON-01).
export function PickupQrScreen({
  pass = DEMO_PASS,
  askToCancel = false,
  onBack,
  onCancelOrder,
}: PickupQrScreenProps) {
  const [confirmingCancel, setConfirmingCancel] = useState(askToCancel)

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Retirada" back onBack={onBack} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-4 pb-8 pt-1"
      >
        <Alert tone="success" title="Pedido confirmado">
          Mostre este QR no balcão da biblioteca. O empréstimo de 14 dias começa
          quando você pegar o livro.
        </Alert>

        <QRPass
          value={pass.qrToken}
          code={pass.pickupCode}
          matricula={pass.matricula}
          name={pass.studentName}
          book={pass.bookTitle}
          author={pass.author}
          expires={pass.deadline}
        />

        <View className="flex-row items-start gap-2.5 rounded-md bg-surface-sunken px-3.5 py-3">
          <Icon name="keyboard" size={18} color="inkMuted" />
          <Text className="text-caption flex-1 text-ink-muted">
            Sem QR? Diga sua matrícula {pass.matricula} ou o código{' '}
            {pass.pickupCode} ao bibliotecário.
          </Text>
        </View>

        <Button
          block
          variant="secondary"
          onPress={() => setConfirmingCancel(true)}
        >
          Cancelar pedido
        </Button>
      </ScrollView>

      <ConfirmationSheet
        visible={confirmingCancel}
        danger
        title={`Cancelar o pedido de ${pass.bookTitle}?`}
        description="O exemplar volta para a estante ou segue para o próximo da fila. Você pode pedir de novo depois."
        confirmText="Cancelar pedido"
        cancelText="Manter pedido"
        onCancel={() => setConfirmingCancel(false)}
        onConfirm={() => {
          setConfirmingCancel(false)
          onCancelOrder?.()
        }}
      />
    </View>
  )
}
