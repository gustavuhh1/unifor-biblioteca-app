import { Text, View } from 'react-native'
import { Alert, Button } from '@/shared/components'
import {
  fieldsText,
  lookupFields,
  sourcesText,
  syncPreview,
} from '../librarian-catalog.format'
import type { IsbnLookup, LibrarianBook } from '../librarian-catalog.types'

interface SyncPreviewProps {
  book: LibrarianBook
  lookup: IsbnLookup
  // O ISBN digitado é o salvo no livro: a atualização usa o ISBN salvo.
  canApply: boolean
  applying: boolean
  onApply: () => void
  onCancel: () => void
}

// Atualizar pelas fontes externas (B23): mostra o que a Open Library e a BrasilAPI
// trouxeram, o que vai ser preenchido e o que não muda. A atualização só preenche
// campo vazio e nunca troca um valor que já existe (RF-GAC-04).
export function SyncPreview({
  book,
  lookup,
  canApply,
  applying,
  onApply,
  onCancel,
}: SyncPreviewProps) {
  const { willFill, kept } = syncPreview(book, lookup.book)
  const found = lookupFields(lookup.book)

  return (
    <View className="gap-3">
      <Alert tone="success" title="Fontes externas responderam">
        {`Livro encontrado na ${sourcesText(lookup.sources)}.`}
      </Alert>

      <Text className="text-title-sm text-ink">O que as fontes trouxeram</Text>
      <View className="gap-2 rounded-lg border border-line bg-surface-raised p-4">
        {found.map(({ field, label, value }) => (
          <View key={field} className="gap-1">
            <Text className="text-label text-ink">{label}</Text>
            <Text className="text-body text-ink-muted" numberOfLines={3}>
              {value}
            </Text>
          </View>
        ))}
      </View>

      <Alert
        tone="info"
        title={
          willFill.length > 0 ? 'O que será preenchido' : 'Nada para preencher'
        }
      >
        {willFill.length > 0
          ? `${fieldsText(willFill)}. A atualização só preenche campo vazio.`
          : 'O livro já tem todos os campos que as fontes trouxeram.'}
      </Alert>
      {kept.length > 0 ? (
        <Text className="text-caption text-ink-muted">
          {`Não muda, porque já existe: ${fieldsText(kept)}. CDU, Cutter, estante, idioma e exemplares nunca vêm das fontes.`}
        </Text>
      ) : null}

      {!canApply ? (
        <Text className="text-caption text-danger">
          Salve o novo ISBN antes de atualizar pelas fontes.
        </Text>
      ) : null}
      <Button
        block
        icon="refresh"
        loading={applying}
        disabled={!canApply || willFill.length === 0}
        onPress={onApply}
      >
        Aplicar ao acervo
      </Button>
      <Button block variant="ghost" onPress={onCancel}>
        Cancelar
      </Button>
    </View>
  )
}
