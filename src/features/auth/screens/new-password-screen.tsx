
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBar } from "@/shared/components/app-bar";
import { Button } from "@/shared/components/button";
import { TextField } from "@/shared/components/text-field";
import { Icon } from "@/shared/components/icon";
import { newPasswordSchema } from '@/features/auth/schemas/registration.schemas';

type NovaSenhaProps = {
  onVoltar?: () => void;
  onRedefinir?: () => void;
};

export function NewPasswordScreen({
  onVoltar,
  onRedefinir,
}: NovaSenhaProps) {
  const insets = useSafeAreaInsets();
  const [senha, setSenha] = useState('');
  const [confirmacao, setConfirmacao] = useState('');
  const [tentou, setTentou] = useState(false);
  function redefinir() {
    setTentou(true);
    if (!newPasswordSchema.safeParse(senha).success || senha !== confirmacao) return;
    onRedefinir?.();
  }

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Nova senha"
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
            name="lock"
            color="brand"
            size={30}
          />
        </View>

        {/* INTRODUÇÃO */}
        <View className="gap-2">
          <Text className="text-title-lg text-ink">
            Crie uma nova senha
          </Text>

          <Text className="text-body text-ink-muted">
            Use uma senha que só você saiba.
            Ela substitui a anterior.
          </Text>
        </View>

        {/* NOVA SENHA */}
        <TextField
          label="Nova senha"
          icon="lock"
          type="password"
          value={senha}
          onChangeText={setSenha}
          error={tentou && !newPasswordSchema.safeParse(senha).success ? 'Use uma senha numérica de pelo menos 8 dígitos.' : undefined}
          hint="Você usa a senha para entrar no app."
        />

        {/* CONFIRMAÇÃO */}
        <TextField
          label="Confirmar nova senha"
          icon="lock"
          type="password"
          value={confirmacao}
          onChangeText={setConfirmacao}
          error={tentou && confirmacao !== senha ? 'As senhas não são iguais.' : undefined}
          hint="Repita a senha."
        />
      </ScrollView>

      {/* BOTÃO */}
      <View
        className="border-t border-line bg-surface-raised px-4 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        <Button
          block
          variant="primary"
          onPress={redefinir}
        >
          Redefinir senha
        </Button>
      </View>
    </View>
  );
}
