import { Pressable, Text, View } from 'react-native'
import { Avatar } from './avatar'
import { Icon } from './icon'
import { StatusBadge, type Status } from './status-badge'

export interface QueueManagerRowProps {
  // Posição na fila (1 = o primeiro, em azul).
  position: number
  name: string
  matricula: string
  // "desde 02/10".
  since?: string
  // Estado do lugar (ex.: `aguardando` = na vez, esperando confirmar).
  status?: Status
  statusLabel?: string
  // Mostra a alça de arrastar para mudar a posição.
  reorder?: boolean
  // Abre as ações do lugar (mudar posição, reenviar aviso, remover).
  onMore?: () => void
}

// Um aluno na gestão da fila do bibliotecário (components.d.ts, QueueManagerRow;
// RF-BAL-06).
export function QueueManagerRow({
  position,
  name,
  matricula,
  since,
  status,
  statusLabel,
  reorder = true,
  onMore,
}: QueueManagerRowProps) {
  return (
    <View className="flex-row items-center gap-3 border-b border-line bg-surface-raised py-3 pl-3 pr-2">
      {reorder ? <Icon name="grip" size={18} color="inkFaint" /> : null}
      <Text
        className={`text-title-sm ${position === 1 ? 'text-brand' : 'text-ink-muted'}`}
      >
        {position}º
      </Text>
      <Avatar name={name} size={36} />
      <View className="min-w-0 flex-1">
        <Text className="text-label text-ink" numberOfLines={1}>
          {name}
        </Text>
        <Text className="text-caption text-ink-muted" numberOfLines={1}>
          {since ? `${matricula} · ${since}` : matricula}
        </Text>
        {status ? (
          <View className="pt-1">
            <StatusBadge status={status} label={statusLabel} />
          </View>
        ) : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ações de ${name}`}
        className="size-[44px] items-center justify-center rounded-pill"
        onPress={onMore}
      >
        <Icon name="more" size={22} />
      </Pressable>
    </View>
  )
}
