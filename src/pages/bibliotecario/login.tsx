
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/shared/components/button";
import { TextField } from "@/shared/components/text-field";
import { Icon } from "@/shared/components/icon";

type LoginBibliotecarioProps = {
  onEntrar?: () => void;
  onEsqueciSenha?: () => void;
  onAcessarComoAluno?: () => void;
};

export default function LoginBibliotecario({
  onEntrar,
  onEsqueciSenha,
  onAcessarComoAluno,
}: LoginBibliotecarioProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-grow justify-between px-4"
        contentContainerStyle={{
          paddingTop: insets.top + 40,
          paddingBottom: Math.max(insets.bottom, 24),
        }}
      >
        <View className="gap-8">
          {/* IDENTIDADE DO APLICATIVO */}
          <View className="items-center gap-3">
            <View className="h-24 w-24 items-center justify-center rounded-[28px] bg-brand-soft">
              <Icon
                name="books"
                size={48}
                color="brand"
              />
            </View>

            <Text className="text-center text-title-lg text-ink">
              Unifor Biblioteca
            </Text>

            <Text className="text-center text-body text-ink-muted">
              Acesso do bibliotecário. Entre com a
              matrícula e a senha pré-cadastradas
              pela biblioteca.
            </Text>
          </View>

          {/* CAMPOS DE LOGIN */}
          <View className="gap-5">
            <TextField
              label="Matrícula"
              icon="user"
              defaultValue="1800123"
              inputMode="numeric"
              keyboardType="number-pad"
            />

            <View className="gap-2">
              <TextField
                label="Senha"
                icon="lock"
                type="password"
                defaultValue="1234567890"
              />

              <Pressable
                accessibilityRole="button"
                onPress={onEsqueciSenha}
                className="min-h-11 items-end justify-center"
              >
                <Text className="text-label text-brand">
                  Esqueci minha senha
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* AÇÕES INFERIORES */}
        <View className="gap-3 pt-8">
          <Button
            block
            variant="primary"
            onPress={onEntrar}
          >
            Entrar
          </Button>

          <Button
            block
            variant="ghost"
            onPress={onAcessarComoAluno}
          >
            Acessar como aluno
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
