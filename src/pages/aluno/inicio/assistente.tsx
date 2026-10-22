
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomNav } from "@/shared/components/bottom-nav";
import { Button } from "@/shared/components/button";
import { Icon } from "@/shared/components/icon";
import { useTheme } from "@/shared/theme/theme-provider";

type AssistenteProps = {
  onVerParecidos?: () => void;
  onBuscarOutroTermo?: () => void;
  onAbrirLivro?: () => void;
  onSelecionarAba?: (indice: number) => void;
};

export default function Assistente({
  onVerParecidos,
  onBuscarOutroTermo,
  onAbrirLivro,
  onSelecionarAba,
}: AssistenteProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <View className="flex-1 bg-surface">
      {/* CABEÇALHO */}
      <View
        className="border-b border-line px-4 pb-3"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Text className="text-title-lg text-ink">
          Assistente
        </Text>

        <Text className="text-caption text-ink-muted">
          Dúvidas sobre o app e sugestões de leitura
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-4 py-6"
      >
        {/* MENSAGEM DO ALUNO */}
        <View className="items-end gap-2">
          <View className="max-w-[85%] rounded-[20px] rounded-br-sm bg-brand p-4">
            <Text className="text-body text-on-brand">
              Procure livros sobre programação
              quântica. Se não tiver, sugira parecidos.
            </Text>
          </View>

          <Text className="text-caption text-ink-muted">
            16:31
          </Text>
        </View>

        {/* RESPOSTA DO ASSISTENTE */}
        <View className="gap-3">
          <View className="flex-row items-center gap-2">
            <Icon
              name="sparkle"
              color="brand"
              size={20}
            />

            <Text className="text-label text-ink">
              Assistente
            </Text>
          </View>

          <View className="gap-3 rounded-[20px] bg-surface-sunken p-4">
            <Text className="text-body text-ink">
              Não achei esse tema no acervo. Estes
              estão na estante e são a base dele:
            </Text>
          </View>

          <Text className="text-caption text-ink-muted">
            16:31
          </Text>

          {/* LIVRO SUGERIDO */}
          <Pressable
            onPress={onAbrirLivro}
            accessibilityRole="button"
            className="flex-row gap-3 rounded-md border border-line bg-surface-raised p-3"
          >
            <View className="h-28 w-20 justify-center rounded-sm bg-[#183A58] p-2">
              <Text className="text-center text-label text-white">
                Física{"\n"}Quântica
              </Text>
            </View>

            <View className="flex-1 gap-2">
              <Text className="text-label text-ink">
                Física Quântica
              </Text>

              <Text className="text-caption text-ink-muted">
                Eisberg, Resnick
              </Text>

              <Text className="text-caption text-ink-muted">
                Base de física quântica
              </Text>

              <View className="self-start rounded-pill bg-success-soft px-3 py-1">
                <Text className="text-caption-strong text-success">
                  Disponível
                </Text>
              </View>
            </View>
          </Pressable>

          {/* AÇÕES */}
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Button
                block
                variant="secondary"
                onPress={onVerParecidos}
              >
                Ver mais parecidos
              </Button>
            </View>

            <View className="flex-1">
              <Button
                block
                variant="secondary"
                onPress={onBuscarOutroTermo}
              >
                Buscar outro termo
              </Button>
            </View>
          </View>
        </View>

        {/* AVISO */}
        <View className="flex-row items-start gap-2 rounded-md bg-brand-soft p-3">
          <Icon
            name="info"
            color="brand"
            size={18}
          />

          <Text className="flex-1 text-caption text-ink-muted">
            O Assistente usa IA e pode errar.
            Confira prazos e regras na página
            do livro e em Meus empréstimos.
          </Text>
        </View>
      </ScrollView>

      {/* CAMPO DE MENSAGEM */}
      <View className="flex-row items-center gap-2 border-t border-line bg-surface-raised px-4 py-3">
        <TextInput
          placeholder="Pergunte sobre livros ou empréstimos"
          placeholderTextColor={colors.inkFaint}
          className="min-h-12 flex-1 rounded-pill border border-line bg-surface px-4 text-body text-ink"
          accessibilityLabel="Mensagem ao Assistente"
        />

        <View className="h-11 w-11 items-center justify-center rounded-pill bg-brand">
          <Icon
            name="sparkle"
            color="onBrand"
            size={20}
          />
        </View>
      </View>

      <BottomNav
        role="aluno"
        active={3}
        onSelect={onSelecionarAba}
      />
    </View>
  );
}
