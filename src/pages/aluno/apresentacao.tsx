
import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/shared/components/button";
import { Icon, type IconName } from "@/shared/components/icon";

type Etapa = 1 | 2 | 3;

type ApresentacaoProps = {
  etapa?: Etapa;
  onConcluir?: () => void;
  onPular?: () => void;
};

type Conteudo = {
  titulo: string;
  descricao: string;
  icone: IconName;
};

const conteudos: Record<Etapa, Conteudo> = {
  1: {
    titulo: "Ache e peça livros pelo celular",
    descricao:
      "Busque no acervo, veja se há exemplar na estante e solicite. Você retira no balcão em até 2 dias úteis.",
    icone: "search",
  },
  2: {
    titulo: "Livro emprestado? Entre na fila",
    descricao:
      "Antes de entrar, você vê quantas pessoas estão na frente. Quando chegar sua vez, tem 24h para confirmar.",
    icone: "users",
  },
  3: {
    titulo: "Dúvidas? Pergunte ao Assistente",
    descricao:
      "Ele explica como o app funciona e sugere livros pelo que você já leu.",
    icone: "sparkle",
  },
};

export default function Apresentacao({
  etapa = 1,
  onConcluir,
  onPular,
}: ApresentacaoProps) {
  const insets = useSafeAreaInsets();
  const [etapaAtual, setEtapaAtual] = useState<Etapa>(etapa);

  useEffect(() => {
    setEtapaAtual(etapa);
  }, [etapa]);

  const conteudo = conteudos[etapaAtual];

  function avancar() {
    if (etapaAtual === 3) {
      onConcluir?.();
      return;
    }

    setEtapaAtual(
      (etapaAtual + 1) as Etapa
    );
  }

  return (
    <View className="flex-1 bg-surface">
      {/* PULAR */}
      <View
        className="items-end px-4"
        style={{ paddingTop: insets.top }}
      >
        <Pressable
          onPress={onPular}
          accessibilityRole="button"
          className="min-h-11 justify-center px-2"
        >
          <Text className="text-label text-brand">
            Pular
          </Text>
        </Pressable>
      </View>

      {/* CONTEÚDO */}
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <View className="mb-4 h-28 w-48 items-center justify-center rounded-pill bg-brand-soft">
          <Icon
            name={conteudo.icone}
            color="brand"
            size={46}
            strokeWidth={1.5}
          />
        </View>

        <Text className="max-w-[330px] text-center text-title-lg text-ink">
          {conteudo.titulo}
        </Text>

        <Text className="max-w-[340px] text-center text-body text-ink-muted">
          {conteudo.descricao}
        </Text>

        {/* PROGRESSO */}
        <View className="mt-4 flex-row items-center gap-2">
          {([1, 2, 3] as const).map((numero) => (
            <View
              key={numero}
              className={
                numero === etapaAtual
                  ? "h-1.5 w-7 rounded-pill bg-brand"
                  : "h-1.5 w-2 rounded-pill bg-line"
              }
            />
          ))}
        </View>
      </View>

      {/* BOTÃO */}
      <View
        className="px-4 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <Button
          block
          variant="primary"
          onPress={avancar}
        >
          {etapaAtual === 3 ? "Começar" : "Próximo"}
        </Button>
      </View>
    </View>
  );
}
