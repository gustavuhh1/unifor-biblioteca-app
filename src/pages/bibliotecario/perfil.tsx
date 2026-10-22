
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomNav } from "@/shared/components/bottom-nav";
import { Icon } from "@/shared/components/icon";

type PerfilBibliotecarioProps = {
  onVoltar?: () => void;
  onAparencia?: () => void;
  onSair?: () => void;
  onSelecionarAba?: (indice: number) => void;
};

export default function PerfilBibliotecario({
  onVoltar,
  onAparencia,
  onSair,
  onSelecionarAba,
}: PerfilBibliotecarioProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-4 pb-8"
        contentContainerStyle={{
          paddingTop: insets.top + 8,
        }}
      >
        {/* CABEÇALHO */}
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={onVoltar}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            className="h-11 w-11 items-center justify-center"
          >
            <Icon
              name="arrowLeft"
              color="ink"
              size={22}
            />
          </Pressable>

          <Text className="text-title text-ink">
            Perfil
          </Text>
        </View>

        {/* INFORMAÇÕES DO BIBLIOTECÁRIO */}
        <View className="items-center gap-3 py-6">
          <View className="h-24 w-24 items-center justify-center rounded-pill bg-brand-soft">
            <Text className="text-title-lg text-brand">
              AS
            </Text>
          </View>

          <View className="items-center gap-1">
            <Text className="text-title text-ink">
              Ana Souza
            </Text>

            <Text className="text-body text-ink-muted">
              Bibliotecária
            </Text>

            <Text className="text-caption text-ink-muted">
              Setor · Biblioteca Praça Central
            </Text>
          </View>
        </View>

        {/* OPÇÕES DO PERFIL */}
        <View className="overflow-hidden rounded-md border border-line bg-surface-raised">
          <Pressable
            onPress={onAparencia}
            accessibilityRole="button"
            className="min-h-[64px] flex-row items-center gap-3 px-4"
          >
            <View className="h-10 w-10 items-center justify-center rounded-md bg-surface-sunken">
              <Icon
                name="moon"
                color="inkMuted"
                size={20}
              />
            </View>

            <View className="flex-1 gap-1">
              <Text className="text-label text-ink">
                Aparência
              </Text>

              <Text className="text-caption text-ink-muted">
                Claro, escuro ou igual ao celular
              </Text>
            </View>

            <Icon
              name="chevronRight"
              color="inkMuted"
              size={20}
            />
          </Pressable>

          <View className="mx-4 h-px bg-line" />

          <Pressable
            onPress={onSair}
            accessibilityRole="button"
            className="min-h-[60px] flex-row items-center gap-3 px-4"
          >
            <View className="h-10 w-10 items-center justify-center rounded-md bg-danger-soft">
              <Icon
                name="logout"
                color="danger"
                size={20}
              />
            </View>

            <Text className="text-label text-danger">
              Sair
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* NAVEGAÇÃO */}
      <BottomNav
        role="bibliotecario"
        active={4}
        onSelect={onSelecionarAba}
      />
    </View>
  );
}
