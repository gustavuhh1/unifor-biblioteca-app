import { Text, View } from 'react-native'
import Svg, { Path } from 'react-native-svg'

export type CoverTone = 1 | 2 | 3 | 4 | 5 | 6
export type CoverSize = 'sm' | 'md' | 'lg'

// Cor de fundo de cada tom (tokens cover-1 a cover-6); iguais nos dois temas.
const TONE_CLASS: Record<CoverTone, string> = {
  1: 'bg-cover-1',
  2: 'bg-cover-2',
  3: 'bg-cover-3',
  4: 'bg-cover-4',
  5: 'bg-cover-5',
  6: 'bg-cover-6',
}

interface SizeStyle {
  // Classe da caixa (largura, altura, padding e raio).
  box: string
  // Só os tamanhos M e G mostram título e autor sobre a capa.
  titleClass?: string
  // Lado do desenho dos arcos e quanto ele sai da capa (canto inferior direito).
  arcs: number
  arcsOffset: { bottom: number; right: number }
}

// P (listas), M (cards) e G (detalhe e grade) do Figma.
const SIZE: Record<CoverSize, SizeStyle> = {
  sm: {
    box: 'h-[80px] w-14 rounded-sm p-2',
    arcs: 52,
    arcsOffset: { bottom: -7, right: -10 },
  },
  md: {
    box: 'h-[128px] w-[88px] rounded-md p-2.5',
    titleClass: 'text-capa-m',
    arcs: 81,
    arcsOffset: { bottom: -11, right: -16 },
  },
  lg: {
    box: 'h-[214px] w-[148px] rounded-md p-3.5',
    titleClass: 'text-capa-g',
    arcs: 136,
    arcsOffset: { bottom: -19, right: -27 },
  },
}

export interface BookCoverProps {
  title: string
  author?: string
  tone?: CoverTone
  size?: CoverSize
}

// Os três arcos concêntricos da marca no canto da capa (README do DS, Marca):
// brancos com 22% de opacidade, num desenho de 81 x 81.
function Arcs({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 81 81" fill="none">
      {[
        'M8.1 81A32.4 32.4 0 0 1 72.9 81',
        'M22.68 81A17.82 17.82 0 0 1 58.32 81',
        'M34.02 81A6.48 6.48 0 0 1 46.98 81',
      ].map((d) => (
        <Path key={d} d={d} stroke="#ffffff" strokeWidth={9} opacity={0.22} />
      ))}
    </Svg>
  )
}

// Capa gerada quando o acervo não tem imagem (components.d.ts, BookCover). O
// título vai na serifa e o texto fica em on-cover nos dois temas.
export function BookCover({
  title,
  author,
  tone = 1,
  size = 'sm',
}: BookCoverProps) {
  const style = SIZE[size]
  return (
    <View
      accessible
      accessibilityLabel={author ? `${title}, de ${author}` : title}
      className={`justify-between overflow-hidden ${TONE_CLASS[tone]} ${style.box}`}
    >
      {style.titleClass ? (
        <>
          <Text className={`${style.titleClass} text-on-cover`}>{title}</Text>
          {author ? (
            <Text className="text-capa-autor text-on-cover opacity-85">
              {author}
            </Text>
          ) : null}
        </>
      ) : null}
      <View pointerEvents="none" className="absolute" style={style.arcsOffset}>
        <Arcs size={style.arcs} />
      </View>
    </View>
  )
}
