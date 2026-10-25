import { useReducedMotion } from '@/shared/theme/use-reduced-motion'
import { CapaLivro } from '@/shared/components/livro'

import React, { useState } from 'react'
import { Modal, Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { BottomNav } from '@/shared/components/bottom-nav'
import { Button } from '@/shared/components/button'
import { Icon } from '@/shared/components/icon'

type EstadoMinhasFilas =
  | 'desistencia-confirmada'
  | 'duas-filas'
  | 'confirmar-saida'
  | 'saiu-da-fila'
  | 'multiplas-edicoes'

type MinhasFilasProps = {
  estado?: EstadoMinhasFilas
  onVouRetirar?: () => void
  onSairFila?: () => void
  onSelecionarAba?: (indice: number) => void
  onAtivos?: () => void
  onHistorico?: () => void
}

export function MyQueuesScreen({
  estado = 'duas-filas',
  onVouRetirar,
  onSairFila,
  onSelecionarAba,
  onAtivos,
  onHistorico,
}: MinhasFilasProps) {
  const reducedMotion = useReducedMotion()

  const insets = useSafeAreaInsets()

  const [confirmarSaida, setConfirmarSaida] = useState(
    estado === 'confirmar-saida',
  )

  const [mostrarArquitetura, setMostrarArquitetura] = useState(
    estado === 'desistencia-confirmada' ||
      estado === 'duas-filas' ||
      estado === 'confirmar-saida',
  )

  const [mostrarAviso, setMostrarAviso] = useState(
    estado === 'desistencia-confirmada'
      ? 'Você desistiu. O próximo foi avisado.'
      : estado === 'saiu-da-fila'
        ? 'Você saiu da fila.'
        : '',
  )

  const multiplas = estado === 'multiplas-edicoes'
  const [mostrarEdicoes, setMostrarEdicoes] = useState(multiplas)
  const exibirCodigo = estado !== 'desistencia-confirmada'

  function confirmarDesistencia() {
    setConfirmarSaida(false)
    if (multiplas) setMostrarEdicoes(false)
    else setMostrarArquitetura(false)
    setMostrarAviso('Você saiu da fila.')
    onSairFila?.()
  }

  return (
    <View className="flex-1 bg-surface">
      {/* CABEÇALHO */}
      <View
        className="gap-1 px-4 pb-4"
        style={{
          paddingTop: insets.top + 12,
        }}
      >
        <Text className="text-title-lg text-ink">Meus empréstimos</Text>

        <Text className="text-caption text-ink-muted">
          3 de 10 livros com você
        </Text>
      </View>

      {/* ABAS */}
      <View className="flex-row border-b border-line px-4">
        {['Ativos (3)', 'Na fila', 'Histórico'].map((aba, index) => (
          <Pressable
            key={aba}
            accessibilityRole="tab"
            accessibilityState={{ selected: index === 1 }}
            onPress={
              index === 0 ? onAtivos : index === 2 ? onHistorico : undefined
            }
            className={
              index === 1
                ? 'flex-1 items-center border-b-2 border-brand py-3'
                : 'flex-1 items-center py-3'
            }
          >
            <Text
              className={
                index === 1
                  ? 'text-label text-brand'
                  : 'text-label text-ink-muted'
              }
            >
              {index === 1
                ? `Na fila (${
                    (exibirCodigo ? 1 : 0) +
                    (mostrarArquitetura ? 1 : 0) +
                    (mostrarEdicoes ? 1 : 0)
                  })`
                : aba}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-4 py-5"
      >
        {/* CÓDIGO LIMPO — SUA VEZ */}
        {exibirCodigo && (
          <View className="gap-4 rounded-md border border-line bg-surface-raised p-4">
            <View className="flex-row gap-3">
              <CapaLivro nome="Código Limpo" cor="cover1" largura={66} />

              <View className="flex-1 gap-2">
                <Text className="text-book-title text-ink">Código Limpo</Text>

                <Text className="text-caption text-ink-muted">
                  Robert C. Martin
                </Text>

                <View className="self-start rounded-pill bg-warning-soft px-3 py-1">
                  <Text className="text-caption-strong text-warning">
                    Sua vez · confirme
                  </Text>
                </View>
              </View>
            </View>

            <View className="rounded-md bg-warning-soft p-3">
              <Text className="text-caption-strong text-ink">
                Confirme em 18h 40min (até 16/10, 09:12)
              </Text>
            </View>

            <Button block variant="primary" onPress={onVouRetirar}>
              Vou retirar
            </Button>
          </View>
        )}

        {/* ARQUITETURA LIMPA */}
        {mostrarArquitetura && !multiplas && (
          <View className="gap-4 rounded-md border border-line bg-surface-raised p-4">
            <View className="flex-row gap-3">
              <CapaLivro nome="Arquitetura Limpa" cor="cover6" largura={66} />

              <View className="flex-1 gap-2">
                <Text className="text-book-title text-ink">
                  Arquitetura Limpa
                </Text>

                <Text className="text-caption text-ink-muted">
                  Robert C. Martin · na fila desde 08/10
                </Text>

                <Text className="text-caption-strong text-brand">
                  2º da fila
                </Text>
              </View>
            </View>

            <View className="gap-3 rounded-md bg-brand-soft p-3">
              <Text className="text-label text-ink">
                1 pessoa na sua frente
              </Text>

              <View className="flex-row justify-between">
                <Text className="text-caption text-ink-muted">1º</Text>
                <Text className="text-caption-strong text-brand">Você</Text>
              </View>

              <Text className="text-caption text-ink">
                Você é o 2º da fila. Devolução prevista do exemplar atual:
                21/10.
              </Text>
            </View>

            <Button
              block
              variant="secondary"
              onPress={() => setConfirmarSaida(true)}
            >
              Sair da fila
            </Button>
          </View>
        )}

        {/* A37 — DUAS EDIÇÕES */}
        {mostrarEdicoes && (
          <View className="gap-4 rounded-md border border-line bg-surface-raised p-4">
            <View className="flex-row gap-3">
              <CapaLivro nome="Algoritmos" cor="cover4" largura={66} />

              <View className="flex-1 gap-2">
                <Text className="text-label text-ink">
                  Algoritmos: teoria e prática
                </Text>

                <Text className="text-caption text-ink-muted">
                  Cormen et al. · na fila desde 08/10
                </Text>

                <Text className="text-caption-strong text-brand">
                  Na fila · 2 edições
                </Text>
              </View>
            </View>

            <View className="gap-3 rounded-md bg-surface-sunken p-3">
              <View className="gap-1">
                <View className="flex-row justify-between gap-2">
                  <Text className="text-label text-ink">3ª ed. · 2012</Text>
                  <Text className="text-caption-strong text-brand">
                    1º na fila
                  </Text>
                </View>

                <Text className="text-caption text-ink-muted">
                  volta prevista 20/10
                </Text>
              </View>

              <View className="h-px bg-line" />

              <View className="gap-1">
                <View className="flex-row justify-between gap-2">
                  <Text className="text-label text-ink">4ª ed. · 2024</Text>
                  <Text className="text-caption-strong text-brand">
                    3º na fila
                  </Text>
                </View>

                <Text className="text-caption text-ink-muted">
                  volta prevista 22/10
                </Text>
              </View>
            </View>

            <View className="flex-row gap-2 rounded-md bg-brand-soft p-3">
              <Icon name="info" color="brand" size={20} />

              <Text className="flex-1 text-caption text-ink">
                A primeira edição que voltar fica com você e a outra fila é
                cancelada.
              </Text>
            </View>

            <Button
              block
              variant="secondary"
              onPress={() => setConfirmarSaida(true)}
            >
              Sair da fila
            </Button>
          </View>
        )}

        {/* AVISOS DE CONFIRMAÇÃO */}
        {!!mostrarAviso && (
          <View
            className="flex-row items-center gap-3 rounded-md bg-brand-soft p-4"
            accessibilityRole="alert"
          >
            <Icon name="checkCircle" color="brand" size={20} />

            <Text className="flex-1 text-label text-ink">{mostrarAviso}</Text>
          </View>
        )}
      </ScrollView>

      <BottomNav role="aluno" active={2} onSelect={onSelecionarAba} />

      {/* A33 — CONFIRMAR SAÍDA */}
      <Modal
        visible={confirmarSaida}
        transparent
        animationType={reducedMotion ? 'none' : 'slide'}
        statusBarTranslucent
        onRequestClose={() => setConfirmarSaida(false)}
      >
        <View className="flex-1 justify-end">
          <Pressable
            className="absolute inset-0 bg-scrim"
            onPress={() => setConfirmarSaida(false)}
            accessibilityRole="button"
            accessibilityLabel="Fechar confirmação"
          />

          <View
            className="gap-4 rounded-t-sheet bg-surface-raised px-4 pt-6"
            style={{
              paddingBottom: Math.max(insets.bottom, 20),
            }}
          >
            <Text className="text-title text-ink">
              {multiplas
                ? 'Sair da fila de Algoritmos?'
                : 'Sair da fila de Arquitetura Limpa?'}
            </Text>

            <Text className="text-body text-ink-muted">
              Você é o 2º da fila. Se sair, perde a posição e, para voltar,
              entra de novo no fim.
            </Text>

            <Button block variant="danger" onPress={confirmarDesistencia}>
              Sair da fila
            </Button>

            <Button
              block
              variant="ghost"
              onPress={() => setConfirmarSaida(false)}
            >
              Ficar na fila
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  )
}
