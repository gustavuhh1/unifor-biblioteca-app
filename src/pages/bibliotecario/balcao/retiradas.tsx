
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomNav } from "@/shared/components/bottom-nav";
import { Icon } from "@/shared/components/icon";
import { useTheme } from "@/shared/theme/theme-provider";

type Retirada = {
  id: string;
  titulo: string;
  aluno: string;
  codigo: string;
  prazo: string;
  cor: string;
  status: "hoje" | "amanha" | "normal";
};

type RetiradasProps = {
  onAbrirRetirada?: (id: string) => void;
  onSelecionarAba?: (indice: number) => void;
};

const retiradas: Retirada[] = [
  {
    id: "1",
    titulo: "Padrões de Projeto",
    aluno: "Beatriz Nogueira",
    codigo: "RET-4820",
    prazo: "Retirar até hoje, 29/10",
    cor: "#145B4B",
    status: "hoje",
  },
  {
    id: "2",
    titulo: "Cálculo, Vol. 2",
    aluno: "Isabela Silva",
    codigo: "RET-4826",
    prazo: "Retirar até amanhã, 30/10",
    cor: "#536B22",
    status: "amanha",
  },
  {
    id: "3",
    titulo: "Código Limpo",
    aluno: "Lucas Almeida",
    codigo: "RET-4821",
    prazo: "Retirar até 31/10",
    cor: "#122A78",
    status: "normal",
  },
];

export default function Retiradas({
  onAbrirRetirada,
  onSelecionarAba,
}: RetiradasProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const [busca, setBusca] = useState("");

  const resultado = retiradas.filter((retirada) => {
    const termo = busca.toLowerCase().trim();

    return (
      retirada.titulo.toLowerCase().includes(termo) ||
      retirada.aluno.toLowerCase().includes(termo) ||
      retirada.codigo.toLowerCase().includes(termo)
    );
  });

  return (
    <View className="flex-1 bg-surface">
      {/* CABEÇALHO */}
      <View
        className="gap-2 px-4 pb-4"
        style={{
          paddingTop: insets.top + 12,
        }}
      >
        <Text className="text-title-lg text-ink">
          Retiradas
        </Text>

        <Text className="text-caption text-ink-muted">
          7 pedidos aguardando retirada
        </Text>
      </View>

      {/* PESQUISA */}
      <View className="px-4 pb-4">
        <View className="min-h-12 flex-row items-center gap-3 rounded-pill border border-line bg-surface-raised px-4">
          <Icon
            name="search"
            color="inkMuted"
            size={20}
          />

          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Buscar pela matrícula ou aluno"
            placeholderTextColor={colors.inkFaint}
            className="flex-1 text-body text-ink"
            accessibilityLabel="Buscar retiradas"
          />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-4 px-4 pb-8"
      >
        {/* ORIENTAÇÃO */}
        <Text className="text-body text-ink-muted">
          Pedidos confirmados, por prazo mais curto
          no início. Busque pela matrícula para
          ver os pedidos de um aluno.
        </Text>

        {/* PEDIDOS */}
        {resultado.map((retirada) => (
          <Pressable
            key={retirada.id}
            onPress={() =>
              onAbrirRetirada?.(retirada.id)
            }
            accessibilityRole="button"
            className="flex-row gap-3 rounded-md border border-line bg-surface-raised p-3"
          >
            {/* CAPA */}
            <View
              className="h-28 w-20 justify-center rounded-md p-2"
              style={{
                backgroundColor: retirada.cor,
              }}
            >
              <Text className="text-caption-strong text-white">
                {retirada.titulo}
              </Text>
            </View>

            {/* DADOS */}
            <View className="min-w-0 flex-1 gap-2">
              <Text
                className="text-label text-ink"
                numberOfLines={2}
              >
                {retirada.titulo}
              </Text>

              <Text
                className="text-caption text-ink-muted"
                numberOfLines={1}
              >
                {retirada.aluno} · {retirada.codigo}
              </Text>

              <View
                className={
                  retirada.status === "hoje"
                    ? "self-start rounded-pill bg-warning-soft px-3 py-1"
                    : retirada.status === "amanha"
                      ? "self-start rounded-pill bg-brand-soft px-3 py-1"
                      : "self-start rounded-pill bg-surface-sunken px-3 py-1"
                }
              >
                <Text
                  className={
                    retirada.status === "hoje"
                      ? "text-caption-strong text-warning"
                      : retirada.status === "amanha"
                        ? "text-caption-strong text-brand"
                        : "text-caption-strong text-ink-muted"
                  }
                >
                  {retirada.prazo}
                </Text>
              </View>

              <Text className="text-caption-strong text-brand">
                Retirar até {retirada.prazo.replace("Retirar até ", "")}
              </Text>
            </View>
          </Pressable>
        ))}

        {resultado.length === 0 && (
          <View className="items-center gap-3 py-12">
            <Icon
              name="search"
              color="inkMuted"
              size={36}
            />

            <Text className="text-title text-ink">
              Nenhuma retirada encontrada
            </Text>

            <Text className="text-center text-body text-ink-muted">
              Confira o nome, matrícula ou código informado.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* NAVEGAÇÃO INFERIOR */}
      <BottomNav
        role="bibliotecario"
        active={1}
        onSelect={onSelecionarAba}
      />
    </View>
  );
}
