import { Text, View } from 'react-native'
import { Icon } from './icon'

export interface QueueInfoProps {
  // Quantas pessoas estão na frente do aluno.
  ahead: number
  // O aluno já está na fila (mostra "Você" em vez da posição que ele teria).
  joined?: boolean
  // Frase de apoio abaixo da linha da fila.
  note?: string
}

// Quantos marcadores de posição a linha mostra antes do "Você".
const MAX_MARKERS = 3

// "pessoa" ou "pessoas na sua frente".
function aheadText(ahead: number): string {
  if (ahead === 0) return 'ninguém na sua frente'
  return ahead === 1 ? 'pessoa na sua frente' : 'pessoas na sua frente'
}

// Mostra quantas pessoas estão na frente do aluno, antes e depois de entrar na
// fila (components.d.ts, QueueInfo; RF-FIL-01). A linha vai do livro, com quem
// está com ele, até o "Você".
export function QueueInfo({ ahead, joined = false, note }: QueueInfoProps) {
  const markers = Array.from(
    { length: Math.min(ahead, MAX_MARKERS) },
    (_, index) => index + 1,
  )
  return (
    <View
      accessible
      accessibilityLabel={`${ahead} ${aheadText(ahead)}`}
      className="gap-3 rounded-lg bg-brand-soft p-4"
    >
      <View className="flex-row items-baseline gap-2">
        {ahead > 0 ? (
          <Text className="text-number-lg text-brand-strong">{ahead}</Text>
        ) : null}
        <Text className="text-label text-ink">{aheadText(ahead)}</Text>
      </View>
      <View className="flex-row items-center gap-1.5">
        <View className="size-[28px] items-center justify-center rounded-pill bg-warning-soft">
          <Icon name="book" size={14} color="warning" />
        </View>
        {markers.map((position) => (
          <View key={position} className="flex-1 flex-row items-center gap-1.5">
            <View className="h-0.5 flex-1 rounded-[1px] bg-line" />
            <View className="size-[28px] items-center justify-center rounded-pill border-[1.5px] border-line bg-surface-raised">
              <Text className="text-micro-strong text-ink-muted">
                {position}º
              </Text>
            </View>
          </View>
        ))}
        <View className="h-0.5 flex-1 rounded-[1px] bg-line" />
        <View
          className={`h-[28px] items-center justify-center rounded-pill bg-brand ${
            joined ? 'w-[44px]' : 'w-[28px]'
          }`}
        >
          <Text className="text-micro-strong text-on-brand">
            {joined ? 'Você' : `${ahead + 1}º`}
          </Text>
        </View>
      </View>
      {note ? (
        <Text className="text-caption text-ink-muted">{note}</Text>
      ) : null}
    </View>
  )
}
