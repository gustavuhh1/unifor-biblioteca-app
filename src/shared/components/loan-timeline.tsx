import { Text, View } from 'react-native'
import { Icon } from './icon'

export type TimelineState = 'done' | 'current' | 'todo' | 'skipped'

export interface TimelineStepItem {
  label: string
  // Quando aconteceu ou o que falta: "14/10 às 09:12".
  detail?: string
  state?: TimelineState
}

export interface LoanTimelineProps {
  steps: TimelineStepItem[]
}

// Marcador de 24px de cada etapa: concluída (verde com check), atual (anel azul com
// ponto), pendente (anel cinza) e ignorada (cinza com x).
function Marker({ state }: { state: TimelineState }) {
  if (state === 'done') {
    return (
      <View className="size-6 items-center justify-center rounded-pill bg-success">
        <Icon name="check" size={14} color="onBrand" />
      </View>
    )
  }
  if (state === 'current') {
    return (
      <View className="size-6 items-center justify-center rounded-pill border-2 border-brand bg-surface-raised">
        <View className="size-[10px] rounded-pill bg-brand" />
      </View>
    )
  }
  if (state === 'skipped') {
    return (
      <View className="size-6 items-center justify-center rounded-pill bg-neutral-soft">
        <Icon name="x" size={14} color="neutralInk" />
      </View>
    )
  }
  return (
    <View className="size-6 rounded-pill border-2 border-line-strong bg-surface-raised" />
  )
}

// Linha do tempo do pedido (components.d.ts, LoanTimeline): as etapas empilhadas,
// com a linha verde entre as concluídas e cinza depois da etapa atual.
export function LoanTimeline({ steps }: LoanTimelineProps) {
  return (
    <View>
      {steps.map((step, index) => {
        const state = step.state ?? 'todo'
        const last = index === steps.length - 1
        const pending = state === 'todo' || state === 'skipped'
        return (
          <View key={`${index}-${step.label}`} className="flex-row gap-3">
            <View className="items-center gap-0.5">
              <Marker state={state} />
              {last ? null : (
                <View
                  className={`w-0.5 flex-1 ${
                    state === 'done' ? 'bg-success' : 'bg-line'
                  }`}
                />
              )}
            </View>
            <View className="min-w-0 flex-1 gap-0.5 pb-4 pt-0.5">
              <Text
                className={`text-label ${pending ? 'text-ink-muted' : 'text-ink'}`}
              >
                {step.label}
              </Text>
              {step.detail ? (
                <Text className="text-caption text-ink-muted">
                  {step.detail}
                </Text>
              ) : null}
            </View>
          </View>
        )
      })}
    </View>
  )
}
