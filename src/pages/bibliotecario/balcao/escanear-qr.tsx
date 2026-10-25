import { Pressable, StatusBar, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Icon } from '@/shared/components'
export interface EscanearQrProps { onVoltar?: () => void; onDigitar?: () => void; onLerQrDemo?: () => void }
export default function EscanearQR({ onVoltar, onDigitar, onLerQrDemo }: EscanearQrProps) {
  const safe = useSafeAreaInsets()
  return <View className="flex-1 bg-[#05070d]" style={{ paddingTop: safe.top, paddingBottom: safe.bottom + 16 }}><StatusBar barStyle="light-content" />
    <View className="flex-row items-center gap-3 px-4"><Pressable onPress={onVoltar} accessibilityRole="button" accessibilityLabel="Fechar leitor" className="h-[44px] w-[44px] items-center justify-center rounded-pill bg-[#ffffff1a]"><Icon name="x" color="onCover" /></Pressable><Text className="text-label text-on-cover">Escanear</Text></View>
    <View className="flex-1 items-center justify-center gap-6 px-6">
      <View className="h-[256px] w-[256px] max-w-full items-center justify-center"><View className="absolute left-0 top-0 h-14 w-14 rounded-tl-lg border-l-4 border-t-4 border-[#7fa6ff]" /><View className="absolute right-0 top-0 h-14 w-14 rounded-tr-lg border-r-4 border-t-4 border-[#7fa6ff]" /><View className="absolute bottom-0 left-0 h-14 w-14 rounded-bl-lg border-b-4 border-l-4 border-[#7fa6ff]" /><View className="absolute bottom-0 right-0 h-14 w-14 rounded-br-lg border-b-4 border-r-4 border-[#7fa6ff]" /><View className="h-[2px] w-[80%] bg-[#7fa6ff]" /></View>
      <Text className="text-center text-label text-on-cover">Aponte para o QR no app do aluno</Text><Text className="text-center text-body text-[#a9b4cc]">O QR do pedido abre a ficha do aluno. Ali você entrega o pedido e registra devoluções.</Text>
      <Pressable onPress={onLerQrDemo} accessibilityRole="button" className="min-h-[44px] justify-center"><Text className="text-caption text-[#a9b4cc]">Simular leitura de QR no preview</Text></Pressable>
    </View>
    <Pressable onPress={onDigitar} accessibilityRole="button" className="mx-4 min-h-12 flex-row items-center justify-center gap-2 rounded-md bg-[#152549] px-4"><Icon name="keyboard" color="onCover" /><Text className="text-label text-[#a9c1ff]">Digitar matrícula ou código</Text></Pressable>
  </View>
}