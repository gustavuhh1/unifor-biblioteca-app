
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppBar } from "@/shared/components/app-bar";
import { BottomNav } from "@/shared/components/bottom-nav";
import { Button } from "@/shared/components/button";
import { Icon } from "@/shared/components/icon";

type EstadoFila =
  | "normal"
  | "gerenciar"
  | "adicionar"
  | "confirmar-posicao"
  | "posicao-atualizada";

type AlunoFila = {
  id: string;
  nome: string;
  matricula: string;
  data: string;
  iniciais: string;
};

type FilaLivroProps = {
  estado?: EstadoFila;
  onVoltar?: () => void;
  onAdicionarAluno?: (
    matricula: string,
    posicao: string,
    motivo: string
  ) => void;
  onMoverAluno?: (id: string) => void;
  onRemoverAluno?: (id: string) => void;
  onSelecionarAba?: (indice: number) => void;
};

const alunosIniciais: AlunoFila[] = [
  {
    id: "ana",
    nome: "Ana Beatriz Lima",
    matricula: "2311107",
    data: "desde 02/10",
    iniciais: "AB",
  },
  {
    id: "lucas",
    nome: "Lucas Almeida",
    matricula: "2412858",
    data: "desde 04/10",
    iniciais: "LA",
  },
  {
    id: "carlos",
    nome: "Carlos Eduardo Sá",
    matricula: "2210933",
    data: "desde 05/10",
    iniciais: "CE",
  },
  {
    id: "marina",
    nome: "Marina Castro",
    matricula: "2513320",
    data: "desde 09/10",
    iniciais: "MC",
  },
];

export default function FilaLivro({
  estado = "normal",
  onVoltar,
  onAdicionarAluno,
  onMoverAluno,
  onRemoverAluno,
  onSelecionarAba,
}: FilaLivroProps) {
  const insets = useSafeAreaInsets();

  const [estadoAtual, setEstadoAtual] =
    useState<EstadoFila>(estado);

  const [alunoSelecionado, setAlunoSelecionado] =
    useState<AlunoFila>(alunosIniciais[2]);

  const [matricula, setMatricula] =
    useState("2311998");

  const [posicao, setPosicao] = useState("fim");
  const [motivo, setMotivo] = useState(
    "Pedido no balcão, sem acesso ao app"
  );

  const [alunos, setAlunos] =
    useState<AlunoFila[]>(alunosIniciais);

  const [mostrarAviso, setMostrarAviso] = useState(
    estado === "posicao-atualizada"
  );

  useEffect(() => {
    setEstadoAtual(estado);
    setMostrarAviso(estado === "posicao-atualizada");
    setAlunos(alunosIniciais);
  }, [estado]);

  const painelAberto =
    estadoAtual === "gerenciar" ||
    estadoAtual === "adicionar" ||
    estadoAtual === "confirmar-posicao";

  function fecharPainel() {
    setEstadoAtual("normal");
  }

  function abrirGerenciamento(aluno: AlunoFila) {
    setAlunoSelecionado(aluno);
    setEstadoAtual("gerenciar");
  }

  function abrirAdicionar() {
    setEstadoAtual("adicionar");
  }

  function abrirConfirmacao() {
    setEstadoAtual("confirmar-posicao");
  }

  function confirmarMudancaPosicao() {
    // Demonstra visualmente a troca de posições.
    // A alteração real será feita pelo backend.
    setAlunos((lista) => {
      const copia = [...lista];

      const indice = copia.findIndex(
        (aluno) => aluno.id === "paulo"
      );

      const posicaoDestino = 3;

      if (indice < 0) {
        const paulo: AlunoFila = {
          id: "paulo",
          nome: "Paulo Ribeiro",
          matricula: "2311998",
          data: "desde hoje",
          iniciais: "PR",
        };

        copia.splice(posicaoDestino, 0, paulo);
      } else {
        const [paulo] = copia.splice(indice, 1);
        copia.splice(posicaoDestino, 0, paulo);
      }

      return copia;
    });

    setMostrarAviso(true);
    setEstadoAtual("posicao-atualizada");
    onMoverAluno?.("paulo");
  }

  function adicionarAluno() {
    const numero = matricula.trim();

    if (!numero) return;

    onAdicionarAluno?.(numero, posicao, motivo);

    // Sem criar registro real: somente apresenta
    // o estado de confirmação do Figma.
    fecharPainel();
  }

  function removerAluno() {
    onRemoverAluno?.(alunoSelecionado.id);
    fecharPainel();
  }

  function LinhaAluno({
    aluno,
    indice,
  }: {
    aluno: AlunoFila;
    indice: number;
  }) {
    return (
      <Pressable
        onPress={() => abrirGerenciamento(aluno)}
        accessibilityRole="button"
        accessibilityLabel={`Gerenciar ${aluno.nome}, posição ${indice + 1}`}
        className="min-h-[70px] flex-row items-center gap-3 border-b border-line px-3 py-3"
      >
        {/* POSIÇÃO */}
        <Text className="w-4 text-center text-caption-strong text-ink-muted">
          {indice + 1}
        </Text>

        {/* AVATAR */}
        <View className="h-10 w-10 items-center justify-center rounded-pill bg-brand-soft">
          <Text className="text-caption-strong text-brand">
            {aluno.iniciais}
          </Text>
        </View>

        {/* DADOS */}
        <View className="flex-1 gap-1">
          <Text className="text-label text-ink">
            {aluno.nome}
          </Text>

          <Text className="text-caption text-ink-muted">
            {aluno.matricula} · {aluno.data}
          </Text>
        </View>

        {/* MENU */}
        <Text className="text-title text-ink-muted">
          ⋮
        </Text>
      </Pressable>
    );
  }

  return (
    <View className="flex-1 bg-surface">
      {/* CABEÇALHO */}
      <AppBar
        title="Fila do livro"
        subtitle={`${alunos.length} alunos aguardando`}
        back
        onBack={onVoltar}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-4 pb-8"
      >
        {/* LIVRO */}
        <View className="flex-row gap-3 rounded-md border border-line bg-surface-raised p-3">
          <View className="h-24 w-16 justify-center rounded-md bg-[#004AF5] p-2">
            <Text className="text-caption-strong text-white">
              Arquitetura Limpa
            </Text>
          </View>

          <View className="flex-1 justify-center gap-2">
            <Text className="text-label text-ink">
              Arquitetura Limpa
            </Text>

            <Text className="text-caption text-ink-muted">
              Com Robert Martin · devolve 21/10
            </Text>

            <View className="self-start rounded-pill bg-warning-soft px-3 py-1">
              <Text className="text-caption-strong text-warning">
                Emprestado
              </Text>
            </View>
          </View>
        </View>

        {/* REGRA DA FILA */}
        <View className="flex-row items-start gap-3 rounded-md bg-brand-soft p-4">
          <Icon
            name="info"
            color="brand"
            size={20}
          />

          <Text className="flex-1 text-body text-ink">
            Fila automática. Quando o livro volta,
            o 1º da fila é avisado e tem 24h para
            confirmar. Mais de um exemplar pode
            atender alunos diferentes.
          </Text>
        </View>

        {/* LISTA DE ALUNOS */}
        <View className="overflow-hidden rounded-md border border-line bg-surface-raised">
          {alunos.map((aluno, indice) => (
            <LinhaAluno
              key={aluno.id}
              aluno={aluno}
              indice={indice}
            />
          ))}
        </View>

        {/* ADICIONAR ALUNO */}
        <Button
          block
          variant="secondary"
          onPress={abrirAdicionar}
        >
          Adicionar aluno à fila
        </Button>
      </ScrollView>

      {/* B12 — AVISO DE CONFIRMAÇÃO */}
      {mostrarAviso && !painelAberto && (
        <View
          className="absolute bottom-20 left-4 right-4 flex-row items-center gap-3 rounded-md bg-[#0B1533] p-4"
          accessibilityRole="alert"
        >
          <Icon
            name="check"
            color="onBrand"
            size={20}
          />

          <Text className="flex-1 text-caption-strong text-white">
            Paulo entrou em 4º na fila
          </Text>
        </View>
      )}

      {/* NAVEGAÇÃO */}
      <BottomNav
        role="bibliotecario"
        active={2}
        onSelect={onSelecionarAba}
      />

      {/* PAINÉIS B09, B10 E B11 */}
      <Modal
        visible={painelAberto}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={fecharPainel}
      >
        <View className="flex-1 justify-end">
          {/* SOBREPOSIÇÃO */}
          <Pressable
            className="absolute inset-0 bg-black/40"
            onPress={fecharPainel}
            accessibilityRole="button"
            accessibilityLabel="Fechar painel"
          />

          <View
            className="max-h-[90%] rounded-t-[28px] bg-surface-raised px-4 pt-5"
            style={{
              paddingBottom: Math.max(insets.bottom, 20),
            }}
          >
            <View className="mb-5 items-center">
              <View className="h-1 w-10 rounded-pill bg-line-strong" />
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerClassName="gap-4 pb-2"
            >
              {/* B09 — OPÇÕES DO ALUNO */}
              {estadoAtual === "gerenciar" && (
                <>
                  <Text className="text-title text-ink">
                    {alunoSelecionado.nome}
                  </Text>

                  <Text className="text-body text-ink-muted">
                    3º na fila de Arquitetura Limpa ·
                    matrícula {alunoSelecionado.matricula}
                  </Text>

                  <View className="gap-2">
                    <Pressable
                      accessibilityRole="button"
                      onPress={abrirConfirmacao}
                      className="min-h-[52px] flex-row items-center justify-between rounded-md border border-line px-4"
                    >
                      <Text className="text-label text-ink">
                        Mudar posição
                      </Text>
                      <Icon
                        name="chevronRight"
                        color="inkMuted"
                        size={20}
                      />
                    </Pressable>

                    <Pressable
                      accessibilityRole="button"
                      onPress={fecharPainel}
                      className="min-h-[52px] flex-row items-center justify-between rounded-md border border-line px-4"
                    >
                      <Text className="text-label text-ink">
                        Reenviar aviso
                      </Text>
                      <Icon
                        name="chevronRight"
                        color="inkMuted"
                        size={20}
                      />
                    </Pressable>

                    <Pressable
                      accessibilityRole="button"
                      onPress={removerAluno}
                      className="min-h-[52px] flex-row items-center justify-between rounded-md border border-line px-4"
                    >
                      <Text className="text-label text-danger">
                        Remover da fila
                      </Text>
                      <Icon
                        name="chevronRight"
                        color="danger"
                        size={20}
                      />
                    </Pressable>
                  </View>

                  <View className="gap-2 rounded-md bg-surface-sunken p-4">
                    <Text className="text-label text-ink">
                      Motivo (obrigatório para remover)
                    </Text>

                    <Text className="text-body text-ink-muted">
                      O aluno recebe um aviso com o motivo
                      e as pessoas de baixo sobem uma posição.
                    </Text>
                  </View>

                  <Button
                    block
                    variant="ghost"
                    onPress={fecharPainel}
                  >
                    Fechar
                  </Button>
                </>
              )}

              {/* B10 — ADICIONAR ALUNO */}
              {estadoAtual === "adicionar" && (
                <>
                  <Text className="text-title text-ink">
                    Adicionar aluno à fila
                  </Text>

                  <Text className="text-body text-ink-muted">
                    Arquitetura Limpa · 4 alunos aguardando
                  </Text>

                  {/* MATRÍCULA */}
                  <View className="gap-2">
                    <Text className="text-label text-ink">
                      Matrícula
                    </Text>

                    <View className="min-h-12 flex-row items-center gap-2 rounded-md border border-line-strong bg-surface px-3">
                      <Icon
                        name="search"
                        color="inkMuted"
                        size={20}
                      />

                      <TextInput
                        value={matricula}
                        onChangeText={setMatricula}
                        keyboardType="number-pad"
                        maxLength={7}
                        className="flex-1 text-body text-ink"
                        accessibilityLabel="Matrícula do aluno"
                      />
                    </View>
                  </View>

                  {/* ALUNO ENCONTRADO — DEMONSTRAÇÃO */}
                  <View className="flex-row items-center gap-3 rounded-md border border-line bg-surface p-3">
                    <View className="h-10 w-10 items-center justify-center rounded-pill bg-brand-soft">
                      <Text className="text-caption-strong text-brand">
                        PR
                      </Text>
                    </View>

                    <View className="flex-1 gap-1">
                      <Text className="text-label text-ink">
                        Paulo Ribeiro
                      </Text>

                      <Text className="text-caption text-ink-muted">
                        Aluno de graduação · 2 livros com você
                      </Text>
                    </View>

                    <Icon
                      name="check"
                      color="success"
                      size={20}
                    />
                  </View>

                  {/* POSIÇÃO */}
                  <View className="gap-3">
                    <Text className="text-label text-ink">
                      Posição
                    </Text>

                    <View className="flex-row flex-wrap gap-2">
                      {[
                        { id: "1", titulo: "1º" },
                        { id: "2", titulo: "2º" },
                        { id: "3", titulo: "3º" },
                        { id: "4", titulo: "4º" },
                        { id: "fim", titulo: "No fim (5º)" },
                      ].map((opcao) => (
                        <Pressable
                          key={opcao.id}
                          onPress={() => setPosicao(opcao.id)}
                          accessibilityRole="radio"
                          accessibilityState={{
                            checked: posicao === opcao.id,
                          }}
                          className={
                            posicao === opcao.id
                              ? "min-h-10 justify-center rounded-pill border border-brand bg-brand-soft px-4"
                              : "min-h-10 justify-center rounded-pill border border-line bg-surface px-4"
                          }
                        >
                          <Text
                            className={
                              posicao === opcao.id
                                ? "text-label text-brand"
                                : "text-label text-ink"
                            }
                          >
                            {opcao.titulo}
                          </Text>
                        </Pressable>
                      ))}
                    </View>

                    <Text className="text-caption text-ink-muted">
                      No fim da fila ninguém é afetado.
                    </Text>
                  </View>

                  {/* MOTIVO */}
                  <View className="gap-2">
                    <Text className="text-label text-ink">
                      Motivo (obrigatório)
                    </Text>

                    <TextInput
                      value={motivo}
                      onChangeText={setMotivo}
                      multiline
                      textAlignVertical="top"
                      className="min-h-20 rounded-md border border-line-strong bg-surface p-3 text-body text-ink"
                      accessibilityLabel="Motivo da inclusão"
                    />

                    <Text className="text-caption text-ink-muted">
                      Fica no histórico da fila e o aluno
                      recebe um aviso.
                    </Text>
                  </View>

                  <Button
                    block
                    variant="primary"
                    disabled={
                      !matricula.trim() || !motivo.trim()
                    }
                    onPress={() => {
                      if (posicao !== "fim") {
                        abrirConfirmacao();
                      } else {
                        adicionarAluno();
                      }
                    }}
                  >
                    Adicionar na fila
                  </Button>

                  <Button
                    block
                    variant="ghost"
                    onPress={fecharPainel}
                  >
                    Cancelar
                  </Button>
                </>
              )}

              {/* B11 — CONFIRMAR ALTERAÇÃO */}
              {estadoAtual === "confirmar-posicao" && (
                <>
                  <Text className="text-title text-ink">
                    Colocar Paulo à frente de 4 alunos?
                  </Text>

                  <Text className="text-body text-ink-muted">
                    Ele passa a ser o 1º da fila de
                    Arquitetura Limpa. Quem está na
                    fila desce uma posição e é avisado
                    na hora.
                  </Text>

                  <View className="gap-3 rounded-md border border-line bg-surface p-4">
                    <Text className="text-label text-ink">
                      Antes → Depois
                    </Text>

                    {[
                      "Ana Beatriz Lima",
                      "Lucas Almeida",
                      "Carlos Eduardo Sá",
                      "Marina Castro",
                    ].map((nome, indice) => (
                      <View
                        key={nome}
                        className="flex-row justify-between"
                      >
                        <Text className="text-caption text-ink">
                          {nome}
                        </Text>

                        <Text className="text-caption-strong text-danger">
                          {indice + 1}º → {indice + 2}º
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View className="flex-row items-start gap-2 rounded-md bg-danger-soft p-4">
                    <Icon
                      name="alert"
                      color="danger"
                      size={20}
                    />

                    <Text className="flex-1 text-body text-ink">
                      Isso não é uma simples adição.
                      Mudar a ordem prejudica quem
                      já estava na fila.
                    </Text>
                  </View>

                  <Button
                    block
                    variant="danger"
                    onPress={confirmarMudancaPosicao}
                  >
                    Colocar à frente mesmo assim
                  </Button>

                  <Button
                    block
                    variant="ghost"
                    onPress={fecharPainel}
                  >
                    Voltar e colocar no fim
                  </Button>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
