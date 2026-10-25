import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
  AppBar,
  Button,
  TextField,
  FineCard,
  SegmentedTabs,
} from '@/shared/components'
import { ConfirmationSheet } from '@/shared/components/confirmation-sheet'
import { Caixa, Linha } from '@/shared/components/blocos'

type Estado =
  | 'abertas'
  | 'contando'
  | 'pagas'
  | 'detalhe'
  | 'confirmar-pagamento'
  | 'pagamento-registrado'
type Multa = {
  nome: string
  matricula: string
  livro: string
  valor: number
  detalhe: string
}
const abertas: Multa[] = [
  {
    nome: 'Marina Castro',
    matricula: '2513320',
    livro: 'Cálculo, Vol. 1',
    valor: 6,
    detalhe: 'devolvido hoje',
  },
  {
    nome: 'Pedro Henrique Lima',
    matricula: '2410221',
    livro: 'Física Básica, Vol. 2',
    valor: 10,
    detalhe: 'devolvido 13/10',
  },
  {
    nome: 'Júlia Martins',
    matricula: '2320876',
    livro: 'Contabilidade Introdutória',
    valor: 4,
    detalhe: 'devolvido 09/10',
  },
  {
    nome: 'Camila Rocha',
    matricula: '2214567',
    livro: 'Direito Civil: Parte Geral',
    valor: 8,
    detalhe: 'devolvido 02/10',
  },
  {
    nome: 'Diego Alves',
    matricula: '2511903',
    livro: 'Anatomia Humana',
    valor: 6,
    detalhe: 'devolvido 30/09',
  },
]
const contando: Multa[] = [
  {
    nome: 'João Pedro Lima',
    matricula: '2412044',
    livro: 'Física Básica, Vol. 1',
    valor: 4,
    detalhe: '2 dias úteis · sobe',
  },
  {
    nome: 'Bruna Costa',
    matricula: '2310772',
    livro: 'Química Geral',
    valor: 2,
    detalhe: '1 dia útil · sobe',
  },
]
const pagas: Multa[] = [
  {
    nome: 'Marina Castro',
    matricula: '2513320',
    livro: 'Cálculo, Vol. 1',
    valor: 6,
    detalhe: 'hoje · Ana Souza',
  },
  {
    nome: 'Thiago Freitas',
    matricula: '2219034',
    livro: 'Microbiologia',
    valor: 12,
    detalhe: '14/10 · Ana Souza',
  },
  {
    nome: 'Larissa Nunes',
    matricula: '2408817',
    livro: 'Teoria Geral do Direito',
    valor: 2,
    detalhe: '10/10 · Carlos Melo',
  },
  {
    nome: 'Lucas Almeida',
    matricula: '2412858',
    livro: 'Algoritmos: teoria e prática',
    valor: 4,
    detalhe: '05/09 · Ana Souza',
  },
]
const dinheiro = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`
const ABAS = ['abertas', 'contando', 'pagas'] as const

export function FinesScreen({ estado = 'abertas' }: { estado?: Estado }) {
  const safe = useSafeAreaInsets()
  const [busca, setBusca] = useState('')
  const [aba, setAba] = useState<'abertas' | 'contando' | 'pagas'>(
    estado === 'contando' || estado === 'pagas' ? estado : 'abertas',
  )
  const [pendentes, setPendentes] = useState(
    estado === 'pagamento-registrado' ? abertas.slice(1) : abertas,
  )
  const [pagamentos, setPagamentos] = useState(pagas)
  const [alvo, setAlvo] = useState<Multa | null>(
    estado === 'detalhe' || estado === 'confirmar-pagamento'
      ? abertas[0]
      : null,
  )
  const [confirmando, setConfirmando] = useState(
    estado === 'confirmar-pagamento',
  )
  const [aviso, setAviso] = useState(
    estado === 'pagamento-registrado' ? 'Pagamento de Marina registrado.' : '',
  )
  const normalizar = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  const resultados = (
    aba === 'abertas' ? pendentes : aba === 'contando' ? contando : pagamentos
  ).filter((m) =>
    normalizar(m.nome + ' ' + m.matricula).includes(normalizar(busca.trim())),
  )
  const total = pendentes.reduce((sum, m) => sum + m.valor, 0)
  function confirmarPagamento() {
    if (!alvo || !pendentes.some((m) => m.matricula === alvo.matricula)) return
    setPendentes((lista) => lista.filter((m) => m.matricula !== alvo.matricula))
    setPagamentos((lista) => [
      { ...alvo, detalhe: 'hoje · Ana Souza' },
      ...lista.filter((m) => m.matricula !== alvo.matricula),
    ])
    setAviso(`Pagamento de ${alvo.nome.split(' ')[0]} registrado.`)
    setConfirmando(false)
    setAlvo(null)
  }
  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title={alvo ? 'Multa em aberto' : 'Multas'}
        subtitle={
          alvo
            ? `${alvo.nome} · ${alvo.matricula}`
            : `${dinheiro(total)} em aberto · ${pendentes.length} alunos`
        }
        back={Boolean(alvo)}
        large={!alvo}
        onBack={() => setAlvo(null)}
      />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}
      >
        {alvo ? (
          <>
            <Caixa>
              <Text className="text-label text-ink">{alvo.nome}</Text>
              <Text className="text-caption text-ink-muted">
                {alvo.matricula} · Sistemas de Informação
              </Text>
            </Caixa>
            <FineCard
              tag="Congelada"
              showPayment={false}
              amount={dinheiro(alvo.valor)}
              daysLate={alvo.valor / 2}
              book={`${alvo.livro} · devolvido em 15/10`}
            />
            <Caixa>
              <Linha esquerda="Venceu em" direita="sáb, 10/10" />
              <Linha
                esquerda="Devolução registrada"
                direita="15/10, 10:42 · Ana Souza"
              />
              <Linha esquerda="Situação" direita="Aguardando pagamento" />
            </Caixa>
            <Caixa tom="brand">
              <Text className="text-label text-ink">
                Pagamento só no balcão
              </Text>
              <Text className="text-body text-ink-muted">
                O app não recebe pagamentos. Confirme só depois de receber o
                valor. O registro fica com seu nome.
              </Text>
            </Caixa>
          </>
        ) : (
          <>
            <TextField
              label="Nome ou matrícula"
              icon="search"
              value={busca}
              onChangeText={setBusca}
            />
            <SegmentedTabs
              items={[
                { label: `Em aberto (${pendentes.length})` },
                { label: 'Contando (2)' },
                { label: 'Pagas' },
              ]}
              value={ABAS.indexOf(aba)}
              onChange={(index) => setAba(ABAS[index]!)}
            />
            <Text className="text-caption text-ink-muted">
              {aba === 'abertas'
                ? 'Livro devolvido, multa congelada. Registre o pagamento só depois de receber no balcão.'
                : aba === 'contando'
                  ? 'Livro ainda não devolvido: a multa sobe R$ 2,00 por dia útil. O pagamento só pode ser registrado depois da devolução.'
                  : 'Pagamentos registrados no balcão, com quem recebeu. Fica no histórico do aluno.'}
            </Text>
            <View className="overflow-hidden rounded-lg border border-line bg-surface-raised">
              {resultados.map((m) => (
                <Pressable
                  key={m.matricula}
                  accessibilityRole={aba === 'abertas' ? 'button' : undefined}
                  disabled={aba !== 'abertas'}
                  onPress={() => setAlvo(m)}
                  className="flex-row gap-3 border-b border-line p-4"
                >
                  <View className="h-10 w-10 items-center justify-center rounded-pill bg-brand-soft">
                    <Text className="text-caption-strong text-brand">
                      {m.nome
                        .split(' ')
                        .map((n) => n[0])
                        .filter((_, i, a) => i === 0 || i === a.length - 1)
                        .join('')}
                    </Text>
                  </View>
                  <View className="min-w-0 flex-1 gap-1">
                    <Text className="text-label text-ink">{m.nome}</Text>
                    <Text className="text-caption text-ink-muted">
                      {m.matricula} · {m.livro}
                    </Text>
                  </View>
                  <View className="items-end gap-1">
                    <Text
                      className={`text-label ${aba === 'pagas' ? 'text-success' : aba === 'contando' ? 'text-warning' : 'text-danger'}`}
                    >
                      {dinheiro(m.valor)}
                    </Text>
                    <Text className="max-w-[110px] text-right text-micro text-ink-muted">
                      {m.detalhe}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
            {!resultados.length ? (
              <Text className="text-body text-ink-muted">
                Nenhuma multa encontrada nesta demonstração.
              </Text>
            ) : null}
            {aviso ? (
              <Text
                accessibilityLiveRegion="polite"
                className="rounded-md bg-ink p-4 text-caption-strong text-surface"
              >
                {aviso}
              </Text>
            ) : null}
            <Text className="text-caption text-ink-muted">
              Demonstração. O pagamento é feito presencialmente na biblioteca.
            </Text>
          </>
        )}
      </ScrollView>
      {alvo ? (
        <View
          className="border-t border-line bg-surface-raised px-4 pt-3"
          style={{ paddingBottom: Math.max(safe.bottom, 16) }}
        >
          <Button
            block
            icon="coin"
            onPress={() => setConfirmando(true)}
          >{`Registrar pagamento de ${dinheiro(alvo.valor)}`}</Button>
        </View>
      ) : null}
      <ConfirmationSheet
        visible={confirmando && Boolean(alvo)}
        title={`Recebeu ${dinheiro(alvo?.valor ?? 6)} de ${alvo?.nome.split(' ')[0] ?? 'Marina'}?`}
        description="A multa sai do app da aluna e o pagamento fica registrado com seu nome. Isso não pode ser desfeito pelo app. Operação demonstrativa."
        confirmText="Confirmar pagamento"
        cancelText="Ainda não recebi"
        onCancel={() => setConfirmando(false)}
        onConfirm={confirmarPagamento}
      >
        <Caixa>
          <Linha
            esquerda="Aluna"
            direita={alvo ? `${alvo.nome} · ${alvo.matricula}` : ''}
          />
          <Linha esquerda="Livro" direita={alvo?.livro ?? ''} />
          <Linha
            esquerda="Valor recebido"
            direita={dinheiro(alvo?.valor ?? 6)}
          />
          <Linha esquerda="Onde" direita="Balcão, presencial" />
        </Caixa>
      </ConfirmationSheet>
    </View>
  )
}
