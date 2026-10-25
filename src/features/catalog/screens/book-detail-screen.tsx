import { CapaLivro } from '@/shared/components/livro'

import React from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AppBar } from '@/shared/components/app-bar'
import { Button } from '@/shared/components/button'
import { Icon } from '@/shared/components/icon'
import { LoanCard } from '@/shared/components/loan-card'

type EstadoLivro =
  'disponivel' | 'emprestado' | 'pausado' | 'atrasado' | 'multiplas-edicoes'

type DetalheLivroProps = {
  estado?: EstadoLivro
  onVoltar?: () => void
  onSalvar?: () => void
  onCompartilhar?: () => void
  onSolicitar?: () => void
  onEntrarFila?: () => void
  onMulta?: () => void
  salvo?: boolean
}

const dados = {
  algoritmos: {
    titulo: 'Algoritmos',
    subtitulo: 'teoria e prática',
    autor: 'Cormen et al.',
    descricao: 'Livro impresso · 3ª e 4ª edições',
    sinopse: 'Exemplo demonstrativo de um livro com mais de uma edição.',
    isbn: 'Não informado nesta referência',
    cutter: 'Não informado nesta referência',
    edicao: '3ª / 4ª',
    publicacao: 'Não informado nesta referência',
  },
  refatoracao: {
    titulo: 'Refatoração',
    subtitulo: 'aperfeiçoando o design de códigos existentes',
    autor: 'Fowler, Martin',
    descricao: 'Livro impresso · 2. ed. · Novatec, 2020',
    sinopse:
      'Um guia prático para reestruturar código existente sem mudar o que ele faz. O autor mostra, com exemplos passo a passo, como identificar trechos difíceis de manter e aplicar pequenas transformações seguras, apoiadas por testes, até chegar a um código mais claro.',
    isbn: '9788575227244',
    cutter: '005.1 F787r',
    edicao: '2. ed.',
    publicacao: 'São Paulo : Novatec, 2020',
  },
  codigoLimpo: {
    titulo: 'Código Limpo',
    subtitulo: 'habilidades práticas do agile software',
    autor: 'Martin, Robert C.',
    descricao: 'Livro impresso · ed. revisada · Alta Books, 2011',
    sinopse:
      'Mostra como escrever código fácil de ler e de manter: nomes que explicam a intenção, funções pequenas, tratamento de erros e testes. Traz estudos de caso em que código confuso é limpo aos poucos, explicando o porquê de cada mudança.',
    isbn: '9788576082675',
    cutter: '005.1 M386c',
    edicao: 'revisada',
    publicacao: 'Rio de Janeiro : Alta Books, 2011',
  },
}

function Secao({ titulo }: { titulo: string }) {
  return <Text className="mb-3 text-title text-ink">{titulo}</Text>
}

function Linha({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <View className="flex-row justify-between gap-4 border-b border-line py-3">
      <Text className="flex-1 text-caption text-ink-muted">{titulo}</Text>

      <Text className="flex-1 text-right text-caption-strong text-ink">
        {valor}
      </Text>
    </View>
  )
}

export function BookDetailScreen({
  estado = 'disponivel',
  onVoltar,
  onSalvar,
  onCompartilhar,
  onSolicitar,
  onEntrarFila,
  onMulta,
  salvo = false,
}: DetalheLivroProps) {
  const insets = useSafeAreaInsets()

  const multiplasEdicoes = estado === 'multiplas-edicoes'
  const emprestado = estado === 'emprestado' || multiplasEdicoes
  const pausado = estado === 'pausado'
  const atrasado = estado === 'atrasado'
  const livro = multiplasEdicoes
    ? dados.algoritmos
    : emprestado
      ? dados.codigoLimpo
      : dados.refatoracao

  const registros = emprestado
    ? [
        ['46122', '24/10'],
        ['223223', '28/10'],
        ['223323', '03/11'],
      ]
    : [
        ['51734', 'Na estante'],
        ['51735', 'Na estante'],
        ['51736', '22/10'],
      ]

  return (
    <View className="flex-1 bg-surface">
      <AppBar title="Detalhe do livro" back onBack={onVoltar} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-6 px-4 pb-8"
      >
        {/* CAPA E DISPONIBILIDADE */}
        <View className="flex-row gap-4">
          <CapaLivro
            nome={livro.titulo}
            autor={
              multiplasEdicoes
                ? 'Cormen et al.'
                : emprestado
                  ? 'Robert C. Martin'
                  : 'Martin Fowler'
            }
            cor={multiplasEdicoes ? 'cover4' : emprestado ? 'cover1' : 'cover2'}
            largura={148}
          />

          <View className="flex-1 justify-center gap-3">
            <View
              className={
                emprestado
                  ? 'self-start rounded-pill bg-warning-soft px-3 py-1'
                  : 'self-start rounded-pill bg-success-soft px-3 py-1'
              }
            >
              <Text
                className={
                  emprestado
                    ? 'text-caption-strong text-warning'
                    : 'text-caption-strong text-success'
                }
              >
                {emprestado ? 'Emprestado' : 'Disponível'}
              </Text>
            </View>

            <Text className="text-body text-ink">
              {multiplasEdicoes
                ? '0 de 4 exemplares na estante'
                : emprestado
                  ? '0 de 3 exemplares na estante'
                  : '2 de 3 exemplares na estante'}
            </Text>

            <Text className="text-caption text-ink-muted">
              {emprestado ? '1 reserva na fila' : 'Nenhuma reserva'}
            </Text>
          </View>
        </View>

        {/* A76 — PEDIDOS PAUSADOS */}
        {pausado && (
          <View className="gap-2 rounded-md border border-warning bg-warning-soft p-4">
            <View className="flex-row items-center gap-2">
              <Icon name="alert" color="warning" size={20} />

              <Text className="flex-1 text-label text-ink">
                Indisponível para novos pedidos
              </Text>
            </View>

            <Text className="text-body text-ink">
              A biblioteca pausou novos pedidos deste livro. Ele continua no
              catálogo, mas não dá para solicitar nem entrar na fila agora.
            </Text>
          </View>
        )}

        {/* IDENTIFICAÇÃO DO LIVRO */}
        <View className="gap-2">
          <Text className="text-book-title-lg text-ink">{livro.titulo}</Text>

          <Text className="text-body text-ink-muted">{livro.subtitulo}</Text>

          <Text className="text-caption text-ink-muted">{livro.descricao}</Text>
        </View>

        {/* SALVAR E COMPARTILHAR */}
        {atrasado ? (
          <>
            <View className="gap-2 rounded-lg bg-danger-soft p-4">
              <Text className="text-label text-danger">
                Empréstimos bloqueados
              </Text>
              <Text className="text-body text-ink">
                Você tem 1 livro em atraso: Cálculo, Vol. 1 (3 dias, multa de R$
                6,00). Devolva no balcão para voltar a solicitar livros e entrar
                em filas.
              </Text>
            </View>
            <LoanCard
              title="Cálculo, Vol. 1"
              author="James Stewart"
              tone={5}
              status="atrasado"
              statusLabel="Atrasado · R$ 6,00"
              startLabel="Retirado 26/09"
              dueLabel="Venceu 10/10"
              progress={1}
              actions={
                <Button
                  block
                  size="sm"
                  variant="danger"
                  icon="coin"
                  onPress={onMulta}
                >
                  Ver multa
                </Button>
              }
            />
          </>
        ) : null}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              block
              variant="secondary"
              icon={salvo ? 'bookmarkFill' : 'bookmark'}
              onPress={onSalvar}
            >
              {salvo ? 'Salvo' : 'Salvar'}
            </Button>
          </View>

          <View className="flex-1">
            <Button
              block
              variant="secondary"
              icon="share"
              onPress={onCompartilhar}
            >
              Compartilhar
            </Button>
          </View>
        </View>

        {/* AUTORIA */}
        <View>
          <Secao titulo="Autoria" />

          <Text className="text-body text-ink">{livro.autor}</Text>

          {emprestado && (
            <Text className="mt-2 text-caption text-ink-muted">
              Chu, Leandro · Tradutor
            </Text>
          )}
        </View>

        {/* ASSUNTOS */}
        <View>
          <Secao titulo="Assuntos" />

          <View className="flex-row flex-wrap gap-2">
            <View className="rounded-pill bg-surface-sunken px-3 py-2">
              <Text className="text-caption text-ink">
                Desenvolvimento de software
              </Text>
            </View>

            <View className="rounded-pill bg-surface-sunken px-3 py-2">
              <Text className="text-caption text-ink">
                {emprestado
                  ? 'Linguagem de programação'
                  : 'Engenharia de software'}
              </Text>
            </View>
          </View>
        </View>

        {/* A14 — POSIÇÃO NA FILA */}
        {emprestado && (
          <View className="gap-3 rounded-md bg-brand-soft p-4">
            <Text className="text-label text-brand">
              1 pessoa na sua frente
            </Text>

            <View className="flex-row items-center gap-2">
              {[1, 2, 3, 4].map((numero) => (
                <View
                  key={numero}
                  className={
                    numero === 2
                      ? 'h-[36px] flex-1 items-center justify-center rounded-md bg-brand'
                      : 'h-[36px] flex-1 items-center justify-center rounded-md bg-surface-raised'
                  }
                >
                  <Text
                    className={
                      numero === 2
                        ? 'text-label text-on-brand'
                        : 'text-label text-ink-muted'
                    }
                  >
                    {numero}º
                  </Text>
                </View>
              ))}
            </View>

            <Text className="text-caption text-ink">
              Se entrar agora, você será o 2º da fila.
            </Text>
          </View>
        )}

        {/* SINOPSE */}
        <View>
          <Secao titulo="Sinopse" />

          <Text className="text-body text-ink">{livro.sinopse}</Text>

          <Pressable
            accessibilityRole="button"
            className="mt-2 self-start py-2"
          >
            <Text className="text-label text-brand">Ler sinopse completa</Text>
          </Pressable>
        </View>

        {/* DISPONIBILIDADE */}
        <View>
          <Secao titulo="Disponibilidade" />

          <View className="rounded-md border border-line bg-surface-raised px-3">
            <Linha
              titulo="Exemplares"
              valor={emprestado ? '0 de 3 na estante' : '2 de 3 na estante'}
            />

            {emprestado ? (
              <>
                <Linha titulo="Reservas na fila" valor="1" />

                <Linha titulo="Próxima devolução" valor="24/10" />

                <Linha
                  titulo="Quando chegar sua vez"
                  valor="24h para confirmar e 2 dias úteis para retirar"
                />
              </>
            ) : (
              <>
                <Linha titulo="Empréstimo" valor="14 dias, domiciliar" />

                <Linha
                  titulo="Retirada"
                  valor="Até 2 dias úteis após solicitar"
                />

                <Linha
                  titulo="Renovação"
                  valor="+14 dias, se não houver atraso nem fila"
                />

                <Linha titulo="Seus empréstimos" valor="3 de 10" />
              </>
            )}
          </View>
        </View>

        {/* LOCALIZAÇÃO */}
        <View>
          <Secao titulo="Onde encontrar" />

          <View className="flex-row gap-3 rounded-md border border-line bg-surface-raised p-4">
            <Icon name="mapPin" color="brand" size={22} />

            <View className="flex-1 gap-1">
              <Text className="text-label text-ink">
                Biblioteca (Praça Central) · Estante 005.1
              </Text>

              <Text className="text-caption text-ink-muted">
                Procure pela etiqueta {livro.cutter} na lombada.
              </Text>
            </View>
          </View>
        </View>

        {/* REGISTRO COMPLETO */}
        <View>
          <Secao titulo="Registro completo" />

          <View className="rounded-md border border-line bg-surface-raised px-3">
            <Linha titulo="Material" valor="Livro" />
            <Linha titulo="Idioma" valor="Português" />
            <Linha titulo="ISBN" valor={livro.isbn} />
            <Linha titulo="CDU e Cutter" valor={livro.cutter} />
            <Linha titulo="Edição" valor={livro.edicao} />
            <Linha titulo="Publicação" valor={livro.publicacao} />
          </View>
        </View>

        {/* EXEMPLARES */}
        <View>
          <Secao titulo="Exemplares" />

          <Text className="mb-3 text-caption text-ink-muted">
            {emprestado
              ? '3 exemplares · 1 reserva'
              : '3 exemplares · 0 reservas'}
          </Text>

          <View className="gap-3">
            {registros.map(([numero, situacao], index) => {
              const disponivel = !emprestado && index < 2

              return (
                <View
                  key={numero}
                  className="gap-2 rounded-md border border-line bg-surface-raised p-3"
                >
                  <View className="flex-row justify-between gap-2">
                    <Text className="text-label text-ink">
                      Registro {numero}
                    </Text>

                    <Text
                      className={
                        disponivel
                          ? 'text-caption-strong text-success'
                          : 'text-caption-strong text-warning'
                      }
                    >
                      {disponivel ? 'Disponível' : 'Emprestado'}
                    </Text>
                  </View>

                  <Text className="text-caption text-ink-muted">
                    {emprestado ? '2011' : '2020'} · Impresso
                  </Text>

                  <Text className="text-caption text-ink-muted">
                    {disponivel
                      ? 'Na estante'
                      : `Devolução prevista: ${situacao}`}
                  </Text>

                  <Text className="text-caption text-ink-muted">
                    1163 · Biblioteca · Livros
                  </Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* MESMO AUTOR */}
        <View>
          <Secao titulo="Do mesmo autor" />

          <View className="flex-row gap-3">
            {(emprestado
              ? ['Arquitetura Limpa', 'O Codificador Limpo']
              : [
                  'Padrões de Arquitetura de Aplicações Corporativas',
                  'UML Essencial',
                ]
            ).map((titulo, index) => (
              <View key={titulo} className="flex-1 gap-2">
                <CapaLivro
                  nome={titulo}
                  cor={index === 0 ? 'cover4' : 'cover5'}
                  largura={98}
                />

                <Text className="text-book-title-sm text-ink" numberOfLines={3}>
                  {titulo}
                </Text>

                <Text className="text-caption text-ink-muted">
                  {livro.autor}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* AÇÃO INFERIOR */}
      <View
        className="border-t border-line bg-surface-raised px-4 pt-3"
        style={{
          paddingBottom: Math.max(insets.bottom, 16),
        }}
      >
        {atrasado ? (
          <>
            <Button block disabled>
              Solicitar empréstimo
            </Button>
            <Button block variant="ghost" onPress={onMulta}>
              Como devolver
            </Button>
          </>
        ) : pausado ? (
          <Button block variant="primary" disabled>
            Indisponível para novos pedidos
          </Button>
        ) : emprestado ? (
          <Button block variant="primary" onPress={onEntrarFila}>
            Entrar na fila
          </Button>
        ) : (
          <Button block variant="primary" onPress={onSolicitar}>
            Solicitar empréstimo
          </Button>
        )}
      </View>
    </View>
  )
}
