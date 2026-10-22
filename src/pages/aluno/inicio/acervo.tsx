
import React, { useEffect, useState } from "react";
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

type EstadoAcervo = "resultados" | "vazio";

type Livro = {
  id: number;
  titulo: string;
  autor: string;
  descricao: string;
  disponivel: boolean;
  capa: string;
  cor: string;
};

type AcervoProps = {
  estado?: EstadoAcervo;
  onAbrirLivro?: (id: number) => void;
  onPerguntarAssistente?: () => void;
  onSelecionarAba?: (indice: number) => void;
};

const livros: Livro[] = [
  {
    id: 1,
    titulo: "Código Limpo: habilidades práticas do agile software",
    autor: "Martin, Robert C. · 2011",
    descricao: "1 pessoa na fila · 3 exemplares",
    disponivel: false,
    capa: "Código\nLimpo",
    cor: "#122B78",
  },
  {
    id: 2,
    titulo: "O Codificador Limpo",
    autor: "Robert C. Martin · 2012",
    descricao: "2 exemplares na estante",
    disponivel: true,
    capa: "O\nCodificador\nLimpo",
    cor: "#53751E",
  },
  {
    id: 3,
    titulo: "Code Complete: Guia Prático para a Construção de Software",
    autor: "Steve McConnell · 2005",
    descricao: "Ninguém na fila: você seria o 1º",
    disponivel: false,
    capa: "Code\nComplete",
    cor: "#572340",
  },
];

export default function Acervo({
  estado = "resultados",
  onAbrirLivro,
  onPerguntarAssistente,
  onSelecionarAba,
}: AcervoProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const [busca, setBusca] = useState(
    estado === "vazio" ? "programação quântica" : "código"
  );

  useEffect(() => {
    setBusca(
      estado === "vazio" ? "programação quântica" : "código"
    );
  }, [estado]);

  const semResultados = estado === "vazio";

  return (
    <View className="flex-1 bg-surface">
      {/* CABEÇALHO */}
      <View
        className="px-4 pb-3"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Text className="mb-4 text-title-lg text-ink">
          Acervo
        </Text>

        <View className="h-12 flex-row items-center gap-3 rounded-pill border border-line bg-surface-raised px-4">
          <Icon name="search" color="inkMuted" size={20} />

          <TextInput
            value={busca}
            onChangeText={setBusca}
            className="flex-1 text-body text-ink"
            placeholder="Buscar título, autor ou assunto"
            placeholderTextColor={colors.inkFaint}
            returnKeyType="search"
            accessibilityLabel="Pesquisar no acervo"
          />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-4 pb-8"
      >
        {!semResultados ? (
          <>
            {/* A09 — RESULTADOS */}
            <Text className="mb-5 text-body text-ink-muted">
              24 resultados para “código”
            </Text>

            <View className="gap-4">
              {livros.map((livro) => (
                <Pressable
                  key={livro.id}
                  onPress={() => onAbrirLivro?.(livro.id)}
                  accessibilityRole="button"
                  className="flex-row gap-3 rounded-md border border-line bg-surface-raised p-3"
                >
                  {/* CAPA ILUSTRATIVA */}
                  <View
                    className="h-32 w-24 justify-center rounded-sm p-2"
                    style={{ backgroundColor: livro.cor }}
                  >
                    <Text className="text-title text-white">
                      {livro.capa}
                    </Text>
                  </View>

                  {/* INFORMAÇÕES */}
                  <View className="min-w-0 flex-1 gap-2">
                    <Text
                      className="text-label text-ink"
                      numberOfLines={3}
                    >
                      {livro.titulo}
                    </Text>

                    <Text
                      className="text-caption text-ink-muted"
                      numberOfLines={2}
                    >
                      {livro.autor}
                    </Text>

                    <Text className="text-caption text-ink-muted">
                      {livro.descricao}
                    </Text>

                    <View
                      className={
                        livro.disponivel
                          ? "self-start rounded-pill bg-success-soft px-3 py-1"
                          : "self-start rounded-pill bg-warning-soft px-3 py-1"
                      }
                    >
                      <Text
                        className={
                          livro.disponivel
                            ? "text-caption-strong text-success"
                            : "text-caption-strong text-warning"
                        }
                      >
                        {livro.disponivel
                          ? "Disponível"
                          : "Emprestado"}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          /* A11 — NENHUM RESULTADO */
          <View className="flex-1 items-center gap-5 pt-16">
            <View className="h-20 w-20 items-center justify-center rounded-pill bg-brand-soft">
              <Icon
                name="search"
                color="brand"
                size={36}
              />
            </View>

            <Text className="text-center text-title text-ink">
              Nenhum resultado para{"\n"}
              “programação quântica”
            </Text>

            <Text className="text-center text-body text-ink-muted">
              Confira a ortografia, use menos palavras
              ou busque pelo nome do autor.
            </Text>

            <Button
              variant="secondary"
              onPress={onPerguntarAssistente}
            >
              Perguntar ao Assistente
            </Button>

            <View className="mt-6 w-full gap-3 rounded-md bg-brand-soft p-4">
              <Text className="text-overline text-brand">
                PERGUNTA PRONTA
              </Text>

              <Text className="text-body text-ink">
                “Procure livros sobre programação
                quântica. Se não tiver no acervo,
                sugira parecidos.”
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <BottomNav
        role="aluno"
        active={1}
        onSelect={onSelecionarAba}
      />
    </View>
  );
}
