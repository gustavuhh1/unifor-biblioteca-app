import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import {
  AppBar,
  Button,
  Icon,
  LoanCard,
  SegmentedTabs,
  coverToneOf,
  BookCover,
} from '@/shared/components'
import { ConfirmationSheet } from '@/shared/components/confirmation-sheet'
import { Caixa, Linha } from '@/shared/components/blocos'
import { MyQueuesScreen as MinhasFilas } from '@/features/queues/screens/my-queues-screen'

export type EstadoEmprestimos =
  | 'ativos'
  | 'confirmar-renovacao'
  | 'renovado'
  | 'renovacao-indisponivel'
  | 'historico'
  | 'atrasado'
  | 'vazio'
export type EmprestimosProps = {
  estado?: EstadoEmprestimos
  onDetalhe?: () => void
  onMinhaVez?: () => void
  onMulta?: () => void
  onAcervo?: () => void
}
const ABAS = ['ativos', 'fila', 'historico'] as const
const livros = [
  {
    title: 'Redes de Computadores',
    author: 'Andrew S. Tanenbaum',
    color: 'cover4' as const,
    status: '5 dias restantes',
    start: 'Retirado 06/10',
    due: 'Devolver até 20/10',
    progress: 0.4,
  },
  {
    title: 'Engenharia de Software',
    author: 'Ian Sommerville',
    color: 'cover3' as const,
    status: 'Vence amanhã',
    start: 'Retirado 02/10',
    due: 'Devolver até 16/10',
    progress: 0.93,
    blocked: true,
  },
  {
    title: 'Estruturas de Dados e Algoritmos',
    author: 'Goodrich, Tamassia',
    color: 'cover2' as const,
    status: '8 dias restantes',
    start: 'Retirado 09/10',
    due: 'Devolver até 23/10',
    progress: 0.4,
  },
]
const historico = [
  {
    title: 'Padrões de Projeto',
    author: 'Gamma, Helm, Johnson, Vlissides',
    detail: 'Retirado 08/09 · devolvido 20/09',
    status: 'Devolvido',
  },
  {
    title: 'Algoritmos: teoria e prática',
    author: 'Cormen et al.',
    detail: '2 dias de atraso · multa paga R$ 4,00',
    status: 'Devolvido',
  },
  {
    title: 'O Programador Pragmático',
    author: 'Hunt, Thomas',
    detail: 'Você saiu da fila em 12/08',
    status: 'Cancelado',
  },
  {
    title: 'Sistemas Operacionais Modernos',
    author: 'Andrew S. Tanenbaum',
    detail: 'Pedido de 04/08 não retirado em 2 dias úteis',
    status: 'Expirado',
  },
]

export function LoansScreen({
  estado = 'ativos',
  onDetalhe,
  onMinhaVez,
  onMulta,
  onAcervo,
}: EmprestimosProps) {
  const [aba, setAba] = useState<'ativos' | 'fila' | 'historico'>(
    estado === 'historico' ? 'historico' : 'ativos',
  )
  const [ano, setAno] = useState('2026')
  const [painel, setPainel] = useState(
    estado === 'confirmar-renovacao'
      ? 'renovar'
      : estado === 'renovacao-indisponivel'
        ? 'bloqueado'
        : '',
  )
  const [selecionado, setSelecionado] = useState(
    estado === 'renovacao-indisponivel' ? 1 : 2,
  )
  const [renovados, setRenovados] = useState<number[]>(
    estado === 'renovado' ? [2] : [],
  )
  const [aviso, setAviso] = useState(
    estado === 'renovado' ? 'Renovado até sex, 06/11.' : '',
  )
  const vazio = estado === 'vazio'
  const atrasado = estado === 'atrasado'
  if (aba === 'fila')
    return (
      <MinhasFilas
        onVouRetirar={onMinhaVez}
        onAtivos={() => setAba('ativos')}
        onHistorico={() => setAba('historico')}
      />
    )
  const alvo = livros[selecionado]
  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Meus empréstimos"
        subtitle={`${vazio ? 0 : 3} de 10 livros com você`}
        large
      />
      <View className="mx-4 mb-4">
        <SegmentedTabs
          items={[
            { label: `Ativos (${vazio ? 0 : 3})` },
            { label: `Na fila (${vazio ? 0 : 2})` },
            { label: 'Histórico' },
          ]}
          value={ABAS.indexOf(aba)}
          onChange={(index) => setAba(ABAS[index]!)}
        />
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          gap: 12,
          paddingBottom: 24,
        }}
      >
        {aba === 'historico' ? (
          <>
            <View className="flex-row gap-2">
              {['2026', '2025', '2024'].map((item) => (
                <Pressable
                  key={item}
                  accessibilityRole="button"
                  accessibilityState={{ selected: item === ano }}
                  onPress={() => setAno(item)}
                  className={`min-h-[44px] justify-center rounded-pill border px-3 ${item === ano ? 'border-brand bg-brand-soft' : 'border-line bg-surface-raised'}`}
                >
                  <Text className="text-caption-strong text-ink">{item}</Text>
                </Pressable>
              ))}
            </View>
            {ano === '2026' && !vazio ? (
              historico.map((l) => (
                <Pressable
                  key={l.title}
                  onPress={onDetalhe}
                  accessibilityRole="button"
                  className="flex-row gap-3 rounded-lg border border-line bg-surface-raised p-3"
                >
                  <BookCover title={l.title} tone={4} size="sm" />
                  <View className="min-w-0 flex-1 gap-1">
                    <Text className="text-book-title text-ink">{l.title}</Text>
                    <Text className="text-caption text-ink-muted">
                      {l.author}
                    </Text>
                    <Text className="text-caption text-ink-muted">
                      {l.detail}
                    </Text>
                    <Text
                      className={`text-overline ${l.status === 'Devolvido' ? 'text-success' : 'text-neutral-ink'}`}
                    >
                      {l.status}
                    </Text>
                  </View>
                </Pressable>
              ))
            ) : (
              <Text className="text-body text-ink-muted">
                Nenhum registro de {ano} nesta demonstração.
              </Text>
            )}
          </>
        ) : vazio ? (
          <>
            <View className="items-center gap-4 py-12">
              <View className="rounded-lg bg-brand-soft p-6">
                <Icon name="books" color="brand" size={36} />
              </View>
              <Text className="text-title text-center text-ink">
                Nenhum livro com você
              </Text>
              <Text className="text-center text-body text-ink-muted">
                Quando você retirar um livro no balcão, ele aparece aqui com o
                prazo de devolução.
              </Text>
              <Button icon="search" onPress={onAcervo}>
                Explorar acervo
              </Button>
            </View>
            <Caixa>
              <Text className="text-overline text-ink-muted">
                Como funciona
              </Text>
              <Text className="text-body text-ink">
                Até 10 livros ao mesmo tempo
              </Text>
              <Text className="text-body text-ink">
                14 dias por empréstimo, com renovação
              </Text>
              <Text className="text-body text-ink">
                Livro emprestado? Entre na fila
              </Text>
            </Caixa>
          </>
        ) : (
          <>
            {atrasado ? (
              <>
                <View className="gap-2 rounded-lg bg-danger-soft p-4">
                  <Text className="text-label text-danger">
                    Empréstimos bloqueados
                  </Text>
                  <Text className="text-body text-ink">
                    Devolva Cálculo, Vol. 1 para voltar a pegar livros e entrar
                    em filas. Multa até agora: R$ 6,00, paga só presencialmente
                    na biblioteca.
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
            {livros
              .filter((_, index) => !atrasado || index !== 0)
              .map((l) => {
                const index = livros.indexOf(l)
                const renovado = renovados.includes(index)
                return (
                  <LoanCard
                    key={l.title}
                    title={l.title}
                    author={l.author}
                    tone={coverToneOf(l.color)}
                    status={l.blocked ? 'vence' : 'ativo'}
                    statusLabel={renovado ? '22 dias restantes' : l.status}
                    progress={l.progress}
                    startLabel={renovado ? 'Renovado em 15/10' : l.start}
                    dueLabel={
                      renovado
                        ? `Devolver até ${index === 2 ? '06/11' : '03/11'}`
                        : l.due
                    }
                    renewBlocked={l.blocked}
                    renewReason="Renovação indisponível: 2 alunos na fila deste livro."
                    actions={
                      <Button
                        block
                        size="sm"
                        variant={l.blocked ? 'ghost' : 'tonal'}
                        icon="refresh"
                        disabled={renovado}
                        onPress={() => {
                          setSelecionado(index)
                          setPainel(l.blocked ? 'bloqueado' : 'renovar')
                        }}
                      >
                        {l.blocked
                          ? 'Renovar'
                          : renovado
                            ? 'Renovação já utilizada'
                            : 'Renovar +14 dias'}
                      </Button>
                    }
                  />
                )
              })}
          </>
        )}
        {aviso ? (
          <Text
            accessibilityLiveRegion="polite"
            className="rounded-md bg-ink p-4 text-caption-strong text-surface"
          >
            {aviso}
          </Text>
        ) : null}
      </ScrollView>
      <ConfirmationSheet
        visible={painel !== ''}
        title={
          painel === 'bloqueado'
            ? 'Renovação indisponível'
            : `Renovar ${alvo.title}?`
        }
        description={
          painel === 'bloqueado'
            ? 'Engenharia de Software não pode ser renovado agora. Devolva até 16/10 para o próximo da fila.'
            : 'Você ganha mais 14 dias. Cada empréstimo renova uma única vez, e só quando o livro não está atrasado e ninguém está na fila.'
        }
        confirmText={painel === 'bloqueado' ? 'Entendi' : 'Renovar +14 dias'}
        hideCancel={painel === 'bloqueado'}
        cancelText="Agora não"
        onCancel={() => setPainel('')}
        onConfirm={() => {
          if (painel === 'renovar' && !renovados.includes(selecionado)) {
            setRenovados((lista) => [...lista, selecionado])
            setAviso(
              `Renovado até ${selecionado === 2 ? 'sex, 06/11' : 'ter, 03/11'}.`,
            )
          }
          setPainel('')
        }}
      >
        <Caixa>
          {painel === 'bloqueado' ? (
            <>
              <Linha esquerda="Dentro do prazo" direita="Vence amanhã, 16/10" />
              <Linha esquerda="Sem atraso" direita="O livro ainda não venceu" />
              <Linha esquerda="Há pessoas na fila" direita="2 alunos esperam" />
              <Linha
                esquerda="Renovação ainda não usada"
                direita="1 renovação"
              />
            </>
          ) : (
            <>
              <Linha
                esquerda="Prazo atual"
                direita={selecionado === 2 ? 'sex, 23/10' : 'ter, 20/10'}
              />
              <Linha
                esquerda="Novo prazo"
                direita={selecionado === 2 ? 'sex, 06/11' : 'ter, 03/11'}
              />
              <Linha esquerda="Fila deste livro" direita="Ninguém esperando" />
            </>
          )}
        </Caixa>
      </ConfirmationSheet>
    </View>
  )
}
