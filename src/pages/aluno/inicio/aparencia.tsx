import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { AppBar } from '@/shared/components/app-bar'
import { Icon } from '@/shared/components/icon'
import { useTheme } from '@/shared/theme/theme-provider'
import type { ThemePreference } from '@/shared/theme/theme-preference'
export interface AparenciaProps { onVoltar?: () => void }
const temas: { id: ThemePreference; titulo: string; descricao: string }[] = [
  { id: 'light', titulo: 'Claro', descricao: 'Fundo claro, ideal para ambientes iluminados.' },
  { id: 'dark', titulo: 'Escuro', descricao: 'Fundo escuro, confortável com pouca luz.' },
  { id: 'system', titulo: 'Igual ao celular', descricao: 'Acompanha o tema configurado no seu aparelho.' },
]
export default function Aparencia({ onVoltar }: AparenciaProps) {
  const { preference, setPreference } = useTheme()
  return <View className="flex-1 bg-surface"><AppBar title="Aparência" back onBack={onVoltar}/><View className="gap-3 px-4"><Text className="text-body text-ink-muted">Escolha como o app aparece. O tema vale para aluno e bibliotecário.</Text>
    {temas.map(t => <Pressable key={t.id} onPress={() => setPreference(t.id)} accessibilityRole="radio" accessibilityState={{ checked: preference === t.id }} className={`flex-row items-center gap-3 rounded-md border p-4 ${preference === t.id ? 'border-brand bg-brand-soft' : 'border-line bg-surface-raised'}`}><View className="flex-1 gap-1"><Text className="text-label text-ink">{t.titulo}</Text><Text className="text-caption text-ink-muted">{t.descricao}</Text></View>{preference === t.id ? <Icon name="checkCircle" color="brand"/> : <View className="h-5 w-5 rounded-pill border border-line-strong"/>}</Pressable>)}
  </View></View>
}
