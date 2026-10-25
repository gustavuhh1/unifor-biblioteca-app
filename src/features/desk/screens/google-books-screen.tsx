import { useRouter } from 'expo-router'
import { ScrollView, Text, View } from 'react-native'
import { AppBar, Button, Icon } from '@/shared/components'

export function GoogleBooksScreen() {
  const router = useRouter()
  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Atualizar pelo Google Books" subtitle="Código Limpo" back />
      <ScrollView contentContainerClassName="gap-4 px-4 pb-6 pt-2">
        <View className="flex-row items-start gap-3 rounded-md bg-success-soft p-4">
          <Icon name="globe" size={20} color="success" />
          <View className="flex-1 gap-1"><Text className="text-label text-ink">Google Books respondeu</Text><Text className="text-body-sm text-ink">Livro encontrado pelo ISBN 978-85-7608-267-5.</Text></View>
        </View>
        <View className="flex-row items-center gap-3">
          <View className="h-[124px] w-[86px] justify-between rounded-md bg-[#102f78] p-2.5"><Text className="font-serif text-label text-white">Código{ '\n' }Limpo</Text><Text className="text-micro-strong text-white">ROBERT C.{ '\n' }MARTIN</Text></View>
          <View className="flex-1 gap-1"><Text className="text-label text-ink">Código Limpo: habilidades práticas do Agile Software</Text><Text className="text-caption text-ink-muted">Robert C. Martin · Alta Books · 2011</Text></View>
        </View>
        <Text className="text-label-lg text-ink">O que será atualizado</Text>
        <View className="gap-4 rounded-lg border border-line bg-surface-raised p-4">
          {[['image', 'Capa e sinopse', 'Novas, vindas do Google Books.'], ['pencil', 'Autores, editora e ano', 'Conferidos com o cadastro atual.']].map(([icon, title, description]) => (
            <View key={title} className="flex-row items-center gap-3"><View className="size-10 items-center justify-center rounded-md bg-brand-soft"><Icon name={icon as 'image' | 'pencil'} color="brand" /></View><View className="flex-1 gap-1"><Text className="text-label text-ink">{title}</Text><Text className="text-body-sm text-ink-muted">{description}</Text></View><Icon name="check" color="success" /></View>
          ))}
        </View>
        <View className="flex-row items-start gap-3 rounded-md bg-brand-soft p-4"><Icon name="info" size={20} color="brandStrong" /><Text className="flex-1 text-body-sm text-ink">CDU, Cutter, estante e número de exemplares não vêm do Google Books e não mudam.</Text></View>
      </ScrollView>
      <View className="border-t border-line bg-surface-raised px-4 pb-4 pt-3"><Button block icon="check" onPress={() => router.replace('/edit-book')}>Aplicar ao acervo</Button><Button block variant="ghost" onPress={() => router.back()}>Cancelar</Button></View>
    </View>
  )
}
