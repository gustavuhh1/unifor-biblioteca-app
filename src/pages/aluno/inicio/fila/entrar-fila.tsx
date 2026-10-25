import { useReducedMotion } from '@/shared/theme/use-reduced-motion'

import React, { useState, type ReactNode } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/shared/components/button";
import { Icon } from "@/shared/components/icon";

type EstadoEntrada = "simples" | "multiplas-edicoes";

type EntrarFilaProps = {
  children: ReactNode;
  estado?: EstadoEntrada;
  aberto?: boolean;
  onVoltar?: () => void;
  onConfirmar?: (edicoes: string[]) => void;
};

export default function EntrarFila({
  children,
  estado = "simples",
  aberto = true,
  onVoltar,
  onConfirmar,
}: EntrarFilaProps) {
  const reducedMotion = useReducedMotion()

  const insets = useSafeAreaInsets();

  const [visivel, setVisivel] = useState(aberto);
  const [edicoes, setEdicoes] = useState<string[]>(["4", "3"]);

  const multiplas = estado === "multiplas-edicoes";

  function alternarEdicao(edicao: string) {
    setEdicoes((atual) =>
      atual.includes(edicao)
        ? atual.filter((item) => item !== edicao)
        : [...atual, edicao]
    );
  }

  function fechar() {
    setVisivel(false);
    onVoltar?.();
  }

  function confirmar() {
    setVisivel(false);
    onConfirmar?.(multiplas ? edicoes : ["unica"]);
  }

  return (
    <View className="flex-1">
      {children}

      <Modal
        visible={visivel}
        transparent
        animationType={reducedMotion ? "none" : "slide"}
        statusBarTranslucent
        onRequestClose={fechar}
      >
        <View className="flex-1 justify-end">
          <Pressable
            className="absolute inset-0 bg-scrim"
            onPress={fechar}
            accessibilityRole="button"
            accessibilityLabel="Fechar confirmação"
          />

          <View
            className="max-h-[90%] rounded-t-sheet bg-surface-raised"
            style={{
              paddingBottom: Math.max(insets.bottom, 16),
            }}
          >
            <View className="items-center py-4">
              <View className="h-1 w-10 rounded-pill bg-line-strong" />
            </View>

            <ScrollView
              className="px-4"
              contentContainerClassName="gap-4 pb-4"
            >
              <Text className="text-title text-ink">
                {multiplas
                  ? "Entrar na fila de Algoritmos?"
                  : "Entrar na fila de Código Limpo?"}
              </Text>

              <Text className="text-body text-ink-muted">
                {multiplas
                  ? "Todos os exemplares estão emprestados. Escolha uma ou mais edições: a primeira que voltar fica com você."
                  : "O livro está emprestado. A fila respeita a ordem de entrada, e você recebe um aviso quando chegar sua vez."}
              </Text>

              {!multiplas ? (
                <>
                  {/* A28 — POSIÇÃO NA FILA */}
                  <View className="gap-3 rounded-md bg-brand-soft p-4">
                    <Text className="text-label text-brand">
                      1 pessoa na sua frente
                    </Text>

                    <View className="flex-row gap-2">
                      {[1, 2, 3, 4].map((numero) => (
                        <View
                          key={numero}
                          className={
                            numero === 2
                              ? "h-[36px] flex-1 items-center justify-center rounded-md bg-brand"
                              : "h-[36px] flex-1 items-center justify-center rounded-md bg-surface-raised"
                          }
                        >
                          <Text
                            className={
                              numero === 2
                                ? "text-label text-on-brand"
                                : "text-label text-ink-muted"
                            }
                          >
                            {numero}º
                          </Text>
                        </View>
                      ))}
                    </View>

                    <Text className="text-caption text-ink">
                      Se entrar agora, você será o 2º da fila.
                    </Text>
                  </View>

                  <View className="gap-4 py-2">
                    {[
                      "24h para confirmar quando chegar sua vez",
                      "2 dias úteis para retirar depois de confirmar",
                      "Você pode sair da fila quando quiser",
                    ].map((texto) => (
                      <View
                        key={texto}
                        className="flex-row items-center gap-3"
                      >
                        <Icon
                          name="checkCircle"
                          color="success"
                          size={20}
                        />
                        <Text className="flex-1 text-body text-ink">
                          {texto}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <>
                  {/* A36 — EDIÇÕES DISPONÍVEIS PARA FILA */}
                  {[
                    {
                      id: "4",
                      titulo: "4ª edição · 2024",
                      descricao:
                        "GEN LTC · 2 exemplares · volta prevista 22/10",
                      fila: "2 pessoas na frente",
                    },
                    {
                      id: "3",
                      titulo: "3ª edição · 2012",
                      descricao:
                        "Elsevier · 2 exemplares · volta prevista 20/10",
                      fila: "Ninguém na frente",
                    },
                  ].map((edicao) => {
                    const selecionada = edicoes.includes(edicao.id);

                    return (
                      <Pressable
                        key={edicao.id}
                        onPress={() => alternarEdicao(edicao.id)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: selecionada }}
                        className="flex-row items-start gap-3 rounded-md border border-line bg-surface p-4"
                      >
                        <View
                          className={
                            selecionada
                              ? "h-6 w-6 items-center justify-center rounded-md bg-brand"
                              : "h-6 w-6 rounded-md border-2 border-line-strong"
                          }
                        >
                          {selecionada && (
                            <Icon
                              name="check"
                              size={16}
                              color="onBrand"
                            />
                          )}
                        </View>

                        <View className="flex-1 gap-2">
                          <Text className="text-label text-ink">
                            {edicao.titulo}
                          </Text>

                          <Text className="text-caption text-ink-muted">
                            {edicao.descricao}
                          </Text>

                          <Text className="text-caption-strong text-brand">
                            {edicao.fila}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}

                  <View className="gap-2 rounded-md bg-brand-soft p-4">
                    <Text className="text-body text-ink">
                      Quando uma edição voltar, as outras filas
                      deste livro são canceladas sozinhas.
                    </Text>

                    <Text className="text-caption-strong text-brand">
                      Usa {edicoes.length} das suas 7 filas:
                      cada edição marcada conta como uma.
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>

            <View className="gap-2 px-4 pt-2">
              <Button
                block
                variant="primary"
                disabled={multiplas && edicoes.length === 0}
                onPress={confirmar}
              >
                {multiplas
                  ? `Entrar na fila de ${edicoes.length} ${
                      edicoes.length === 1 ? "edição" : "edições"
                    }`
                  : "Entrar na fila"}
              </Button>

              <Button
                block
                variant="ghost"
                onPress={fechar}
              >
                Agora não
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
