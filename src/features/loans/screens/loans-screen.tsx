import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { useSession } from '@/features/auth/hooks/use-session'
import { MyQueuesList } from '@/features/queues/components/my-queues-list'
import { ApiError } from '@/shared/api/errors'
import {
  Alert,
  AppBar,
  Button,
  ConfirmationSheet,
  EmptyState,
  SegmentedTabs,
} from '@/shared/components'
import { MAX_ACTIVE_LOANS } from '@/shared/config/library-rules'
import { useTheme } from '@/shared/theme/theme-provider'
import { ActiveLoanCard } from '../components/active-loan-card'
import { CancelLoanSheet } from '../components/cancel-loan-sheet'
import { LoanHistoryRow } from '../components/loan-history-row'
import { RenewLoanSheet } from '../components/renew-loan-sheet'
import { useMyLoans } from '../hooks/use-my-loans'
import {
  LOAN_STATE,
  LOAN_VIEW,
  LOANS_TAB,
  LOANS_TABS,
  RENEWAL_DENIAL_MESSAGE,
  type LoansTab,
} from '../loans.constants'
import { loansTabFromParam, renewedNotice } from '../loans.format'
import type { MyLoan } from '../loans.types'

// Meus empréstimos (A39 a A42, A69 e A70; RF-EMP-05, RF-EMP-08, RF-EMP-09 e
// RF-EMP-10): os pedidos e empréstimos ativos (GET /me/loans?view=active), o
// histórico (view=history), a renovação e o cancelamento. A aba "Na fila" mostra
// Minhas filas (A32; RF-FIL-08) e abre também por /loans?tab=queue.
export function LoansScreen() {
  const router = useRouter()
  const { colors } = useTheme()
  const { user } = useSession()
  const params = useLocalSearchParams<{ tab?: string }>()
  const [tab, setTab] = useState<LoansTab>(loansTabFromParam(params.tab))
  // A aba também muda quando a rota chega com outro `tab` (a tela já está aberta).
  const [seenTabParam, setSeenTabParam] = useState(params.tab)
  if (params.tab !== seenTabParam) {
    setSeenTabParam(params.tab)
    setTab(loansTabFromParam(params.tab))
  }
  const active = useMyLoans(LOAN_VIEW.active)
  const history = useMyLoans(LOAN_VIEW.history, {
    enabled: tab === LOANS_TAB.history,
  })
  const [renewing, setRenewing] = useState<MyLoan | null>(null)
  const [renewBlocked, setRenewBlocked] = useState<MyLoan | null>(null)
  const [cancelling, setCancelling] = useState<MyLoan | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  function changeTab(next: LoansTab) {
    setNotice(null)
    setTab(next)
  }

  const showingHistory = tab === LOANS_TAB.history
  const query = showingHistory ? history : active
  const items = query.data?.items ?? []
  const overdueLoan = showingHistory
    ? undefined
    : items.find((loan) => loan.state === LOAN_STATE.overdue)

  function openBook(loan: MyLoan) {
    router.push({ pathname: '/book-details', params: { id: loan.bookId } })
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Meus empréstimos"
        subtitle={`${user?.activeLoanCount ?? 0} de ${MAX_ACTIVE_LOANS} livros com você`}
        large
      />
      <View className="mx-4 mb-4">
        <SegmentedTabs
          items={[
            { label: 'Ativos', count: active.data?.items.length },
            { label: 'Na fila', count: user?.activeQueueCount },
            { label: 'Histórico' },
          ]}
          value={LOANS_TABS.indexOf(tab)}
          onChange={(index) => changeTab(LOANS_TABS[index] ?? LOANS_TAB.active)}
        />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 12,
          paddingBottom: 24,
        }}
      >
        {notice ? (
          <Alert tone="success" icon="checkCircle">
            {notice}
          </Alert>
        ) : null}

        {tab === LOANS_TAB.queue ? (
          <MyQueuesList onNotice={setNotice} />
        ) : query.isPending ? (
          <View
            accessibilityLabel="Carregando empréstimos"
            className="items-center py-12"
          >
            <ActivityIndicator color={colors.brand} />
          </View>
        ) : query.isError ? (
          <EmptyState
            icon="alert"
            title="Não foi possível carregar seus empréstimos"
            text={
              query.error instanceof ApiError ? query.error.message : undefined
            }
            action={
              <Button icon="refresh" onPress={() => void query.refetch()}>
                Tentar de novo
              </Button>
            }
          />
        ) : items.length === 0 ? (
          showingHistory ? (
            <EmptyState
              icon="clock"
              title="Sem histórico ainda"
              text="Livros devolvidos, pedidos expirados e cancelados aparecem aqui."
            />
          ) : (
            <EmptyState
              icon="books"
              title="Nenhum livro com você"
              text="Quando você pedir ou retirar um livro, ele aparece aqui com o prazo."
              action={
                <Button icon="search" onPress={() => router.push('/catalog')}>
                  Explorar acervo
                </Button>
              }
            />
          )
        ) : (
          <>
            {overdueLoan ? (
              <Alert tone="danger" title="Empréstimos bloqueados">
                {`Devolva ${overdueLoan.bookTitle} para voltar a pegar livros e entrar em filas. A multa é paga só no balcão da biblioteca.`}
              </Alert>
            ) : null}
            {items.map((loan) =>
              showingHistory ? (
                <LoanHistoryRow
                  key={loan.id}
                  loan={loan}
                  onPress={() => openBook(loan)}
                />
              ) : (
                <ActiveLoanCard
                  key={loan.id}
                  loan={loan}
                  onOpenBook={() => openBook(loan)}
                  onShowQr={() =>
                    router.push({
                      pathname: '/withdrawal',
                      params: { loanId: loan.id },
                    })
                  }
                  onCancel={() => setCancelling(loan)}
                  onRenew={() => setRenewing(loan)}
                  onRenewBlocked={() => setRenewBlocked(loan)}
                  onShowFine={() => router.push('/fine')}
                />
              ),
            )}
          </>
        )}
      </ScrollView>

      <RenewLoanSheet
        loan={renewing}
        onClose={() => setRenewing(null)}
        onRenewed={(renewed) => setNotice(renewedNotice(renewed))}
      />
      <CancelLoanSheet
        loan={cancelling}
        onClose={() => setCancelling(null)}
        onCancelled={() => setNotice('Pedido cancelado.')}
      />
      <ConfirmationSheet
        visible={renewBlocked !== null}
        title="Renovação indisponível"
        description={
          renewBlocked?.renewalDenialReason
            ? RENEWAL_DENIAL_MESSAGE[renewBlocked.renewalDenialReason]
            : 'Este empréstimo não pode ser renovado agora.'
        }
        confirmText="Entendi"
        hideCancel
        onCancel={() => setRenewBlocked(null)}
        onConfirm={() => setRenewBlocked(null)}
      />
    </View>
  )
}
