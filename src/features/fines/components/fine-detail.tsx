import { Text, View } from 'react-native'
import { FineCard } from '@/shared/components'
import { formatCents } from '@/shared/utils/money'
import { formatDate } from '@/shared/utils/dates'
import { fineBookLine } from '../fines.format'
import type { LibrarianFine } from '../fines.types'

// Uma linha "rótulo à esquerda, valor à direita" do quadro de detalhes.
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between gap-3 border-b border-line py-2">
      <Text className="flex-1 text-caption text-ink-muted">{label}</Text>
      <Text className="flex-1 text-right text-caption-strong text-ink">
        {value}
      </Text>
    </View>
  )
}

// Detalhe da multa em aberto (B16, RF-BAL-09): quem deve, o valor congelado e o
// aviso de que o pagamento é só presencial. O botão de registrar fica na tela.
export function FineDetail({ fine }: { fine: LibrarianFine }) {
  return (
    <View className="gap-4">
      <View className="gap-1 rounded-lg border border-line bg-surface-raised p-4">
        <Text className="text-label text-ink">{fine.studentName}</Text>
        <Text className="text-caption text-ink-muted">{fine.matricula}</Text>
      </View>
      <FineCard
        tag="Congelada"
        showPayment={false}
        amount={formatCents(fine.amountCents)}
        daysLate={fine.businessDaysLate}
        rate={formatCents(fine.ratePerBusinessDayCents)}
        book={fineBookLine(fine)}
      />
      <View className="rounded-lg border border-line bg-surface-raised px-4 py-2">
        <DetailRow label="Venceu em" value={formatDate(fine.dueAt)} />
        <DetailRow
          label="Devolução registrada"
          value={fine.frozenAt ? formatDate(fine.frozenAt) : '—'}
        />
        <DetailRow label="Situação" value="Aguardando pagamento" />
      </View>
      <View className="gap-1 rounded-lg bg-brand-soft p-4">
        <Text className="text-label text-ink">Pagamento só no balcão</Text>
        <Text className="text-body text-ink-muted">
          O app não recebe pagamentos. Confirme só depois de receber o valor. O
          registro fica com seu nome.
        </Text>
      </View>
    </View>
  )
}
