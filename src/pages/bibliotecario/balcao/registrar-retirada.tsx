
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBar } from "@/shared/components/app-bar";
import { Button } from "@/shared/components/button";
import { Icon } from "@/shared/components/icon";

type RegistrarRetiradaProps = {
  onVoltar?: () => void;
  onConfirmar?: () => void;
  onCancelar?: () => void;
};

export default function RegistrarRetirada({
  onVoltar,
  onConfirmar,
  onCancelar,
}: RegistrarRetiradaProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Registrar retirada"
        back
        onBack={onVoltar}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-4 pb-8"
      >
        {/* CÓDIGO IDENTIFICADO */}
        <View className="gap-2 rounded-md bg-success-soft p-4">
          <View className="flex-row items-center gap-2">
            <Icon
              name="check"
              color="success"
              size={20}
            />

            <Text className="text-label text-ink">
              QR lido: RET-4821
            </Text>
          </View>

          <Text className="text-body text-ink">
            Pedido confirmado pelo aluno, sem
            pendências. Entregue o exemplar e registre.
          </Text>
        </View>

        {/* DADOS DO ALUNO */}
        <View className="flex-row items-center gap-3 rounded-md border border-line bg-surface-raised p-4">
          <View className="h-12 w-12 items-center justify-center rounded-pill bg-brand-soft">
            <Text className="text-label text-brand">
              BN
            </Text>
          </View>

          <View className="flex-1 gap-1">
            <Text className="text-label text-ink">
              Beatriz Nogueira
            </Text>

            <Text className="text-caption text-ink-muted">
              Matrícula 2310052
            </Text>
          </View>
        </View>

        {/* EXEMPLAR */}
        <View className="flex-row gap-3 rounded-md border border-line bg-surface-raised p-4">
          <View className="h-32 w-24 justify-center rounded-md bg-[#536B22] p-2">
            <Text className="text-label text-white">
              Padrões de Projeto
            </Text>
          </View>

          <View className="flex-1 justify-center gap-2">
            <Text className="text-label text-ink">
              Padrões de Projeto
            </Text>

            <Text className="text-caption text-ink-muted">
              Gamma et al.
            </Text>

            <Text className="text-caption text-ink-muted">
              Exemplar 1163 · Estante 005.1
            </Text>

            <View className="self-start rounded-pill bg-brand-soft px-3 py-1">
              <Text className="text-caption-strong text-brand">
                Pronto para retirar
              </Text>
            </View>
          </View>
        </View>

        {/* INFORMAÇÕES DO EMPRÉSTIMO */}
        <View className="flex-row justify-between gap-3 rounded-md bg-surface-sunken p-4">
          <View className="gap-1">
            <Text className="text-caption text-ink-muted">
              Empréstimo de 14 dias
            </Text>

            <Text className="text-label text-ink">
              Inicia na retirada
            </Text>
          </View>

          <View className="items-end gap-1">
            <Text className="text-caption text-ink-muted">
              Devolver até
            </Text>

            <Text className="text-label text-ink">
              29/10
            </Text>
          </View>
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
          onPress={onConfirmar}
        >
          Registrar retirada
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
