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
  FineCard,
  Icon,
  Toggle,
} from '@/shared/components'
import { ConfirmationSheet } from '@/shared/components/confirmation-sheet'
import { useTheme } from '@/shared/theme/theme-provider'
import { formatDayMonth } from '@/shared/utils/dates'
import { formatCents } from '@/shared/utils/money'
import {
  coverToneOfTitle,
  firstName,
  returnConfirmationText,
  returnFineText,
  withStudentChip,
} from '../desk.format'
import { useDeskStudent } from '../hooks/use-desk-student'
import { useRegisterReturn } from '../hooks/use-register-return'

// O que a tela mostra depois de registrar: a ficha é relida e o livro deixa de
// estar "com o aluno", então o texto fica guardado aqui.
interface Returned {
  bookTitle: string
  studentName: string
}

// Registrar devolução (B06, RF-BAL-04 e RF-BAL-08): recebe o livro que está com o
// aluno (POST /librarian/loans/{loanId}/return). Com multa, o bibliotecário marca
// "Multa paga agora" depois de receber o valor no balcão. O 1º da fila é avisado
// na hora.
export function RegisterReturnScreen() {
  const router = useRouter()
  const safe = useSafeAreaInsets()
  const { colors } = useTheme()
  const { loanId, matricula } = useLocalSearchParams<{
    loanId: string
    matricula: string
  }>()
  const record = useDeskStudent(matricula)
  const register = useRegisterReturn()
  const [finePaidNow, setFinePaidNow] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [returned, setReturned] = useState<Returned | null>(null)

  const loan = record.data?.withStudent.find((item) => item.id === loanId)

  function confirm() {
    if (!loan || !record.data) return
    const snapshot = {
      bookTitle: loan.bookTitle,
      studentName: record.data.student.name,
    }
    setConfirming(false)
    register.mutate(
      { loanId: loan.id, finePaidNow: loan.fine ? finePaidNow : false },
      { onSuccess: () => setReturned(snapshot) },
    )
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Registrar devolução" back />
      {returned && register.data ? (
        <View className="flex-1 gap-4 p-4">
          <Alert tone="success" title="Devolução registrada">
            {`${returned.bookTitle}, de ${firstName(returned.studentName)}. ${returnFineText(register.data.fine)}`}
          </Alert>
          {register.data.queueNotified ? (
            <View className="flex-row gap-3 rounded-lg bg-brand-soft p-4">
              <Icon name="users" color="brand" />
              <Text className="flex-1 text-body text-ink">
                O 1º da fila deste livro foi avisado na hora e tem 24h para
                confirmar.
              </Text>
            </View>
          ) : null}
          <Button block onPress={() => router.back()}>
            Voltar à ficha do aluno
          </Button>
        </View>
      ) : record.isPending ? (
        <View
          accessibilityLabel="Carregando o empréstimo"
          className="flex-1 items-center justify-center"
        >
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : record.isError ? (
        <EmptyState
          icon="alert"
          title="Não foi possível abrir o empréstimo"
          text={
            record.error instanceof ApiError ? record.error.message : undefined
          }
          action={
            <Button icon="refresh" onPress={() => void record.refetch()}>
              Tentar de novo
            </Button>
          }
        />
      ) : !loan ? (
        <EmptyState
          icon="inbox"
          title="Este livro não está mais com o aluno"
          text="Abra a ficha do aluno de novo para ver os livros de agora."
          action={<Button onPress={() => router.back()}>Voltar</Button>}
        />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}
          >
            <View className="flex-row gap-3 rounded-lg border border-line bg-surface-raised p-4">
              <BookCover
                title={loan.bookTitle}
                tone={coverToneOfTitle(loan.bookTitle)}
                size="sm"
              />
              <View className="min-w-0 flex-1 gap-2">
                <Text className="text-book-title text-ink">
                  {loan.bookTitle}
                </Text>
                <Text className="text-caption text-ink-muted">
                  Com {record.data.student.name} ·{' '}
                  {record.data.student.matricula}
                </Text>
                <Text className="text-caption text-ink-muted">
                  {loan.pickedUpAt
                    ? `Retirado ${formatDayMonth(loan.pickedUpAt)}`
                    : null}
                  {loan.pickedUpAt && loan.dueAt ? ' · ' : null}
                  {loan.dueAt
                    ? `${loan.fine ? 'venceu' : 'vence'} ${formatDayMonth(loan.dueAt)}`
                    : null}
                </Text>
                <View className="flex-row">
                  <DeadlineChip kind={withStudentChip(loan).kind}>
                    {withStudentChip(loan).text}
                  </DeadlineChip>
                </View>
              </View>
            </View>
            {loan.fine ? (
              <>
                <FineCard
                  amount={formatCents(loan.fine.amountCents)}
                  daysLate={loan.fine.businessDaysLate}
                  book={`${loan.bookTitle}${loan.dueAt ? ` · venceu em ${formatDayMonth(loan.dueAt)}` : ''}`}
                  note="Cobrar no balcão ao registrar a devolução"
                  showPayment={false}
                />
                <View className="gap-1 rounded-lg border border-line bg-surface-raised p-4">
                  <Toggle
                    label={`Multa paga agora (${formatCents(loan.fine.amountCents)})`}
                    checked={finePaidNow}
                    onChange={setFinePaidNow}
                  />
                  <Text className="text-caption text-ink-muted">
                    Pagamento só presencial. Marque depois de receber o valor.
                  </Text>
                </View>
              </>
            ) : null}
            {register.isError ? (
              <Alert
                tone="danger"
                title="Não foi possível registrar a devolução"
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
              onPress={() => setConfirming(true)}
            >
              Registrar devolução
            </Button>
            <Button block variant="ghost" onPress={() => router.back()}>
              Cancelar
            </Button>
          </View>
          <ConfirmationSheet
            visible={confirming}
            title="Confirmar devolução?"
            description={returnConfirmationText(
              loan.bookTitle,
              loan.fine ? loan.fine.amountCents : null,
              finePaidNow,
            )}
            confirmText="Registrar devolução"
            onCancel={() => setConfirming(false)}
            onConfirm={confirm}
          />
        </>
      )}
    </View>
  )
}
