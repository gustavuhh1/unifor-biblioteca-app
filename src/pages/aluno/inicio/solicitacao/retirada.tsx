import { useReducedMotion } from '@/shared/theme/use-reduced-motion'
import { CapaLivro } from '@/shared/components/livro'

import React, { useState } from "react";
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
import QrIlustrativo from "@/shared/components/qrIlustrativo";

type EstadoRetirada = "normal" | "cancelar";

type RetiradaProps = {
  estado?: EstadoRetirada;
  onVoltar?: () => void;
  onCancelarPedido?: () => void;
};

export default function Retirada({
  estado = "normal",
  onVoltar,
  onCancelarPedido,
}: RetiradaProps) {
  const reducedMotion = useReducedMotion()

  const insets = useSafeAreaInsets();

  const [mostrarCancelamento, setMostrarCancelamento] =
    useState(estado === "cancelar");

  function confirmarCancelamento() {
    setMostrarCancelamento(false);
    onCancelarPedido?.();
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Retirada"
        back
        onBack={onVoltar}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-4 pb-8"
      >
        {/* CONFIRMAÇÃO */}
        <View className="gap-2 rounded-md bg-success-soft p-4">
          <View className="flex-row items-center gap-2">
            <Icon
              name="checkCircle"
              color="success"
              size={20}
            />

            <Text className="text-label text-ink">
              Pedido confirmado
            </Text>
          </View>

          <Text className="text-body text-ink">
            Mostre este QR no balcão da biblioteca.
            O empréstimo de 14 dias começa quando
            você pegar o livro.
          </Text>
        </View>

        {/* PRAZO */}
        <View className="flex-row items-center justify-between gap-3">
          <Text className="text-label text-ink">
            Retirada no balcão
          </Text>

          <Text className="text-caption-strong text-brand">
            até seg, 19/10
          </Text>
        </View>

        {/* CARTÃO DE RETIRADA */}
        <View className="overflow-hidden rounded-md border border-line bg-surface-raised">
          <View className="flex-row items-center justify-between bg-brand px-4 py-3">
            <Text className="text-caption-strong text-on-brand">
              RETIRADA NA BIBLIOTECA
            </Text>

            <Icon
              name="qr"
              color="onBrand"
              size={20}
            />
          </View>

          <View className="items-center gap-3 px-4 py-6">
            {/* QR DEMONSTRATIVO */}
            <QrIlustrativo />

            <View className="items-center gap-1">
              <Text className="text-title text-ink">
                RET-4821
              </Text>

              <Text className="text-center text-caption text-ink-muted">
                Lucas Almeida · Matrícula 2412858
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3 border-t border-line p-4">
            <CapaLivro nome="Código Limpo"  cor="cover1" largura={55} />

            <View className="flex-1 gap-1">
              <Text className="text-book-title text-ink">
                Código Limpo
              </Text>

              <Text className="text-caption text-ink-muted">
                Robert C. Martin
              </Text>
            </View>
          </View>
        </View>

        {/* INSTRUÇÃO SEM QR */}
        <View className="flex-row items-start gap-3 rounded-md bg-brand-soft p-4">
          <Icon name="info" color="brand" size={20} />

          <Text className="flex-1 text-body text-ink">
            Sem QR? Diga sua matrícula 2412858
            ou o código RET-4821 ao bibliotecário.
          </Text>
        </View>

        {/* AÇÃO VISUAL */}
        <Button
          block
          variant="secondary"
          onPress={() => setMostrarCancelamento(true)}
        >
          Cancelar pedido
        </Button>
      </ScrollView>

      {/* A69 — CONFIRMAR CANCELAMENTO */}
      <Modal
        visible={mostrarCancelamento}
        transparent
        animationType={reducedMotion ? "none" : "slide"}
        statusBarTranslucent
        onRequestClose={() => setMostrarCancelamento(false)}
      >
        <View className="flex-1 justify-end">
          <Pressable
            className="absolute inset-0 bg-scrim"
            accessibilityRole="button"
            accessibilityLabel="Fechar confirmação"
            onPress={() => setMostrarCancelamento(false)}
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

            <Text className="text-title text-ink">
              Cancelar o pedido de Código Limpo?
            </Text>

            <Text className="mt-3 text-body text-ink-muted">
              O exemplar volta para a estante ou
              segue para o próximo da fila. Você
              pode pedir de novo depois.
            </Text>

            <View className="mt-6 gap-3">
              <Button
                block
                variant="danger"
                onPress={confirmarCancelamento}
              >
                Cancelar pedido
              </Button>

              <Button
                block
                variant="ghost"
                onPress={() =>
                  setMostrarCancelamento(false)
                }
              >
                Manter pedido
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
