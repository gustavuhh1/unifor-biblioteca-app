
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/shared/components/button";
import { Icon } from "@/shared/components/icon";

type PedidoFeitoProps = {
  onMostrarQR?: () => void;
  onVoltarAcervo?: () => void;
};

export default function PedidoFeito({
  onMostrarQR,
  onVoltarAcervo,
}: PedidoFeitoProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-surface"
      style={{ paddingTop: insets.top }}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-4 pt-10 pb-8"
      >
        {/* CONFIRMAÇÃO */}
        <View className="items-center gap-3">
          <View className="h-20 w-20 items-center justify-center rounded-pill bg-success-soft">
            <Icon
              name="checkCircle"
              color="success"
              size={40}
            />
          </View>

          <Text className="text-center text-title-lg text-ink">
            Pedido feito!
          </Text>

          <Text className="text-center text-body text-ink-muted">
            Refatoração está separado para você
            no balcão da biblioteca.
          </Text>
        </View>

        {/* PRAZO */}
        <View className="items-center">
          <View className="rounded-pill bg-brand-soft px-4 py-2">
            <Text className="text-label text-brand">
              Retire até seg, 19/10
            </Text>
          </View>
        </View>

        {/* LIVRO */}
        <View className="flex-row gap-3 rounded-md border border-line bg-surface-raised p-4">
          <View className="h-28 w-20 justify-center rounded-md bg-[#145B4B] p-2">
            <Text className="text-label text-white">
              Refatoração
            </Text>
          </View>

          <View className="flex-1 justify-center gap-2">
            <Text className="text-label text-ink">
              Refatoração
            </Text>

            <Text className="text-caption text-ink-muted">
              Fowler, Martin
            </Text>

            <Text className="text-caption text-ink-muted">
              Biblioteca (Praça Central) · Estante 005.1
            </Text>
          </View>
        </View>

        {/* INSTRUÇÕES */}
        <View className="gap-5">
          <View className="flex-row items-start gap-3">
            <Icon name="qr" color="brand" size={21} />
            <Text className="flex-1 text-body text-ink">
              Mostre o QR do pedido no balcão.
            </Text>
          </View>

          <View className="flex-row items-start gap-3">
            <Icon name="clock" color="brand" size={21} />
            <Text className="flex-1 text-body text-ink">
              O empréstimo de 14 dias começa na retirada.
            </Text>
          </View>

          <View className="flex-row items-start gap-3">
            <Icon name="bell" color="brand" size={21} />
            <Text className="flex-1 text-body text-ink">
              Avisamos um dia antes do prazo de retirada acabar.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        className="gap-3 border-t border-line bg-surface-raised px-4 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <Button
          block
          variant="primary"
          icon="qr"
          onPress={onMostrarQR}
        >
          Mostrar QR de retirada
        </Button>

        <Button
          block
          variant="ghost"
          onPress={onVoltarAcervo}
        >
          Voltar ao acervo
        </Button>
      </View>
    </View>
  );
}
