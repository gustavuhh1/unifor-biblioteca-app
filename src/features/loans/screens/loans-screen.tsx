import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { AppBar, BottomSheet, Button, Icon } from '@/shared/components'
import { useTheme } from '@/shared/theme/theme-provider'

type LoanState =
  | 'active'
  | 'empty'
  | 'history'
  | 'overdue'
  | 'renewal-confirm'
  | 'renewal-unavailable'
  | 'renewed'

type Loan = {
  title: string
  author: string
  cover: 'cover-1' | 'cover-2' | 'cover-3' | 'cover-4' | 'cover-5'
  taken: string
  due: string
  progress: 'short' | 'long' | 'middle'
  daysLeft?: string
  overdue?: string
  queueMessage?: string
  renewed?: string
  renewalDisabled?: boolean
}

const LOAN_TABS = ['Ativos (3)', 'Na fila (2)', 'Histórico']
const COVER_CLASS: Record<Loan['cover'], string> = {
  'cover-1': 'bg-cover-1',
  'cover-2': 'bg-cover-2',
  'cover-3': 'bg-cover-3',
  'cover-4': 'bg-cover-4',
  'cover-5': 'bg-cover-5',
}
const ACTIVE_LOANS: Loan[] = [
  {
    title: 'Redes de Computadores',
    author: 'Andrew S. Tanenbaum',
    cover: 'cover-4',
    taken: 'Retirado 06/10',
    due: 'Devolver até 20/10',
    progress: 'short',
    daysLeft: '5 DIAS RESTANTES',
  },
  {
    title: 'Engenharia de Software',
    author: 'Ian Sommerville',
    cover: 'cover-3',
    taken: 'Retirado 02/10',
    due: 'Devolver até 16/10',
    progress: 'long',
    daysLeft: 'VENCE AMANHÃ',
    queueMessage: 'Renovação indisponível: 2 alunos na fila deste livro.',
    renewalDisabled: true,
  },
  {
    title: 'Estruturas de Dados e Algoritmos',
    author: 'Goodrich, Tamassia',
    cover: 'cover-2',
    taken: 'Retirado 07/10',
    due: 'Devolver até 23/10',
    progress: 'middle',
    daysLeft: '8 DIAS RESTANTES',
  },
]

const RENEWED_LOAN: Loan = {
  ...ACTIVE_LOANS[2],
  taken: 'Renovado em 15/10',
  due: 'Devolver até 06/11',
  daysLeft: '22 DIAS RESTANTES',
  renewed: 'sex, 06/11',
}

const OVERDUE_LOANS: Loan[] = [
  {
    title: 'Cálculo, Vol. 1',
    author: 'James Stewart',
    cover: 'cover-5',
    taken: 'Retirado 26/09',
    due: 'Venceu 10/10',
    progress: 'long',
    overdue: 'ATRASADO · R$ 6,00',
  },
  ACTIVE_LOANS[1],
  ACTIVE_LOANS[2],
]

const HISTORY = [
  {
    year: '2026',
    title: 'Padrões de Projeto',
    author: 'Gamma, Helm, Johnson, Vlissides',
    detail: 'Retirado 08/09 · devolvido 20/09',
    status: 'DEVOLVIDO',
    tone: 'success',
  },
  {
    year: '2026',
    title: 'Algoritmos: teoria e prática',
    author: 'Cormen et al.',
    detail: '2 dias de atraso · multa paga R$ 4,00',
    status: 'DEVOLVIDO',
    tone: 'success',
  },
  {
    year: '2026',
    title: 'O Programador Pragmático',
    author: 'Hunt, Thomas',
    detail: 'Você saiu da fila em 12/08',
    status: 'CANCELADO',
    tone: 'neutral',
  },
  {
    year: '2026',
    title: 'Sistemas Operacionais Modernos',
    author: 'Andrew S. Tanenbaum',
    detail: 'Pedido de 04/08 não retirado em 2 dias úteis',
    status: 'EXPIRADO',
    tone: 'neutral',
  },
  {
    year: '2025',
    title: 'Engenharia de Software',
    author: 'Ian Sommerville',
    detail: 'Retirado 12/08 · devolvido 26/08',
    status: 'DEVOLVIDO',
    tone: 'success',
  },
  {
    year: '2025',
    title: 'Redes de Computadores',
    author: 'Andrew S. Tanenbaum',
    detail: 'Retirado 03/04 · devolvido 17/04',
    status: 'DEVOLVIDO',
    tone: 'success',
  },
  {
    year: '2024',
    title: 'Cálculo, Vol. 1',
    author: 'James Stewart',
    detail: 'Retirado 10/09 · devolvido 24/09',
    status: 'DEVOLVIDO',
    tone: 'success',
  },
  {
    year: '2024',
    title: 'Estruturas de Dados e Algoritmos',
    author: 'Goodrich, Tamassia',
    detail: 'Retirado 06/05 · devolvido 20/05',
    status: 'DEVOLVIDO',
    tone: 'success',
  },
]

function LoanTabs({
  active,
  onChange,
}: {
  active: number
  onChange: (index: number) => void
}) {
  const { shadows } = useTheme()
  return (
    <View className="h-11 flex-row items-center rounded-pill bg-surface-sunken p-1">
      {LOAN_TABS.map((tab, index) => (
        <Pressable
          key={tab}
          accessibilityRole="tab"
          accessibilityState={{ selected: active === index }}
          onPress={() => onChange(index)}
          className={`h-9 flex-1 items-center justify-center rounded-pill px-2 ${active === index ? 'bg-surface-raised' : ''}`}
          style={active === index ? { boxShadow: shadows.card } : undefined}
        >
          <Text
            className={`text-label-sm ${active === index ? 'text-ink' : 'text-ink-muted'}`}
          >
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}

function BookCover({ color }: { color: Loan['cover'] }) {
  return (
    <View
      className={`h-[78px] w-[54px] overflow-hidden rounded-sm ${COVER_CLASS[color]}`}
    >
      <View className="absolute -bottom-3 -right-3 size-11 rounded-pill border-2 border-on-cover/20 bg-on-cover/10" />
    </View>
  )
}

function LoanStatus({ loan }: { loan: Loan }) {
  if (loan.overdue) {
    return (
      <View className="flex-row items-center gap-1 self-start rounded-pill bg-danger-soft px-2 py-1">
        <Icon name="alert" size={14} color="danger" />
        <Text className="text-micro-strong text-danger">{loan.overdue}</Text>
      </View>
    )
  }

  if (loan.renewed || loan.daysLeft?.includes('DIAS')) {
    return (
      <View className="flex-row items-center gap-1 self-start rounded-pill bg-brand-soft px-2 py-1">
        <Icon name="book" size={14} color="brand" />
        <Text className="text-micro-strong text-brand">{loan.daysLeft}</Text>
      </View>
    )
  }

  return (
    <View className="flex-row items-center gap-1 self-start rounded-pill bg-warning-soft px-2 py-1">
      <Icon name="clock" size={14} color="warning" />
      <Text className="text-micro-strong text-warning">{loan.daysLeft}</Text>
    </View>
  )
}

function LoanCard({
  loan,
  onRenew,
  onFine,
}: {
  loan: Loan
  onRenew: () => void
  onFine: () => void
}) {
  const overdue = Boolean(loan.overdue)
  const progressColor = overdue
    ? 'bg-danger'
    : loan.daysLeft?.includes('VENCE')
      ? 'bg-warning'
      : 'bg-brand'
  const progressWidth =
    loan.progress === 'short'
      ? 'w-[36%]'
      : loan.progress === 'middle'
        ? 'w-[58%]'
        : 'w-[94%]'

  return (
    <View
      className={`gap-3 rounded-lg border bg-surface-raised p-4 ${overdue ? 'border-[1.5px] border-danger' : 'border-line'}`}
    >
      <View className="flex-row gap-3">
        <BookCover color={loan.cover} />
        <View className="flex-1 gap-1">
          <Text className="font-serif text-book-title-sm text-ink">
            {loan.title}
          </Text>
          <Text className="text-caption text-ink-muted">{loan.author}</Text>
          <LoanStatus loan={loan} />
        </View>
      </View>
      <View className="h-1 rounded-pill bg-surface-sunken">
        <View
          className={`h-1 rounded-pill ${progressColor} ${progressWidth}`}
        />
      </View>
      <View className="flex-row justify-between gap-2">
        <Text className="text-caption text-ink-muted">{loan.taken}</Text>
        <Text className="text-caption-strong text-ink">{loan.due}</Text>
      </View>
      {loan.queueMessage ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ver por que a renovação está indisponível"
          onPress={onRenew}
          className="flex-row items-center gap-2"
        >
          <Icon name="users" size={17} color="inkMuted" />
          <Text className="flex-1 text-caption text-ink-muted">
            {loan.queueMessage}
          </Text>
        </Pressable>
      ) : null}
      {overdue ? (
        <Button block variant="danger" icon="coin" onPress={onFine}>
          Ver multa
        </Button>
      ) : loan.renewed ? (
        <View className="min-h-9 flex-row items-center justify-center gap-2 rounded-sm bg-brand-soft px-3">
          <Icon name="refresh" size={17} color="brand" />
          <Text className="text-label-sm text-brand">Renovar +14 dias</Text>
        </View>
      ) : (
        <Button
          block
          variant="tonal"
          icon="refresh"
          disabled={loan.renewalDisabled}
          onPress={onRenew}
        >
          Renovar +14 dias
        </Button>
      )}
    </View>
  )
}

function EmptyLoans({
  activeTab,
  onExplore,
}: {
  activeTab: number
  onExplore: () => void
}) {
  const emptyState = [
    {
      icon: 'books' as const,
      title: 'Nenhum livro com você',
      text: 'Quando você retirar um livro no balcão, ele aparece aqui com o prazo de devolução.',
      action: 'Explorar acervo',
    },
    {
      icon: 'users' as const,
      title: 'Você não está em nenhuma fila',
      text: 'Quando todos os exemplares de um livro estiverem emprestados, você pode entrar na fila.',
      action: 'Explorar acervo',
    },
    {
      icon: 'book' as const,
      title: 'Seu histórico está vazio',
      text: 'Os livros que você devolver aparecem aqui.',
      action: 'Explorar acervo',
    },
  ][activeTab]

  return (
    <View className="items-center px-4 pt-12">
      <View className="mb-3 size-[72px] items-center justify-center rounded-lg bg-brand-soft">
        <Icon name={emptyState.icon} size={32} color="brandStrong" />
      </View>
      <Text className="text-center text-title text-ink">
        {emptyState.title}
      </Text>
      <Text className="mt-2 max-w-[320px] text-center text-body text-ink-muted">
        {emptyState.text}
      </Text>
      <View className="mt-3">
        <Button icon="search" onPress={onExplore}>
          {emptyState.action}
        </Button>
      </View>
    </View>
  )
}

function HistoryCard({ item }: { item: (typeof HISTORY)[number] }) {
  const statusClass =
    item.tone === 'success'
      ? 'bg-success-soft text-success'
      : 'bg-neutral-soft text-neutral-ink'
  const [background, foreground] = statusClass.split(' ')

  return (
    <View className="flex-row gap-3 rounded-lg border border-line bg-surface-raised p-4">
      <BookCover color="cover-1" />
      <View className="flex-1 gap-1">
        <Text className="font-serif text-book-title-sm text-ink">
          {item.title}
        </Text>
        <Text className="text-caption text-ink-muted">{item.author}</Text>
        <Text
          className={`text-caption ${item.tone === 'success' && item.detail.startsWith('2 dias') ? 'text-danger' : 'text-ink-muted'}`}
        >
          {item.detail}
        </Text>
        <View className={`self-start rounded-pill px-2 py-1 ${background}`}>
          <Text className={`text-micro-strong ${foreground}`}>
            {item.tone === 'success' ? '✓ ' : '× '}
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  )
}

function HistoryList() {
  const [year, setYear] = useState('2026')
  const { shadows } = useTheme()
  const yearItems = HISTORY.filter((item) => item.year === year)
  return (
    <View className="gap-3">
      <View className="flex-row gap-2">
        {['2026', '2025', '2024'].map((item) => {
          const selected = year === item
          return (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityLabel={`Filtrar histórico de ${item}`}
              accessibilityState={{ selected }}
              onPress={() => setYear(item)}
              className={`min-h-9 items-center justify-center rounded-pill border px-4 ${selected ? 'border-brand bg-brand-soft' : 'border-line bg-surface-raised'}`}
              style={selected ? { boxShadow: shadows.card } : undefined}
            >
              <Text
                className={`text-label-sm ${selected ? 'text-brand' : 'text-ink'}`}
              >
                {item}
              </Text>
            </Pressable>
          )
        })}
      </View>
      {yearItems.map((item) => (
        <HistoryCard key={item.title} item={item} />
      ))}
    </View>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between border-b border-line py-2.5 last:border-b-0">
      <Text className="text-caption text-ink-muted">{label}</Text>
      <Text className="text-caption-strong text-ink">{value}</Text>
    </View>
  )
}

function RenewalSheet({
  visible,
  unavailable,
  onClose,
  onConfirm,
}: {
  visible: boolean
  unavailable: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  if (unavailable) {
    return (
      <BottomSheet
        visible={visible}
        title="Renovação indisponível"
        description="Engenharia de Software não pode ser renovado agora. Devolva até 16/10 para o próximo da fila."
        onClose={onClose}
      >
        <View className="gap-3">
          <Reason ok title="Dentro do prazo" detail="Vence amanhã, 16/10." />
          <Reason ok title="Sem atraso" detail="O livro ainda não venceu." />
          <Reason
            ok={false}
            title="Há pessoas na fila"
            detail="2 alunos esperam por este livro."
          />
          <Reason
            ok
            title="Renovação ainda não usada"
            detail="Este empréstimo tem 1 renovação."
          />
        </View>
        <Button block onPress={onClose}>
          Entendi
        </Button>
      </BottomSheet>
    )
  }

  return (
    <BottomSheet
      visible={visible}
      title="Renovar Estruturas de Dados e Algoritmos?"
      description="Você ganha mais 14 dias. Cada empréstimo renova uma única vez, e só quando o livro não está atrasado e ninguém está na fila."
      onClose={onClose}
    >
      <View className="rounded-lg border border-line bg-surface-raised px-4">
        <DetailRow label="Prazo atual" value="sex, 23/10" />
        <DetailRow label="Novo prazo" value="sex, 06/11" />
        <DetailRow label="Fila deste livro" value="Ninguém esperando" />
      </View>
      <Button block icon="refresh" onPress={onConfirm}>
        Renovar +14 dias
      </Button>
      <Button block variant="ghost" onPress={onClose}>
        Agora não
      </Button>
    </BottomSheet>
  )
}

function Reason({
  ok,
  title,
  detail,
}: {
  ok: boolean
  title: string
  detail: string
}) {
  return (
    <View className="flex-row items-start gap-3">
      <View
        className={`size-8 items-center justify-center rounded-sm ${ok ? 'bg-success-soft' : 'bg-danger-soft'}`}
      >
        <Icon
          name={ok ? 'check' : 'x'}
          size={18}
          color={ok ? 'success' : 'danger'}
        />
      </View>
      <View className="flex-1 gap-0.5">
        <Text className="text-label-sm text-ink">{title}</Text>
        <Text className="text-caption text-ink-muted">{detail}</Text>
      </View>
    </View>
  )
}

// A39–A43: empréstimos ativos, renovação, histórico e atraso.
// A55: estado vazio. A70: renovação indisponível.
export function LoansScreen() {
  const params = useLocalSearchParams<{ state?: LoanState }>()
  const router = useRouter()
  const state = params.state ?? 'active'
  const overdue = state === 'overdue'
  const history = state === 'history'
  const empty = state === 'empty'
  const [renewed, setRenewed] = useState(state === 'renewed')
  const unavailable = state === 'renewal-unavailable'
  const renewalConfirm = state === 'renewal-confirm'
  const [activeTab, setActiveTab] = useState(history ? 2 : 0)
  const [showRenewal, setShowRenewal] = useState(unavailable || renewalConfirm)
  const [showToast, setShowToast] = useState(renewed)

  const loans = unavailable
    ? [ACTIVE_LOANS[1]]
    : overdue
      ? OVERDUE_LOANS
      : renewed
        ? [RENEWED_LOAN, ACTIVE_LOANS[0], ACTIVE_LOANS[1]]
        : ACTIVE_LOANS

  function confirmRenewal() {
    setShowRenewal(false)
    setRenewed(true)
    setShowToast(true)
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Meus empréstimos"
        subtitle={empty ? '0 de 10 livros com você' : '3 de 10 livros com você'}
        large
      />
      <ScrollView
        contentContainerClassName="gap-4 px-4 pb-6 pt-3"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <LoanTabs
          active={activeTab}
          onChange={(index) => {
            setActiveTab(index)
            if (index === 2) router.setParams({ state: 'history' })
            else if (state === 'history') router.setParams({ state: 'active' })
          }}
        />
        {history || activeTab === 2 ? (
          <HistoryList />
        ) : empty ? (
          <>
            <EmptyLoans
              activeTab={activeTab}
              onExplore={() => router.push('/catalog')}
            />
            <HowItWorks />
          </>
        ) : (
          <View className="gap-3">
            {overdue ? (
              <View className="flex-row items-start gap-3 rounded-md bg-danger-soft p-3">
                <Icon name="lock" size={18} color="danger" />
                <View className="flex-1 gap-1">
                  <Text className="text-label text-ink">
                    Empréstimos bloqueados
                  </Text>
                  <Text className="text-body-sm text-ink">
                    Devolva Cálculo, Vol. 1 para voltar a pegar livros e entrar
                    em filas. Multa até agora: R$ 6,00, paga só presencialmente
                    na biblioteca.
                  </Text>
                </View>
              </View>
            ) : null}
            {loans.map((loan) => (
              <LoanCard
                key={loan.title}
                loan={loan}
                onRenew={() => setShowRenewal(true)}
                onFine={() => router.push('/fine?state=overdue')}
              />
            ))}
          </View>
        )}
      </ScrollView>
      <RenewalSheet
        visible={showRenewal}
        unavailable={unavailable}
        onClose={() => setShowRenewal(false)}
        onConfirm={confirmRenewal}
      />
      {showToast ? (
        <View className="absolute bottom-3 left-4 right-4 flex-row items-center gap-3 rounded-md bg-ink px-4 py-3">
          <Icon name="check" size={18} color="onBrand" />
          <Text className="text-body-sm text-on-brand">
            Renovado até sex, 06/11.
          </Text>
        </View>
      ) : null}
    </View>
  )
}

function HowItWorks() {
  const items = [
    { icon: 'books' as const, text: 'Até 10 livros ao mesmo tempo' },
    {
      icon: 'calendar' as const,
      text: '14 dias por empréstimo, com renovação',
    },
    { icon: 'users' as const, text: 'Livro emprestado? Entre na fila' },
  ]
  return (
    <View className="gap-3 rounded-lg border border-line bg-surface-raised p-4">
      <Text className="text-overline text-ink-muted">Como funciona</Text>
      {items.map((item) => (
        <View key={item.text} className="flex-row items-center gap-2.5">
          <Icon name={item.icon} size={18} color="ink" />
          <Text className="flex-1 text-body text-ink">{item.text}</Text>
        </View>
      ))}
    </View>
  )
}
