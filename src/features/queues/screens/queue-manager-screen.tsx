import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { ApiError } from '@/shared/api/errors'
import {
  Alert,
  AppBar,
  BookCover,
  Button,
  EmptyState,
  Icon,
  QueueManagerRow,
  StatusBadge,
} from '@/shared/components'
import { bookCoverTone } from '@/features/catalog/catalog.format'
import { useTheme } from '@/shared/theme/theme-provider'
import { QueueChangeSheet } from '../components/queue-change-sheet'
import { QueueCutSheet } from '../components/queue-cut-sheet'
import { QueueEntrySheet } from '../components/queue-entry-sheet'
import { QueueRemoveSheet } from '../components/queue-remove-sheet'
import {
  useBookQueue,
  useQueueActions,
  useQueueBooks,
} from '../hooks/use-librarian-queue'
import {
  QUEUE_NOTICE,
  buildAddBody,
  buildMoveBody,
  entryBadge,
  entrySince,
  queueSubtitle,
} from '../librarian-queues.format'
import type {
  AddToQueueBody,
  LibrarianQueueEntry,
  QueueMovedDown,
} from '../librarian-queues.types'

// O que a tela está mostrando por cima da lista: a folha de ações, a de adicionar
// ou mover, a de remover ou a confirmação de passar à frente de outros.
type Sheet =
  | { kind: 'entry'; entry: LibrarianQueueEntry }
  | { kind: 'add' }
  | { kind: 'move'; entry: LibrarianQueueEntry }
  | { kind: 'remove'; entry: LibrarianQueueEntry }
  | {
      kind: 'cut'
      movedDown: QueueMovedDown[]
      pending:
        | { type: 'add'; body: AddToQueueBody }
        | { type: 'move'; entry: LibrarianQueueEntry; position: number }
    }

// Texto de erro da API (já em português) ou um aviso genérico.
function errorText(error: unknown): string | undefined {
  if (!error) return undefined
  return error instanceof ApiError
    ? error.message
    : 'Algo deu errado. Tente de novo.'
}

// Fila de um livro para o bibliotecário (B08 a B12, RF-BAL-06 e RF-BAL-07): lê
// GET /librarian/books/{id}/queue e deixa mover, reenviar o aviso, remover e
// adicionar alunos. Mexer no fim não pergunta nada; passar à frente de outros
// mostra quem desce e exige o motivo.
export function QueueManagerScreen() {
  const { colors } = useTheme()
  const { bookId } = useLocalSearchParams<{ bookId: string }>()
  const query = useBookQueue(bookId)
  const books = useQueueBooks()
  const { add, move, remove, resend } = useQueueActions(bookId)
  const [sheet, setSheet] = useState<Sheet | null>(null)
  const [notice, setNotice] = useState('')

  const queue = query.data
  const entries = queue?.items ?? []
  const coverTone = bookCoverTone({
    coverTone: books.data?.find((book) => book.id === bookId)?.coverTone ?? 1,
  })

  function openSheet(next: Sheet | null) {
    add.reset()
    move.reset()
    remove.reset()
    resend.reset()
    setSheet(next)
  }

  // Aviso de resultado e fecha a folha.
  function done(message: string) {
    setNotice(message)
    setSheet(null)
  }

  function submitAdd(input: {
    matricula: string
    position: number
    reason: string
  }) {
    const body = buildAddBody({ ...input, queueLength: entries.length })
    add.mutate(body, {
      onSuccess: (result) => {
        if (result.applied) {
          const name =
            result.queue?.items.find(
              (item) => item.matricula === body.matricula,
            )?.studentName ?? 'Aluno'
          done(QUEUE_NOTICE.added(name, input.position))
        } else {
          setSheet({
            kind: 'cut',
            movedDown: result.movedDown,
            pending: { type: 'add', body },
          })
        }
      },
    })
  }

  function submitMove(entry: LibrarianQueueEntry, position: number) {
    move.mutate(
      { entryId: entry.id, body: buildMoveBody(position) },
      {
        onSuccess: (result) => {
          if (result.applied) {
            done(QUEUE_NOTICE.moved(entry.studentName, position))
          } else {
            setSheet({
              kind: 'cut',
              movedDown: result.movedDown,
              pending: { type: 'move', entry, position },
            })
          }
        },
      },
    )
  }

  function confirmCut(
    pending: Extract<Sheet, { kind: 'cut' }>['pending'],
    reason: string,
  ) {
    if (pending.type === 'add') {
      const position = pending.body.position ?? entries.length + 1
      add.mutate(
        { ...pending.body, reason: reason.trim(), confirmed: true },
        {
          onSuccess: (result) => {
            if (!result.applied) return
            const name =
              result.queue?.items.find(
                (item) => item.matricula === pending.body.matricula,
              )?.studentName ?? 'Aluno'
            done(QUEUE_NOTICE.added(name, position))
          },
        },
      )
      return
    }
    move.mutate(
      {
        entryId: pending.entry.id,
        body: {
          position: pending.position,
          reason: reason.trim(),
          confirmed: true,
        },
      },
      {
        onSuccess: (result) => {
          if (result.applied) {
            done(
              QUEUE_NOTICE.moved(pending.entry.studentName, pending.position),
            )
          }
        },
      },
    )
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Fila do livro"
        subtitle={queue ? queueSubtitle(entries) : undefined}
        back
      />
      {query.isPending ? (
        <View
          accessibilityLabel="Carregando a fila"
          className="flex-1 items-center justify-center"
        >
          <ActivityIndicator color={colors.brand} />
        </View>
      ) : query.isError ? (
        <EmptyState
          icon="alert"
          title="Não foi possível abrir a fila"
          text={errorText(query.error)}
          action={
            <Button icon="refresh" onPress={() => void query.refetch()}>
              Tentar de novo
            </Button>
          }
        />
      ) : (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 32 }}
        >
          {notice ? (
            <Alert
              tone="success"
              icon="checkCircle"
              action="Fechar"
              onAction={() => setNotice('')}
            >
              {notice}
            </Alert>
          ) : null}
          <View className="flex-row gap-3 rounded-lg border border-line bg-surface-raised p-3">
            <BookCover
              title={query.data.book.title}
              tone={coverTone}
              size="md"
            />
            <View className="min-w-0 flex-1 gap-2">
              <Text className="text-label text-ink">
                {query.data.book.title}
              </Text>
              <Text className="text-caption text-ink-muted">
                {`${query.data.book.copiesAvailable} de ${query.data.book.copiesTotal} exemplares na estante`}
              </Text>
              <StatusBadge
                status={
                  query.data.book.copiesAvailable === 0
                    ? 'emprestado'
                    : 'disponivel'
                }
              />
            </View>
          </View>
          <View className="flex-row gap-3 rounded-lg bg-brand-soft p-4">
            <Icon name="info" color="brand" size={20} />
            <Text className="flex-1 text-body text-ink">
              Fila automática. Quando o livro volta, o 1º da fila é avisado e
              tem 24h para confirmar.
            </Text>
          </View>
          {entries.length === 0 ? (
            <EmptyState icon="users" title="Ninguém na fila" />
          ) : (
            <View className="overflow-hidden rounded-lg border border-line">
              {entries.map((entry) => {
                const badge = entryBadge(entry)
                return (
                  <QueueManagerRow
                    key={entry.id}
                    position={entry.position}
                    name={entry.studentName}
                    matricula={entry.matricula}
                    since={entrySince(entry)}
                    status={badge.status}
                    statusLabel={badge.label}
                    reorder={false}
                    onMore={() => openSheet({ kind: 'entry', entry })}
                  />
                )
              })}
            </View>
          )}
          <Button
            block
            variant="secondary"
            icon="plus"
            onPress={() => openSheet({ kind: 'add' })}
          >
            Adicionar aluno à fila
          </Button>
        </ScrollView>
      )}

      {sheet?.kind === 'entry' ? (
        <QueueEntrySheet
          entry={sheet.entry}
          onClose={() => openSheet(null)}
          onMove={() => openSheet({ kind: 'move', entry: sheet.entry })}
          onRemove={() => openSheet({ kind: 'remove', entry: sheet.entry })}
          onResend={() =>
            resend.mutate(sheet.entry.id, {
              onSuccess: () =>
                done(QUEUE_NOTICE.resent(sheet.entry.studentName)),
            })
          }
          resending={resend.isPending}
          error={errorText(resend.error)}
        />
      ) : null}
      {sheet?.kind === 'add' ? (
        <QueueChangeSheet
          entries={entries}
          bookTitle={queue?.book.title ?? ''}
          onClose={() => openSheet(null)}
          onSubmit={submitAdd}
          loading={add.isPending}
          error={errorText(add.error)}
        />
      ) : null}
      {sheet?.kind === 'move' ? (
        <QueueChangeSheet
          entries={entries}
          entry={sheet.entry}
          bookTitle={queue?.book.title ?? ''}
          onClose={() => openSheet(null)}
          onSubmit={({ position }) => submitMove(sheet.entry, position)}
          loading={move.isPending}
          error={errorText(move.error)}
        />
      ) : null}
      {sheet?.kind === 'remove' ? (
        <QueueRemoveSheet
          entry={sheet.entry}
          onCancel={() => openSheet(null)}
          onConfirm={(reason) =>
            remove.mutate(
              { entryId: sheet.entry.id, reason },
              {
                onSuccess: () =>
                  done(QUEUE_NOTICE.removed(sheet.entry.studentName)),
              },
            )
          }
          loading={remove.isPending}
          error={errorText(remove.error)}
        />
      ) : null}
      {sheet?.kind === 'cut' ? (
        <QueueCutSheet
          title={
            sheet.pending.type === 'add'
              ? 'Colocar o aluno à frente da fila?'
              : `Mover ${sheet.pending.entry.studentName} à frente?`
          }
          movedDown={sheet.movedDown}
          initialReason={
            sheet.pending.type === 'add'
              ? (sheet.pending.body.reason ?? '')
              : ''
          }
          onCancel={() =>
            openSheet(
              sheet.pending.type === 'add'
                ? { kind: 'add' }
                : { kind: 'move', entry: sheet.pending.entry },
            )
          }
          onConfirm={(reason) => confirmCut(sheet.pending, reason)}
          loading={add.isPending || move.isPending}
          error={errorText(add.error) ?? errorText(move.error)}
        />
      ) : null}
    </View>
  )
}
