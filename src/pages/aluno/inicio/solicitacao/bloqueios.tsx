
import React, { type ReactNode } from "react";
import {
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBar } from "@/shared/components/app-bar";
import { Button } from "@/shared/components/button";
import { Icon } from "@/shared/components/icon";

type EstadoBloqueio =
  | "limite-livros"
  | "mesmo-titulo";

type BloqueiosProps = {
  estado?: EstadoBloqueio;
  onVoltar?: () => void;
  onVerEmprestimo?: () => void;
  detalheLivro?: ReactNode;
};

export default function Bloqueios({
  estado = "limite-livros",
  onVoltar,
  onVerEmprestimo,
  detalheLivro,
}: BloqueiosProps) {
  const insets = useSafeAreaInsets();
  const limite = estado === "limite-livros";

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Detalhe do livro"
        back
        onBack={onVoltar}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-4 pb-8"
      >
        {/* RESUMO DO LIVRO */}
        <View className="flex-row gap-4">
          <View
            className={
              limite
                ? "h-44 w-28 justify-center rounded-md bg-[#145B4B] p-3"
                : "h-44 w-28 justify-center rounded-md bg-[#963621] p-3"
            }
          >
            <Text className="text-label text-white">
              {limite
                ? "Refatoração"
                : "Engenharia\nde software"}
            </Text>
          </View>

          <View className="flex-1 justify-center gap-3">
            <View className="self-start rounded-pill bg-success-soft px-3 py-1">
              <Text className="text-caption-strong text-success">
                Disponível
              </Text>
            </View>

            <Text className="text-body text-ink">
              2 de 3 exemplares na estante
            </Text>
          </View>
        </View>

        <View className="gap-2">
          <Text className="text-title-lg text-ink">
            {limite
              ? "Refatoração"
              : "Engenharia de software"}
          </Text>

          <Text className="text-caption text-ink-muted">
            {limite
              ? "aperfeiçoando o design de códigos existentes"
              : "Livro impresso · 10. ed. · Pearson"}
          </Text>
        </View>

        {/* AVISO PRINCIPAL */}
        <View className="gap-3 rounded-md border border-warning bg-warning-soft p-4">
          <View className="flex-row items-start gap-2">
            <Icon
              name="alert"
              color="warning"
              size={21}
            />

            <Text className="flex-1 text-label text-ink">
              {limite
                ? "Limite de 10 livros atingido"
                : "Você já está com este título"}
            </Text>
          </View>

          <Text className="text-body text-ink">
            {limite
              ? "Você está com 10 livros, o máximo para alunos de graduação. Devolva um deles para solicitar outro."
              : "Você está com Engenharia de software (9. ed.). A biblioteca não empresta duas edições do mesmo título ao mesmo tempo."}
          </Text>
        </View>

        {limite ? (
          /* A26 — LIMITE DE LIVROS */
          <View className="gap-3 rounded-md border border-line bg-surface-raised p-4">
            <View className="flex-row justify-between gap-3">
              <Text className="text-caption text-ink-muted">
                Com você
              </Text>

              <Text className="text-caption-strong text-ink">
                10 de 10 livros
              </Text>
            </View>

            <View className="h-px bg-line" />

            <View className="flex-row justify-between gap-3">
              <Text className="text-caption text-ink-muted">
                Próxima devolução
              </Text>

              <Text className="flex-1 text-right text-caption-strong text-ink">
                Redes de Computadores · 20/10
              </Text>
            </View>
          </View>
        ) : (
          /* A27 — MESMO TÍTULO */
          <View className="gap-4">
            <View className="flex-row items-center gap-3 rounded-md border border-line bg-surface-raised p-3">
              <View className="h-24 w-16 justify-center rounded-sm bg-[#963621] p-2">
                <Text className="text-caption text-white">
                  Engenharia de software
                </Text>
              </View>

              <View className="flex-1 gap-2">
                <Text className="text-label text-ink">
                  Engenharia de software (9. ed.)
                </Text>

                <Text className="text-caption text-ink-muted">
                  Sommerville, Ian
                </Text>

                <View className="self-start rounded-pill bg-warning-soft px-3 py-1">
                  <Text className="text-caption-strong text-warning">
                    Vence em breve
                  </Text>
                </View>
              </View>
            </View>

            <View className="gap-3 rounded-md border border-line bg-surface-raised p-4">
              <View className="flex-row justify-between">
                <Text className="text-caption text-ink-muted">
                  Retirado
                </Text>
                <Text className="text-caption-strong text-ink">
                  02/10
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-caption text-ink-muted">
                  Devolver até
                </Text>
                <Text className="text-caption-strong text-ink">
                  16/10
                </Text>
              </View>
            </View>

            <Text className="text-caption text-ink-muted">
              Renovação indisponível: 2 alunos na fila
              deste livro.
            </Text>
          </View>
        )}

        {detalheLivro}
      </ScrollView>

      {/* BOTÃO INFERIOR */}
      <View
        className="gap-2 border-t border-line bg-surface-raised px-4 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        {limite ? (
          <>
            <Button block variant="primary" disabled>
              Limite de 10 livros atingido
            </Button>

            <Text className="text-center text-caption text-ink-muted">
              Você ainda pode entrar em filas de livros emprestados.
            </Text>
          </>
        ) : (
          <>
            <Button block variant="primary" disabled>
              Você já tem este título
            </Button>

            <Text className="text-center text-caption text-ink-muted">
              Disponível para você depois que devolver a 9. edição.
            </Text>

            <Button
              block
              variant="ghost"
              onPress={onVerEmprestimo}
            >
              Ver meu empréstimo
            </Button>
          </>
        )}
      </View>
    </View>
  );
}
