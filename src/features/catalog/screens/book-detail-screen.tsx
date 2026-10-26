import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSession } from '@/features/auth/hooks/use-session'
import { ApiError } from '@/shared/api/errors'
import {
  Alert,
  AppBar,
  BookCover,
  Button,
  EmptyState,
  Icon,
  QueueInfo,
  StatusBadge,
} from '@/shared/components'
import {
  LOAN_PERIOD_DAYS,
  MAX_ACTIVE_LOANS,
  PICKUP_BUSINESS_DAYS,
  QUEUE_CONFIRM_HOURS,
} from '@/shared/config/library-rules'
import { ASSISTANT_BLOCKED_REASON, COPY_STATUS } from '@/shared/types'
import { useTheme } from '@/shared/theme/theme-provider'
import { BLOCKED_REASON_MESSAGE } from '@/shared/utils/blocked-reason'
import { formatDayMonth } from '@/shared/utils/dates'
import { pluralize } from '@/shared/utils/plural'
import { BOOK_ACTION_LABEL, COPY_STATUS_LABEL } from '../catalog.constants'
import {
  authorsLine,
  bookCoverTone,
  bookDescription,
  bookLocationText,
  bookStatus,
  callNumberText,
  copiesText,
  publicationText,
  reservationsText,
  shelfText,
} from '../catalog.format'
import type { BookPage } from '../catalog.types'
import { useBook } from '../hooks/use-book'

// Linhas da sinopse antes de "Ler sinopse completa".
const SYNOPSIS_PREVIEW_LINES = 5

function Secao({ titulo }: { titulo: string }) {
  return <Text className="mb-3 text-title text-ink">{titulo}</Text>
}

function Linha({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <View className="flex-row justify-between gap-4 border-b border-line py-3">
      <Text className="flex-1 text-caption text-ink-muted">{titulo}</Text>

      <Text className="flex-1 text-right text-caption-strong text-ink">
        {valor}
      </Text>
    </View>
  )
}

// Abre o menu nativo de compartilhar do celular (RF-ACE-07).
function shareBook(book: BookPage) {
  void Share.share({
    message: `${book.title}, de ${authorsLine(book.authors)}. ${bookLocationText(book)}.`,
  })
}

// Página do livro (RF-ACE-02, RF-ACE-03 e RF-ACE-08; telas A13, A14 e A76):
// GET /books/{bookId}, com a ação que cabe a este aluno no botão fixo.
export function BookDetailScreen() {
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()
  const query = useBook(id)

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Detalhe do livro" back />

      {query.isPending ? (
        <View
          accessibilityLabel="Carregando livro"
          className="flex-1 items-center justify-center"
        >
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : query.isError ? (
        <EmptyState
          icon="alert"
          title="Não foi possível abrir o livro"
          text={
            query.error instanceof ApiError ? query.error.message : undefined
          }
          action={
            <Button icon="refresh" onPress={() => void query.refetch()}>
              Tentar de novo
            </Button>
          }
        />
      ) : (
        <BookDetail book={query.data} bottomInset={insets.bottom} />
      )}
    </View>
  )
}

function BookDetail({
  book,
  bottomInset,
}: {
  book: BookPage
  bottomInset: number
}) {
  const { user } = useSession()
  const [synopsisOpen, setSynopsisOpen] = useState(false)
  const [synopsisTruncated, setSynopsisTruncated] = useState(false)

  const emprestado = book.copiesAvailable === 0
  const action = book.action
  const blocked = action?.blockedReason
    ? BLOCKED_REASON_MESSAGE[action.blockedReason]
    : null
  const pausado = action?.blockedReason === ASSISTANT_BLOCKED_REASON.unavailable
  const atrasado = action?.blockedReason === ASSISTANT_BLOCKED_REASON.overdue
  const registro = [
    ['Material', book.materialType],
    ['Idioma', book.language],
    ['ISBN', book.isbn],
    ['CDU e Cutter', callNumberText(book)],
    ['Edição', book.edition],
    ['Publicação', publicationText(book)],
    ['Série', book.series],
  ].filter((row): row is [string, string] => Boolean(row[1]))

  return (
    <>
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-4 pb-8"
      >
        {/* CAPA E DISPONIBILIDADE */}
        <View className="flex-row gap-4">
          <BookCover
            title={book.title}
            author={authorsLine(book.authors)}
            tone={bookCoverTone(book)}
            size="lg"
          />

          <View className="flex-1 justify-center gap-3">
            <StatusBadge status={bookStatus(book)} />

            <Text className="text-body text-ink">{copiesText(book)}</Text>

            <Text className="text-caption text-ink-muted">
              {reservationsText(book.queueLength)}
            </Text>
          </View>
        </View>

        {/* A76 — MOTIVO DO BLOQUEIO (pedidos pausados, atraso, limites) */}
        {blocked ? (
          <Alert tone={atrasado ? 'danger' : 'warning'} title={blocked.title}>
            {blocked.text}
          </Alert>
        ) : null}

        {/* IDENTIFICAÇÃO DO LIVRO */}
        <View className="gap-2">
          <Text className="text-book-title-lg text-ink">{book.title}</Text>

          {book.subtitle ? (
            <Text className="text-body text-ink-muted">{book.subtitle}</Text>
          ) : null}

          <Text className="text-caption text-ink-muted">
            {bookDescription(book)}
          </Text>
        </View>

        {/* SALVAR E COMPARTILHAR (Salvar chega na Etapa 5) */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button block variant="secondary" icon="bookmark">
              Salvar
            </Button>
          </View>

          <View className="flex-1">
            <Button
              block
              variant="secondary"
              icon="share"
              onPress={() => shareBook(book)}
            >
              Compartilhar
            </Button>
          </View>
        </View>

        {/* AUTORIA */}
        <View>
          <Secao titulo="Autoria" />

          <Text className="text-body text-ink">
            {authorsLine(book.authors)}
          </Text>

          {book.translators.map((translator) => (
            <Text key={translator} className="mt-2 text-caption text-ink-muted">
              {translator} · Tradutor
            </Text>
          ))}
        </View>

        {/* ASSUNTOS */}
        {book.subjects.length > 0 ? (
          <View>
            <Secao titulo="Assuntos" />

            <View className="flex-row flex-wrap gap-2">
              {book.subjects.map((subject) => (
                <View
                  key={subject}
                  className="rounded-pill bg-surface-sunken px-3 py-2"
                >
                  <Text className="text-caption text-ink">{subject}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* A14 — PESSOAS NA FILA */}
        {emprestado && (!action || action.allowed) ? (
          <QueueInfo
            ahead={book.queueLength}
            note={
              action
                ? `Se entrar agora, você será o ${book.queueLength + 1}º da fila.`
                : undefined
            }
          />
        ) : null}

        {/* SINOPSE */}
        {book.synopsis ? (
          <View>
            <Secao titulo="Sinopse" />

            <Text
              className="text-body text-ink"
              numberOfLines={synopsisOpen ? undefined : SYNOPSIS_PREVIEW_LINES}
            >
              {book.synopsis}
            </Text>

            {/* Cópia invisível sem limite de linhas: só serve para medir se o
                texto passa do resumo e o link "Ler sinopse completa" fazer
                sentido. */}
            <Text
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              pointerEvents="none"
              className="text-body text-ink"
              style={{ position: 'absolute', left: 0, right: 0, opacity: 0 }}
              onTextLayout={(event) =>
                setSynopsisTruncated(
                  event.nativeEvent.lines.length > SYNOPSIS_PREVIEW_LINES,
                )
              }
            >
              {book.synopsis}
            </Text>

            {synopsisTruncated && !synopsisOpen ? (
              <Pressable
                accessibilityRole="button"
                className="mt-2 min-h-[44px] justify-center self-start"
                onPress={() => setSynopsisOpen(true)}
              >
                <Text className="text-label text-brand">
                  Ler sinopse completa
                </Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {/* DISPONIBILIDADE */}
        <View>
          <Secao titulo="Disponibilidade" />

          <View className="rounded-md border border-line bg-surface-raised px-3">
            <Linha titulo="Exemplares" valor={shelfText(book)} />

            {emprestado ? (
              <>
                <Linha
                  titulo="Reservas na fila"
                  valor={String(book.queueLength)}
                />

                {book.nextReturnAt ? (
                  <Linha
                    titulo="Próxima devolução"
                    valor={formatDayMonth(book.nextReturnAt)}
                  />
                ) : null}

                <Linha
                  titulo="Quando chegar sua vez"
                  valor={`${QUEUE_CONFIRM_HOURS}h para confirmar e ${PICKUP_BUSINESS_DAYS} dias úteis para retirar`}
                />
              </>
            ) : (
              <>
                <Linha
                  titulo="Empréstimo"
                  valor={`${LOAN_PERIOD_DAYS} dias, domiciliar`}
                />

                <Linha
                  titulo="Retirada"
                  valor={`Até ${PICKUP_BUSINESS_DAYS} dias úteis após solicitar`}
                />

                <Linha
                  titulo="Renovação"
                  valor={`+${LOAN_PERIOD_DAYS} dias, se não houver atraso nem fila`}
                />

                {user ? (
                  <Linha
                    titulo="Seus empréstimos"
                    valor={`${user.activeLoanCount} de ${MAX_ACTIVE_LOANS}`}
                  />
                ) : null}
              </>
            )}
          </View>
        </View>

        {/* LOCALIZAÇÃO */}
        <View>
          <Secao titulo="Onde encontrar" />

          <View className="flex-row gap-3 rounded-md border border-line bg-surface-raised p-4">
            <Icon name="mapPin" color="brand" size={22} />

            <View className="flex-1 gap-1">
              <Text className="text-label text-ink">
                {bookLocationText(book)}
              </Text>

              <Text className="text-caption text-ink-muted">
                Procure pela etiqueta {callNumberText(book)} na lombada.
              </Text>
            </View>
          </View>
        </View>

        {/* REGISTRO COMPLETO */}
        <View>
          <Secao titulo="Registro completo" />

          <View className="rounded-md border border-line bg-surface-raised px-3">
            {registro.map(([titulo, valor]) => (
              <Linha key={titulo} titulo={titulo} valor={valor} />
            ))}
          </View>
        </View>

        {/* EXEMPLARES */}
        <View>
          <Secao titulo="Exemplares" />

          <Text className="mb-3 text-caption text-ink-muted">
            {pluralize(book.copies.length, 'exemplar', 'exemplares')} ·{' '}
            {pluralize(book.queueLength, 'reserva', 'reservas')}
          </Text>

          <View className="gap-3">
            {book.copies.map((copy) => {
              const disponivel = copy.status === COPY_STATUS.available

              return (
                <View
                  key={copy.registration}
                  className="gap-2 rounded-md border border-line bg-surface-raised p-3"
                >
                  <View className="flex-row justify-between gap-2">
                    <Text className="text-label text-ink">
                      Registro {copy.registration}
                    </Text>

                    <Text
                      className={
                        disponivel
                          ? 'text-caption-strong text-success'
                          : 'text-caption-strong text-warning'
                      }
                    >
                      {COPY_STATUS_LABEL[copy.status]}
                    </Text>
                  </View>

                  <Text className="text-caption text-ink-muted">
                    {[book.year, copy.format].filter(Boolean).join(' · ')}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>

      {/* AÇÃO INFERIOR (solicitar e entrar na fila chegam na Etapa 2) */}
      {action ? (
        <View
          className="border-t border-line bg-surface-raised px-4 pt-3"
          style={{
            paddingBottom: Math.max(bottomInset, 16),
          }}
        >
          <Button block variant="primary" disabled={!action.allowed}>
            {pausado
              ? BLOCKED_REASON_MESSAGE[ASSISTANT_BLOCKED_REASON.unavailable]
                  .title
              : BOOK_ACTION_LABEL[action.suggestedAction]}
          </Button>
        </View>
      ) : null}
    </>
  )
}
