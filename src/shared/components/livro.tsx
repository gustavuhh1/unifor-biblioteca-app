import { Text, View } from 'react-native'
import { useTheme } from '@/shared/theme/theme-provider'
import { Caixa, Marcador, Texto } from './blocos'
import type { ColorToken } from '@/shared/theme/tokens.generated'
export function CapaLivro({
  nome,
  autor,
  cor = 'cover2',
  largura = 102,
}: {
  nome: string
  autor?: string
  cor?: ColorToken
  largura?: number
}) {
  const { colors } = useTheme()
  return (
    <View
      style={{
        width: largura,
        height: (largura * 146) / 102,
        borderRadius: 9,
        padding: 10,
        backgroundColor: colors[cor],
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}
    >
      <Text
        style={{
          color: colors.onCover,
          fontFamily: 'Newsreader_600SemiBold',
          fontSize: 17,
        }}
        numberOfLines={3}
      >
        {nome}
      </Text>
      <Text style={{ color: colors.onCover, fontSize: 9 }}>
        {autor?.toUpperCase() || 'BIBLIOTECA UNIFOR'}
      </Text>
    </View>
  )
}
export function CartaoLivro({
  titulo,
  autor,
  emprestado = false,
  cor = 'cover2',
}: {
  titulo: string
  autor: string
  emprestado?: boolean
  cor?: ColorToken
}) {
  return (
    <Caixa>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <CapaLivro nome={titulo} autor={autor} cor={cor} />
        <View style={{ flex: 1, gap: 7 }}>
          <Texto destaque>{titulo}</Texto>
          <Texto subtitulo>{autor}</Texto>
          <Marcador
            tom={emprestado ? 'warning' : 'success'}
            texto={emprestado ? 'Emprestado' : 'Disponível'}
          />
        </View>
      </View>
    </Caixa>
  )
}
