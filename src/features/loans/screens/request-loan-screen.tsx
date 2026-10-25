import { useReducedMotion } from '@/shared/theme/use-reduced-motion'

import React, { type ReactNode } from "react";
import {
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/shared/components/button";

type SolicitarLivroProps = {
  children: ReactNode;
  aberto?: boolean;
  onConfirmar?: () => void;
  onCancelar?: () => void;
};

export function RequestLoanScreen({
  children,
  aberto = true,
  onConfirmar,
  onCancelar,
}: SolicitarLivroProps) {
  const reducedMotion = useReducedMotion()

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      {/* TELA ORIGINAL DE DETALHE */}
      {children}

      {/* A23 — CONFIRMAR SOLICITAÇÃO */}
      <Modal
        visible={aberto}
        transparent
        animationType={reducedMotion ? "none" : "slide"}
        statusBarTranslucent
        onRequestClose={() => onCancelar?.()}
      >
        <View className="flex-1 justify-end">
          <Pressable
            className="absolute inset-0 bg-scrim"
            accessibilityRole="button"
            accessibilityLabel="Fechar confirmação"
            onPress={onCancelar}
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
              Solicitar Refatoração?
            </Text>

            <Text className="mt-2 text-body text-ink-muted">
              Um exemplar fica separado para você.
              Retire no balcão da biblioteca
              mostrando o QR do app.
            </Text>

            <View className="mt-6 rounded-md border border-line bg-surface p-3">
              <View className="flex-row justify-between gap-3 py-2">
                <Text className="text-caption text-ink-muted">
                  Retirar até
                </Text>
                <Text className="text-right text-caption-strong text-ink">
                  seg, 19/10 (2 dias úteis)
                </Text>
              </View>

              <View className="flex-row justify-between gap-3 border-t border-line py-3">
                <Text className="text-caption text-ink-muted">
                  Empréstimo
                </Text>
                <Text className="flex-1 text-right text-caption-strong text-ink">
                  14 dias a partir da retirada
                </Text>
              </View>

              <View className="flex-row justify-between gap-3 border-t border-line py-3">
                <Text className="text-caption text-ink-muted">
                  Seus empréstimos
                </Text>
                <Text className="text-right text-caption-strong text-ink">
                  passa a 4 de 10
                </Text>
              </View>
            </View>

            <Text className="my-5 text-caption text-ink-muted">
              Fim de semana, feriado e recesso não
              contam. Sem retirada no prazo, o pedido
              expira e o livro volta à estante.
            </Text>

            <View className="gap-3">
              <Button
                block
                variant="primary"
                onPress={onConfirmar}
              >
                Confirmar solicitação
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
        </View>
      </Modal>
    </View>
  );
}
