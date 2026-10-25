import { Pressable, Text, View } from 'react-native'

export function SegmentedTabs<T extends string>({ items, value, onChange }: {
  items: readonly { value: T; label: string }[]; value: T; onChange: (value: T) => void
}) {
  return <View accessibilityRole="tablist" className="flex-row rounded-pill bg-surface-sunken p-1">
    {items.map(item => <Pressable key={item.value} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected: item.value === value }} onPress={() => onChange(item.value)} className={`min-h-[44px] flex-1 items-center justify-center rounded-pill px-1 py-2 ${item.value === value ? 'bg-surface-raised' : ''}`}>
      <Text className={`text-center text-caption-strong ${item.value === value ? 'text-brand' : 'text-ink-muted'}`}>{item.label}</Text>
    </Pressable>)}
  </View>
}
