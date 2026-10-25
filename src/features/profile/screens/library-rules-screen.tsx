import { Linking, ScrollView, Text, View } from 'react-native'
import { AppBar, Button, Icon, type IconName } from '@/shared/components'

const OFFICIAL_RULES_URL = 'https://unifor.br/cesta-de-servicos/biblioteca'

const RULES: { title: string; icon: IconName; bullets: string[] }[] = [
  {
    title: 'Empréstimo',
    icon: 'book',
    bullets: [
      'Até 10 livros ao mesmo tempo.',
      '14 dias para devolver cada livro.',
      'Não dá para pegar dois exemplares do mesmo título, nem outra edição dele.',
    ],
  },
  {
    title: 'Retirada',
    icon: 'qr',
    bullets: [
      'Pedido feito: retire no balcão em até 2 dias úteis.',
      'Mostre o QR do pedido. Sem celular? Informe a matrícula ou o código do pedido.',
    ],
  },
  {
    title: 'Fila (reserva)',
    icon: 'users',
    bullets: [
      'Só abre quando todos os exemplares da edição estão emprestados.',
      'Até 7 filas ao mesmo tempo. Cada edição marcada conta como uma.',
      'Na sua vez: 24h para confirmar e 2 dias úteis para retirar. Se perder um prazo, você sai da fila e o próximo é avisado.',
    ],
  },
  {
    title: 'Renovação',
    icon: 'refresh',
    bullets: [
      'Uma única vez por empréstimo, por mais 14 dias, dentro do prazo, se o livro não estiver atrasado e ninguém estiver na fila.',
      'Pelo app, pelo Unifor Online ou no balcão.',
    ],
  },
  {
    title: 'Atraso e multa',
    icon: 'alert',
    bullets: [
      'R$ 2,00 por dia útil de atraso, por livro.',
      'Com livro atrasado, você não pode pedir, entrar na fila nem retirar até devolver.',
      'Na devolução, a multa para de contar e fica em aberto até ser paga.',
      'Pagamento só presencial, no balcão da biblioteca. O app não recebe pagamentos.',
    ],
  },
  {
    title: 'Perda ou dano',
    icon: 'shield',
    bullets: [
      'Você repõe o livro e ainda paga a multa do atraso, se houver. O app só informa esta regra. A reposição é combinada no balcão.',
    ],
  },
  {
    title: 'Fins de semana e feriados',
    icon: 'calendar',
    bullets: [
      'Prazos em dias úteis não contam fins de semana, feriados (nacionais, do Ceará e de Fortaleza) nem dias de recesso da Unifor.',
      'Se o prazo cair num feriado, ele passa para o próximo dia útil.',
    ],
  },
  {
    title: 'Atendimento',
    icon: 'mapPin',
    bullets: [
      'Biblioteca (Praça Central).',
      'Seg a sex, 7h às 21h55 · sáb, 8h às 14h10.',
      'BiblioZap (85) 3477-3257 · Empréstimo (85) 3477-3162.',
      'bibemprestimo@unifor.br',
    ],
  },
]

function RuleCard({ title, icon, bullets }: (typeof RULES)[number]) {
  return (
    <View className="gap-2 rounded-lg border border-line bg-surface-raised p-3">
      <View className="flex-row items-center gap-2">
        <View className="size-7 items-center justify-center rounded-sm bg-brand-soft">
          <Icon name={icon} size={16} color="brandStrong" />
        </View>
        <Text className="text-label text-ink">{title}</Text>
      </View>
      <View className="gap-1 pl-1">
        {bullets.map((bullet) => (
          <View key={bullet} className="flex-row gap-2">
            <Text className="text-caption text-ink-muted">•</Text>
            <Text className="flex-1 text-caption text-ink-muted">{bullet}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

// Tela A52: resumo das regras principais, com link para a fonte oficial.
export function LibraryRulesScreen() {
  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Regras da biblioteca"
        subtitle="Para alunos de graduação"
        back
      />
      <ScrollView contentContainerClassName="gap-2 px-4 pb-6 pt-3">
        {RULES.map((rule) => (
          <RuleCard key={rule.title} {...rule} />
        ))}
        <Button
          variant="secondary"
          block
          icon="externalLink"
          onPress={() => void Linking.openURL(OFFICIAL_RULES_URL)}
        >
          Abrir página oficial da biblioteca
        </Button>
        <Text className="px-1 text-micro text-ink-faint">
          unifor.br/cesta-de-servicos/biblioteca · Dados sujeitos a atualização
          pela biblioteca.
        </Text>
      </ScrollView>
    </View>
  )
}
