import { ScrollView, Text, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { AppBar, Icon } from '@/shared/components'

function DetailRow({
  label,
  value,
  last = false,
}: {
  label: string
  value: string
  last?: boolean
}) {
  return (
    <View
      className={`min-h-11 flex-row items-center justify-between ${last ? '' : 'border-b border-line'}`}
    >
      <Text className="text-body text-ink-muted">{label}</Text>
      <Text className="text-label text-ink">{value}</Text>
    </View>
  )
}

export function FineScreen() {
  const params = useLocalSearchParams<{ state?: string }>()

  // A45: multa ainda contando. A46: livro devolvido, multa congelada. Sem estado: A71.
  if (params.state === 'overdue' || params.state === 'paid') {
    return <FineStatusScreen paid={params.state === 'paid'} />
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Multa" subtitle="Cálculo, Vol. 1" back />
      <ScrollView contentContainerClassName="gap-4 px-4 pb-8 pt-3">
        <View className="gap-3 rounded-lg border border-danger bg-surface-raised p-4">
          <View className="flex-row items-start justify-between">
            <View className="gap-1">
              <Text className="text-overline text-ink-muted">
                MULTA ACUMULADA
              </Text>
              <Text className="text-hero text-danger">R$ 6,00</Text>
            </View>
            <View className="flex-row items-center gap-1 rounded-sm bg-danger-soft px-2 py-1">
              <Icon name="alert" size={14} color="danger" />
              <Text className="text-micro-strong text-danger">3 DIAS</Text>
            </View>
          </View>
          <Text className="text-caption text-ink-muted">
            Cálculo, Vol. 1 · venceu em 10/10
          </Text>
          <View className="h-px bg-line" />
          <View className="flex-row justify-between">
            <Text className="text-caption-strong text-ink">
              3 dias úteis × R$ 2,00
            </Text>
            <Text className="text-caption text-ink-muted">
              R$ 2,00 por dia útil
            </Text>
          </View>
          <View className="flex-row items-center gap-2 rounded-md bg-surface-sunken px-3 py-2">
            <Icon name="mapPin" size={18} color="inkMuted" />
            <Text className="text-label-sm text-ink">Pague no balcão</Text>
          </View>
        </View>
        <Text className="text-title text-ink">Como a multa é calculada</Text>
        <View className="gap-0 rounded-lg border border-line bg-surface-raised px-4">
          <DetailRow label="Venceu em" value="10/10" />
          <DetailRow label="Dias úteis de atraso" value="3 dias" />
          <DetailRow label="Valor por dia útil" value="R$ 2,00" />
          <DetailRow label="Total até hoje" value="R$ 6,00" last />
        </View>
        <Text className="text-caption text-ink-muted">
          Fim de semana, feriado e recesso não contam. A multa para de crescer
          quando o livro é devolvido.
        </Text>
        <View className="flex-row items-start gap-3 rounded-md bg-brand-soft p-4">
          <Icon name="info" size={20} color="brandStrong" />
          <View className="flex-1 gap-1">
            <Text className="text-label text-ink">Pagamento só no balcão</Text>
            <Text className="text-body-sm text-ink">
              O app não recebe pagamentos. Pague no balcão da biblioteca: seg a
              sex, 7h às 21h55; sáb, 8h às 14h10.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

function FineStatusScreen({ paid }: { paid: boolean }) {
  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title={paid ? 'Multa em aberto' : 'Multa por atraso'}
        back
        actions={[{ icon: 'more', label: 'Mais opções' }]}
      />
      <ScrollView contentContainerClassName="gap-4 px-4 pb-8 pt-3">
        <View className="gap-3 rounded-lg border-[1.5px] border-danger bg-surface-raised p-4">
          <View className="flex-row items-start justify-between">
            <View className="gap-1">
              <Text className="text-overline text-ink-muted">
                MULTA ACUMULADA
              </Text>
              <Text className="text-hero text-danger">R$ 6,00</Text>
            </View>
            <View className="flex-row items-center gap-1 rounded-sm bg-danger-soft px-2 py-1">
              <Icon name="alert" size={14} color="danger" />
              <Text className="text-micro-strong text-danger">
                {paid ? 'CONGELADA' : '3 DIAS ÚTEIS'}
              </Text>
            </View>
          </View>
          <Text className="text-caption text-ink-muted">
            Cálculo, Vol. 1 · {paid ? 'devolvido em 15/10' : 'venceu em 10/10'}
          </Text>
          <View className="h-px bg-line" />
          <View className="flex-row justify-between">
            <Text className="text-caption-strong text-ink">
              3 dias úteis × R$ 2,00
            </Text>
            <Text className="text-caption text-ink-muted">
              R$ 2,00 por dia útil
            </Text>
          </View>
          <View className="flex-row items-center gap-2 rounded-md bg-surface-sunken px-3 py-2">
            <Icon name="mapPin" size={18} color="inkMuted" />
            <Text className="flex-1 text-caption-strong text-ink">
              Pagamento só presencial, no balcão da biblioteca. O app não recebe
              pagamentos.
            </Text>
          </View>
        </View>

        {paid ? (
          <View className="flex-row items-start gap-3 rounded-md bg-brand-soft p-4">
            <Icon name="info" size={20} color="brand" />
            <View className="flex-1 gap-1">
              <Text className="text-label text-ink">
                A multa parou de contar
              </Text>
              <Text className="text-body-sm text-ink">
                Você devolveu o livro, então o valor não sobe mais. Você já pode
                pegar livros e entrar em filas.
              </Text>
            </View>
          </View>
        ) : (
          <View className="flex-row items-start gap-3 rounded-md bg-warning-soft p-4">
            <Icon name="alert" size={20} color="warning" />
            <View className="flex-1 gap-1">
              <Text className="text-label text-ink">
                A multa sobe R$ 2,00 por dia útil
              </Text>
              <Text className="text-body-sm text-ink">
                Amanhã (sex) passa para R$ 8,00. A contagem para quando você
                devolver o livro.
              </Text>
            </View>
          </View>
        )}

        <Text className="text-overline text-ink-muted">COMO RESOLVER</Text>
        <View className="gap-3 rounded-lg border border-line bg-surface-raised p-4">
          {!paid ? (
            <ActionStep
              number="1"
              title="Devolva Cálculo, Vol. 1 no balcão"
              description="A multa para de contar e o bloqueio para novos empréstimos termina na hora."
            />
          ) : null}
          <ActionStep
            number={paid ? '1' : '2'}
            title="Pague R$ 6,00 na biblioteca"
            description="Só presencialmente, no balcão. O bibliotecário registra o pagamento."
          />
        </View>

        <Text className="text-overline text-ink-muted">ATENDIMENTO</Text>
        <View className="gap-3 rounded-lg border border-line bg-surface-raised p-4">
          <ContactRow icon="mapPin" text="Biblioteca (Praça Central)" />
          <ContactRow
            icon="clock"
            text="Seg a sex, 7h às 21h55 · sáb, 8h às 14h10"
          />
          <ContactRow icon="send" text="BiblioZap (85) 3477-3257" />
        </View>
      </ScrollView>
    </View>
  )
}

function ActionStep({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <View className="flex-row items-start gap-3">
      <View className="size-7 items-center justify-center rounded-pill bg-brand-soft">
        <Text className="text-caption-strong text-brand">{number}</Text>
      </View>
      <View className="flex-1 gap-1">
        <Text className="text-label-sm text-ink">{title}</Text>
        <Text className="text-caption text-ink-muted">{description}</Text>
      </View>
    </View>
  )
}

function ContactRow({
  icon,
  text,
}: {
  icon: 'mapPin' | 'clock' | 'send'
  text: string
}) {
  return (
    <View className="flex-row items-center gap-3">
      <Icon name={icon} size={17} color="ink" />
      <Text className="flex-1 text-body-sm text-ink">{text}</Text>
    </View>
  )
}
