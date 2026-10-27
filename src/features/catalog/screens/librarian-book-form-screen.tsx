import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMemo, useState } from 'react'
import { Controller, useForm, useWatch, type Control } from 'react-hook-form'
import { ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ApiError } from '@/shared/api/errors'
import { applyApiFieldErrors } from '@/shared/api/form-errors'
import {
  Alert,
  AppBar,
  Button,
  EmptyState,
  TextField,
  Toggle,
  type TextFieldProps,
} from '@/shared/components'
import { ConfirmationSheet } from '@/shared/components/confirmation-sheet'
import { toAppDate } from '@/shared/utils/dates'
import {
  IsbnLookupError,
  IsbnLookupNotice,
} from '../components/isbn-lookup-notice'
import { SyncPreview } from '../components/sync-preview'
import { useCachedLibrarianBook } from '../hooks/use-librarian-books'
import {
  useCreateBook,
  useIsbnLookup,
  useRemoveBook,
  useSyncBook,
  useUpdateBook,
} from '../hooks/use-librarian-book-actions'
import {
  BOOK_NOTICE,
  LIBRARIAN_BOOK_ERROR_CODE,
} from '../librarian-catalog.constants'
import {
  buildCreateBody,
  buildUpdateBody,
  dataSourceNote,
  fieldsText,
  formValuesFromBook,
  isIsbnLike,
  normalizeIsbn,
  nowMs,
  applyLookupToForm,
  type BookFormExtras,
  type BookFormValues,
} from '../librarian-catalog.format'
import type { LibrarianBook, SyncField } from '../librarian-catalog.types'
import {
  BOOK_FORM_FIELDS,
  makeBookFormSchema,
} from '../schemas/book-form.schemas'

const EMPTY_VALUES: BookFormValues = {
  isbn: '',
  title: '',
  authors: '',
  publisher: '',
  edition: '',
  year: '',
  cdu: '',
  cutter: '',
  shelf: '',
  copies: '',
}

const ISBN_NOT_FOUND =
  'Não encontrado nas fontes externas. Preencha os dados abaixo à mão.'
const GENERIC_ERROR = 'Algo deu errado. Tente de novo.'

type FormFieldProps = Omit<
  TextFieldProps,
  'value' | 'onChangeText' | 'error' | 'onBlur'
> & { control: Control<BookFormValues>; name: keyof BookFormValues }

// Campo de texto do formulário ligado ao react-hook-form, com o erro do campo.
function FormField({ control, name, ...props }: FormFieldProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          {...props}
          value={field.value}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  )
}

// Cadastro e edição de livro (RF-GAC-02 a RF-GAC-06, telas B21 a B24 e B26): com
// `id` abre a edição do livro, sem `id` o cadastro. A edição abre a partir da lista
// do Acervo, que já tem o registro completo.
export function LibrarianBookFormScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id?: string }>()
  const book = useCachedLibrarianBook(id)

  if (id && !book) {
    return (
      <View className="flex-1 bg-surface">
        <AppBar title="Editar livro" back />
        <EmptyState
          icon="alert"
          title="Não encontramos este livro na lista"
          text="Volte ao Acervo e abra o livro de novo."
          action={
            <Button onPress={() => router.back()}>Voltar ao Acervo</Button>
          }
        />
      </View>
    )
  }
  return <BookForm key={book?.id ?? 'new'} book={book} />
}

function BookForm({ book }: { book: LibrarianBook | undefined }) {
  const router = useRouter()
  const safe = useSafeAreaInsets()
  const editing = book !== undefined
  // O livro como está salvo: muda depois de atualizar pelas fontes.
  const [saved, setSaved] = useState(book)
  const schema = useMemo(() => makeBookFormSchema(!editing), [editing])
  const form = useForm<BookFormValues>({
    resolver: zodResolver(schema),
    defaultValues: book ? formValuesFromBook(book) : EMPTY_VALUES,
  })
  const [extras, setExtras] = useState<BookFormExtras>({ subjects: [] })
  const [unavailable, setUnavailable] = useState(
    book?.unavailableForNewRequests ?? false,
  )
  const [filled, setFilled] = useState<SyncField[]>([])
  const [previewOpen, setPreviewOpen] = useState(false)
  const [syncedFields, setSyncedFields] = useState<SyncField[] | null>(null)
  const [confirmRemoval, setConfirmRemoval] = useState(false)
  const [removalBlocked, setRemovalBlocked] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const lookup = useIsbnLookup()
  const create = useCreateBook()
  const update = useUpdateBook()
  const sync = useSyncBook()
  const remove = useRemoveBook()
  const found = lookup.data?.found ? lookup.data : undefined
  const notFound = lookup.data !== undefined && !lookup.data.found

  function describe(error: unknown) {
    return error instanceof ApiError ? error.message : GENERIC_ERROR
  }

  // Volta à lista do Acervo com o aviso do que foi feito.
  function finish(notice: (typeof BOOK_NOTICE)[keyof typeof BOOK_NOTICE]) {
    router.dismissTo({
      pathname: '/collection-management',
      params: { notice, noticeKey: String(nowMs()) },
    })
  }

  function searchSources() {
    const isbn = normalizeIsbn(form.getValues('isbn'))
    if (!isIsbnLike(isbn)) {
      form.setError('isbn', { message: 'O ISBN tem 10 ou 13 dígitos.' })
      return
    }
    form.clearErrors('isbn')
    setFilled([])
    lookup.mutate(isbn, {
      onSuccess: (data) => {
        if (!data.found) return
        if (editing) {
          setPreviewOpen(true)
          return
        }
        const next = applyLookupToForm(form.getValues(), extras, data.book)
        form.reset(next.values)
        setExtras(next.extras)
        setFilled(next.filled)
      },
    })
  }

  function onError(error: unknown) {
    if (!applyApiFieldErrors(error, form.setError, BOOK_FORM_FIELDS)) {
      setFormError(describe(error))
    }
  }

  const submit = form.handleSubmit((values) => {
    setFormError(null)
    if (!saved) {
      const year = toAppDate(new Date().toISOString()).getFullYear()
      create.mutate(buildCreateBody(values, extras, nowMs(), year), {
        onSuccess: () => finish(BOOK_NOTICE.created),
        onError,
      })
      return
    }
    const body = buildUpdateBody(values, saved, unavailable)
    if (Object.keys(body).length === 0) {
      setFormError('Nenhuma alteração para salvar.')
      return
    }
    update.mutate(
      { id: saved.id, body },
      { onSuccess: () => finish(BOOK_NOTICE.updated), onError },
    )
  })

  function applySync() {
    if (!saved) return
    setFormError(null)
    sync.mutate(saved.id, {
      onSuccess: ({ book: updated, changedFields }) => {
        setSaved(updated)
        form.reset(formValuesFromBook(updated))
        setPreviewOpen(false)
        setSyncedFields(changedFields)
      },
      onError: (error) => {
        setPreviewOpen(false)
        setFormError(describe(error))
      },
    })
  }

  function removeBook() {
    if (!saved) return
    remove.mutate(saved.id, {
      onSuccess: () => finish(BOOK_NOTICE.removed),
      onError: (error) => {
        setConfirmRemoval(false)
        if (
          error instanceof ApiError &&
          error.code === LIBRARIAN_BOOK_ERROR_CODE.bookInCirculation
        ) {
          setRemovalBlocked(true)
        } else {
          setFormError(describe(error))
        }
      },
    })
  }

  const isbnError =
    form.formState.errors.isbn?.message ??
    (notFound ? ISBN_NOT_FOUND : undefined)
  const typedIsbn = normalizeIsbn(
    useWatch({ control: form.control, name: 'isbn' }),
  )
  const canApplySync = saved !== undefined && typedIsbn === (saved.isbn ?? '')

  // Atualizar pelas fontes externas (B23).
  if (previewOpen && saved && found) {
    return (
      <View className="flex-1 bg-surface">
        <AppBar
          title="Atualizar pelas fontes externas"
          subtitle={saved.title}
          back
          onBack={() => setPreviewOpen(false)}
        />
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            paddingBottom: Math.max(safe.bottom, 16) + 8,
          }}
        >
          <SyncPreview
            book={saved}
            lookup={found}
            canApply={canApplySync}
            applying={sync.isPending}
            onApply={applySync}
            onCancel={() => setPreviewOpen(false)}
          />
        </ScrollView>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title={editing ? 'Editar livro' : 'Novo livro'}
        subtitle={saved ? saved.title : 'Cadastro no acervo'}
        back
        actions={
          saved
            ? [
                {
                  icon: 'trash',
                  label: 'Remover livro',
                  onPress: () => setConfirmRemoval(true),
                },
              ]
            : []
        }
      />
      {/* Os botões ficam no fim da rolagem: com o teclado aberto nada cobre os campos. */}
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: 16,
          gap: 16,
          paddingBottom: Math.max(safe.bottom, 16) + 8,
        }}
      >
        {syncedFields ? (
          <Alert tone="success" title="Atualizado pelas fontes externas">
            {syncedFields.length > 0
              ? `Preenchemos: ${fieldsText(syncedFields)}. CDU, Cutter, estante e exemplares não mudaram.`
              : 'Nada mudou: o livro já tinha todos os campos que as fontes trouxeram.'}
          </Alert>
        ) : null}
        {formError ? (
          <Alert tone="danger" title="Não foi possível salvar">
            {formError}
          </Alert>
        ) : null}
        {removalBlocked ? (
          <Alert
            tone="warning"
            title="Não dá para remover este livro"
            action="Marcar como indisponível"
            onAction={() => {
              setUnavailable(true)
              setRemovalBlocked(false)
            }}
          >
            Há exemplar emprestado ou fila. Marque o livro como indisponível
            para novos pedidos e salve.
          </Alert>
        ) : null}

        {saved ? (
          <View className="gap-3 rounded-lg border border-line bg-surface-raised p-4">
            <Toggle
              label="Indisponível para novos pedidos"
              checked={unavailable}
              onChange={setUnavailable}
            />
            <Text className="text-caption text-ink-muted">
              O livro continua no catálogo, mas ninguém solicita nem entra na
              fila.
            </Text>
          </View>
        ) : null}
        {unavailable ? (
          <Alert tone="warning" title="Livro indisponível">
            Os alunos ainda veem o livro, com Solicitar empréstimo e Entrar na
            fila desativados. Pedidos e filas que já existem não mudam.
          </Alert>
        ) : null}

        <Controller
          control={form.control}
          name="isbn"
          render={({ field }) => (
            <TextField
              label="ISBN"
              icon="barcode"
              inputMode="numeric"
              maxLength={17}
              value={field.value}
              onChangeText={(text) => {
                field.onChange(text)
                form.clearErrors('isbn')
              }}
              onBlur={field.onBlur}
              error={isbnError}
              hint={
                saved
                  ? dataSourceNote(saved)
                  : 'Consultamos a Open Library e a BrasilAPI pelo ISBN.'
              }
            />
          )}
        />
        <Button
          block
          variant="tonal"
          icon="globe"
          loading={lookup.isPending}
          onPress={searchSources}
        >
          Buscar nas fontes externas
        </Button>
        {lookup.isError ? <IsbnLookupError error={lookup.error} /> : null}
        {found && !editing ? (
          <IsbnLookupNotice lookup={found} filled={filled} />
        ) : null}

        <FormField
          control={form.control}
          name="title"
          label="Título"
          placeholder="Preenchido pelas fontes externas"
        />
        <FormField
          control={form.control}
          name="authors"
          label="Autores"
          placeholder="Preenchido pelas fontes externas"
          hint="Separe os autores com ponto e vírgula."
        />
        <FormField
          control={form.control}
          name="publisher"
          label="Editora"
          placeholder="Preenchido pelas fontes externas"
        />
        <View className="flex-row gap-3">
          <View className="flex-1">
            <FormField
              control={form.control}
              name="edition"
              label="Edição"
              placeholder="Ex.: 2ª"
            />
          </View>
          <View className="flex-1">
            <FormField
              control={form.control}
              name="year"
              label="Ano"
              inputMode="numeric"
              maxLength={4}
              placeholder="Ex.: 2019"
            />
          </View>
        </View>

        <Text className="text-title-sm text-ink">Dados da biblioteca</Text>
        <View className="flex-row gap-3">
          <View className="flex-1">
            <FormField control={form.control} name="cdu" label="CDU" />
          </View>
          <View className="flex-1">
            <FormField control={form.control} name="cutter" label="Cutter" />
          </View>
        </View>
        <FormField control={form.control} name="shelf" label="Estante" />
        {saved ? (
          <Text className="text-body text-ink-muted">
            {`Exemplares: ${saved.copiesTotal}. O número de exemplares não muda aqui.`}
          </Text>
        ) : (
          <FormField
            control={form.control}
            name="copies"
            label="Exemplares"
            inputMode="numeric"
            maxLength={2}
            hint="Cada exemplar recebe um número de registro automático."
          />
        )}

        <Button
          block
          loading={create.isPending || update.isPending}
          onPress={() => void submit()}
        >
          {editing ? 'Salvar alterações' : 'Cadastrar livro'}
        </Button>
      </ScrollView>

      <ConfirmationSheet
        visible={confirmRemoval}
        danger
        title={`Remover ${saved?.title ?? 'o livro'} do acervo?`}
        description="O livro some da busca dos alunos. O histórico de empréstimos é mantido. Só dá para remover livros sem exemplar emprestado e sem fila."
        confirmText="Remover livro"
        onCancel={() => setConfirmRemoval(false)}
        onConfirm={removeBook}
      />
    </View>
  )
}
