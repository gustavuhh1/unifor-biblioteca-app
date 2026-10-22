
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBar } from "@/shared/components/app-bar";
import { Button } from "@/shared/components/button";
import { Icon } from "@/shared/components/icon";

type RegistrarDevolucaoProps = {
  onVoltar?: () => void;
  onRegistrar?: (multaPaga: boolean) => void;
  onCancelar?: () => void;
};

export default function RegistrarDevolucao({
  onVoltar,
  onRegistrar,
  onCancelar,
}: RegistrarDevolucaoProps) {
  const insets = useSafeAreaInsets();
  const [multaPaga, setMultaPaga] = useState(true);

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Registrar devolução"
        back
        onBack={onVoltar}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-4 pb-8"
      >
        {/* EXEMPLAR */}
        <View className="flex-row items-center gap-3 rounded-md border border-line bg-surface-raised p-3">
          <View className="h-20 w-16 justify-center rounded-md bg-[#572440] p-2">
            <Text className="text-caption-strong text-white">
              Cálculo, Vol. 1
            </Text>
          </View>

          <View className="flex-1 gap-2">
            <Text className="text-label text-ink">
              Cálculo, Vol. 1
            </Text>

            <Text className="text-caption text-ink-muted">
              James Stewart · Exemplar 1163
            </Text>

            <Text className="text-caption text-ink-muted">
              Retirado 26/09 · venceu 10/10
            </Text>
          </View>
        </View>

        {/* MULTA */}
        <View className="gap-3 rounded-md border border-danger bg-surface-raised p-4">
          <View className="flex-row justify-between">
            <Text className="text-overline text-ink-muted">
              MULTA ACUMULADA
            </Text>

            <Text className="text-caption-strong text-danger">
              3 DIAS
            </Text>
          </View>

          <Text className="text-title-lg text-danger">
            R$ 6,00
          </Text>

          <Text className="text-caption text-ink-muted">
            Cálculo, Vol. 1 · 3 dias úteis de atraso
          </Text>

          <View className="h-px bg-line" />

          <View className="flex-row justify-between">
            <Text className="text-caption text-ink-muted">
              3 dias úteis × R$ 2,00
            </Text>

            <Text className="text-caption-strong text-ink">
              R$ 2,00 por dia útil
            </Text>
          </View>
        </View>

        {/* PAGAMENTO PRESENCIAL */}
        <View className="gap-3 rounded-md border border-line bg-surface-raised p-4">
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className="text-label text-ink">
                Multa paga agora (R$ 6,00)
              </Text>

              <Text className="text-caption text-ink-muted">
                Pagamento só presencial. Marque depois
                de receber no balcão.
              </Text>
            </View>

            <Pressable
              onPress={() => setMultaPaga((atual) => !atual)}
              accessibilityRole="switch"
              accessibilityState={{
                checked: multaPaga,
              }}
              className={
                multaPaga
                  ? "h-8 w-14 justify-center rounded-pill bg-brand p-1"
                  : "h-8 w-14 justify-center rounded-pill bg-line-strong p-1"
              }
            >
              <View
                className={
                  multaPaga
                    ? "ml-auto h-6 w-6 rounded-pill bg-white"
                    : "h-6 w-6 rounded-pill bg-white"
                }
              />
            </Pressable>
          </View>
        </View>

        {/* INFORMAÇÃO */}
        <View className="gap-2 rounded-md bg-brand-soft p-4">
          <View className="flex-row items-start gap-2">
            <Icon name="info" color="brand" size={20} />

            <Text className="flex-1 text-label text-ink">
              Há 2 alunos na fila deste livro
            </Text>
          </View>

          <Text className="text-body text-ink">
            Registrar a devolução libera o próximo
            da fila, que terá 24h para confirmar
            a retirada. Mesmo sem o pagamento da multa,
            a devolução pode ser registrada.
          </Text>
        </View>
      </ScrollView>

      {/* AÇÕES */}
      <View
        className="gap-3 border-t border-line bg-surface-raised px-4 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <Button
          block
          variant="primary"
          onPress={() => onRegistrar?.(multaPaga)}
        >
          Registrar devolução
        </Button>

        <Button
          block
          variant="ghost"
          onPress={onCancelar}
        >
          Cancelar
        </Button>
      </View>
    </View>
  );
}
