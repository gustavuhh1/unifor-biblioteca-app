
import React, { ElementRef, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBar } from "@/shared/components/app-bar";
import { Button } from "@/shared/components/button";
import { Icon } from "@/shared/components/icon";

type VerificarTokenProps = {
  onVoltar?: () => void;
  onContinuar?: (token: string) => void;
  onReenviar?: () => void;
};

export default function VerificarToken({
  onVoltar,
  onContinuar,
  onReenviar,
}: VerificarTokenProps) {
  const insets = useSafeAreaInsets();

  const [token, setToken] = useState("");
  const inputRef = useRef<ElementRef<typeof TextInput>>(null);

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
            name="mail"
            color="brand"
            size={30}
          />
        </View>

        {/* INTRODUÇÃO */}
        <View className="gap-2">
          <Text className="text-title-lg text-ink">
            Digite o token
          </Text>

          <Text className="text-body text-ink-muted">
            Enviamos para lu***@edu.unifor.br.
            Digite o código de 6 dígitos.
          </Text>
        </View>

        {/* TOKEN */}
        <View className="gap-3">
          <Text className="text-caption-strong text-ink">
            Token do e-mail
          </Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Digitar token"
            onPress={() => inputRef.current?.focus()}
            className="flex-row gap-2"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <View
                key={index}
                className="h-14 flex-1 items-center justify-center rounded-md border border-line-strong bg-surface-raised"
              >
                <Text className="text-title text-ink">
                  {token[index] ?? ""}
                </Text>
              </View>
            ))}
          </Pressable>

          <TextInput
            ref={inputRef}
            value={token}
            onChangeText={(valor) =>
              setToken(
                valor.replace(/\D/g, "").slice(0, 6)
              )
            }
            keyboardType="number-pad"
            maxLength={6}
            autoComplete="one-time-code"
            accessibilityLabel="Token de seis dígitos"
            className="h-0 w-0 opacity-0"
          />

          <Text className="text-caption text-ink-muted">
            Não chegou? Veja também a caixa de spam.
          </Text>
        </View>

        {/* REENVIAR */}
        <View className="items-center">
          <Pressable
            accessibilityRole="button"
            onPress={onReenviar}
            className="min-h-11 justify-center rounded-md bg-surface-sunken px-5"
          >
            <Text className="text-label text-brand">
              Reenviar token
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* CONTINUAR */}
      <View
        className="border-t border-line bg-surface-raised px-4 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <Button
          block
          variant="primary"
          disabled={token.length !== 6}
          onPress={() => onContinuar?.(token)}
        >
          Continuar
        </Button>
      </View>
    </View>
  );
}
