import { useReducedMotion } from '@/shared/theme/use-reduced-motion'
import { CapaLivro } from "@/shared/components/livro";

import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBar } from "@/shared/components/app-bar";
import { BottomNav } from "@/shared/components/bottom-nav";
import { Button } from "@/shared/components/button";
import { Icon } from "@/shared/components/icon";

type EstadoPasta =
  | "aberta"
  | "menu"
  | "renomear"
  | "apagar";

type PastaProps = {
  estado?: EstadoPasta;
  onVoltar?: () => void;
  onAbrirLivro?: (id: string) => void;
  onRenomear?: (nome: string) => void;
  onApagar?: () => void;
  onSelecionarAba?: (indice: number) => void;
};

const livros = [
  {
    id: "refatoracao",
    titulo: "Refatoração",
    autor: "Martin Fowler",
    descricao: "Disponível · 2 exemplares na estante",
    status: "Disponível",
    cor: "cover2" as const,
    capa: "Refatoração",
  },
  {
    id: "programador-pragmatico",
    titulo: "O Programador Pragmático",
    autor: "Hunt, Thomas",
    descricao: "Emprestado · 1 pessoa na fila",
    status: "Emprestado",
    cor: "cover5" as const,
    capa: "O Programador\nPragmático",
  },
  {
    id: "entendendo-algoritmos",
    titulo: "Entendendo Algoritmos",
    autor: "Aditya Bhargava",
    descricao: "Disponível · 1 exemplar na estante",
    status: "Disponível",
    cor: "cover4" as const,
    capa: "Entendendo\nAlgoritmos",
  },
];

export default function Pasta({
  estado = "aberta",
  onVoltar,
  onAbrirLivro,
  onRenomear,
  onApagar,
  onSelecionarAba,
}: PastaProps) {
  const reducedMotion = useReducedMotion()

  const insets = useSafeAreaInsets();

  const [estadoAtual, setEstadoAtual] =
    useState<EstadoPasta>(estado);

  const [nomePasta, setNomePasta] =
    useState("Amei!!!");

  const [novoNome, setNovoNome] =
    useState("Favoritos da vida");

  const painelAberto = estadoAtual !== "aberta";

  function fecharPainel() {
    setEstadoAtual("aberta");
  }

  function renomearPasta() {
    const nome = novoNome.trim();

    if (!nome) return;

    // Atualiza somente o nome visível na interface.
    setNomePasta(nome);
    fecharPainel();
    onRenomear?.(nome);
  }

  function apagarPasta() {
    // A exclusão real será implementada na integração.
    fecharPainel();
    onApagar?.();
  }

  return (
    <View className="flex-1 bg-surface">
      {/* CABEÇALHO DA PASTA */}
      <View>
        <AppBar
          title={nomePasta}
          subtitle="3 livros"
          back
          onBack={onVoltar}
          actions={[
            {
              icon: "pencil",
              label: "Gerenciar pasta",
              onPress: () => setEstadoAtual("menu"),
            },
          ]}
        />
      </View>

      {/* LIVROS DA PASTA */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-4 px-4 py-4"
      >
        {livros.map((livro) => {
          const disponivel =
            livro.status === "Disponível";

          return (
            <Pressable
              key={livro.id}
              onPress={() => onAbrirLivro?.(livro.id)}
              accessibilityRole="button"
              className="flex-row gap-3 rounded-md border border-line bg-surface-raised p-3"
            >
              {/* CAPA */}
              <CapaLivro nome={livro.capa.split("\n").join(" ")} cor={livro.cor} largura={87} />

              

              {/* INFORMAÇÕES */}
              <View className="min-w-0 flex-1 gap-2">
                <Text
                  className="text-book-title text-ink"
                  numberOfLines={2}
                >
                  {livro.titulo}
                </Text>

                <Text className="text-caption text-ink-muted">
                  {livro.autor}
                </Text>

                <Text className="text-caption text-ink-muted">
                  {livro.descricao}
                </Text>

                <View
                  className={
                    disponivel
                      ? "self-start rounded-pill bg-success-soft px-3 py-1"
                      : "self-start rounded-pill bg-warning-soft px-3 py-1"
                  }
                >
                  <Text
                    className={
                      disponivel
                        ? "text-caption-strong text-success"
                        : "text-caption-strong text-warning"
                    }
                  >
                    {livro.status}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}

        {/* TEXTO INFORMATIVO */}
        <Text className="mt-3 text-center text-caption text-ink-muted">
          Toque e segure um livro para tirar da pasta.
          O lápis renomeia ou apaga a pasta; os livros
          continuam em Todos os salvos.
        </Text>
      </ScrollView>

      <BottomNav
        role="aluno"
        active={4}
        onSelect={onSelecionarAba}
      />

      {/* PAINÉIS A20, A21 E A22 */}
      <Modal
        visible={painelAberto}
        transparent
        animationType={reducedMotion ? "none" : "slide"}
        statusBarTranslucent
        onRequestClose={fecharPainel}
      >
        <View className="flex-1 justify-end">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar painel"
            onPress={fecharPainel}
            className="absolute inset-0 bg-scrim"
          />

          <View
            className="rounded-t-sheet bg-surface-raised px-4 pt-5"
            style={{
              paddingBottom: Math.max(insets.bottom, 20),
            }}
          >
            {/* INDICADOR SUPERIOR */}
            <View className="mb-6 items-center">
              <View className="h-1 w-10 rounded-pill bg-line-strong" />
            </View>

            {/* A20 — MENU DA PASTA */}
            {estadoAtual === "menu" && (
              <View className="gap-3">
                <Text className="text-title text-ink">
                  {nomePasta}
                </Text>

                <Text className="text-body text-ink-muted">
                  3 livros · só você vê esta pasta
                </Text>

                <View className="mt-3 gap-2">
                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      setEstadoAtual("renomear")
                    }
                    className="min-h-[52px] flex-row items-center gap-3 rounded-md border border-line px-4"
                  >
                    <Icon
                      name="pencil"
                      color="brand"
                      size={20}
                    />

                    <Text className="text-label text-ink">
                      Renomear pasta
                    </Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      setEstadoAtual("apagar")
                    }
                    className="min-h-[52px] flex-row items-center gap-3 rounded-md border border-line px-4"
                  >
                    <Icon
                      name="trash"
                      color="danger"
                      size={20}
                    />

                    <Text className="text-label text-danger">
                      Apagar pasta
                    </Text>
                  </Pressable>
                </View>

                <Button
                  block
                  variant="ghost"
                  onPress={fecharPainel}
                >
                  Fechar
                </Button>
              </View>
            )}

            {/* A21 — RENOMEAR PASTA */}
            {estadoAtual === "renomear" && (
              <View className="gap-3">
                <Text className="text-title text-ink">
                  Renomear pasta
                </Text>

                <Text className="text-body text-ink-muted">
                  Os livros continuam nela.
                </Text>

                <View className="mt-4 gap-2">
                  <Text className="text-caption-strong text-ink">
                    Nome da pasta
                  </Text>

                  <TextInput
                    value={novoNome}
                    onChangeText={setNovoNome}
                    maxLength={30}
                    autoFocus
                    accessibilityLabel="Novo nome da pasta"
                    className="min-h-[52px] rounded-md border border-line-strong bg-surface px-3 text-body text-ink"
                  />

                  <Text className="text-caption text-ink-muted">
                    {novoNome.length} de 30 caracteres
                  </Text>
                </View>

                <View className="mt-5 gap-3">
                  <Button
                    block
                    variant="primary"
                    disabled={!novoNome.trim()}
                    onPress={renomearPasta}
                  >
                    Salvar nome
                  </Button>

                  <Button
                    block
                    variant="ghost"
                    onPress={fecharPainel}
                  >
                    Cancelar
                  </Button>
                </View>
              </View>
            )}

            {/* A22 — APAGAR PASTA */}
            {estadoAtual === "apagar" && (
              <View className="gap-3">
                <Text className="text-title text-ink">
                  Apagar a pasta {nomePasta}?
                </Text>

                <Text className="text-body text-ink-muted">
                  Os 3 livros continuam em Todos os
                  salvos. Só a pasta some.
                </Text>

                <View className="mt-5 gap-3">
                  <Button
                    block
                    variant="danger"
                    onPress={apagarPasta}
                  >
                    Apagar pasta
                  </Button>

                  <Button
                    block
                    variant="ghost"
                    onPress={fecharPainel}
                  >
                    Cancelar
                  </Button>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
