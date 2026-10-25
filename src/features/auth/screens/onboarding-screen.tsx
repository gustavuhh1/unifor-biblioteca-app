import React, { useRef, useState } from 'react'
import { ScrollView, FlatList, Pressable, Text, View, useWindowDimensions } from 'react-native'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button } from '@/shared/components/button'
import { Icon, type IconName } from '@/shared/components/icon'

import { useReducedMotion } from '@/shared/theme/use-reduced-motion'

type Etapa = 1 | 2 | 3

type ApresentacaoProps = {
  etapa?: Etapa
  onConcluir?: () => void
  onPular?: () => void
}

const paginas: { id: Etapa; titulo: string; descricao: string; icone: IconName }[] = [
  { id: 1, titulo: 'Ache e peça livros pelo celular', descricao: 'Busque no acervo, veja se há exemplar na estante e solicite. Você retira no balcão em até 2 dias úteis.', icone: 'search' },
  { id: 2, titulo: 'Livro emprestado? Entre na fila', descricao: 'Antes de entrar, você vê quantas pessoas estão na frente. Quando chegar sua vez, tem 24h para confirmar.', icone: 'users' },
  { id: 3, titulo: 'Dúvidas? Pergunte ao Assistente', descricao: 'Ele explica como o app funciona e sugere livros pelo que você já leu.', icone: 'sparkle' },
]

export function OnboardingScreen({ etapa = 1, onConcluir, onPular }: ApresentacaoProps) {
  const { width } = useWindowDimensions()
  const reducedMotion = useReducedMotion()
  const insets = useSafeAreaInsets()
  const lista = useRef<FlatList<(typeof paginas)[number]>>(null)
  const [indice, setIndice] = useState(etapa - 1)

  function avancar() {
    if (indice === paginas.length - 1) { onConcluir?.(); return }
    const proximo = indice + 1
    lista.current?.scrollToIndex({ index: proximo, animated: !reducedMotion })
    setIndice(proximo)
  }

  function atualizarIndice(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const proximo = Math.max(0, Math.min(2, Math.round(e.nativeEvent.contentOffset.x / width)))
    setIndice(proximo)
  }

  return (
    <View className="flex-1 bg-surface" style={{ paddingTop: insets.top }}>
      <View className="h-12 flex-row items-center justify-end px-5">
        <Pressable accessibilityRole="button" accessibilityLabel="Pular apresentação" onPress={onPular} hitSlop={12} className="min-h-[44px] justify-center">
          <Text className="text-label text-brand">Pular</Text>
        </Pressable>
      </View>
      <FlatList
        testID="apresentacao-paginas"
        key={width}
        ref={lista}
        data={paginas}
        keyExtractor={item => String(item.id)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        initialScrollIndex={indice}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onMomentumScrollEnd={atualizarIndice}
        renderItem={({ item }) => (
          <ScrollView style={{ width }} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
            <View className="mb-12 h-[180px] w-[180px] items-center justify-center rounded-pill bg-brand-soft">
              <Icon name={item.icone} size={56} strokeWidth={1.35} color="brand" />
            </View>
            <Text className="max-w-[325px] text-center text-title-lg text-ink" style={{ marginBottom: 16 }}>
              {item.titulo}
            </Text>
            <Text className="max-w-[330px] text-center text-body text-ink-muted" style={{ lineHeight: 22 }}>
              {item.descricao}
            </Text>
          </ScrollView>
        )}
      />
      <View className="flex-row justify-center gap-2 pb-8" accessibilityLabel={`Etapa ${indice + 1} de 3`}>
        {paginas.map((item, i) => (
          <Pressable key={item.id} accessibilityRole="button" accessibilityLabel={`Ir para etapa ${item.id}`} onPress={() => { lista.current?.scrollToIndex({ index: i, animated: !reducedMotion }); setIndice(i) }}
            accessibilityState={{ selected: indice === i }} className="min-h-[44px] min-w-[44px] items-center justify-center"><View className={`h-1.5 rounded-pill ${indice === i ? 'w-[28px] bg-brand' : 'w-2 bg-line'}`} /></Pressable>
        ))}
      </View>
      <View className="px-4 pt-2" style={{ paddingBottom: Math.max(insets.bottom, 16) }}>
        <Button block variant="primary" onPress={avancar}>{indice === 2 ? 'Começar' : 'Próximo'}</Button>
      </View>
    </View>
  )
}
