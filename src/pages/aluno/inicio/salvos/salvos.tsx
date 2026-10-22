
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBar } from "@/shared/components/app-bar";
import { BottomNav } from "@/shared/components/bottom-nav";
import { Icon } from "@/shared/components/icon";

type Pasta = {
  id: string;
  nome: string;
  quantidade: number;
  cores: [string, string, string, string];
};

type SalvosProps = {
  onVoltar?: () => void;
  onAbrirPasta?: (id: string) => void;
  onNovaPasta?: () => void;
  onSelecionarAba?: (indice: number) => void;
};

const pastas: Pasta[] = [
  {
    id: "todos",
    nome: "Todos os salvos",
    quantidade: 6,
    cores: ["#194B59", "#566F27", "#792C25", "#172F7E"],
  },
  {
    id: "ler-depois",
    nome: "Ler depois",
    quantidade: 2,
    cores: ["#566F27", "#172F7E", "#194B59", "#792C25"],
  },
  {
    id: "amei",
    nome: "Amei!!!",
    quantidade: 3,
    cores: ["#145B4B", "#8E3325", "#172F7E", "#3F571B"],
  },
  {
    id: "tcc",
    nome: "TCC",
    quantidade: 4,
    cores: ["#172F7E", "#145B4B", "#8E3325", "#3F571B"],
  },
];

export default function Salvos({
  onVoltar,
  onAbrirPasta,
  onNovaPasta,
  onSelecionarAba,
}: SalvosProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Salvos"
        back
        onBack={onVoltar}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-4 pb-8"
      >
        {/* INTRODUÇÃO */}
        <Text className="text-body text-ink-muted">
          Só você vê seus salvos. Um livro pode
          estar em mais de uma pasta.
        </Text>

        {/* GRADE DE PASTAS */}
        <View className="flex-row flex-wrap gap-3">
          {pastas.map((pasta) => (
            <Pressable
              key={pasta.id}
              accessibilityRole="button"
              accessibilityLabel={`${pasta.nome}, ${pasta.quantidade} livros`}
              onPress={() => onAbrirPasta?.(pasta.id)}
              className="w-[48%] gap-2"
            >
              {/* CAPA DA PASTA */}
              <View className="h-36 overflow-hidden rounded-md bg-surface-sunken">
                <View className="flex-1 flex-row">
                  <View
                    className="flex-1"
                    style={{
                      backgroundColor: pasta.cores[0],
                    }}
                  />
                  <View
                    className="flex-1"
                    style={{
                      backgroundColor: pasta.cores[1],
                    }}
                  />
                </View>

                <View className="flex-1 flex-row">
                  <View
                    className="flex-1"
                    style={{
                      backgroundColor: pasta.cores[2],
                    }}
                  />
                  <View
                    className="flex-1"
                    style={{
                      backgroundColor: pasta.cores[3],
                    }}
                  />
                </View>
              </View>

              <Text
                className="text-label text-ink"
                numberOfLines={1}
              >
                {pasta.nome}
              </Text>

              <Text className="text-caption text-ink-muted">
                {pasta.quantidade} livros
              </Text>
            </Pressable>
          ))}

          {/* CRIAR NOVA PASTA */}
          <Pressable
            onPress={onNovaPasta}
            accessibilityRole="button"
            className="w-[48%] gap-2"
          >
            <View className="h-36 items-center justify-center gap-3 rounded-md border-2 border-dashed border-line-strong bg-surface-raised">
              <Icon
                name="plus"
                color="brand"
                size={30}
              />

              <Text className="text-label text-brand">
                Nova pasta
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>

      <BottomNav
        role="aluno"
        active={4}
        onSelect={onSelecionarAba}
      />
    </View>
  );
}
