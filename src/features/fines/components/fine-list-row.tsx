import { Pressable, Text, View } from 'react-native'
import { Avatar } from '@/shared/components'
import { FINE_STATUS, type FineStatus } from '@/shared/types'
import { formatCents } from '@/shared/utils/money'
import { fineRowDetail } from '../fines.format'
import type { LibrarianFine } from '../fines.types'

// Cor do valor: em aberto em vermelho, contando em amarelo e paga em verde.
const AMOUNT_CLASS: Record<FineStatus, string> = {
  [FINE_STATUS.open]: 'text-danger',
  [FINE_STATUS.accruing]: 'text-warning',
  [FINE_STATUS.paid]: 'text-success',
}

interface FineListRowProps {
  fine: LibrarianFine
  // Só as multas em aberto abrem o detalhe para registrar o pagamento.
  onPress?: () => void
}

// Uma multa na lista da aba Multas (B13 a B15, RF-BAL-09): aluno, livro, valor e
// o que aconteceu com ela.
export function FineListRow({ fine, onPress }: FineListRowProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={`${fine.studentName}, ${fine.bookTitle}, ${formatCents(fine.amountCents)}`}
      disabled={!onPress}
      onPress={onPress}
      className="min-h-[44px] flex-row gap-3 border-b border-line p-4"
    >
      <Avatar name={fine.studentName} />
      <View className="min-w-0 flex-1 gap-1">
        <Text className="text-label text-ink">{fine.studentName}</Text>
        <Text className="text-caption text-ink-muted">
          {`${fine.matricula} · ${fine.bookTitle}`}
        </Text>
      </View>
      <View className="items-end gap-1">
        <Text className={`text-label ${AMOUNT_CLASS[fine.status]}`}>
          {formatCents(fine.amountCents)}
        </Text>
        <Text className="max-w-[110px] text-right text-micro text-ink-muted">
          {fineRowDetail(fine)}
        </Text>
      </View>
    </Pressable>
  )
}
