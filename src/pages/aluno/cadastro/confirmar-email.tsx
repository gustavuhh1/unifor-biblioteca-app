
import React, { useRef, useState, type ElementRef } from "react";
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

type ConfirmarEmailProps = {
  estado?: "normal" | "token-expirado";
  onVoltar?: () => void;
  onConfirmar?: (token: string) => void;
  onReenviar?: () => void;
  onCorrigirEmail?: () => void;
};

export default function ConfirmarEmail({
  estado = "normal",
  onVoltar,
  onConfirmar,
  onReenviar,
  onCorrigirEmail,
}: ConfirmarEmailProps) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<ElementRef<typeof TextInput>>(null);

  const [token, setToken] = useState("");

  const expirado = estado === "token-expirado";

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Confirmar e-mail"
        back
        onBack={onVoltar}
      />

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-5 px-4 pb-8"
      >
        {/* INDICADORES */}
        <View className="flex-row gap-2">
          {["Dados", "E-mail", "Passkey"].map(
            (nome, index) => (
              <View key={nome} className="flex-1 gap-2">
                <Text
                  className={
                    index < 2
                      ? "text-caption-strong text-brand"
                      : "text-caption text-ink-muted"
                  }
                >
                  {nome}
                </Text>

                <View
                  className={
                    index < 2
                      ? "h-1.5 rounded-pill bg-brand"
                      : "h-1.5 rounded-pill bg-line"
                  }
                />
              </View>
            )
          )}
        </View>

        {/* INTRODUÇÃO */}
        <View className="gap-2">
          <Text className="text-title text-ink">
            Digite o token
          </Text>

          <Text className="text-body text-ink-muted">
            Enviamos um token de 6 dígitos para
            lucas.almeida@edu.unifor.br.
          </Text>
        </View>

        {/* A77 — TOKEN EXPIRADO */}
        {expirado && (
          <View className="flex-row items-start gap-3 rounded-md border border-warning bg-warning-soft p-4">
            <Icon
              name="alert"
              color="warning"
              size={20}
            />

            <View className="flex-1 gap-1">
              <Text className="text-label text-ink">
                Token expirado ou já usado
              </Text>

              <Text className="text-body text-ink">
                Cada token vale 20 minutos e só
                pode ser usado uma vez. Toque em
                Reenviar token para receber outro.
              </Text>
            </View>
          </View>
        )}

        {/* CÓDIGO */}
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

        {/* LINKS */}
        <View className="flex-row justify-between gap-3">
          <Pressable
            onPress={onReenviar}
            accessibilityRole="button"
            className="min-h-11 justify-center"
          >
            <Text className="text-label text-brand">
              {expirado
                ? "Reenviar token"
                : "Reenviar token"}
            </Text>
          </Pressable>

          <Pressable
            onPress={onCorrigirEmail}
            accessibilityRole="button"
            className="min-h-11 justify-center"
          >
            <Text className="text-label text-brand">
              Corrigir e-mail
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* CONFIRMAR */}
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
          onPress={() => onConfirmar?.(token)}
        >
          Confirmar e-mail
        </Button>
      </View>
    </View>
  );
}
