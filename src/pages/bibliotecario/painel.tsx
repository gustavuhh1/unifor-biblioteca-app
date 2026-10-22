
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomNav } from "@/shared/components/bottom-nav";
import { Icon, type IconName } from "@/shared/components/icon";

type PainelBibliotecarioProps = {
  onAbrirAcervo?: () => void;
  onVerRetiradas?: () => void;
  onAbrirRetirada?: (id: string) => void;
  onAbrirPerfil?: () => void;
  onSelecionarAba?: (indice: number) => void;
};

type IndicadorProps = {
  titulo: string;
  valor: string;
  descricao: string;
  icone: IconName;
  cor: "brand" | "warning" | "danger" | "success";
};

function Indicador({
  titulo,
  valor,
  descricao,
  icone,
  cor,
}: IndicadorProps) {
  const fundo = {
    brand: "bg-brand-soft",
    warning: "bg-warning-soft",
    danger: "bg-danger-soft",
    success: "bg-success-soft",
  }[cor];

  const texto = {
    brand: "text-brand",
    warning: "text-warning",
    danger: "text-danger",
    success: "text-success",
  }[cor];

  return (
    <View className="min-h-36 flex-1 gap-2 rounded-md border border-line bg-surface-raised p-4">
      <View
        className={`h-10 w-10 items-center justify-center rounded-md ${fundo}`}
      >
        <Icon name={icone} color={cor} size={21} />
      </View>

      <Text className="text-title-lg text-ink">
        {valor}
      </Text>

      <Text className="text-caption-strong text-ink">
        {titulo}
      </Text>

      <Text className={`text-caption ${texto}`}>
        {descricao}
      </Text>
    </View>
  );
}

const retiradas = [
  {
    id: "1",
    iniciais: "LA",
    nome: "Lucas Almeida",
    livro: "Código Limpo",
    horario: "até 19/10",
    cor: "brand" as const,
  },
  {
    id: "2",
    iniciais: "BN",
    nome: "Beatriz Nogueira",
    livro: "Manual de Projeto e Design",
    horario: "hoje",
    cor: "warning" as const,
  },
  {
    id: "3",
    iniciais: "RL",
    nome: "Rafael Teixeira",
    livro: "Refatoração",
    horario: "até amanhã",
    cor: "brand" as const,
  },
];

export default function PainelBibliotecario({
  onAbrirAcervo,
  onVerRetiradas,
  onAbrirRetirada,
  onAbrirPerfil,
  onSelecionarAba,
}: PainelBibliotecarioProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-4 pb-8"
        contentContainerStyle={{
          paddingTop: insets.top + 12,
        }}
      >
        {/* CABEÇALHO */}
        <View className="flex-row items-center justify-between">
          <View className="gap-1">
            <Text className="text-title-lg text-ink">
              Biblioteca
            </Text>

            <Text className="text-caption text-ink-muted">
              Praça Central · balcão · Ana Souza
            </Text>
          </View>

          <Pressable
            onPress={onAbrirPerfil}
            accessibilityRole="button"
            accessibilityLabel="Abrir perfil"
            className="h-11 w-11 items-center justify-center rounded-pill bg-brand-soft"
          >
            <Text className="text-label text-brand">
              AS
            </Text>
          </Pressable>
        </View>

        {/* INDICADORES */}
        <View className="flex-row gap-3">
          <Indicador
            titulo="Livros para entregar"
            valor="12"
            descricao="Retiradas"
            icone="book"
            cor="brand"
          />

          <Indicador
            titulo="Aguardando o aluno confirmar"
            valor="7"
            descricao="Fila"
            icone="users"
            cor="warning"
          />
        </View>

        <View className="flex-row gap-3">
          <Indicador
            titulo="Empréstimos atrasados"
            valor="5"
            descricao="Atenção"
            icone="alert"
            cor="danger"
          />

          <Indicador
            titulo="Devoluções hoje"
            valor="31"
            descricao="Movimentação"
            icone="check"
            cor="success"
          />
        </View>

        {/* ACERVO */}
        <Pressable
          onPress={onAbrirAcervo}
          accessibilityRole="button"
          className="flex-row items-center gap-3 rounded-md border border-line bg-surface-raised p-4"
        >
          <View className="h-11 w-11 items-center justify-center rounded-md bg-brand-soft">
            <Icon
              name="books"
              color="brand"
              size={22}
            />
          </View>

          <View className="flex-1 gap-1">
            <Text className="text-label text-ink">
              Acervo
            </Text>

            <Text className="text-caption text-ink-muted">
              Buscar, cadastrar e editar livros
            </Text>
          </View>

          <Icon
            name="chevronRight"
            size={20}
            color="inkMuted"
          />
        </Pressable>

        {/* RETIRADAS DO DIA */}
        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-title text-ink">
              Retiradas de hoje
            </Text>

            <Pressable
              onPress={onVerRetiradas}
              accessibilityRole="button"
              className="min-h-11 justify-center px-2"
            >
              <Text className="text-label text-brand">
                Ver todas
              </Text>
            </Pressable>
          </View>

          <View className="gap-3">
            {retiradas.map((retirada) => (
              <Pressable
                key={retirada.id}
                onPress={() =>
                  onAbrirRetirada?.(retirada.id)
                }
                accessibilityRole="button"
                className="flex-row items-center gap-3 rounded-md border border-line bg-surface-raised p-3"
              >
                <View className="h-11 w-11 items-center justify-center rounded-pill bg-brand-soft">
                  <Text className="text-label text-brand">
                    {retirada.iniciais}
                  </Text>
                </View>

                <View className="flex-1 gap-1">
                  <Text className="text-label text-ink">
                    {retirada.nome}
                  </Text>

                  <Text
                    className="text-caption text-ink-muted"
                    numberOfLines={1}
                  >
                    {retirada.livro}
                  </Text>
                </View>

                <View
                  className={
                    retirada.cor === "warning"
                      ? "rounded-pill bg-warning-soft px-3 py-2"
                      : "rounded-pill bg-brand-soft px-3 py-2"
                  }
                >
                  <Text
                    className={
                      retirada.cor === "warning"
                        ? "text-caption-strong text-warning"
                        : "text-caption-strong text-brand"
                    }
                  >
                    {retirada.horario}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* NAVEGAÇÃO DO BIBLIOTECÁRIO */}
      <BottomNav
        role="bibliotecario"
        active={0}
        onSelect={onSelecionarAba}
      />
    </View>
  );
}
