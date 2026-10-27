import { Pressable, Text, View } from 'react-native'
import { BookCover, StatusBadge } from '@/shared/components'
import { historyDetailText, loanBadge } from '../loans.format'
import type { MyLoan } from '../loans.types'

export interface LoanHistoryRowProps {
  loan: MyLoan
  onPress: () => void
}

// Linha do histórico de empréstimos (A42, RF-EMP-08): devolvido, expirado ou
// cancelado, com o que aconteceu e quando.
export function LoanHistoryRow({ loan, onPress }: LoanHistoryRowProps) {
  const badge = loanBadge(loan)
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${loan.bookTitle}. ${historyDetailText(loan)}`}
      onPress={onPress}
      className="flex-row gap-3 rounded-lg border border-line bg-surface-raised p-3"
    >
      <BookCover title={loan.bookTitle} size="sm" />
      <View className="min-w-0 flex-1 gap-1">
        <Text className="text-book-title text-ink">{loan.bookTitle}</Text>
        <Text className="text-caption text-ink-muted">
          {historyDetailText(loan)}
        </Text>
        <View className="self-start">
          <StatusBadge status={badge.status} />
        </View>
      </View>
    </Pressable>
  )
}
