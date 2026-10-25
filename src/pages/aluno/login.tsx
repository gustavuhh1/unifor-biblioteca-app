import { useReducedMotion } from '@/shared/theme/use-reduced-motion'

import React, { useState } from "react";
import {
  Modal,
  Image,
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
  const reducedMotion = useReducedMotion()

  const insets = useSafeAreaInsets();

  const [painel, setPainel] = useState<Painel>(estado === "outras-formas" || estado === "erro-passkey" ? estado : "nenhum");
  const [matricula, setMatricula] = useState("2412858");
  const [senha, setSenha] = useState("1234567890");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroLocal, setErroLocal] = useState(false);
  const [usarSenha, setUsarSenha] = useState(false);

  const erro = estado === "erro" || erroLocal;
  const sessaoExpirada = estado === "sessao-expirada";

  const loginPasskey =
    !usarSenha &&
    ["passkey", "outras-formas", "erro-passkey"].includes(
      estado
    );

  function fazerLogin() {
    if (!/^\d{7}$/.test(matricula) || (!loginPasskey && senha !== "1234567890")) {
      setErroLocal(true);
      return;
    }
    setErroLocal(false);
    onEntrar?.();
  }

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
          <Image source={require("../../../assets/logo-unifor.png")} style={{ width: 73, height: 78 }} resizeMode="contain" />
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
            value={matricula}
            onChangeText={(v) => { setMatricula(v.replace(/\D/g, "")); setErroLocal(false); }}
            hint="7 dígitos. Os dois primeiros são o ano de ingresso."
            error={erro && !/^\d{7}$/.test(matricula) ? 'Informe os 7 dígitos da matrícula.' : undefined}
            inputMode="numeric"
            maxLength={7}
          />

          {!loginPasskey ? (
            <View className="gap-2">
              <TextField
                label="Senha"
                icon="lock"
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChangeText={(v) => { setSenha(v); setErroLocal(false); }}
                trailing={<Pressable accessibilityRole="button" accessibilityLabel={mostrarSenha ? "Ocultar senha" : "Mostrar senha"} onPress={() => setMostrarSenha(v => !v)}><Icon name={mostrarSenha ? "eyeOff" : "eye"} color="inkMuted" size={20} /></Pressable>}
                error={
                  erro
                    ? "Matrícula ou senha incorretos."
                    : undefined
                }
              />

              <Pressable
                className="min-h-[44px] items-end justify-center"
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
              className="min-h-[44px] items-end justify-center"
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
            onPress={fazerLogin}
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
          className="mt-6 min-h-[44px] items-center justify-center"
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
        animationType={reducedMotion ? "none" : "slide"}
        statusBarTranslucent
        onRequestClose={fecharPainel}
      >
        <View className="flex-1 justify-end">
          <Pressable
            className="absolute inset-0 bg-scrim"
            accessibilityRole="button"
            accessibilityLabel="Fechar painel"
            onPress={fecharPainel}
          />

          <View
            className="rounded-t-sheet bg-surface-raised px-4 pt-5"
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
