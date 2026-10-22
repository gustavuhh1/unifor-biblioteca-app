
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBar } from "@/shared/components/app-bar";
import { Button } from "@/shared/components/button";
import { TextField } from "@/shared/components/text-field";

type EstadoCadastro =
  | "normal"
  | "validacao"
  | "conta-existente";

type CadastroProps = {
  estado?: EstadoCadastro;
  onVoltar?: () => void;
  onContinuar?: () => void;
  onEntrar?: () => void;
};

export default function Cadastro({
  estado = "normal",
  onVoltar,
  onContinuar,
  onEntrar,
}: CadastroProps) {
  const insets = useSafeAreaInsets();

  const validacao = estado === "validacao";
  const contaExistente = estado === "conta-existente";

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Criar conta"
        back
        onBack={onVoltar}
      />

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-5 px-4 pb-8"
      >
        {/* ETAPAS */}
        <View className="flex-row gap-2">
          {["Dados", "E-mail", "Passkey"].map(
            (nome, index) => (
              <View
                key={nome}
                className="flex-1 gap-2"
              >
                <Text
                  className={
                    index === 0
                      ? "text-caption-strong text-brand"
                      : "text-caption text-ink-muted"
                  }
                >
                  {nome}
                </Text>

                <View
                  className={
                    index === 0
                      ? "h-1.5 rounded-pill bg-brand"
                      : "h-1.5 rounded-pill bg-line"
                  }
                />
              </View>
            )
          )}
        </View>

        {/* FORMULÁRIO */}
        <TextField
          label="E-mail institucional"
          icon="mail"
          defaultValue={
            validacao
              ? "lucas.almeida@gmail.com"
              : "lucas.almeida@edu.unifor.br"
          }
          autoCapitalize="none"
          keyboardType="email-address"
          hint={
            !validacao && !contaExistente
              ? "Terminado em @edu.unifor.br."
              : undefined
          }
          error={
            validacao
              ? "Use o e-mail institucional, terminado em @edu.unifor.br."
              : contaExistente
                ? "Este e-mail já tem conta. Entre ou recupere a senha."
                : undefined
          }
        />

        <TextField
          label="Matrícula"
          icon="user"
          defaultValue={
            validacao ? "24128" : "2412858"
          }
          inputMode="numeric"
          maxLength={7}
          hint={
            !validacao && !contaExistente
              ? "7 dígitos. Os dois primeiros são o ano de ingresso."
              : undefined
          }
          error={
            validacao
              ? "A matrícula tem 7 dígitos."
              : contaExistente
                ? "Esta matrícula já tem conta."
                : undefined
          }
        />

        <TextField
          label="Senha"
          icon="lock"
          type="password"
          defaultValue="123456789012"
          hint="Você usa a senha para entrar no app."
        />

        <TextField
          label="Confirmar senha"
          icon="lock"
          type="password"
          defaultValue={
            validacao
              ? "1234567890"
              : "123456789012"
          }
          hint={
            validacao ? undefined : "Repita a senha."
          }
          error={
            validacao
              ? "As senhas não são iguais."
              : undefined
          }
        />
      </ScrollView>

      {/* AÇÕES */}
      <View
        className="gap-2 border-t border-line bg-surface-raised px-4 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <Button
          block
          variant="primary"
          onPress={onContinuar}
        >
          Continuar
        </Button>

        <Button
          block
          variant="ghost"
          onPress={onEntrar}
        >
          Já tem conta? Entrar
        </Button>
      </View>
    </View>
  );
}
