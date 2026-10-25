import { Text, View } from 'react-native'

export interface AvatarProps {
  // Nome completo; o avatar mostra as iniciais (ou "?" se estiver vazio).
  name: string
  // Entre 32 e 64; o padrão é 40.
  size?: number
}

// Duas iniciais: a primeira letra do primeiro e do último nome ("Lucas Almeida" → "LA").
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  const first = parts[0]!.charAt(0)
  const last = parts.length > 1 ? parts[parts.length - 1]!.charAt(0) : ''
  return `${first}${last}`.toUpperCase()
}

// Iniciais do aluno ou do bibliotecário (components.d.ts, Avatar).
export function Avatar({ name, size = 40 }: AvatarProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="items-center justify-center rounded-pill bg-brand-soft"
      style={{ width: size, height: size }}
    >
      <Text
        className="text-label text-brand-strong"
        style={{ fontSize: Math.round(size * 0.375) }}
      >
        {initialsOf(name)}
      </Text>
    </View>
  )
}
