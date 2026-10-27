import { Alert } from '@/shared/components'
import { ApiError } from '@/shared/api/errors'
import { fieldsText, sourcesText } from '../librarian-catalog.format'
import type { IsbnLookup, SyncField } from '../librarian-catalog.types'

interface IsbnLookupNoticeProps {
  lookup: IsbnLookup
  // Campos do formulário que a consulta preencheu.
  filled: SyncField[]
}

// Resultado da consulta de ISBN no cadastro (B21): diz quais fontes externas
// responderam e o que foi preenchido. O ISBN não encontrado é mostrado em
// vermelho no próprio campo, pela tela.
export function IsbnLookupNotice({ lookup, filled }: IsbnLookupNoticeProps) {
  return (
    <Alert tone="success" title="Fontes externas responderam">
      {`Encontrado na ${sourcesText(lookup.sources)}.${
        filled.length > 0
          ? ` Preenchemos: ${fieldsText(filled)}.`
          : ' Os campos que você já preencheu não foram trocados.'
      } CDU, Cutter, estante e exemplares não vêm das fontes: preencha à mão.`}
    </Alert>
  )
}

// Falha na consulta: uma fonte fora do ar não deixa afirmar que o ISBN não existe
// (502), e qualquer outro erro mostra a mensagem da API.
export function IsbnLookupError({ error }: { error: unknown }) {
  return (
    <Alert tone="warning" title="Não foi possível consultar as fontes">
      {error instanceof ApiError
        ? error.message
        : 'Tente de novo ou preencha os dados à mão.'}
    </Alert>
  )
}
