import { Text, View } from 'react-native'
import { Icon } from './icon'
import { STATUS_STYLE, type Status } from './status-style'

export type { Status } from './status-style'

export interface StatusBadgeProps {
  status: Status
  // Troca a palavra do selo, sem mudar cor nem ícone (ex.: "Emprestado até 24/10").
  label?: string
}

// Selo de status do livro ou do empréstimo (components.d.ts, StatusBadge).
export function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = STATUS_STYLE[status]
  return (
    <View
      className={`min-h-6 flex-row items-center gap-1 self-start rounded-sm pl-1.5 pr-2 ${style.background}`}
    >
      <Icon name={style.icon} size={14} color={style.color} />
      <Text className={`text-overline ${style.text}`}>
        {label ?? style.label}
      </Text>
    </View>
  )
}
