
import React from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/shared/components/button";
import { Icon } from "@/shared/components/icon";

type SenhaRedefinidaProps = {
  onCriarPasskey?: () => void;
  onEntrarComSenha?: () => void;
};

export default function SenhaRedefinida({
  onCriarPasskey,
  onEntrarComSenha,
}: SenhaRedefinidaProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-surface"
      style={{
        paddingTop: insets.top,
      }}
    >
      {/* CONFIRMAÇÃO */}
      <View className="flex-1 items-center justify-center gap-4 px-6">
        <View className="h-[96px] w-[112px] items-center justify-center rounded-sheet bg-success-soft">
          <Icon
            name="checkCircle"
            size={48}
            color="success"
          />
        </View>

        <Text className="text-center text-title-lg text-ink">
          Senha redefinida
        </Text>

        <Text className="text-center text-body text-ink-muted">
          Você já pode entrar com a nova senha.
          Quer criar um passkey neste celular para
          entrar só com a biometria?
        </Text>
      </View>

      {/* BOTÕES */}
      <View
        className="gap-3 border-t border-line bg-surface-raised px-4 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <Button
          block
          variant="primary"
          icon="fingerprint"
          onPress={onCriarPasskey}
        >
          Criar passkey
        </Button>

        <Button
          block
          variant="ghost"
          onPress={onEntrarComSenha}
        >
          Agora não, entrar com a senha
        </Button>
      </View>
    </View>
  );
}
