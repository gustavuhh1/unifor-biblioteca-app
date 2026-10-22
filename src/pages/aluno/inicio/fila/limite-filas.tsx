
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBar } from "@/shared/components/app-bar";
import { Button } from "@/shared/components/button";
import { Icon } from "@/shared/components/icon";

type LimiteFilasProps = {
  onVoltar?: () => void;
  onVerMinhasFilas?: () => void;
};

export default function LimiteFilas({
  onVoltar,
  onVerMinhasFilas,
}: LimiteFilasProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Detalhe do livro"
        back
        onBack={onVoltar}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-4 pb-8"
      >
        {/* LIVRO */}
        <View className="flex-row gap-4">
          <View className="h-48 w-32 justify-center rounded-md bg-[#572440] p-3">
            <Text className="text-title text-white">
              Domain-Driven Design
            </Text>

            <Text className="mt-auto text-caption text-white">
              Eric Evans
            </Text>
          </View>

          <View className="flex-1 justify-center gap-3">
            <View className="self-start rounded-pill bg-warning-soft px-3 py-1">
              <Text className="text-caption-strong text-warning">
                Emprestado
              </Text>
            </View>

            <Text className="text-body text-ink">
              0 de 2 exemplares na estante · 3 na fila
            </Text>
          </View>
        </View>

        {/* IDENTIFICAÇÃO */}
        <View className="gap-2">
          <Text className="text-title-lg text-ink">
            Domain-Driven Design
          </Text>

          <Text className="text-body text-ink-muted">
            atacando as complexidades no coração do software
          </Text>

          <Text className="text-caption text-ink-muted">
            Livro impresso · 3. ed. · Alta Books, 2016
          </Text>
        </View>

        {/* AVISO */}
        <View className="gap-3 rounded-md border border-warning bg-warning-soft p-4">
          <View className="flex-row items-start gap-3">
            <Icon
              name="alert"
              color="warning"
              size={22}
            />

            <Text className="flex-1 text-label text-ink">
              Limite de 7 filas atingido
            </Text>
          </View>

          <Text className="text-body text-ink">
            Você já está na fila de 7 livros, o máximo
            da biblioteca. Saia de uma fila para entrar nesta.
          </Text>
        </View>
      </ScrollView>

      {/* RODAPÉ */}
      <View
        className="gap-3 border-t border-line bg-surface-raised px-4 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <Button
          block
          variant="primary"
          disabled
        >
          Limite de 7 filas atingido
        </Button>

        <Button
          block
          variant="ghost"
          onPress={onVerMinhasFilas}
        >
          Ver minhas filas
        </Button>

        <Text className="text-center text-caption text-ink-muted">
          Você ainda pode pedir livros disponíveis.
        </Text>
      </View>
    </View>
  );
}
