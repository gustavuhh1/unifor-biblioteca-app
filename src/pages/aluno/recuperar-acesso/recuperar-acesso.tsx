
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBar } from "@/shared/components/app-bar";
import { Button } from "@/shared/components/button";
import { TextField } from "@/shared/components/text-field";
import { Icon } from "@/shared/components/icon";

type RecuperarAcessoProps = {
  onVoltar?: () => void;
  onEnviarToken?: () => void;
};

export default function RecuperarAcesso({
  onVoltar,
  onEnviarToken,
}: RecuperarAcessoProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Recuperar acesso"
        back
        onBack={onVoltar}
      />

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-5 px-4 pb-8"
      >
        {/* ÍCONE */}
        <View className="h-14 w-20 items-center justify-center rounded-[20px] bg-brand-soft">
          <Icon
            name="lock"
            color="brand"
            size={30}
          />
        </View>

        {/* TÍTULO */}
        <View className="gap-2">
          <Text className="text-title-lg text-ink">
            Esqueceu a senha ou trocou de celular?
          </Text>

          <Text className="text-body text-ink-muted">
            Informe sua matrícula. Enviamos um
            token de 6 dígitos para o e-mail do
            seu cadastro.
          </Text>
        </View>

        {/* MATRÍCULA */}
        <TextField
          label="Matrícula"
          icon="user"
          defaultValue="2412858"
          inputMode="numeric"
          maxLength={7}
          hint="7 dígitos."
        />

        {/* INFORMAÇÃO */}
        <View className="flex-row items-start gap-3 rounded-md bg-brand-soft p-4">
          <Icon
            name="fingerprint"
            color="brand"
            size={20}
          />

          <Text className="flex-1 text-body text-ink">
            Depois de criar uma nova senha, você
            entra com ela. Se quiser, cria também
            um passkey neste celular.
          </Text>
        </View>
      </ScrollView>

      {/* BOTÃO INFERIOR */}
      <View
        className="border-t border-line bg-surface-raised px-4 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <Button
          block
          variant="primary"
          onPress={onEnviarToken}
        >
          Enviar token
        </Button>
      </View>
    </View>
  );
}
