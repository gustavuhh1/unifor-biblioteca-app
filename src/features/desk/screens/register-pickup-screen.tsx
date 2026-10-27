import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ApiError } from '@/shared/api/errors'
import {
  Alert,
  AppBar,
  BookCover,
  Button,
  DeadlineChip,
  EmptyState,
  Icon,
} from '@/shared/components'
import { ConfirmationSheet } from '@/shared/components/confirmation-sheet'
import { useTheme } from '@/shared/theme/theme-provider'
import {
  coverToneOfTitle,
  dueLabel,
  firstName,
  isLastPickupDay,
  isPickupBlocked,
  pickupDeadlineLabel,
} from '../desk.format'
import { useDeskStudent } from '../hooks/use-desk-student'
import { useRegisterPickup } from '../hooks/use-register-pickup'

// O que a tela mostra depois de registrar: a ficha é relida e o pedido deixa de
// estar na lista, então o texto da confirmação fica guardado aqui.
interface Delivered {
  studentName: string
  bookTitle: string
}

// Registrar retirada (B05, RF-BAL-02): confere o pedido da ficha do aluno e
// registra a entrega do exemplar (POST /librarian/loans/{loanId}/pickup). O
// empréstimo de 14 dias começa a contar e a tela mostra o dia da devolução.
export function RegisterPickupScreen() {
  const router = useRouter()
  const safe = useSafeAreaInsets()
  const { colors } = useTheme()
  const { loanId, matricula } = useLocalSearchParams<{
    loanId: string
    matricula: string
  }>()
  const record = useDeskStudent(matricula)
  const register = useRegisterPickup()
  const [confirming, setConfirming] = useState(false)
  const [delivered, setDelivered] = useState<Delivered | null>(null)

  const pickup = record.data?.pickups.find((item) => item.id === loanId)
  const blocked = record.data ? isPickupBlocked(record.data) : false

  function confirm() {
    if (!pickup || !record.data) return
    const studentName = record.data.student.name
    setConfirming(false)
    register.mutate(pickup.id, {
      onSuccess: () =>
        setDelivered({ studentName, bookTitle: pickup.bookTitle }),
    })
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Registrar retirada" back />
      {delivered && register.data ? (
        <View className="flex-1 gap-4 p-4">
          <Alert tone="success" title="Retirada registrada">
            {`${delivered.bookTitle} está com ${firstName(delivered.studentName)}. ${dueLabel(register.data.loan.dueAt) ?? ''}`.trim()}
          </Alert>
          <Button block onPress={() => router.back()}>
            Voltar à ficha do aluno
          </Button>
        </View>
      ) : record.isPending ? (
        <View
          accessibilityLabel="Carregando o pedido"
          className="flex-1 items-center justify-center"
        >
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : record.isError ? (
        <EmptyState
          icon="alert"
          title="Não foi possível abrir o pedido"
          text={
            record.error instanceof ApiError ? record.error.message : undefined
          }
          action={
            <Button icon="refresh" onPress={() => void record.refetch()}>
              Tentar de novo
            </Button>
          }
        />
      ) : !pickup ? (
        <EmptyState
          icon="inbox"
          title="Este pedido não está mais aguardando retirada"
          text="Abra a ficha do aluno de novo para ver os pedidos de agora."
          action={<Button onPress={() => router.back()}>Voltar</Button>}
        />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}
          >
            <View className="flex-row gap-3 rounded-lg bg-success-soft p-4">
              <Icon name="qr" color="success" />
              <View className="flex-1 gap-1">
                <Text className="text-label text-ink">
                  {pickup.scanned ? 'QR lido' : 'Pedido'}:{' '}
                  {pickup.pickupCode ?? pickup.id}
                </Text>
                <Text className="text-body text-ink-muted">
                  {blocked
                    ? 'O aluno tem livro em atraso. Registre a devolução antes de entregar.'
                    : 'Pedido confirmado e sem pendências. Entregue o exemplar e registre.'}
                </Text>
              </View>
            </View>
            <View className="gap-4 rounded-lg border border-line bg-surface-raised p-4">
              <Text className="text-label text-ink">
                {record.data.student.name}
              </Text>
              <Text className="text-caption text-ink-muted">
                Matrícula {record.data.student.matricula}
              </Text>
              <View className="flex-row gap-3">
                <BookCover
                  title={pickup.bookTitle}
                  tone={coverToneOfTitle(pickup.bookTitle)}
                  size="md"
                />
                <View className="min-w-0 flex-1 gap-2">
                  <Text className="text-book-title text-ink">
                    {pickup.bookTitle}
                  </Text>
                  <Text className="text-caption text-ink-muted">
                    Estante {pickup.bookShelf}
                  </Text>
                  <View className="flex-row">
                    <DeadlineChip
                      kind={
                        isLastPickupDay(pickup.pickupDeadline)
                          ? 'vence'
                          : 'retirar'
                      }
                    >
                      {pickupDeadlineLabel(pickup.pickupDeadline)}
                    </DeadlineChip>
                  </View>
                </View>
              </View>
            </View>
            <View className="rounded-md bg-brand-soft p-4">
              <Text className="text-caption text-ink">
                O empréstimo de 14 dias começa a contar quando você registra a
                entrega.
              </Text>
            </View>
            {register.isError ? (
              <Alert
                tone="danger"
                title="Não foi possível registrar a retirada"
              >
                {register.error instanceof ApiError
                  ? register.error.message
                  : 'Tente de novo.'}
              </Alert>
            ) : null}
          </ScrollView>
          <View
            className="gap-2 border-t border-line bg-surface-raised px-4 pt-3"
            style={{ paddingBottom: Math.max(safe.bottom, 16) }}
          >
            <Button
              block
              icon="check"
              loading={register.isPending}
              disabled={blocked}
              onPress={() => setConfirming(true)}
            >
              Registrar entrega
            </Button>
            <Button block variant="ghost" onPress={() => router.back()}>
              Cancelar
            </Button>
          </View>
          <ConfirmationSheet
            visible={confirming}
            title="Confirmar retirada?"
            description={`Entregue ${pickup.bookTitle} a ${firstName(record.data.student.name)}. O empréstimo de 14 dias começa a contar agora.`}
            confirmText="Registrar entrega"
            onCancel={() => setConfirming(false)}
            onConfirm={confirm}
          />
        </>
      )}
    </View>
  )
}
