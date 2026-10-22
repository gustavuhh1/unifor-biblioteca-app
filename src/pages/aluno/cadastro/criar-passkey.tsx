
import React from "react";
import {
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBar } from "@/shared/components/app-bar";
import { Button } from "@/shared/components/button";
import {
  Icon,
  type IconName,
} from "@/shared/components/icon";

type EstadoPasskey = "criar" | "concluido" | "erro";

type CriarPasskeyProps = {
  estado?: EstadoPasskey;
  onVoltar?: () => void;
  onCriar?: () => void;
  onPular?: () => void;
  onEntrar?: () => void;
  onTentarNovamente?: () => void;
};

type BeneficioProps = {
  icone: IconName;
  titulo: string;
  descricao: string;
};

function Beneficio({
  icone,
  titulo,
  descricao,
}: BeneficioProps) {
  return (
    <View className="flex-row items-start gap-3">
      <Icon
        name={icone}
        size={22}
        color="brand"
      />

      <View className="flex-1 gap-1">
        <Text className="text-label text-ink">
          {titulo}
        </Text>

        <Text className="text-body text-ink-muted">
          {descricao}
        </Text>
      </View>
    </View>
  );
}

export default function CriarPasskey({
  estado = "criar",
  onVoltar,
  onCriar,
  onPular,
  onEntrar,
  onTentarNovamente,
}: CriarPasskeyProps) {
  const insets = useSafeAreaInsets();

  const concluido = estado === "concluido";
  const erro = estado === "erro";

  return (
    <View className="flex-1 bg-surface">
      {!concluido && (
        <AppBar
          title="Segurança da conta"
          back
          onBack={onVoltar}
        />
      )}

      <ScrollView
        className="flex-1"
        contentContainerClassName={
          concluido
            ? "flex-grow justify-center gap-6 px-4"
            : "gap-6 px-4 pb-8"
        }
      >
        {/* A59 — CRIAR PASSKEY */}
        {estado === "criar" && (
          <>
            {/* ETAPAS */}
            <View className="flex-row gap-2">
              {["Dados", "E-mail", "Passkey"].map(
                (nome) => (
                  <View
                    key={nome}
                    className="flex-1 gap-2"
                  >
                    <Text className="text-caption-strong text-brand">
                      {nome}
                    </Text>
                    <View className="h-1.5 rounded-pill bg-brand" />
                  </View>
                )
              )}
            </View>

            <View className="items-center gap-3 py-5">
              <View className="h-24 w-24 items-center justify-center rounded-pill bg-brand-soft">
                <Icon
                  name="fingerprint"
                  size={48}
                  color="brand"
                />
              </View>

              <Text className="text-center text-title text-ink">
                Entre com sua digital
              </Text>

              <Text className="text-center text-body text-ink-muted">
                Crie um passkey e, nas próximas vezes,
                entre com a digital, o rosto ou o PIN
                do celular.
              </Text>
            </View>

            <View className="gap-5">
              <Beneficio
                icone="checkCircle"
                titulo="Entrar em um toque"
                descricao="Sem digitar matrícula e senha toda vez."
              />

              <Beneficio
                icone="shield"
                titulo="Mais seguro que senha"
                descricao="A chave fica só no seu celular: não vaza e não funciona em site falso."
              />

              <Beneficio
                icone="lock"
                titulo="Sua biometria é só sua"
                descricao="A digital e o rosto nunca saem do celular. Nem a biblioteca nem o app têm acesso."
              />
            </View>

            <Text className="text-center text-caption text-ink-muted">
              Se trocar de celular, você entra com
              a senha e cria outro.
            </Text>
          </>
        )}

        {/* A60 — PASSKEY CRIADO */}
        {concluido && (
          <>
            <View className="items-center gap-4">
              <View className="h-24 w-24 items-center justify-center rounded-[28px] bg-success-soft">
                <Icon
                  name="checkCircle"
                  color="success"
                  size={48}
                />
              </View>

              <Text className="text-center text-title-lg text-ink">
                Passkey criado
              </Text>

              <Text className="text-center text-body text-ink-muted">
                Pronto, Lucas. A partir de agora
                você entra no app com a biometria
                deste celular.
              </Text>
            </View>

            <View className="flex-row items-center gap-3 rounded-md border border-line bg-surface-raised p-4">
              <Icon
                name="smartphone"
                color="brand"
                size={24}
              />

              <View className="flex-1 gap-1">
                <Text className="text-label text-ink">
                  Este aparelho
                </Text>

                <Text className="text-caption text-ink-muted">
                  Passkey criado hoje, 15/10
                </Text>
              </View>
            </View>

            <Text className="text-center text-caption text-ink-muted">
              Em Perfil › Meus passkeys você vê,
              cria e remove seus passkeys.
            </Text>
          </>
        )}

        {/* A61 — ERRO AO CRIAR PASSKEY */}
        {erro && (
          <>
            <View className="flex-row items-start gap-3 rounded-md border border-danger bg-danger-soft p-4">
              <Icon
                name="alert"
                size={22}
                color="danger"
              />

              <View className="flex-1 gap-3">
                <Text className="text-label text-danger">
                  Não foi possível criar o passkey
                </Text>

                <Text className="text-body text-ink">
                  • Você cancelou a biometria.
                </Text>

                <Text className="text-body text-ink">
                  • O celular não tem bloqueio de
                  tela ou biometria.
                </Text>

                <Text className="text-body text-ink">
                  • Sem conexão com a internet.
                </Text>
              </View>
            </View>

            <View className="gap-2 rounded-md border border-line bg-surface-raised p-4">
              <Text className="text-label text-ink">
                Precisa de ajuda?
              </Text>

              <Text className="text-body text-ink-muted">
                Sem passkey você ainda entra com
                matrícula e senha. Se o problema
                continuar, chame o BiblioZap:
                (85) 3477-3257.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* BOTÕES */}
      <View
        className="gap-3 border-t border-line bg-surface-raised px-4 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        {estado === "criar" && (
          <>
            <Button
              block
              variant="primary"
              onPress={onCriar}
            >
              Criar passkey
            </Button>

            <Button
              block
              variant="ghost"
              onPress={onPular}
            >
              Agora não
            </Button>
          </>
        )}

        {concluido && (
          <Button
            block
            variant="primary"
            onPress={onEntrar}
          >
            Entrar no app
          </Button>
        )}

        {erro && (
          <>
            <Button
              block
              variant="primary"
              onPress={onTentarNovamente}
            >
              Tentar de novo
            </Button>

            <Button
              block
              variant="ghost"
              onPress={onVoltar}
            >
              Voltar
            </Button>
          </>
        )}
      </View>
    </View>
  );
}
