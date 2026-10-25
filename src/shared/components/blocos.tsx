import type { ReactNode } from 'react'
import { Text, View } from 'react-native'
import { useTheme } from '@/shared/theme/theme-provider'
import { Button } from '@/shared/components/button'
import { TextField } from '@/shared/components/text-field'
import { Icon, type IconName } from '@/shared/components/icon'

type Tom = 'normal' | 'brand' | 'aviso' | 'erro' | 'sucesso'
type Status = 'success' | 'warning' | 'danger' | 'brand'

export function Texto({
  children,
  subtitulo = false,
  destaque = false,
}: {
  children: ReactNode
  subtitulo?: boolean
  destaque?: boolean
}) {
  const { colors } = useTheme()
  return (
    <Text
      style={{
        color: subtitulo ? colors.inkMuted : colors.ink,
        fontSize: destaque ? 19 : 15,
        lineHeight: destaque ? 26 : 22,
        fontFamily: destaque ? 'Figtree_700Bold' : 'Figtree_400Regular',
      }}
    >
      {children}
    </Text>
  )
}

export function Titulo({ children }: { children: ReactNode }) {
  return <Texto destaque>{children}</Texto>
}

export function Caixa({
  children,
  tom = 'normal',
}: {
  children: ReactNode
  tom?: Tom
}) {
  const { colors } = useTheme()
  const fundos = {
    normal: colors.surfaceRaised,
    brand: colors.brandSoft,
    aviso: colors.warningSoft,
    erro: colors.dangerSoft,
    sucesso: colors.successSoft,
  }
  return (
    <View
      style={{
        backgroundColor: fundos[tom],
        borderRadius: 12,
        borderColor: tom === 'normal' ? colors.line : 'transparent',
        borderWidth: 1,
        padding: 14,
        gap: 9,
      }}
    >
      {children}
    </View>
  )
}

export function Linha({
  esquerda,
  direita,
}: {
  esquerda: string
  direita: string
}) {
  const { colors } = useTheme()
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
        paddingVertical: 9,
      }}
    >
      <Text style={{ color: colors.inkMuted, fontSize: 13, flex: 1 }}>
        {esquerda}
      </Text>
      <Text
        style={{
          color: colors.ink,
          fontSize: 13,
          fontFamily: 'Figtree_600SemiBold',
          flex: 1,
          textAlign: 'right',
        }}
      >
        {direita}
      </Text>
    </View>
  )
}

// Botão visual: nenhuma regra de negócio nem chamada à API.
export function Acao({
  label,
  secundario = false,
  disabled = false,
  icon,
}: {
  label: string
  secundario?: boolean
  disabled?: boolean
  icon?: IconName
}) {
  return (
    <Button
      block
      variant={secundario ? 'secondary' : 'primary'}
      disabled={disabled}
      icon={icon}
    >
      {label}
    </Button>
  )
}

// Campo visual de exemplo: editável apenas quando a equipe conectar os formulários.
export function Entrada({
  label,
  valor = '',
  erro,
  segredo = false,
}: {
  label: string
  valor?: string
  erro?: string
  segredo?: boolean
}) {
  return (
    <TextField
      label={label}
      defaultValue={valor}
      error={erro}
      type={segredo ? 'password' : 'text'}
      editable={false}
    />
  )
}

export function Marcador({
  texto,
  tom = 'success',
}: {
  texto: string
  tom?: Status
}) {
  const { colors } = useTheme()
  const fundos = {
    success: colors.successSoft,
    warning: colors.warningSoft,
    danger: colors.dangerSoft,
    brand: colors.brandSoft,
  }
  const icones: Record<Status, IconName> = {
    success: 'check',
    warning: 'clock',
    danger: 'alert',
    brand: 'info',
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: 'flex-start',
        gap: 5,
        alignItems: 'center',
        backgroundColor: fundos[tom],
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
      }}
    >
      <Icon name={icones[tom]} color={tom} size={14} />
      <Text
        style={{
          color: colors[tom],
          fontSize: 12,
          fontFamily: 'Figtree_700Bold',
        }}
      >
        {texto}
      </Text>
    </View>
  )
}

export function TopoEstado({
  icone = 'checkCircle',
  titulo,
  descricao,
}: {
  icone?: IconName
  titulo: string
  descricao: string
}) {
  const { colors } = useTheme()
  return (
    <View
      style={{
        alignItems: 'center',
        gap: 12,
        paddingTop: 65,
        paddingBottom: 30,
      }}
    >
      <View
        style={{
          padding: 25,
          borderRadius: 30,
          backgroundColor: colors.brandSoft,
        }}
      >
        <Icon name={icone} size={36} color="brand" />
      </View>
      <Titulo>{titulo}</Titulo>
      <Text
        style={{ textAlign: 'center', color: colors.inkMuted, lineHeight: 22 }}
      >
        {descricao}
      </Text>
    </View>
  )
}
