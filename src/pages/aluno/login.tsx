
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Button } from "@/shared/components/button";
import { TextField } from "@/shared/components/text-field";
import { Icon } from "@/shared/components/icon";

type EstadoLogin =
  | "normal"
  | "erro"
  | "sessao-expirada"
  | "passkey"
  | "outras-formas"
  | "erro-passkey";

type Painel = "nenhum" | "outras-formas" | "erro-passkey";

type LoginProps = {
  estado?: EstadoLogin;
  onEntrar?: () => void;
  onCriarConta?: () => void;
  onEsqueciSenha?: () => void;
  onBibliotecario?: () => void;
};

export default function Login({
  estado = "normal",
  onEntrar,
  onCriarConta,
  onEsqueciSenha,
  onBibliotecario,
}: LoginProps) {
  const insets = useSafeAreaInsets();

  const [painel, setPainel] = useState<Painel>("nenhum");
  const [usarSenha, setUsarSenha] = useState(false);

  useEffect(() => {
    setPainel(
      estado === "outras-formas" ||
      estado === "erro-passkey"
        ? estado
        : "nenhum"
    );

    setUsarSenha(false);
  }, [estado]);

  const erro = estado === "erro";
  const sessaoExpirada = estado === "sessao-expirada";

  const loginPasskey =
    !usarSenha &&
    ["passkey", "outras-formas", "erro-passkey"].includes(
      estado
    );

  function fecharPainel() {
    setPainel("nenhum");
  }

  function entrarComSenha() {
    setUsarSenha(true);
    fecharPainel();
  }

  function recuperarSenha() {
    fecharPainel();
    onEsqueciSenha?.();
  }

  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="flex-grow justify-center px-4"
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        }}
      >
        {/* APRESENTAÇÃO */}
        <View className="mb-8 items-center gap-2">
          <Text className="text-title-lg text-ink">
            Unifor Biblioteca
          </Text>

          <Text className="text-center text-body text-ink-muted">
            {loginPasskey
              ? "Digite sua matrícula e confirme com a digital, o rosto ou o PIN do celular."
              : "Entre com a matrícula e a senha que você criou no cadastro."}
          </Text>
        </View>

        {/* ERRO A06 */}
        {erro && (
          <View className="mb-6 flex-row items-start gap-3 rounded-md border border-danger bg-danger-soft p-4">
            <Icon name="alert" color="danger" size={20} />

            <View className="flex-1 gap-1">
              <Text className="text-label text-danger">
                Não foi possível entrar
              </Text>
              <Text className="text-body text-ink">
                Confira os dados ou toque em Esqueci minha senha.
              </Text>
            </View>
          </View>
        )}

        {/* SESSÃO EXPIRADA A79 */}
        {sessaoExpirada && (
          <View className="mb-6 flex-row items-start gap-3 rounded-md border border-line bg-surface-raised p-4">
            <Icon name="info" color="brand" size={20} />

            <View className="flex-1 gap-1">
              <Text className="text-label text-ink">
                Sua sessão expirou
              </Text>
              <Text className="text-body text-ink-muted">
                Por segurança, entre de novo para continuar de onde parou.
              </Text>
            </View>
          </View>
        )}

        {/* CAMPOS */}
        <View className="gap-5">
          <TextField
            label="Matrícula"
            icon="user"
            defaultValue="2412858"
            hint="7 dígitos. Os dois primeiros são o ano de ingresso."
            inputMode="numeric"
            maxLength={7}
          />

          {!loginPasskey ? (
            <View className="gap-2">
              <TextField
                label="Senha"
                icon="lock"
                type="password"
                defaultValue="1234567890"
                error={
                  erro
                    ? "Matrícula ou senha incorretos."
                    : undefined
                }
              />

              <Pressable
                className="min-h-11 items-end justify-center"
                accessibilityRole="button"
                onPress={recuperarSenha}
              >
                <Text className="text-label text-brand">
                  Esqueci minha senha
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              className="min-h-11 items-end justify-center"
              accessibilityRole="button"
              onPress={() => setPainel("outras-formas")}
            >
              <Text className="text-label text-brand">
                Outras formas de entrar
              </Text>
            </Pressable>
          )}
        </View>

        {/* BOTÕES */}
        <View className="mt-8 gap-3">
          <Button
            block
            variant="primary"
            onPress={onEntrar}
          >
            Entrar
          </Button>

          <Button
            block
            variant="secondary"
            onPress={onCriarConta}
          >
            Criar conta
          </Button>
        </View>

        <Pressable
          className="mt-6 min-h-11 items-center justify-center"
          accessibilityRole="button"
          onPress={onBibliotecario}
        >
          <Text className="text-label text-brand">
            Acessar como bibliotecário
          </Text>
        </Pressable>
      </ScrollView>

      {/* PAINÉIS A63 E A64 */}
      <Modal
        visible={painel !== "nenhum"}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={fecharPainel}
      >
        <View className="flex-1 justify-end">
          <Pressable
            className="absolute inset-0 bg-black/40"
            accessibilityRole="button"
            accessibilityLabel="Fechar painel"
            onPress={fecharPainel}
          />

          <View
            className="rounded-t-[28px] bg-surface-raised px-4 pt-5"
            style={{
              paddingBottom: Math.max(insets.bottom, 20),
            }}
          >
            <View className="mb-6 items-center">
              <View className="h-1 w-10 rounded-pill bg-line-strong" />
            </View>

            {painel === "erro-passkey" ? (
              <View className="gap-3">
                <Text className="text-title text-ink">
                  Não foi possível entrar
                </Text>

                <Text className="text-body text-ink-muted">
                  A biometria não foi reconhecida, ou este
                  celular não tem um passkey para a
                  matrícula 2412858. Você pode entrar
                  com a senha.
                </Text>

                <View className="mt-5 gap-3">
                  <Button
                    block
                    variant="primary"
                    onPress={fecharPainel}
                  >
                    Tentar de novo
                  </Button>

                  <Button
                    block
                    variant="secondary"
                    onPress={entrarComSenha}
                  >
                    Entrar com matrícula e senha
                  </Button>

                  <Button
                    block
                    variant="ghost"
                    onPress={recuperarSenha}
                  >
                    Esqueci minha senha
                  </Button>
                </View>
              </View>
            ) : (
              <View className="gap-3">
                <Text className="text-title text-ink">
                  Outras formas de entrar
                </Text>

                <Text className="text-body text-ink-muted">
                  Se o passkey não funcionar neste celular,
                  entre com a senha do seu cadastro.
                  Se esqueceu a senha, enviamos um token
                  para o seu e-mail.
                </Text>

                <View className="mt-5 gap-3">
                  <Button
                    block
                    variant="primary"
                    onPress={entrarComSenha}
                  >
                    Entrar com matrícula e senha
                  </Button>

                  <Button
                    block
                    variant="secondary"
                    onPress={recuperarSenha}
                  >
                    Esqueci minha senha
                  </Button>

                  <Button
                    block
                    variant="ghost"
                    onPress={fecharPainel}
                  >
                    Fechar
                  </Button>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
