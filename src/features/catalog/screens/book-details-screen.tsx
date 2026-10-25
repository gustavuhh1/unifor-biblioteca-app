import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { AppBar, Button, Icon } from '@/shared/components'

const COVER_CLASSES = {
  teal: 'bg-cover-2',
  olive: 'bg-cover-4',
  plum: 'bg-cover-5',
} as const

function Cover({
  title,
  color,
  compact = false,
  hero = false,
  small = false,
}: {
  title: string
  color: keyof typeof COVER_CLASSES
  compact?: boolean
  hero?: boolean
  small?: boolean
}) {
  return (
    <View
      className={`relative overflow-hidden rounded-md p-3 ${COVER_CLASSES[color]} ${hero ? 'h-[208px] w-[144px]' : small ? 'h-[78px] w-[54px]' : compact ? 'h-[122px] flex-1' : 'h-[150px] w-[112px]'}`}
    >
      {!small ? (
        <Text className="font-serif text-title text-on-cover">{title}</Text>
      ) : null}
      {hero ? (
        <Text className="absolute bottom-3 left-3 text-micro-strong text-on-cover">
          MARTIN FOWLER
        </Text>
      ) : null}
      <View className="absolute -bottom-5 -right-4 size-16 rounded-pill border-2 border-on-cover/20" />
    </View>
  )
}

function OverdueBookDetails() {
  const router = useRouter()

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Detalhe do livro"
        back
        actions={[{ icon: 'more', label: 'Mais opções' }]}
      />
      <ScrollView contentContainerClassName="gap-4 px-5 pb-6 pt-2">
        <View className="flex-row items-end gap-4">
          <Cover hero title="Refatoração" color="teal" />
          <View className="flex-1 gap-2 pb-1">
            <View className="flex-row items-center gap-1 self-start rounded-pill bg-success-soft px-2 py-1">
              <Icon name="check" size={13} color="success" />
              <Text className="text-micro-strong text-success">DISPONÍVEL</Text>
            </View>
            <Text className="text-caption text-ink-muted">
              2 de 3 exemplares na estante
            </Text>
          </View>
        </View>
        <View className="flex-row items-start gap-3 rounded-md bg-warning-soft p-3">
          <Icon name="alert" size={18} color="warning" />
          <View className="flex-1 gap-1">
            <Text className="text-label-sm text-ink">
              Indisponível para novos pedidos
            </Text>
            <Text className="text-caption text-ink">
              Devolva o livro em atraso para voltar a pedir livros e entrar em
              filas.
            </Text>
          </View>
        </View>
        <View className="gap-1">
          <Text className="font-serif text-title-lg text-ink">Refatoração</Text>
          <Text className="text-body text-ink-muted">
            aperfeiçoando o design de códigos existentes
          </Text>
          <Text className="text-caption text-ink-muted">
            Livro impresso · 2. ed. · Novatec, 2020
          </Text>
        </View>
        <View className="flex-row items-start gap-3 rounded-md bg-danger-soft p-4">
          <Icon name="lock" size={20} color="danger" />
          <View className="flex-1 gap-1">
            <Text className="text-label text-ink">Empréstimos bloqueados</Text>
            <Text className="text-body-sm text-ink">
              Você tem 1 livro em atraso: Cálculo, Vol. 1 (3 dias, multa de R$
              6,00). Devolva no balcão para voltar a solicitar livros e entrar
              em filas.
            </Text>
          </View>
        </View>
        <View className="gap-3 rounded-lg border-[1.5px] border-danger bg-surface-raised p-4">
          <View className="flex-row gap-3">
            <Cover small title="Cálculo, Vol. 1" color="plum" />
            <View className="flex-1 gap-1">
              <Text className="font-serif text-label-lg text-ink">
                Cálculo, Vol. 1
              </Text>
              <Text className="text-caption text-ink-muted">James Stewart</Text>
              <View className="flex-row items-center gap-1 self-start rounded-pill bg-danger-soft px-2 py-1">
                <Icon name="alert" size={14} color="danger" />
                <Text className="text-micro-strong text-danger">
                  ATRASADO · R$ 6,00
                </Text>
              </View>
            </View>
          </View>
          <View className="h-1 rounded-pill bg-danger" />
        </View>
        <View className="gap-2">
          <SectionTitle>AUTORES</SectionTitle>
          <View className="self-start rounded-pill border border-line bg-surface-raised px-3 py-1.5">
            <Text className="text-caption-strong text-ink">Fowler, Martin</Text>
          </View>
        </View>
        <View className="gap-2">
          <SectionTitle>ASSUNTOS</SectionTitle>
          <View className="flex-row flex-wrap gap-2">
            {['Desenvolvimento de software', 'Engenharia de software'].map(
              (subject) => (
                <View
                  key={subject}
                  className="rounded-pill border border-line bg-surface-raised px-3 py-1.5"
                >
                  <Text className="text-caption-strong text-ink">{subject}</Text>
                </View>
              ),
            )}
          </View>
        </View>
        <View className="gap-1">
          <SectionTitle>SINOPSE</SectionTitle>
          <Text className="text-caption text-ink-muted">
            Um guia prático para melhorar código existente sem mudar o que ele
            faz. O autor mostra, com exemplos passo a passo, como identificar
            trechos difíceis de manter e aplicar pequenas transformações
            seguras, apoiadas por testes, até chegar a um código mais claro.
          </Text>
        </View>
        <View className="gap-2">
          <SectionTitle>DISPONIBILIDADE</SectionTitle>
          <Availability />
        </View>
        <View className="gap-2">
          <SectionTitle>ONDE ENCONTRAR</SectionTitle>
          <View className="flex-row items-start gap-3 rounded-lg border border-line bg-surface-raised p-3">
            <View className="size-9 items-center justify-center rounded-md bg-brand-soft">
              <Icon name="mapPin" size={18} color="brand" />
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-caption-strong text-ink">
                Biblioteca (Praça Central) · Estante 005.1
              </Text>
              <Text className="text-micro text-ink-muted">
                Procure pela etiqueta 005.1 F787r no corredor.
              </Text>
            </View>
          </View>
        </View>
        <View className="gap-2">
          <SectionTitle>DADOS BIBLIOGRÁFICOS</SectionTitle>
          <View className="rounded-lg border border-line bg-surface-raised px-4">
            <DetailRow label="Material" value="Livro" />
            <DetailRow label="Idioma" value="Português" />
            <DetailRow label="ISBN" value="9788575227244" />
            <DetailRow label="CDU / Cutter" value="005.1 · F787r" />
            <DetailRow label="Edição" value="2. ed." />
            <DetailRow
              label="Publicação"
              value="São Paulo · Novatec · 2020"
              last
            />
          </View>
        </View>
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <SectionTitle>EXEMPLARES</SectionTitle>
            <Text className="text-micro text-ink-muted">
              3 exemplares · 2 disponíveis
            </Text>
          </View>
          <View className="gap-2 rounded-lg border border-line bg-surface-raised p-3">
            {['51734', '51735', '51736'].map((record, index) => (
              <View
                key={record}
                className={`flex-row items-center justify-between gap-2 py-1.5 ${index < 2 ? 'border-b border-line' : ''}`}
              >
                <View className="flex-1 gap-1">
                  <Text className="text-caption-strong text-ink">
                    Registro {record}
                  </Text>
                  <Text className="text-micro text-ink-muted">
                    2020 · impresso · 1 vol. · Biblioteca · Livro
                  </Text>
                </View>
                <View
                  className={`rounded-pill px-2 py-1 ${index < 2 ? 'bg-success-soft' : 'bg-warning-soft'}`}
                >
                  <Text
                    className={`text-micro-strong ${index < 2 ? 'text-success' : 'text-warning'}`}
                  >
                    {index < 2 ? 'DISPONÍVEL' : 'EMPRÉSTIMO'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View className="gap-2">
          <SectionTitle>DO MESMO AUTOR</SectionTitle>
          <View className="flex-row gap-3">
            <View className="flex-1 gap-1">
              <Cover
                compact
                title="Padrões de Arquitetura de Aplicações Corporativas"
                color="olive"
              />
              <Text className="text-caption-strong text-ink">
                Padrões de Arquitetura de Aplicações Corporativas
              </Text>
              <Text className="text-micro text-ink-muted">Fowler, Martin</Text>
              <Text className="text-micro-strong text-success">DISPONÍVEL</Text>
            </View>
            <View className="flex-1 gap-1">
              <Cover compact title="UML Essencial" color="plum" />
              <Text className="text-caption-strong text-ink">UML Essencial</Text>
              <Text className="text-micro text-ink-muted">Fowler, Martin</Text>
              <Text className="text-micro-strong text-warning">EMPRÉSTIMO</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View className="gap-1 bg-surface-raised px-4 pt-2 pb-3">
        <Button
          block
          disabled
          onPress={() => router.push('/fine?state=overdue')}
        >
          Solicitar empréstimo
        </Button>
        <Text className="text-center text-micro text-ink-muted">
          Liberado assim que a devolução do livro em atraso for registrada.
        </Text>
      </View>
    </View>
  )
}

function SectionTitle({ children }: { children: string }) {
  return <Text className="text-overline text-ink-muted">{children}</Text>
}

function DetailRow({
  label,
  value,
  last = false,
}: {
  label: string
  value: string
  last?: boolean
}) {
  return (
    <View
      className={`flex-row items-start justify-between gap-3 py-2.5 ${last ? '' : 'border-b border-line'}`}
    >
      <Text className="text-caption text-ink-muted">{label}</Text>
      <Text className="max-w-[65%] text-right text-caption-strong text-ink">
        {value}
      </Text>
    </View>
  )
}

function Availability() {
  return (
    <View className="rounded-lg border border-line bg-surface-raised px-4">
      <DetailRow label="Exemplares" value="2 de 3 na estante" />
      <DetailRow label="Empréstimo" value="14 dias, renovável" />
      <DetailRow
        label="Retirada"
        value="Até 2 dias úteis após solicitar. Fim de semana, feriado e recesso não contam."
      />
      <DetailRow
        label="Renovação"
        value="+14 dias, se não houver atraso nem fila"
      />
      <DetailRow label="Seus empréstimos" value="3 de 10" last />
    </View>
  )
}

export function BookDetailsScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ state?: string }>()
  const [saved, setSaved] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // A44 mostra o livro enquanto a conta está bloqueada por atraso; A76 é o detalhe padrão.
  if (params.state === 'overdue') return <OverdueBookDetails />

  return (
    <View className="flex-1 bg-surface">
      <AppBar
        title="Detalhe do livro"
        back
        actions={[{ icon: 'more', label: 'Mais opções' }]}
      />
      <ScrollView contentContainerClassName="gap-3 px-4 pb-6 pt-2">
        <View className="flex-row items-end gap-3">
          <Cover title="Refatoração" color="teal" />
          <View className="flex-1 gap-2 pb-1">
            <View className="flex-row items-center gap-1 self-start rounded-pill bg-success-soft px-2 py-1">
              <Icon name="check" size={13} color="success" />
              <Text className="text-micro-strong text-success">DISPONÍVEL</Text>
            </View>
            <Text className="text-caption text-ink-muted">
              2 de 3 exemplares na estante
            </Text>
            <Text className="text-caption text-ink-muted">
              Retirada em até 2 dias
            </Text>
          </View>
        </View>
        <View className="flex-row items-start gap-3 rounded-md bg-warning-soft p-3">
          <Icon name="alert" size={18} color="warning" />
          <View className="flex-1 gap-1">
            <Text className="text-label-sm text-ink">
              Indisponível para novos pedidos
            </Text>
            <Text className="text-caption text-ink">
              A biblioteca possui regras para novos pedidos. Devolva o livro em
              atraso e regularize as multas para voltar a pedir livros e entrar
              em filas.
            </Text>
          </View>
        </View>
        <View className="gap-1">
          <Text className="text-title-lg text-ink">Refatoração</Text>
          <Text className="text-body-sm text-ink-muted">
            Aprimorando o design de códigos existentes
          </Text>
          <Text className="text-caption text-ink-muted">
            2. ed. · Novatec, 2020
          </Text>
        </View>
        <View className="flex-row gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon="bookmark"
            onPress={() => setSaved(!saved)}
          >
            {saved ? 'Salvo' : 'Salvar'}
          </Button>
          <Button size="sm" variant="secondary" icon="share" onPress={() => {}}>
            Compartilhar
          </Button>
        </View>
        <View className="gap-2">
          <SectionTitle>AUTORES</SectionTitle>
          <View className="self-start rounded-pill border border-line bg-surface-raised px-3 py-1.5">
            <Text className="text-caption-strong text-ink">Fowler, Martin</Text>
          </View>
        </View>
        <View className="gap-2">
          <SectionTitle>ASSUNTOS</SectionTitle>
          <View className="flex-row flex-wrap gap-2">
            <View className="rounded-pill border border-line bg-surface-raised px-3 py-1.5">
              <Text className="text-caption-strong text-ink">
                Desenvolvimento de software
              </Text>
            </View>
            <View className="rounded-pill border border-line bg-surface-raised px-3 py-1.5">
              <Text className="text-caption-strong text-ink">
                Engenharia de software
              </Text>
            </View>
          </View>
        </View>
        <View className="gap-1">
          <SectionTitle>SINOPSE</SectionTitle>
          <Text
            numberOfLines={expanded ? undefined : 4}
            className="text-caption text-ink-muted"
          >
            Um guia prático para melhorar código existente sem mudar o que ele
            faz. O autor mostra, com exemplos passo a passo, como identificar
            trechos difíceis de manter e aplicar pequenas transformações
            seguras, apoiadas por testes, até chegar a um código mais claro.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setExpanded(!expanded)}
          >
            <Text className="text-caption-strong text-brand">
              {expanded ? 'Ler menos' : 'Ler sinopse completa'} ›
            </Text>
          </Pressable>
        </View>
        <View className="gap-2">
          <SectionTitle>DISPONIBILIDADE</SectionTitle>
          <Availability />
        </View>
        <View className="gap-2">
          <SectionTitle>ONDE ENCONTRAR</SectionTitle>
          <View className="flex-row items-start gap-3 rounded-lg border border-line bg-surface-raised p-3">
            <View className="size-9 items-center justify-center rounded-md bg-brand-soft">
              <Icon name="mapPin" size={18} color="brand" />
            </View>
            <View className="flex-1 gap-1">
              <Text className="text-caption-strong text-ink">
                Biblioteca (Praça Central) · Estante 005.1
              </Text>
              <Text className="text-micro text-ink-muted">
                Procure pela etiqueta 005.1 F787r no corredor.
              </Text>
            </View>
          </View>
        </View>
        <View className="gap-2">
          <SectionTitle>DADOS BIBLIOGRÁFICOS</SectionTitle>
          <View className="rounded-lg border border-line bg-surface-raised px-4">
            <DetailRow label="Material" value="Livro" />
            <DetailRow label="Idioma" value="Português" />
            <DetailRow label="ISBN" value="9788575227244" />
            <DetailRow label="CDU / Cutter" value="005.1 · F787r" />
            <DetailRow label="Edição" value="2. ed." />
            <DetailRow
              label="Publicação"
              value="São Paulo · Novatec · 2020"
              last
            />
          </View>
        </View>
        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <SectionTitle>EXEMPLARES</SectionTitle>
            <Text className="text-micro text-ink-muted">
              3 exemplares · 2 disponíveis
            </Text>
          </View>
          <View className="gap-2 rounded-lg border border-line bg-surface-raised p-3">
            {['51734', '51735', '51736'].map((record, index) => (
              <View
                key={record}
                className={`flex-row items-center justify-between gap-2 py-1.5 ${index < 2 ? 'border-b border-line' : ''}`}
              >
                <View className="flex-1 gap-1">
                  <Text className="text-caption-strong text-ink">
                    Registro {record}
                  </Text>
                  <Text className="text-micro text-ink-muted">
                    2020 · impresso · 1 vol. · Biblioteca · Livro
                  </Text>
                </View>
                <View
                  className={`rounded-pill px-2 py-1 ${index < 2 ? 'bg-success-soft' : 'bg-warning-soft'}`}
                >
                  <Text
                    className={`text-micro-strong ${index < 2 ? 'text-success' : 'text-warning'}`}
                  >
                    {index < 2 ? 'DISPONÍVEL' : 'EMPRÉSTIMO'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
        <View className="gap-2">
          <SectionTitle>DO MESMO AUTOR</SectionTitle>
          <View className="flex-row gap-3">
            <View className="flex-1 gap-1">
              <Cover
                compact
                title="Padrões de Arquitetura de Aplicações Corporativas"
                color="olive"
              />
              <Text className="text-caption-strong text-ink">
                Padrões de Arquitetura de Aplicações Corporativas
              </Text>
              <Text className="text-micro text-ink-muted">Fowler, Martin</Text>
              <Text className="text-micro-strong text-success">DISPONÍVEL</Text>
            </View>
            <View className="flex-1 gap-1">
              <Cover compact title="UML Essencial" color="plum" />
              <Text className="text-caption-strong text-ink">
                UML Essencial
              </Text>
              <Text className="text-micro text-ink-muted">Fowler, Martin</Text>
              <Text className="text-micro-strong text-warning">EMPRÉSTIMO</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        className="bg-surface-raised px-4 pt-2"
        style={{ paddingBottom: 16 }}
      >
        <Button block disabled onPress={() => router.push('/fine')}>
          Indisponível pelas multas pendentes
        </Button>
      </View>
    </View>
  )
}
