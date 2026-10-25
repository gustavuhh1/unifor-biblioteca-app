import QRCode from 'react-native-qrcode-svg'
import { Text, View } from 'react-native'
import { useTheme } from '../theme/theme-provider'
import { BookCover, type CoverTone } from './book-cover'
import { Icon } from './icon'

export interface QRPassProps {
  // O segredo do pedido (qrToken) que o QR carrega. O QR é gerado no aparelho,
  // então aparece também sem internet (RF-EMP-07, RNF-CON-01).
  value: string
  // Código curto do pedido, digitado no balcão sem QR: "RET-4821".
  code: string
  matricula: string
  name: string
  book: string
  author?: string
  tone?: CoverTone
  // Prazo de retirada por extenso: "até seg, 19/10".
  expires?: string
  heading?: string
}

// Lado do QR e da moldura branca, como no Figma.
const QR_SIZE = 176

// Comprovante que o aluno mostra no balcão (components.d.ts, QRPass). O QR usa
// qr-ink sobre qr-paper e fica escuro sobre branco também no tema escuro, para o
// leitor ler (README do DS, Cor).
export function QRPass({
  value,
  code,
  matricula,
  name,
  book,
  author,
  tone,
  expires,
  heading = 'Retirada no balcão',
}: QRPassProps) {
  const { colors, shadows } = useTheme()
  return (
    <View
      className="overflow-hidden rounded-sheet border border-line bg-surface-raised"
      style={{ boxShadow: shadows.card }}
    >
      <View className="flex-row items-center justify-between bg-brand px-5 py-4">
        <Text className="text-overline text-on-brand">{heading}</Text>
        {expires ? (
          <View className="h-[30px] flex-row items-center gap-1.5 rounded-pill bg-brand-soft pl-2.5 pr-3">
            <Icon name="qr" size={16} color="brandStrong" />
            <Text className="text-caption text-brand-strong">{expires}</Text>
          </View>
        ) : null}
      </View>
      <View className="items-center gap-2 px-5 pb-3 pt-5">
        <View
          accessible
          accessibilityLabel={`QR do pedido ${code}`}
          className="rounded-md bg-qr-paper p-2.5"
        >
          <QRCode
            value={value}
            size={QR_SIZE}
            color={colors.qrInk}
            backgroundColor={colors.qrPaper}
            ecl="M"
            quietZone={0}
          />
        </View>
        <Text className="text-code text-ink" selectable>
          {code}
        </Text>
        <Text className="text-caption text-ink-muted">
          {name} · Matrícula {matricula}
        </Text>
        <View className="h-px self-stretch bg-line" />
      </View>
      <View className="flex-row items-center gap-3 px-5 pb-5 pt-4">
        <BookCover title={book} author={author} tone={tone} size="sm" />
        <View className="min-w-0 flex-1 gap-0.5">
          <Text className="text-book-title text-ink" numberOfLines={2}>
            {book}
          </Text>
          {author ? (
            <Text className="text-caption text-ink-muted" numberOfLines={1}>
              {author}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  )
}
