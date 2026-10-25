import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native'
import { AppBar, Icon } from '@/shared/components'

type FineTab = 'open' | 'collecting' | 'paid'

type FineRowData = {
  initials: string
  name: string
  detail: string
  amount: string
  status: string
  tone: 'danger' | 'warning' | 'success'
}

const COLLECTING: FineRowData[] = [
  {
    initials: 'JL',
    name: 'João Pedro Lima',
    detail: '2412044 · Física Básica, Vol. 1',
    amount: 'R$ 4,00',
    status: '2 dias úteis · sobe',
    tone: 'warning',
  },
  {
    initials: 'BC',
    name: 'Bruna Costa',
    detail: '2310772 · Química Geral',
    amount: 'R$ 2,00',
    status: '1 dia útil · sobe',
    tone: 'warning',
  },
]

const PAID: FineRowData[] = [
  {
    initials: 'MC',
    name: 'Marina Castro',
    detail: '2513320 · Cálculo, Vol. 1',
    amount: 'R$ 6,00',
    status: 'hoje · Ana Souza',
    tone: 'success',
  },
  {
    initials: 'TF',
    name: 'Thiago Freitas',
    detail: '2219034 · Microbiologia',
    amount: 'R$ 12,00',
    status: '14/10 · Ana Souza',
    tone: 'success',
  },
  {
    initials: 'LN',
    name: 'Larissa Nunes',
    detail: '2408817 · Teoria Geral do Direito',
    amount: 'R$ 2,00',
    status: '10/10 · Carlos Melo',
    tone: 'success',
  },
  {
    initials: 'LA',
    name: 'Lucas Almeida',
    detail: '2412858 · Algoritmos: teoria e prática',
    amount: 'R$ 4,00',
    status: '05/09 · Ana Souza',
    tone: 'success',
  },
]

const OPEN_AFTER_PAYMENT: FineRowData[] = [
  {
    initials: 'PL',
    name: 'Pedro Henrique Lima',
    detail: '2410221 · Física Básica, Vol. 2',
    amount: 'R$ 10,00',
    status: 'devolvido 13/10',
    tone: 'danger',
  },
  {
    initials: 'JM',
    name: 'Júlia Martins',
    detail: '2320876 · Contabilidade Introdutória',
    amount: 'R$ 4,00',
    status: 'devolvido 09/10',
    tone: 'danger',
  },
  {
    initials: 'CR',
    name: 'Camila Rocha',
    detail: '2214567 · Direito Civil: Parte Geral',
    amount: 'R$ 8,00',
    status: 'devolvido 02/10',
    tone: 'danger',
  },
  {
    initials: 'DA',
    name: 'Diego Alves',
    detail: '2511903 · Anatomia Humana',
    amount: 'R$ 6,00',
    status: 'devolvido 30/09',
    tone: 'danger',
  },
]

const OPEN_DEFAULT = [
  ...OPEN_AFTER_PAYMENT,
  {
    initials: 'MC',
    name: 'Marina Castro',
    detail: '2513320 · Cálculo, Vol. 1',
    amount: 'R$ 6,00',
    status: 'devolvido 15/10',
    tone: 'danger' as const,
  },
]

const TAB_LABELS: { id: FineTab; label: string }[] = [
  { id: 'open', label: 'Em aberto' },
  { id: 'collecting', label: 'Contando' },
  { id: 'paid', label: 'Pagas' },
]

export function FinesScreen() {
  const params = useLocalSearchParams<{ state?: string }>()
  const router = useRouter()
  const afterPayment = params.state === 'payment-registered'
  const initialTab: FineTab =
    params.state === 'collecting' || params.state === 'paid'
      ? params.state
      : 'open'
  const [activeTab, setActiveTab] = useState<FineTab>(initialTab)
  const [search, setSearch] = useState('')
  const rows =
    activeTab === 'collecting'
      ? COLLECTING
      : activeTab === 'paid'
        ? PAID
        : afterPayment
          ? OPEN_AFTER_PAYMENT
          : OPEN_DEFAULT
  const filteredRows = rows.filter((row) =>
    `${row.name} ${row.detail}`
      .toLocaleLowerCase('pt-BR')
      .includes(search.toLocaleLowerCase('pt-BR')),
  )
  const total = afterPayment
    ? 'R$ 28,00 em aberto · 4 alunos'
    : 'R$ 34,00 em aberto · 5 alunos'
  const counts: Record<FineTab, number> = {
    open: afterPayment ? 4 : 5,
    collecting: 2,
    paid: 4,
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Multas" subtitle={total} large />
      <ScrollView contentContainerClassName="gap-3 px-4 pb-8 pt-2">
        <View className="h-12 flex-row items-center gap-2 rounded-pill border border-line bg-surface-raised px-4">
          <Icon name="search" size={20} color="inkMuted" />
          <TextInput
            accessibilityLabel="Buscar por nome ou matrícula"
            value={search}
            onChangeText={setSearch}
            placeholder="Nome ou matrícula"
            className="flex-1 p-0 text-body text-ink"
          />
        </View>

        <View className="h-11 flex-row items-center rounded-pill bg-surface-sunken p-1">
          {TAB_LABELS.map((tab, index) => (
            <Pressable
              key={tab.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === tab.id }}
              onPress={() => setActiveTab(tab.id)}
              className={`h-9 flex-1 items-center justify-center rounded-pill px-2 ${activeTab === tab.id ? 'bg-surface-raised' : ''}`}
              style={
                activeTab === tab.id
                  ? { boxShadow: '0 2px 6px rgba(11, 21, 51, 0.12)' }
                  : undefined
              }
            >
              <Text
                className={`text-label-sm ${activeTab === tab.id ? 'text-ink' : 'text-ink-muted'}`}
              >
                {tab.label}
                {tab.id === 'paid' ? '' : ` (${counts[tab.id]})`}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="text-caption text-ink-muted">
          {activeTab === 'collecting'
            ? 'Livro ainda não devolvido: a multa sobe R$ 2,00 por dia útil. O pagamento só pode ser registrado depois da devolução.'
            : activeTab === 'paid'
              ? 'Pagamentos registrados no balcão, com quem recebeu. Fica no histórico do aluno.'
              : 'Livro devolvido, multa congelada. Registre o pagamento só depois de receber no balcão.'}
        </Text>

        <View className="rounded-lg border border-line bg-surface-raised px-4">
          {filteredRows.map((row, index) => (
            <Pressable
              key={`${row.name}-${row.detail}`}
              onPress={() => router.push('/fine-payment')}
              className={`min-h-[78px] flex-row items-center gap-3 py-3 ${index < filteredRows.length - 1 ? 'border-b border-line' : ''}`}
            >
              <View className="size-10 items-center justify-center rounded-pill bg-brand-soft">
                <Text className="text-label-sm text-brand">{row.initials}</Text>
              </View>
              <View className="min-w-0 flex-1 gap-1">
                <Text className="text-label-sm text-ink" numberOfLines={1}>
                  {row.name}
                </Text>
                <Text className="text-caption text-ink-muted" numberOfLines={2}>
                  {row.detail}
                </Text>
              </View>
              <View className="items-end gap-0.5">
                <Text
                  className={`text-title ${row.tone === 'danger' ? 'text-danger' : row.tone === 'warning' ? 'text-warning' : 'text-success'}`}
                >
                  {row.amount}
                </Text>
                <Text className="text-micro text-ink-muted" numberOfLines={1}>
                  {row.status}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {afterPayment ? (
        <View className="absolute bottom-3 left-4 right-4 flex-row items-center justify-center rounded-md bg-ink px-4 py-4">
          <Text className="text-body-sm text-on-brand">
            Pagamento de Marina registrado.
          </Text>
        </View>
      ) : null}
    </View>
  )
}
