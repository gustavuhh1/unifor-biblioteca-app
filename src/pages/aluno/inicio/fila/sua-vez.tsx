
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBar } from "@/shared/components/app-bar";
import { Button } from "@/shared/components/button";
import { Icon } from "@/shared/components/icon";

type EstadoSuaVez =
  | "normal"
  | "desistir"
  | "edicao-liberada";

type SuaVezProps = {
  estado?: EstadoSuaVez;
  onVoltar?: () => void;
  onConfirmarRetirada?: () => void;
  onDesistir?: () => void;
};

export default function SuaVez({
  estado = "normal",
  onVoltar,
  onConfirmarRetirada,
  onDesistir,
}: SuaVezProps) {
  const insets = useSafeAreaInsets();

  const [mostrarDesistencia, setMostrarDesistencia] =
    useState(estado === "desistir");

  useEffect(() => {
    setMostrarDesistencia(estado === "desistir");
  }, [estado]);

  const edicaoLiberada = estado === "edicao-liberada";

  const titulo = edicaoLiberada
    ? "Algoritmos: teoria e prática"
    : "Código Limpo";

  const eventos = edicaoLiberada
    ? [
        {
          titulo: "Entrou na fila de 2 edições",
          descricao: "08/10 · 3ª e 4ª edição",
        },
        {
          titulo: "3ª edição liberada para você",
          descricao: "Hoje, 15/10, às 09:12",
        },
        {
          titulo: "Confirme que vai retirar",
          descricao: "Até 16/10 às 09:12 (24h)",
        },
        {
          titulo: "Retire no balcão",
          descricao: "Até 2 dias úteis depois de confirmar",
        },
      ]
    : [
        {
          titulo: "Entrou na fila",
          descricao: "02/10 · você era o 2º",
        },
        {
          titulo: "Livro liberado para você",
          descricao: "Hoje, 15/10, às 09:12",
        },
        {
          titulo: "Confirme que vai retirar",
          descricao: "Até 16/10 às 09:12 (24h)",
        },
        {
          titulo: "Retire no balcão",
          descricao: "Até 2 dias úteis depois de confirmar",
        },
        {
          titulo: "Empréstimo de 14 dias",
          descricao: "Começa na retirada",
        },
      ];

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Sua vez chegou"
        back
        onBack={onVoltar}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-4 pb-8"
      >
        {/* LIVRO */}
        <View className="flex-row gap-3 rounded-md border border-line bg-surface-raised p-3">
          <View
            className={
              edicaoLiberada
                ? "h-24 w-16 justify-center rounded-sm bg-[#526C26] p-2"
                : "h-24 w-16 justify-center rounded-sm bg-[#122A78] p-2"
            }
          >
            <Text className="text-caption-strong text-white">
              {edicaoLiberada ? "Algoritmos" : "Código Limpo"}
            </Text>
          </View>

          <View className="flex-1 justify-center gap-2">
            <Text className="text-label text-ink">
              {titulo}
            </Text>

            <Text className="text-body text-ink-muted">
              {edicaoLiberada
                ? "A 3ª edição (2012) voltou e está separada para você."
                : "Foi devolvido e está separado para você."}
            </Text>
          </View>
        </View>

        {/* PRAZO */}
        <View className="gap-2 rounded-md bg-warning-soft p-4">
          <Text className="text-caption-strong text-ink">
            Tempo para confirmar
          </Text>

          <Text className="text-title-lg text-warning">
            18h 40min
          </Text>

          <Text className="text-caption text-ink">
            Até amanhã, sex 16/10, às 09:12
          </Text>
        </View>

        {/* A38 — CANCELAMENTO DA OUTRA EDIÇÃO */}
        {edicaoLiberada && (
          <View className="gap-2 rounded-md bg-brand-soft p-4">
            <View className="flex-row items-center gap-2">
              <Icon name="info" color="brand" size={20} />
              <Text className="flex-1 text-label text-ink">
                Fila da 4ª edição cancelada
              </Text>
            </View>

            <Text className="text-body text-ink">
              Saiu sozinha, porque a 3ª voltou primeiro.
              Quem estava atrás de você lá subiu uma posição.
            </Text>
          </View>
        )}

        {/* HISTÓRICO DA FILA */}
        <View className="gap-4">
          {eventos.map((evento, index) => (
            <View
              key={evento.titulo}
              className="flex-row items-start gap-3"
            >
              <View
                className={
                  index < 2
                    ? "h-8 w-8 items-center justify-center rounded-pill bg-success-soft"
                    : "h-8 w-8 items-center justify-center rounded-pill bg-brand-soft"
                }
              >
                <Icon
                  name={index < 2 ? "check" : "clock"}
                  color={index < 2 ? "success" : "brand"}
                  size={18}
                />
              </View>

              <View className="flex-1 gap-1 border-b border-line pb-4">
                <Text className="text-label text-ink">
                  {evento.titulo}
                </Text>

                <Text className="text-caption text-ink-muted">
                  {evento.descricao}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* AÇÕES */}
      <View
        className="gap-2 border-t border-line bg-surface-raised px-4 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <Button
          block
          variant="primary"
          onPress={onConfirmarRetirada}
        >
          Vou retirar
        </Button>

        <Button
          block
          variant="ghost"
          onPress={() => setMostrarDesistencia(true)}
        >
          Desistir e sair da fila
        </Button>

        <Text className="text-center text-caption text-ink-muted">
          Sem confirmação até o fim do prazo, você sai
          da fila e o próximo é avisado.
        </Text>
      </View>

      {/* A30 — DESISTIR DA FILA */}
      <Modal
        visible={mostrarDesistencia}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setMostrarDesistencia(false)}
      >
        <View className="flex-1 justify-end">
          <Pressable
            className="absolute inset-0 bg-black/40"
            accessibilityRole="button"
            accessibilityLabel="Fechar confirmação"
            onPress={() => setMostrarDesistencia(false)}
          />

          <View
            className="gap-4 rounded-t-[28px] bg-surface-raised px-4 pt-6"
            style={{
              paddingBottom: Math.max(insets.bottom, 20),
            }}
          >
            <Text className="text-title text-ink">
              Desistir de {titulo}?
            </Text>

            <Text className="text-body text-ink-muted">
              Você sai da fila e o livro vai na hora para o
              próximo. Para pegar depois, terá que entrar
              na fila de novo, no fim.
            </Text>

            <View className="gap-2 rounded-md bg-warning-soft p-4">
              <Text className="text-label text-ink">
                Não dá para desfazer
              </Text>
              <Text className="text-body text-ink">
                O próximo da fila é avisado assim que
                você confirmar.
              </Text>
            </View>

            <Button
              block
              variant="danger"
              onPress={() => {
                setMostrarDesistencia(false);
                onDesistir?.();
              }}
            >
              Desistir e sair da fila
            </Button>

            <Button
              block
              variant="ghost"
              onPress={() => setMostrarDesistencia(false)}
            >
              Voltar
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
