
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { AppBar } from "@/shared/components/app-bar";
import { BottomNav } from "@/shared/components/bottom-nav";
import { useTheme } from '@/shared/theme/theme-provider';
import type { ColorToken } from '@/shared/theme/tokens.generated';
import { Icon } from "@/shared/components/icon";

type Pasta = {
  id: string;
  nome: string;
  quantidade: number;
  cores: [ColorToken, ColorToken, ColorToken, ColorToken];
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
    cores: ["cover1","cover2","cover3","cover4"],
  },
  {
    id: "ler-depois",
    nome: "Ler depois",
    quantidade: 2,
    cores: ["cover5","cover6","cover5","cover6"],
  },
  {
    id: "amei",
    nome: "Amei!!!",
    quantidade: 3,
    cores: ["cover2","cover6","cover1","cover3"],
  },
  {
    id: "tcc",
    nome: "TCC",
    quantidade: 4,
    cores: ["cover4","cover1","cover6","cover3"],
  },
];

export function SavedScreen({
  onVoltar,
  onAbrirPasta,
  onNovaPasta,
  onSelecionarAba,
}: SalvosProps) {
  const { colors } = useTheme();

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
              <View className="h-[144px] overflow-hidden rounded-md bg-surface-sunken">
                <View className="flex-1 flex-row">
                  <View
                    className="flex-1"
                    style={{
                      backgroundColor: colors[pasta.cores[0]],
                    }}
                  />
                  <View
                    className="flex-1"
                    style={{
                      backgroundColor: colors[pasta.cores[1]],
                    }}
                  />
                </View>

                <View className="flex-1 flex-row">
                  <View
                    className="flex-1"
                    style={{
                      backgroundColor: colors[pasta.cores[2]],
                    }}
                  />
                  <View
                    className="flex-1"
                    style={{
                      backgroundColor: colors[pasta.cores[3]],
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
            <View className="h-[144px] items-center justify-center gap-3 rounded-md border-2 border-dashed border-line-strong bg-surface-raised">
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
