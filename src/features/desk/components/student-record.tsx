import { Pressable, Text, View } from 'react-native'
import {
  Alert,
  BookCover,
  Button,
  DeadlineChip,
  Icon,
} from '@/shared/components'
import { formatCents } from '@/shared/utils/money'
import {
  coverToneOfTitle,
  firstName,
  isLastPickupDay,
  isPickupBlocked,
  overdueCount,
  overdueText,
  pickupDeadlineLabel,
  studentLoansText,
  withStudentChip,
} from '../desk.format'
import type { DeskLookupResponse } from '../desk.types'

interface StudentRecordProps {
  record: DeskLookupResponse
  // Abre "Registrar retirada" do pedido.
  onPickup: (loanId: string) => void
  // Abre "Registrar devolução" do livro que está com o aluno.
  onReturn: (loanId: string) => void
}

// Ficha do aluno no balcão (B04 e B05, RF-BAL-02 e RF-BAL-03): quem é, os
// pedidos prontos para retirar e os livros que estão com ele. O QR ou o código
// marca o pedido que apontou. Livro atrasado bloqueia a retirada (RF-EMP-04).
export function StudentRecord({
  record,
  onPickup,
  onReturn,
}: StudentRecordProps) {
  const { student, pickups, withStudent } = record
  const blocked = isPickupBlocked(record)
  const overdue = overdueCount(record)

  return (
    <View className="gap-4">
      <View className="gap-1 rounded-lg border border-line bg-surface-raised p-4">
        <Text className="text-title-sm text-ink">{student.name}</Text>
        <Text className="text-caption text-ink-muted">
          Matrícula {student.matricula}
        </Text>
        <Text className="text-overline text-brand">
          {studentLoansText(student)}
          {overdue > 0 ? ` · ${overdueText(overdue)}` : ''}
        </Text>
        {student.openFineTotalCents > 0 ? (
          <Text className="text-caption text-ink-muted">
            Multa em aberto: {formatCents(student.openFineTotalCents)}
          </Text>
        ) : null}
      </View>

      {blocked ? (
        <Alert tone="danger" title="Empréstimos bloqueados">
          {`${firstName(student.name)} tem ${overdueText(overdue)}. Registre a devolução; até lá não pode retirar livros.`}
        </Alert>
      ) : null}

      <Text className="text-overline text-ink-muted">Pedidos para retirar</Text>
      {pickups.length === 0 ? (
        <Text className="text-body text-ink-muted">
          Nenhum pedido aguardando retirada.
        </Text>
      ) : (
        pickups.map((pickup) => (
          <View
            key={pickup.id}
            className="gap-3 rounded-lg border border-line bg-surface-raised p-3"
          >
            <View className="flex-row gap-3">
              <BookCover
                title={pickup.bookTitle}
                tone={coverToneOfTitle(pickup.bookTitle)}
                size="sm"
              />
              <View className="min-w-0 flex-1 gap-2">
                <Text className="text-book-title text-ink">
                  {pickup.bookTitle}
                </Text>
                <Text className="text-caption text-ink-muted">
                  Estante {pickup.bookShelf}
                  {pickup.pickupCode ? ` · ${pickup.pickupCode}` : ''}
                </Text>
                {pickup.scanned ? (
                  <View className="flex-row items-center gap-1">
                    <Icon name="qr" color="success" size={16} />
                    <Text className="text-caption-strong text-success">
                      Pedido lido agora
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
            <View className="flex-row">
              <DeadlineChip
                kind={
                  isLastPickupDay(pickup.pickupDeadline) ? 'vence' : 'retirar'
                }
              >
                {pickupDeadlineLabel(pickup.pickupDeadline)}
              </DeadlineChip>
            </View>
            <Button
              block
              icon="check"
              disabled={blocked}
              onPress={() => onPickup(pickup.id)}
            >
              Registrar retirada
            </Button>
          </View>
        ))
      )}

      <Text className="text-overline text-ink-muted">Com o aluno</Text>
      {withStudent.length === 0 ? (
        <Text className="text-body text-ink-muted">
          Nenhum livro com o aluno.
        </Text>
      ) : (
        <View className="overflow-hidden rounded-lg border border-line bg-surface-raised">
          {withStudent.map((loan) => {
            const chip = withStudentChip(loan)
            return (
              <Pressable
                key={loan.id}
                accessibilityRole="button"
                accessibilityLabel={`Registrar devolução de ${loan.bookTitle}`}
                onPress={() => onReturn(loan.id)}
                className="min-h-[44px] gap-2 border-b border-line p-3"
              >
                <View className="flex-row items-center justify-between gap-3">
                  <Text className="flex-1 text-book-title-sm text-ink">
                    {loan.bookTitle}
                  </Text>
                  <Icon name="chevronRight" color="inkMuted" size={18} />
                </View>
                <View className="flex-row items-center gap-3">
                  <DeadlineChip kind={chip.kind}>{chip.text}</DeadlineChip>
                  {loan.fine ? (
                    <Text className="text-caption text-danger">
                      Multa {formatCents(loan.fine.amountCents)}
                    </Text>
                  ) : null}
                </View>
              </Pressable>
            )
          })}
        </View>
      )}
    </View>
  )
}
