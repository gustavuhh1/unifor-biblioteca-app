
import React, { type ComponentRef, useRef, useState } from "react";
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
import { useResendCooldown } from '@/shared/utils/use-resend-cooldown';

type VerificarTokenProps = {
  tokenEsperado?: string;
  onVoltar?: () => void;
  onContinuar?: (token: string) => void;
  onReenviar?: () => void;
};

export function RecoveryTokenScreen({
  tokenEsperado,
  onVoltar,
  onContinuar,
  onReenviar,
}: VerificarTokenProps) {
  const insets = useSafeAreaInsets();
  const cooldown = useResendCooldown(42);

  const [token, setToken] = useState("");
  const [erroToken, setErroToken] = useState("");
  function confirmarToken() {
    if (token.length !== 6) { setErroToken("Digite os seis dígitos do token."); return; }
    
    if (tokenEsperado && token !== tokenEsperado) { setErroToken("Token incorreto. Confira o código recebido."); return; }
    setErroToken("");
    onContinuar?.(token);
  }
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);

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
        <View className="h-14 w-[80px] items-center justify-center rounded-lg bg-brand-soft">
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

        {tokenEsperado ? <Text className="text-caption text-ink-muted">Demonstração: use 123456 para confirmar ou outro código para testar o erro.</Text> : null}
        {erroToken ? <Text accessibilityRole="alert" className="text-caption text-danger">{erroToken}</Text> : null}
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
            onPress={() => { if (cooldown.waiting) return; setToken(''); setErroToken(''); cooldown.restart(); onReenviar?.(); }}
            disabled={cooldown.waiting}
            accessibilityState={{ disabled: cooldown.waiting }}
            className="min-h-[44px] justify-center rounded-md bg-surface-sunken px-5"
          >
            <Text className="text-label text-brand">
              {cooldown.waiting ? `Reenviar token (${cooldown.label})` : 'Reenviar token'}
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
          onPress={confirmarToken}
        >
          Continuar
        </Button>
      </View>
    </View>
  );
}
