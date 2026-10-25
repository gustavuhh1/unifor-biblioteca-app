import { useTheme } from '@/shared/theme/theme-provider'
import { useReducedMotion } from '@/shared/theme/use-reduced-motion'

import React, { useState } from "react";
import type { ReactNode } from "react";
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/shared/components/button";
import { Icon } from "@/shared/components/icon";

type EstadoSalvar =
  | "confirmado"
  | "escolher-pasta"
  | "nova-pasta";

type SalvarLivroProps = {
  children: ReactNode;
  estado?: EstadoSalvar;
  onConcluir?: () => void;
  onCriarPasta?: (nome: string) => void;
};

const pastas = [
  { id: "ler-depois", nome: "Ler depois", livros: 2 },
  { id: "amei", nome: "Amei!!!", livros: 3 },
  { id: "tcc", nome: "TCC", livros: 4 },
];

export function SaveBookScreen({
  children,
  estado = "confirmado",
  onConcluir,
  onCriarPasta,
}: SalvarLivroProps) {
  const reducedMotion = useReducedMotion()

  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const [etapa, setEtapa] = useState<EstadoSalvar>(estado);
  const [nomePasta, setNomePasta] = useState("Amei!!!");
  const [pastasSelecionadas, setPastasSelecionadas] =
    useState<string[]>(["ler-depois"]);

  function alternarPasta(id: string) {
    setPastasSelecionadas((atual) =>
      atual.includes(id)
        ? atual.filter((item) => item !== id)
        : [...atual, id]
    );
  }

  function concluir() {
    setEtapa("confirmado");
    onConcluir?.();
  }

  function criarPasta() {
    const nome = nomePasta.trim();

    if (!nome) return;

    onCriarPasta?.(nome);
    setEtapa("confirmado");
  }

  return (
    <View className="flex-1">
      {/* REUTILIZA A TELA DE DETALHE EXISTENTE */}
      {children}

      {/* A15 — CONFIRMAÇÃO DE LIVRO SALVO */}
      {etapa === "confirmado" && (
        <View
          className="absolute bottom-[96px] left-4 right-4 flex-row items-center justify-between gap-2 rounded-md border border-line bg-surface-raised p-3"
          accessibilityRole="alert"
        >
          <View className="flex-row flex-1 items-center gap-2">
            <Icon
              name="checkCircle"
              color="success"
              size={19}
            />

            <Text className="flex-1 text-caption text-ink">
              Salvo em Todos os salvos.
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => setEtapa("escolher-pasta")}
            className="min-h-[44px] justify-center px-1"
          >
            <Text className="text-caption-strong text-brand">
              Escolher pasta
            </Text>
          </Pressable>
        </View>
      )}

      {/* A16 E A17 — PAINÉIS */}
      <Modal
        visible={etapa !== "confirmado"}
        transparent
        animationType={reducedMotion ? "none" : "slide"}
        statusBarTranslucent
        onRequestClose={() => setEtapa("confirmado")}
      >
        <View className="flex-1 justify-end">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar painel"
            onPress={() => setEtapa("confirmado")}
            className="absolute inset-0 bg-scrim"
          />

          <View
            className="rounded-t-sheet bg-surface-raised px-4 pt-5"
            style={{
              paddingBottom: Math.max(insets.bottom, 20),
            }}
          >
            <View className="mb-5 items-center">
              <View className="h-1 w-10 rounded-pill bg-line-strong" />
            </View>

            {etapa === "escolher-pasta" ? (
              <>
                {/* A16 — SALVAR EM */}
                <Text className="text-title text-ink">
                  Salvar em
                </Text>

                <Text className="mt-2 text-body text-ink-muted">
                  Refatoração já está em Todos os salvos.
                  Escolha pastas, se quiser. Só você vê
                  seus salvos.
                </Text>

                <View className="mt-5 gap-1">
                  {pastas.map((pasta, index) => {
                    const selecionada =
                      pastasSelecionadas.includes(pasta.id);

                    const cores = [
                      colors.cover5,
                      colors.cover2,
                      colors.cover6,
                    ];

                    return (
                      <Pressable
                        key={pasta.id}
                        onPress={() =>
                          alternarPasta(pasta.id)
                        }
                        accessibilityRole="checkbox"
                        accessibilityState={{
                          checked: selecionada,
                        }}
                        className="min-h-[60px] flex-row items-center gap-3 rounded-md px-2"
                      >
                        <View
                          className="h-[36px] w-[36px] rounded-sm"
                          style={{
                            backgroundColor: cores[index],
                          }}
                        />

                        <View className="flex-1">
                          <Text className="text-label text-ink">
                            {pasta.nome}
                          </Text>
                          <Text className="text-caption text-ink-muted">
                            {pasta.livros} livros
                          </Text>
                        </View>

                        <View
                          className={
                            selecionada
                              ? "h-6 w-6 items-center justify-center rounded-pill bg-brand"
                              : "h-6 w-6 rounded-pill border-2 border-line-strong"
                          }
                        >
                          {selecionada && (
                            <Icon
                              name="check"
                              color="onBrand"
                              size={14}
                            />
                          )}
                        </View>
                      </Pressable>
                    );
                  })}

                  <Pressable
                    onPress={() => setEtapa("nova-pasta")}
                    accessibilityRole="button"
                    className="min-h-[52px] flex-row items-center gap-3 px-2"
                  >
                    <View className="h-[36px] w-[36px] items-center justify-center rounded-md bg-brand-soft">
                      <Icon
                        name="plus"
                        color="brand"
                        size={20}
                      />
                    </View>

                    <Text className="text-label text-brand">
                      Nova pasta
                    </Text>
                  </Pressable>
                </View>

                <View className="mt-5">
                  <Button
                    block
                    variant="primary"
                    onPress={concluir}
                  >
                    Pronto
                  </Button>
                </View>
              </>
            ) : (
              <>
                {/* A17 — NOVA PASTA */}
                <Text className="text-title text-ink">
                  Nova pasta
                </Text>

                <Text className="mt-2 text-body text-ink-muted">
                  Dê um nome do seu jeito. Refatoração
                  vai direto para ela.
                </Text>

                <View className="mt-6 gap-2">
                  <Text className="text-caption-strong text-ink">
                    Nome da pasta
                  </Text>

                  <TextInput
                    value={nomePasta}
                    onChangeText={setNomePasta}
                    maxLength={30}
                    autoFocus
                    className="min-h-[52px] rounded-md border border-line-strong bg-surface px-3 text-body text-ink"
                    accessibilityLabel="Nome da pasta"
                  />

                  <Text className="text-caption text-ink-muted">
                    {nomePasta.length} de 30 caracteres
                  </Text>
                </View>

                <View className="mt-6 gap-3">
                  <Button
                    block
                    variant="primary"
                    disabled={!nomePasta.trim()}
                    onPress={criarPasta}
                  >
                    Criar e salvar
                  </Button>

                  <Button
                    block
                    variant="ghost"
                    onPress={() =>
                      setEtapa("escolher-pasta")
                    }
                  >
                    Cancelar
                  </Button>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
