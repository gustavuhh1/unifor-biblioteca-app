import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { AppBar, BottomNav, Button, Icon } from '@/shared/components'
import { ConfirmationSheet } from '@/shared/components/confirmation-sheet'
export interface MeusPasskeysProps { estado?: 'normal' | 'sem-passkey' | 'remover'; onVoltar?: () => void; onCriar?: () => void; onSelecionarAba?: (i: number) => void }
export default function MeusPasskeys({ estado = 'normal', onVoltar, onCriar, onSelecionarAba }: MeusPasskeysProps) {
  const [galaxy, setGalaxy] = useState(true)
  const [confirmando, setConfirmando] = useState(estado === 'remover')
  const atual = estado !== 'sem-passkey'
  return <View className="flex-1 bg-surface"><AppBar title="Meus passkeys" subtitle="Entrar com biometria" back onBack={onVoltar} /><ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
    <View className="flex-row gap-3 rounded-lg bg-brand-soft p-4"><Icon name="fingerprint" color="brand" /><Text className="flex-1 text-body text-ink">Cada passkey vale para um aparelho. Se perder um celular, remova o passkey dele aqui ou recupere o acesso pelo e-mail.</Text></View>
    {atual ? <View className="flex-row items-center gap-3 rounded-lg border border-line bg-surface-raised p-4"><Icon name="smartphone" color="brand" size={24} /><View className="flex-1 gap-1"><Text className="text-label text-ink">Pixel 8 (este aparelho)</Text><Text className="text-caption text-ink-muted">Criado em 14/10 · usado hoje</Text></View><Text className="text-overline text-success">Ativo</Text></View> : null}
    {galaxy ? <View className="flex-row items-center gap-3 rounded-lg border border-line bg-surface-raised p-4"><Icon name="smartphone" color="brand" size={24} /><View className="flex-1 gap-1"><Text className="text-label text-ink">Galaxy A54</Text><Text className="text-caption text-ink-muted">Criado em 02/09 · usado em 11/10</Text></View><Pressable accessibilityRole="button" onPress={() => setConfirmando(true)} className="min-h-[44px] justify-center"><Text className="text-label text-brand">Remover</Text></Pressable></View> : null}
    <Button block disabled={atual} onPress={onCriar}>Criar passkey neste aparelho</Button>
    <Text className="text-caption text-ink-muted">{atual ? 'Este aparelho já tem um passkey. Para usar outro celular, entre no app por ele e crie o passkey em Meus passkeys.' : 'Este aparelho ainda não tem passkey. Crie um para entrar com a biometria, sem digitar a senha.'}</Text>
    {!galaxy ? <Text accessibilityLiveRegion="polite" className="text-caption text-success">Passkey removido nesta demonstração. Suas credenciais reais não foram alteradas.</Text> : null}
  </ScrollView><BottomNav role="aluno" active={4} onSelect={onSelecionarAba} />
    <ConfirmationSheet visible={confirmando} title="Remover o passkey do Galaxy A54?" description="Esse aparelho deixa de entrar no app com a biometria. Você pode criar outro passkey nele quando quiser. Operação demonstrativa." danger confirmText="Remover passkey" onCancel={() => setConfirmando(false)} onConfirm={() => { setGalaxy(false); setConfirmando(false) }} />
  </View>
}