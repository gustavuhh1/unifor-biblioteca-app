import { useRouter } from 'expo-router'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { AppBar, Icon, type IconName } from '@/shared/components'

// Rotas do bibliotecário abertas pelo Painel (as abas e o Acervo).
const ROUTE = {
  withdrawals: '/withdrawals',
  queues: '/queues',
  fines: '/fines',
  scan: '/scan',
  collection: '/collection-management',
  profile: '/librarian-profile',
} as const

const itens: {
  icone: IconName
  titulo: string
  valor: string
  tom: 'brand' | 'warning' | 'danger' | 'success'
  href: string
}[] = [
  {
    icone: 'inbox',
    titulo: 'Livros para separar',
    valor: '12',
    tom: 'brand',
    href: ROUTE.withdrawals,
  },
  {
    icone: 'bell',
    titulo: 'Aguardando o aluno confirmar',
    valor: '7',
    tom: 'warning',
    href: ROUTE.queues,
  },
  {
    icone: 'alert',
    titulo: 'Empréstimos atrasados',
    valor: '5',
    tom: 'danger',
    href: ROUTE.fines,
  },
  {
    icone: 'check',
    titulo: 'Devoluções hoje',
    valor: '31',
    tom: 'success',
    href: ROUTE.scan,
  },
]

// Painel do bibliotecário (B01, RF-BAL-01): atalhos para as abas, o Acervo e o Perfil.
export function PanelScreen() {
  const router = useRouter()
  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Biblioteca"
        subtitle="Praça Central · balcão · Ana Souza"
        actions={[
          {
            icon: 'user',
            label: 'Perfil',
            onPress: () => router.push(ROUTE.profile),
          },
        ]}
      />
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}
      >
        <View className="flex-row flex-wrap gap-3">
          {itens.map((item) => (
            <Pressable
              key={item.titulo}
              onPress={() => router.push(item.href)}
              accessibilityRole="button"
              className="min-w-0 grow basis-[45%] gap-3 rounded-lg border border-line bg-surface-raised p-4"
            >
              <Icon name={item.icone} color={item.tom} size={24} />
              <Text className="text-number text-ink">{item.valor}</Text>
              <Text className="text-caption text-ink-muted">{item.titulo}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          onPress={() => router.push(ROUTE.collection)}
          accessibilityRole="button"
          className="min-h-18 flex-row items-center gap-3 rounded-lg border border-line bg-surface-raised p-4"
        >
          <Icon name="books" color="brand" />
          <View className="flex-1 gap-1">
            <Text className="text-label text-ink">Acervo</Text>
            <Text className="text-caption text-ink-muted">
              Buscar, cadastrar e editar livros
            </Text>
          </View>
          <Icon name="chevronRight" color="inkMuted" />
        </Pressable>
        <View className="flex-row items-center justify-between">
          <Text className="text-title text-ink">Retiradas de hoje</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(ROUTE.withdrawals)}
            className="min-h-[44px] justify-center"
          >
            <Text className="text-label text-brand">Ver todas</Text>
          </Pressable>
        </View>
        <View className="overflow-hidden rounded-lg border border-line bg-surface-raised">
          {[
            ['LA', 'Lucas Almeida', 'Código Limpo · RET-4821', 'seg, 19/10'],
            ['BN', 'Beatriz Nogueira', 'Padrões de Projeto · RET-4817', 'hoje'],
            ['RT', 'Rafael Teixeira', 'Cálculo, Vol. 2 · RET-4809', 'amanhã'],
          ].map(([sigla, nome, livro, prazo]) => (
            <Pressable
              key={sigla}
              accessibilityRole="button"
              onPress={() => router.push(ROUTE.withdrawals)}
              className="flex-row items-center gap-3 border-b border-line p-3"
            >
              <View className="h-10 w-10 items-center justify-center rounded-pill bg-brand-soft">
                <Text className="text-caption-strong text-brand">{sigla}</Text>
              </View>
              <View className="min-w-0 flex-1 gap-1">
                <Text className="text-label text-ink">{nome}</Text>
                <Text className="text-caption text-ink-muted">{livro}</Text>
              </View>
              <Text className="text-caption-strong text-brand">{prazo}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}
